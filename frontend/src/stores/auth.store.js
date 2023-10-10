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
            const login = await api.graphqlQuery(`{
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

            const auth = login.data.authLogin;

            this.token = auth.token;
            this.username = auth.username;
            this.userid = auth.userid;

            return auth;
        },

        async register(username, password) {
            const register = await api.graphqlQuery(`mutation {
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

            const auth = register.data.authRegister;

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
