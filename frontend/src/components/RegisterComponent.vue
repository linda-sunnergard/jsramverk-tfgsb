<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'

import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const usernameReg = ref('')
const passwordReg = ref('')
const password2Reg = ref('')
const message = ref('')
const regex = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'

async function submitRegister() {
    if (!checkPassword(passwordReg.value, password2Reg.value)) {
        return
    }

    const authStore = useAuthStore()
    const register = await authStore.register(usernameReg.value, passwordReg.value)

    console.log(register)
    if (register.success) {
        router.push('/home')
    } else {
        registerErrorHandler(register)
    }
}

function printMessage(msg) {
    message.value = msg
}

function registerErrorHandler(data) {
    let msg = 'Okänt fel.'
    if (data.message == 'Error: User with that name already exists.') {
        msg = 'Användarnamnet är upptaget.'
    }
    printMessage(msg)
}

function checkPassword(pw1, pw2) {
    if (!pw1.match(regex)) {
        printMessage(
            'Lösenordet måste innehålla: liten bokstav, stor bokstav, specialtecken och siffra. Det måste också vara minst åtta tecken långt.'
        )
        return false
    } else if (!(pw1 === pw2)) {
        printMessage('Bekräfta lösenordet genom att skriva det igen.')
        return false
    }

    return true
}
</script>

<template>
    <div class="container">
        <div class="login">
            <h1>Registrera användare</h1>

            <p v-if="message">{{ message }}</p>

            <form class="login-form" @submit.prevent="submitRegister($event)">
                <input type="text" v-model="usernameReg" placeholder="Användarnamn" />
                <input type="password" v-model="passwordReg" placeholder="Lösenord" />
                <input type="password" v-model="password2Reg" placeholder="Bekräfta lösenord" />
                <input type="submit" value="Registrera" />
            </form>

            <!-- pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})" -->

            <RouterLink to="/">Tillbaka</RouterLink>
        </div>
    </div>
</template>
