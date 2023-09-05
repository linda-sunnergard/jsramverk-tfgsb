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