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

## Krav 1: Visa enbart försenade tåg

Vi valde att genomföra en lösning där man växla mellan att antingen se alla tåg, eller enbart se de tåg som är försenade. Även när alla tåg visas, så är de färgkodade för ökad användbarhet. Tåg som är i tid visas som blåa markörer, och tåg som är försenade visas som röda markörer. Klickar man på ett försenat tåg antingen på kartan eller i listan, så skickas man vidare till tågets ärende-sida där man kan skapa ett nytt ärende för tåget. Man kan även följa det specifika tåget i realtid på en karta.
Den största utmaningen med detta krav var att möjliggöra en filtrering av försenade och icke-försenade tåg. Detta inte var helt självklart utifrån den data som gick att få ut från Trafikverkets API när man efterfrågade information om tågens position. Lösningen blev att i backend skicka en separat request till Trafikverket för varje tåg för att få fram true/false om tåget var försenat baserat på EstimatedTimeAtLocation och AdvertisedTimeAtLocation. Detta skickades i sin tur med i det trainObject som skickades till frontend via socket.
I frontend skapades ett reaktivt objekt (ref() object i Vue) som agerade som en flagga beroende på om användaren markerat att hen ville se alla tåg eller enbart försenade tåg. Därefter uppdaterades kartan med alla, eller enbart försenade, markörer.

## Krav 2: Ändra befintliga ärenden
