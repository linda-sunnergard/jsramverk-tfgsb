<script setup>
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    import { useRouter, useRoute } from 'vue-router';
    import { ref } from 'vue';

    const router = useRouter();
    const route = useRoute();
    const activityIdInRoute = ref(route.params.activityId);

    const trains = ref([]);
    const tickets = ref([]);
    const codes = ref([]);
    const currentTrain = ref({});
    const selected = ref({});

    function updateTrains() {
        api.delayed().then((result) => {
            trains.value = result;

            for (const train of trains.value) {
                if (train.ActivityId === activityIdInRoute.value) {
                    currentTrain.value = train;
                }
            }

            if (currentTrain.value.ActivityId === undefined) {
                router.push("/home");
            }
        });
    }

    function updateTickets() {
        api.getTickets().then((result) => {
            tickets.value = result;
        });
    }

    function updateCodes() {
        api.codes().then((result) => {
            codes.value = result;
        });
    }

    updateTrains();
    updateTickets();
    updateCodes();

    function submitTicket (selectedCode) {
        if (typeof selectedCode !== "string") {
            console.log("inte en sträng")
            return;
        };
        const code = selectedCode;
        const trainNumber = currentTrain.value.OperationalTrainNumber;
        const trainDate = currentTrain.value.EstimatedTimeAtLocation.substring(0, 10);
        console.log(code, trainNumber, trainDate);
        api.postTicket(code, trainNumber, trainDate).then(() => {
            updateTickets();
        });
    };
</script>

<template>
    <div class="ticket-container">
        <div class="ticket">
            <RouterLink to="/home">&lt- Tillbaka</RouterLink>
            <h1>Nytt ärende #{{ tickets.length + 1 }}</h1>
            <h3 v-if="currentTrain.FromLocation">
                {{ "Tåg från " + currentTrain.FromLocation[0].LocationName + " till " + currentTrain.ToLocation[0].LocationName + ". Just nu i " + currentTrain.LocationSignature + "." }}
            </h3>
            <p><strong>Försenad:</strong> {{ utils.outputDelay(currentTrain) }}</p>
            <form id="new-ticket-form" @submit.prevent="submitTicket(selected)">
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
