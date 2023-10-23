const EventSource = require('eventsource')

function initiateEventSource(sseurl) {
    const eventSource = new EventSource(sseurl)

    eventSource.onopen = function() {
        console.log("Train position data stream opened.")
    }

    eventSource.onerror = function(e) {
        console.log("Train position data stream failed.")
        console.log(e)
    }

    return eventSource
}

function hookEventSource(eventSource, socket, trainPositions) {
    eventSource.onmessage = function (e) {
        try {
            // console.log(e)
            const parsedData = JSON.parse(e.data);

            if (parsedData) {
                const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];
                const matchCoords = /(\d*\.\d+|\d+),?/g
                const position = changedPosition.Position.WGS84.match(matchCoords).map((t=>parseFloat(t))).reverse()
                const trainObject = {
                    trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                    position: position,
                    timestamp: changedPosition.TimeStamp,
                    bearing: changedPosition.Bearing,
                    status: !changedPosition.Deleted,
                    speed: changedPosition.Speed,
                };

                if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
                    socket.emit("mapUpdate", trainObject);
                }

                trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
            }
        } catch (e) {
            console.log(e)
        }

        return
    }
}

module.exports = { initiateEventSource, hookEventSource }
