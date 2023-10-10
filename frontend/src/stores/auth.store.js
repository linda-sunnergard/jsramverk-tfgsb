import { defineStore } from 'pinia';

import api from '../models/ApiModel';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        token: null,
        username: null,
        userid: null
    }),
    actions: {
        async login(username, password) {
            const auth = await api.login(username, password);

            this.token = auth.token;
            this.username = auth.username;
            this.userid = auth.userid;

            return auth;
        },

        async register(username, password) {
            const auth = await api.register(username, password)

            this.token = auth.token;
            this.username = auth.username;
            this.userid = auth.userid;

            return auth;
        },

        logout() {
            this.token = null;
            this.username = null;
            this.userid = null;
        }
    }
});
