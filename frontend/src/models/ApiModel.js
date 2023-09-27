
export default {
    delayed: async function() {
        return fetch("http://localhost:1337/delayed")
            .then((response) => response.json())
            .then((result) => {
                // console.log(result);
                return result.data;
            });
    },

    getTickets: async function() {
        return fetch("http://localhost:1337/tickets")
            .then((response) => response.json())
            .then((result) => {
                return result.data;
            });
    },

    postTicket: async function(newCode, newTrainnumber, newTraindate) {
        return fetch("http://localhost:1337/tickets", {
            body: JSON.stringify({
                code: newCode,
                trainnumber: newTrainnumber,
                traindate: newTraindate,
            }),
            headers: {
              'content-type': 'application/json'
            },
            method: 'POST'
        })
            .then((response) => response.json())
            .then((result) => {
                return result.data;
            });
    },

    codes: async function() {
        return fetch("http://localhost:1337/codes")
            .then((response) => response.json())
            .then((result) => {
                return result.data;
            });
    }

};
