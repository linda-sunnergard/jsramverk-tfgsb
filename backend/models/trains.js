const fetch = require('node-fetch')
const { initiateEventSource, hookEventSource } = require('./trainsSocket.js')

async function subscribeTrainPositions(io) {
    const query = `<REQUEST>
        <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
        <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
    </REQUEST>`
    const trainPositions = [];
    const response = await fetch(
        "https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        }
    )
    const result = await response.json()
    const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL
    const eventSource = initiateEventSource(sseurl)

    io.on('connection', (socket) => {
        console.log("User", socket.id, "subscribed to train positions.")
        hookEventSource(eventSource, socket, trainPositions)
    })

    io.on('close', async () => {
        try {
            console.log("Closing connection");
            await eventSource.close();
        } catch (e) {
            console.log(e);
        }
        return
    })
}

module.exports = subscribeTrainPositions;
