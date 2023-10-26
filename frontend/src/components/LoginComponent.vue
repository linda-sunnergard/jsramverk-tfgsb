<script setup>
    import { RouterLink, useRouter } from 'vue-router';
    import { ref } from 'vue';

    import { useAuthStore } from '../stores/auth.store';

    const router= useRouter();
    const username = ref("");
    const password = ref("");
    const message = ref("");

    async function submitLogin() {
        const authStore = useAuthStore();
        const login = await authStore.login(username.value, password.value);

        if (login.success) {
            router.push('home');
        } else {
            console.error("Error logging in");
            message.value = "Fel vid inloggning."
        }
    }
</script>

<template>
    <div class="container">
        <div class="login">
            <h1>TrafikLedare</h1>

            <p v-if="message">{{ message }}</p>

            <form class="login-form" @submit.prevent="submitLogin">
                <input type="text" v-model="username" placeholder="Användarnamn" />
                <input type="password" v-model="password" placeholder="Lösenord" />
                <input type="submit" value="Logga in" />
            </form>

            <RouterLink to="/register">Registrera dig</RouterLink>
        </div>
    </div>
</template>