<script setup>
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    import { useRouter, useRoute } from 'vue-router';
    import { ref } from 'vue';

    const route = useRoute();
    const activityId = ref(route.params.activityId);

    const router = useRouter();
    const trains = await api.delayed();
    const tickets = await api.getTickets();
    const ticketCount = tickets.length;
    const codes = await api.codes();
    let currentTrain = {};
    let selected;

    for (const train of trains) {
        if (train.ActivityId === activityId.value) {
            currentTrain = train;
        }
    }

    if (currentTrain.ActivityId === undefined) {
        await router.push("/");
    }

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
</script>

<template>
    <div class="ticket-container">
        <div class="ticket">
            <RouterLink to="/">&lt- Tillbaka</RouterLink>
            <h1>Nytt ärende #{{ ticketCount + 1 }}</h1>
            <h3 v-if="currentTrain.FromLocation">
                {{ "Tåg från " + currentTrain.FromLocation[0].LocationName + " till " + currentTrain.ToLocation[0].LocationName + ". Just nu i " + currentTrain.LocationSignature + "." }}
            </h3>
            <p><strong>Försenad:</strong> {{ utils.outputDelay(currentTrain) }}</p>
            <form id="new-ticket-form" @submit.prevent="submitTicket(selected, currentTrain)">
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
                <div>{{ ticket.traindate }} - {{ ticket.code }} - {{ ticket.trainnumber }} - {{ ticket._id }}</div>
            </div>
        </div>
    </div>
</template>

<style>

</style>
