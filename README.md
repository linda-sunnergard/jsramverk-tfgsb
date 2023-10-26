# jsramverk-tfgsb

## Säkerhetshål

När vi körde `npm audit` i `/backend` så hittade vi 11 säkerhetsbrister i dessa sju paket.

`debug  <=2.6.8`
`fresh  <0.5.2`
`mime  <1.4.1`
`ms  <2.0.0`
`node-fetch  <2.6.7`
`qs  <=6.2.3`
`semver  6.0.0 - 6.3.0 || 7.0.0 - 7.5.1`

Samtliga gick att åtgärda med hjälp av `npm audit fix`.

## Starta applikationen

Vi första försöket att starta applikationen krashade den. Appen gav ett felmeddelande för ogiltig autentisering, detta berodde på att den inte hade en API-nyckel. Efter felsökning så skapade vi en `.env`-fil i rooten för backend med API-nyckel från Trafikverket. Efter detta gick det att starta appen med `nodemon app.js`.

När vi sedan startade frontend med `python3 -m http.server 9000` gick det att navigera till startsidan. Men när vi klickade på länken för ett tåg krashade backend-appen igen. Genom att felsöka med utgångspunkt i felmeddelandet efter krashen så finner att en tabell saknas i databasen, samt att vi kan återställa databasen med ett bash-skript. Efter att vi körde det bash-skriptet fungerar det även att klicka på länkar i appen, dessutom gick det att skapa tågärenden i appen. Nu verkar appen fungera som den ska.

## Val av ramverk

Vi väljer att implementera vue till frontend-appen.

## Förbättringspotential

- Göra om asynkrona delar till reaktiva props.
- Utveckla frontend-tester?

### Krav 1: Visa enbart försenade tåg

Vi valde att genomföra en lösning där man växla mellan att antingen se alla tåg, eller enbart se de tåg som är försenade. Även när alla tåg visas, så är de färgkodade för ökad användbarhet. Tåg som är i tid visas som blåa markörer, och tåg som är försenade visas som röda markörer. Klickar man på ett försenat tåg antingen på kartan eller i listan, så skickas man vidare till tågets ärende-sida där man kan skapa ett nytt ärende för tåget. Man kan även följa det specifika tåget i realtid på en karta.
Den största utmaningen med detta krav var att möjliggöra en filtrering av försenade och icke-försenade tåg. Detta inte var helt självklart utifrån den data som gick att få ut från Trafikverkets API när man efterfrågade information om tågens position. Lösningen blev att i backend skicka en separat request till Trafikverket för varje tåg för att få fram true/false om tåget var försenat baserat på EstimatedTimeAtLocation och AdvertisedTimeAtLocation. Detta skickades i sin tur med i det trainObject som skickades till frontend via socket.
I frontend skapades ett reaktivt objekt (ref() object i Vue) som agerade som en flagga beroende på om användaren markerat att hen ville se alla tåg eller enbart försenade tåg. Därefter uppdaterades kartan med alla, eller enbart försenade, markörer.

### Krav 2: Ändra befintliga ärenden

Vi valde att helt enkelt att använda oss utav reaktiva objekt (ref()) för att hålla koll på vilket ärende det är som håller på att uppdateras. Därefter skickar en request till backenden om att uppdatera det aktuella ärendet i databasen. Detta uppnåddes genom att att fixa en ny funktion i backenden i enlighet med MongoDB, där det aktuella ärendet samt den uppdaterade koden skickas med. Vi valde att man enbart kan ändra vilken felkod som ärendet har, och inte kunna ändra exempelvis datum eller liknande. Därefter uppdateras det aktuella ärendet i frontend/det reaktiva objektet med den nya informationen och visas för användaren. Då detta krav framförallt gäller mer statisk data i vår databas (jämfört med exempelvis tågpositioner från Trafikverkets API) var det något smidigare att hantera och skapa en förhoppningsvis användarvänlig upplevelse.

### Krav 3

Vi använder socket.io-paketet för att få servern och klienter att kommunicera vilka ärenden som har öppnats och dölja dem för andra användare. Vi återanvände samma socket-anslutning som redan var implementerad för tågens position. Servern har en array där socket-id och aktuellt tåg sparas för att hålla koll på vilka tickets som är "upptagna", så att säga. När en användare går in på listan med alla tåg så skickar klienter en delayedRequest-emit för att begära data. Servern svarar med delayedUpdate-emit med alla fördröjda tåg minus de upptagna tågen. Sedan när en användare klickar på ett försenad tåg skickas en delayedHold-emit till servern. Servern uppdaterar då arrayen med upptagna tåg samt skickar ut en delayedUpdate till _alla_ klienter. Motsvarande händer när en användare lämnar det försenade tågets sida.

Det slutliga mönstret är förhållandevis litet och koncist, men det krävdes lite tänkande och experimenterade för att till slut komma fram det resultatet. Det uppstod inga särskilda problem men det var en process att komma fram till logiken som vi till slut använde, antagligen är detta enbart på grund av viss ovana att struktura tvåvägskommunikation mellan tjänster.

### Krav 4

Många olika system samverkar för att klara av appens autentisering. Först och främst används databasen för att spara användarnamn och lösenord. Lösenorden hashas med bcrypt innan de lagras. Enligt viss googlande bestämde vi oss för att hasha på serversidan då appen nås via https-anslutning bör det vara okej att skicka lösenordet ohashat. När en användare är skapat så går det att logga in (sker också automatiskt vid registrering). Lösenordet jämförs med lösenordet i databasen och om det stämmer så får användaren en JSON web token som svar.

Samtliga av dessa delar sköts i en Pinia store-modell, där token, användarnamn och användarid sparas i states. Användarnamn och användarid är det som sparas i tokenens payload, men de användes aldrig till något i den slutliga implementationen. Dessutom har innehåller storen alla actions för registrering och inloggning.

För att hindra tillgång till de delar av APIn som kräver inloggning används ett middleware som kollar om antigen 1) graphql-queriet börjar med `{auth`, dvs leder till login- eller register-endpoints eller om 2) headern innehåller en token som validerar.

Förutom att det var många olika system och paket som ska samverka och det tog tid att sätta sig in i alla paketen så var det bara en sak som orsakade lite större problem. Pinia stores var lite svårt att förstå och använda, då det var första gången vi använde oss av den sortens system. Det svåra här var att lära sig vad det tänkta användningsområdet var, t.ex. att storen skulle innehålla actions samt vad skillnaden på detta är från att helt enkeln göra egna modeller.

### Krav 5

Vid implementation av graphql så stötte vi på många problem. Då express-graphql har föråldrad status använde vi oss av graphql-http från npm. Dokumentationen för detta paket var väldigt bristfälligt. Det beskrev enbart hur man definerar ett schema utan inputs samt utan mutations (som C, U, D från CRUD kallas i graphql). Dessutom verkar paketet vara tillräckligt nytt och/eller lite använt att stackoverflow inte kunde ge så mycket hjälp. Vi fick läsa hur andra delar av paketet fungerar och chansa för att ta reda på hur 1) inputs defineras i schemat, 2) mutations defineras och inkluderas i handlern samt 3) hur middleware som kontrollerar autentisering bör struktureras. I slutändan känns paketet bra gjort och rätt så enkelt att jobba med, men det var en lång väg dit.
