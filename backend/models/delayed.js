
const fetch = require('node-fetch');

const delayed = {
    getDelayedTrains: async function(req, res) {
        const query = `<REQUEST>
            <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
            <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8">
                <FILTER>
                <AND>
                    <EQ name="ActivityType" value="Avgang" />
                    <GT name="EstimatedTimeAtLocation" value="$now" />
                    <AND>
                        <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                        <LT name='AdvertisedTimeAtLocation' value='$dateadd(02:00:00)' />
                    </AND>
                </AND>
                </FILTER>
                <INCLUDE>ActivityId</INCLUDE>
                <INCLUDE>ActivityType</INCLUDE>
                <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
                <INCLUDE>AdvertisedTrainIdent</INCLUDE>
                <INCLUDE>OperationalTrainNumber</INCLUDE>
                <INCLUDE>Canceled</INCLUDE>
                <INCLUDE>FromLocation</INCLUDE>
                <INCLUDE>ToLocation</INCLUDE>
                <INCLUDE>LocationSignature</INCLUDE>
                <INCLUDE>TimeAtLocation</INCLUDE>
                <INCLUDE>TrainOwner</INCLUDE>
            </QUERY>
        </REQUEST>`;

        return fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "application/xml" }
            }
        ).then(function(response) {
            return response.json();
        }).then(function(result) {
            return result.RESPONSE.RESULT[0].TrainAnnouncement;
        })
    },

    getDelayedTrain: async function getDelayedTrain(req, res) {
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8">
                        <FILTER>
                        <AND>
                            <EQ name="ActivityType" value="Avgang" />
                            <EQ name="OperationalTrainNumber" value="${req.params.trainNumber}"/>
                            <GT name="EstimatedTimeAtLocation" value="$now" />
                            <AND>
                                <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                                <LT name='AdvertisedTimeAtLocation'                   value='$dateadd(02:00:00)' />
                            </AND>
                        </AND>
                        </FILTER>
                        <INCLUDE>ActivityId</INCLUDE>
                        <INCLUDE>ActivityType</INCLUDE>
                        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
                        <INCLUDE>AdvertisedTrainIdent</INCLUDE>
                        <INCLUDE>OperationalTrainNumber</INCLUDE>
                        <INCLUDE>Canceled</INCLUDE>
                        <INCLUDE>FromLocation</INCLUDE>
                        <INCLUDE>ToLocation</INCLUDE>
                        <INCLUDE>LocationSignature</INCLUDE>
                        <INCLUDE>TimeAtLocation</INCLUDE>
                        <INCLUDE>TrainOwner</INCLUDE>
                  </QUERY>
            </REQUEST>`;


        return fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "application/xml" }
            }
            ).then(function(response) {
                return response.json();
            }).then(function(result) {
                return result.RESPONSE.RESULT[0].TrainAnnouncement;
            })
    },

    held: {},

    filterHeld: function(allDelayed) {
        return allDelayed.map((delayed) => {
            delayed.Held = ""
            for (const socketId of Object.keys(this.held)) {
                if (delayed.ActivityId == this.held[socketId].ActivityId) {
                    delayed.Held = socketId
                }
            }
            return delayed
        })
    },

    emitUpdate: async function(socketOrIo, socketId) {
        const allDelayed = await delayed.getDelayedTrains();

        socketOrIo.emit('delayedUpdate', this.filterHeld(allDelayed, socketId));
    },

    subscribeDelayedTrains: async function(io) {
        io.on('connection', (socket) => {
            console.log("User", socket.id, "subscribed to delayed trains.")

            socket.on("test", (content) => {
                console.log("Test emit:", content)
            })

            socket.on("delayedRequest", () => {
                this.emitUpdate(socket, socket.id)
            })

            socket.on("delayedRelease", () => {
                console.log("release call from", socket.id)
                delete this.held[socket.id]
                this.emitUpdate(io, socket.id)
            })

            socket.on("delayedHold", (payload) => {
                console.log("hold call from", socket.id)
                this.held[socket.id] = payload
                this.emitUpdate(io, socket.id)
            })
        })

        io.on('close', () => {
            // pass
        })
    }
};

module.exports = delayed;
