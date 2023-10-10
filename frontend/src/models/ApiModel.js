import { useAuthStore } from '../stores/auth.store.js';

const backendServer = import.meta.env.VITE_BACKEND;

export default {
    graphqlQuery: async function (query) {
        const authStore = useAuthStore();
    
        return fetch(backendServer + "/graphql", {
            body: JSON.stringify({query: query}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Access-Token': authStore.token
            },
            method: 'POST'
        })
            .then((response) => response.json())
            .then((result) => {
                // console.log(result.data);
                return result;
            });
    },

    getDelayedTrains: async function() {
        const response = await this.graphqlQuery(`{
            delayed {
                ActivityId,
                OperationalTrainNumber,
                LocationSignature,
                FromLocation,
                ToLocation,
                AdvertisedTimeAtLocation,
                EstimatedTimeAtLocation
            }
        }`);

        return response.data.delayed;
    },

    getTickets: async function() {
        // return await getFetcher(backendServer + "/tickets");
        const response = await this.graphqlQuery(`{
            tickets {
                _id,
                code,
                trainnumber,
                traindate
            }
        }`);

        return response.data.tickets;
    },

    // not implemented on backend
    // getTicket: async function(ticketId) {
    //     return await getFetcher(backendServer + "/tickets/" + ticketId);
    // },

    postTicket: async function(newCode, newTrainnumber, newTraindate) {
        const response = await this.graphqlQuery(`mutation {
            createTicket(input: {
                code: "${newCode}",
                trainnumber: ${newTrainnumber},
                traindate: "${newTraindate}"
            }) {
                _id,
                code,
                trainnumber,
                traindate
            }
        }`);

        return response.data.createTicket;
    },

    updateTicket: async function(ticketId, newCode) {
        const response = await this.graphqlQuery(`mutation {
            updateTicket(input: {
                _id: "${ticketId}",
                code: "${newCode}"
            }) {
                _id,
                code,
                trainnumber,
                traindate
            }
        }`);

        return response.data.updateTicket;
    },

    getCodes: async function() {
        const response = await this.graphqlQuery("{ codes { Code, Level3Description } }");

        return response.data.codes;
    },

    login: async function(username, password) {
        const login = await this.graphqlQuery(`{
            authLogin(input: {
                username: "${username}",
                password: "${password}"
            }) {
                token,
                username,
                userid,
                success,
                message
            }
        }`);

        return login.data.authLogin;
    },

    register: async function(username, password) {
        const register = await this.graphqlQuery(`mutation {
            authRegister(input: {
                username: "${username}",
                password: "${password}"
            }) {
                token,
                username,
                userid,
                success,
                message
            }
        }`);

        return register.data.authRegister;
    }
};
