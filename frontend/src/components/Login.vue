<script setup>
    import { RouterLink, useRouter, useRoute } from 'vue-router';
    import { ref } from 'vue';

    import { useAuthStore } from '../stores/auth.store';
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';

    const route = useRoute();
    const router= useRouter();
    const username = ref("");
    const password = ref("");

    function submitLogin(event) {
        console.log(username.value);
        console.log(password.value);
        const authStore = useAuthStore();

        authStore.login(username.value, password.value)
            .then(() => {
                router.push('/home');
            })
            .catch(() => {
                console.error("Error logging in.");
                router.push('/');
            });

            // return
    };
</script>

<template>
    <div class="container">
        <div class="login">
            <h1>TrafikLedare</h1>

            <form class="login-form" @submit.prevent="submitLogin">
                <input type="text" v-model="username" placeholder="Användarnamn" />
                <input type="password" v-model="password" placeholder="Lösenord" />
                <input type="submit" value="Logga in" />
            </form>

            <RouterLink to="/register">Registrera dig</RouterLink>
        </div>
    </div>
</template>