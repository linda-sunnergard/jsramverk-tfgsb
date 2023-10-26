<script setup>
    import { inject, ref } from 'vue'
    import api from '../models/ApiModel.js';
    import { RouterLink, useRouter } from 'vue-router';

    const codes = ref([])
    const router = useRouter();
    let selected;
    const {currentTicket, updateCurrentTicket} = inject('currentTicket');

    api.getCodes().then((result) => { codes.value = result });

    function updateTicket (selected, currentTicket) {
        if (selected === undefined) {
            return;
        };
        const id = currentTicket._id;
        const code = selected;
        const newTicket = api.updateTicket(id, code);
        updateCurrentTicket(newTicket);
        router.push({name: 'ticket'});;
    };
</script>

<template>
        <div class="ticket-container">
        <div class="ticket">
            <div class="old-tickets" id="old-tickets">
            <!-- <a href="/ticket" @click.prevent="handleBackButton">&lt- Tillbaka</a> -->
            <RouterLink to="/ticket">&lt;- Tillbaka</RouterLink>
            <h1>Nuvarande ärende</h1>
                <div>{{ currentTicket.traindate }} - {{ currentTicket.code }} - {{ currentTicket.trainnumber }} - {{ currentTicket._id }} </div>
            </div>
            <h3>Ändra ärende</h3>
            <form id="new-ticket-form" @submit.prevent="updateTicket(selected, currentTicket)">
                <label>Orsakskod</label><br>
                <select id="reason-code" v-model="selected">
                    <option 
                        v-for="(code) in codes"
                        :value="code.Code"
                        :key="code._id"
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