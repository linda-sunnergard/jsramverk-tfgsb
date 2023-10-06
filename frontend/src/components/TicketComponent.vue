<script setup>
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    import { useRouter } from 'vue-router';
    import { inject } from 'vue';

    const router = useRouter();
    const tickets = await api.getTickets();
    const ticketCount = tickets.length;
    const codes = await api.codes();
    let selected;
    const {currentTicket, updateCurrentTicket} = inject('currentTicket');
    const {currentTrainRef, updateCurrentTrainRef} = inject('currentTrainRef');

    function submitTicket (selected, train) {
        if (selected === undefined) {
            return;
        };
        const code = selected;
        const trainNumber = train.OperationalTrainNumber;
        const trainDate = train.EstimatedTimeAtLocation.substring(0, 10);

        api.postTicket(code, trainNumber, trainDate);
        router.go("/ticket/" + train.ActivityId);
    };

    function handleTicketUpdate(ticket) {
        updateCurrentTicket(ticket)
        router.push("/update/");
    }
</script>

<template>
    <div class="ticket-container">
        <div class="ticket">
            <RouterLink to="/">&lt- Tillbaka</RouterLink>
            <h1>Nytt ärende #{{ ticketCount + 1 }}</h1>
            <h3 v-if="currentTrainRef.FromLocation">
                {{ "Tåg från " + currentTrainRef.FromLocation[0].LocationName + " till " + currentTrainRef.ToLocation[0].LocationName + ". Just nu i " + currentTrainRef.LocationSignature + "." }}
            </h3>
            <p><strong>Försenad:</strong> {{ utils.outputDelay(currentTrainRef) }}</p>
            <form id="new-ticket-form" @submit.prevent="submitTicket(selected, currentTrainRef)">
                <label>Orsakskod</label><br>
                <select id="reason-code" v-model="selected">
                    <option 
                        v-for="(code, index) in codes"
                        :value="code.Code"
                    >
                        {{ code.Code }} - {{ code.Level3Description }}
                    </option>
                </select><br><br>
                <input type="submit" value="Skapa nytt ärende" />
            </form>
        </div>
        <br>
        <div class="old-tickets" id="old-tickets">
            <h2>Befintliga ärenden</h2>
            <div v-for="ticket in tickets">
                <div>
                    {{ ticket.traindate }} - {{ ticket.code }} - {{ ticket.trainnumber }} - {{ ticket._id }}
                    <button @click="handleTicketUpdate(ticket)">Uppdatera ärende</button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- // Using https://vuejs.org/guide/essentials/event-handling.html -->
