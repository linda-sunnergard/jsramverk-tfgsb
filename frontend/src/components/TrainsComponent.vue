<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'

import { useAuthStore } from '../stores/auth.store'
import utils from '../models/Utils.js'
import { inject } from 'vue'

const { currentTrainRef } = inject('currentTrainRef')
const router = useRouter()
const delayedTrains = ref([])
const socketIo = inject('socketIo')

const { changeMap, updateChangeMap } = inject('changeMap')
let mapMessage = ref('Se endast försenade tåg')

socketIo.emit('delayedRequest')

socketIo.on('delayedUpdate', (payload) => {
    delayedTrains.value = payload.filter((train) => {
        if (train.Held === '' || train.Held === socketIo.id) {
            return true
        }
        return false
    })
})

function ticketHref(train) {
    currentTrainRef.value = train
    socketIo.emit('delayedHold', train)
    router.push({ path: '/ticket/' })
}

function logout() {
    const authStore = useAuthStore()
    authStore.logout()
}

function changeMapHandler() {
    if (changeMap.value == false) {
        updateChangeMap(true)
        mapMessage.value = 'Se alla tåg'
    } else {
        updateChangeMap(false)
        mapMessage.value = 'Se endast försenade tåg'
    }
}
</script>

<template>
    <div class="delayed">
        <RouterLink to="/" @click="logout">&lt;- Logga ut</RouterLink>
        <br />
        <button @click="changeMapHandler" :key="mapMessage">{{ mapMessage }}</button>
        <h1>Försenade tåg</h1>

        <div
            id="delayed-trains"
            class="delayed-trains"
            v-for="item in delayedTrains"
            :key="item.ActivityId"
        >
            <div @click="ticketHref(item)">
                <div class="train-number">
                    {{ item.OperationalTrainNumber }}
                </div>
                <div class="current-station">
                    <div>{{ item.LocationSignature }}</div>
                    <div>
                        {{ item.FromLocation ? item.FromLocation[0].LocationName + ' -> ' : '' }}
                        {{ item.ToLocation ? item.ToLocation[0].LocationName : '' }}
                    </div>
                </div>
                <div class="delay">
                    {{ utils.outputDelay(item) }}
                </div>
            </div>
        </div>
    </div>
</template>
