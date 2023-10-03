let backendServer = import.meta.env.VITE_BACKEND;

export default {
    delayed: async function() {
        return fetch(backendServer + "/delayed")
            .then((response) => response.json())
            .then((result) => {
                // console.log(result);
                return result.data;
            });
    },

    getTickets: async function() {
        return fetch(backendServer + "/tickets")
            .then((response) => response.json())
            .then((result) => {
                return result.data;
            });
    },

    postTicket: async function(newCode, newTrainnumber, newTraindate) {
        return fetch(backendServer + "/tickets", {
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
        return fetch(backendServer + "/codes")
            .then((response) => response.json())
            .then((result) => {
                return result.data;
            });
    }

};
