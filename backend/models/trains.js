const fetch = require('node-fetch')
const EventSource = require('eventsource');
const delayed = require('./delayed.js');

async function isTrainDelayed(trainNumber) {
    const query = `<REQUEST>
                <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8">
                    <FILTER>
                    <AND>
                        <EQ name="ActivityType" value="Avgang" />
                        <GT name="EstimatedTimeAtLocation" value="$now" />
                        <EQ name="OperationalTrainNumber" value="${trainNumber}"/>
                        <AND>
                            <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                            <LT name='AdvertisedTimeAtLocation'                   value='$dateadd(02:00:00)' />
                        </AND>
                    </AND>
                    </FILTER>
                </QUERY>
        </REQUEST>`;


    const response = await fetch(
        "https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "application/xml" }
        });
    const trainData = await response.json();
    return trainData.RESPONSE.RESULT[0].TrainAnnouncement.length > 0;
}

async function fetchTrainPositions(io) {
    const query = `<REQUEST>
        <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
        <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
    </REQUEST>`
    const trainPositions = {};
    let fileredTrainIds = [];
    const response = await fetch(
        "https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "application/xml" }
        }
    )
    const result = await response.json()
    const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL
    const eventSource = new EventSource(sseurl)

    io.on('connection', (socket) => {
        console.log('A user connected')
        eventSource.onmessage = async function (e) {
            try {
                // console.log(e)
                const parsedData = JSON.parse(e.data);

                if (parsedData) {
                    const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];


                    const matchCoords = /(\d*\.\d+|\d+),?/g

                    const position = changedPosition.Position.WGS84.match(matchCoords).map((t=>parseFloat(t))).reverse()
                    const delayed = await isTrainDelayed(changedPosition.Train.OperationalTrainNumber);
                    const trainObject = {
                        trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                        position: position,
                        timestamp: changedPosition.TimeStamp,
                        bearing: changedPosition.Bearing,
                        status: !changedPosition.Deleted,
                        speed: changedPosition.Speed,
                        delayed: delayed};

                    if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
                        socket.emit("message", trainObject);
                    }

                    trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
                }
            } catch (e) {
                console.log(e)
            }

            return
        }
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

    io.on('message', async (e) => {
        const parsedData = JSON.parse(e.data);
        fileredTrainIds = parsedData
        console.log("apply filter")
        console.log(fileredTrainIds)
    })
}


module.exports = fetchTrainPositions;
