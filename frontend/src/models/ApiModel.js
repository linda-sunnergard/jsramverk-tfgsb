import { useAuthStore } from '../stores/auth.store.js';

const backendServer = import.meta.env.VITE_BACKEND;

async function getFetcher(route) {
    const authStore = useAuthStore();

    return fetch(route, {
        headers: {
            'content-type': 'application/json',
            'x-access-token': authStore.token
        },
        method: 'GET'
    })
        .then((response) => response.json())
        .then((result) => {
            // console.log(result);
            return result.data;
        });
};

async function postFetcher(route, body) {
    const authStore = useAuthStore();

    return fetch(route, {
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json',
            'x-access-token': authStore.token
        },
        method: 'POST'
    })
        .then((response) => response.json())
        .then((result) => {
            // console.log(result);
            return result.data;
        });
};

export default {
    delayed: async function() {
        return await getFetcher(backendServer + "/delayed");
    },

    getTickets: async function() {
        return await getFetcher(backendServer + "/tickets");
    },

    postTicket: async function(newCode, newTrainnumber, newTraindate) {
        return await postFetcher(
            backendServer + "/tickets",
            {
                code: newCode,
                trainnumber: newTrainnumber,
                traindate: newTraindate
        });
    },

    updateTicket: async function(ticketId, newCode) {
        return await postFetcher(
            backendServer + "/tickets/" + ticketId,
            { code: newCode }
        );
    },

    codes: async function() {
        return await getFetcher(backendServer + "/codes");
    }
};
