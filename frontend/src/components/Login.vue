<script setup>
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    import { RouterLink, useRouter } from 'vue-router';

    const router= useRouter();

    function submitLogin(event) {
        console.log(event);
    };
</script>

<template>
    <div class="container">
        <div class="login">
            <h1>TrafikLedare</h1>

            <form @submit.prevent="submitLogin($event)">
                <input type="text" placeholder="Användarnamn">
                <input type="password" placeholder="Lösenord">
                <input type="submit" value="Logga in">
            </form>

            <RouterLink to="/register">Registrera dig</RouterLink>
        </div>
    </div>
</template>