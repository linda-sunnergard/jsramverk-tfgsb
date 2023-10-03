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
            <h1>Registrera användare</h1>

            <form class="login-form" @submit.prevent="submitLogin($event)">
                <input type="text" placeholder="Användarnamn">
                <input type="password" placeholder="Lösenord">
                <input type="password" placeholder="Bekräfta lösenord">
                <input type="submit" value="Registrera">
            </form>

            <RouterLink to="/">Tillbaka</RouterLink>
        </div>
    </div>
</template>