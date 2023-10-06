<script setup>
    import { inject } from 'vue'
    import api from '../models/ApiModel.js';
    import { useRouter, useRoute } from 'vue-router';

    const {currentTrainRef, updateCurrentTrainRef} = inject('currentTrainRef');
    const activityId = currentTrainRef.value.ActivityId;
    const codes = await api.codes();
    const router = useRouter();
    let selected;
    const {currentTicket, updateCurrentTicket} = inject('currentTicket');

    function updateTicket (selected, currentTicket) {
        if (selected === undefined) {
            return;
        };
        const id = currentTicket._id;
        const code = selected;
        const newTicket = api.updateTicket(id, code);
        updateCurrentTicket(newTicket);
        router.push({name: 'ticket', params: { activityId: activityId }});;
    };

    function handleBackButton() {
        router.push({name: 'ticket', params: { activityId: activityId }});
    }

</script>

<template>
        <div class="ticket-container">
        <div class="ticket">
            <div class="old-tickets" id="old-tickets">
            <h1>Nuvarande ärende</h1>
                <div>{{ currentTicket.traindate }} - {{ currentTicket.code }} - {{ currentTicket.trainnumber }} - {{ currentTicket._id }} </div>
            </div>
            <button @click="handleBackButton()">&lt- Tillbaka</button>
            <h3>Ändra ärende</h3>
            <form id="new-ticket-form" @submit.prevent="updateTicket(selected, currentTicket)">
                <label>Orsakskod</label><br>
                <select id="reason-code" v-model="selected">
                    <option 
                        v-for="(code, index) in codes"
                        :value="code.Code"
                    >
                        {{ code.Code }} - {{ code.Level3Description }}
                    </option>
                </select><br><br>
                <input type="submit" value="Ändra ärende" />
            </form>
        </div>
        <br>
        </div>
</template>

<!-- 2023-09-15 - ANA002 - 1547 - 65045731f2031f563af341e1 -->