<script setup>
import api from '../models/ApiModel.js'
import utils from '../models/Utils.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { inject } from 'vue'

const router = useRouter()

const trains = ref([])
const tickets = ref([])
const codes = ref([])
const selected = ref({})
const { updateCurrentTicket } = inject('currentTicket')
const { currentTrainRef } = inject('currentTrainRef')
const socketIo = inject('socketIo')

function updateTrains() {
    api.getDelayedTrains().then((result) => {
        trains.value = result
    })
}

function updateTickets() {
    api.getTickets().then((result) => {
        tickets.value = result
    })
}

function updateCodes() {
    api.getCodes().then((result) => {
        codes.value = result
    })
}

updateTrains()
updateTickets()
updateCodes()

function submitTicket(selectedCode) {
    if (typeof selectedCode !== 'string') {
        console.log('inte en sträng')
        return
    }
    const code = selectedCode
    const trainNumber = currentTrainRef.value.OperationalTrainNumber
    const trainDate = currentTrainRef.value.EstimatedTimeAtLocation.substring(0, 10)
    api.postTicket(code, trainNumber, trainDate).then(() => {
        updateTickets()
    })
}

function handleTicketUpdate(ticket) {
    updateCurrentTicket(ticket)
    router.push('/update/')
}

function goHome() {
    socketIo.emit('delayedRelease')
    router.push('/home')
}
</script>

<template>
    <div class="ticket-container">
        <div class="ticket">
            <a href="/home" @click.prevent="goHome()">&lt;- Tillbaka</a>
            <h1>Nytt ärende #{{ tickets.length + 1 }}</h1>
            <h3 v-if="currentTrainRef.FromLocation">
                {{
                    'Tåg från ' +
                    currentTrainRef.FromLocation[0].LocationName +
                    ' till ' +
                    currentTrainRef.ToLocation[0].LocationName +
                    '. Just nu i ' +
                    currentTrainRef.LocationSignature +
                    '.'
                }}
            </h3>
            <p><strong>Försenad:</strong> {{ utils.outputDelay(currentTrainRef) }}</p>
            <form id="new-ticket-form" @submit.prevent="submitTicket(selected, currentTrainRef)">
                <label>Orsakskod</label><br />
                <select id="reason-code" v-model="selected">
                    <option v-for="code in codes" :value="code.Code" :key="code._id">
                        {{ code.Code }} - {{ code.Level3Description }}
                    </option></select
                ><br /><br />
                <input type="submit" value="Skapa nytt ärende" />
            </form>
        </div>
        <br />
        <div class="old-tickets" id="old-tickets">
            <h2>Befintliga ärenden</h2>
            <div v-for="ticket in tickets" :key="ticket._id">
                <div>
                    {{ ticket.traindate }} - {{ ticket.code }} - {{ ticket.trainnumber }} -
                    {{ ticket._id }}
                    <button @click="handleTicketUpdate(ticket)">Uppdatera ärende</button>
                </div>
            </div>
        </div>
    </div>
</template>

