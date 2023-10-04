import { defineStore } from 'pinia';

const backendServer = import.meta.env.VITE_BACKEND;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        token: null,
        username: null,
        userid: null
    }),
    actions: {
        async login(username, password) {
            console.log("före")

            const data = await fetch(backendServer + "/auth/login", {
                body: JSON.stringify({ username, password }),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            })
                .then((response) => response.json())
                .then((result) => {
                    return result.data;
            });

            this.token = data.token;
            this.username = data.username;
            this.userid = data.userid;
        },
        logout() {
            this.token = null;
            this.username = null;
            this.userid = null;
        }
    }
});
