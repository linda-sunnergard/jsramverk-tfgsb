<script setup>
    import { RouterLink, useRouter } from 'vue-router';
    import { ref } from 'vue';

    import { useAuthStore } from '../stores/auth.store';
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    import { inject } from 'vue';

    const {currentTrainRef, updateCurrentTrainRef} = inject('currentTrainRef');
    const router= useRouter();
    const delayedTrains = ref([]);

    api.getDelayedTrains().then((result) => {
        delayedTrains.value = result;
    });

    function ticketHref(train) {
        updateCurrentTrainRef(train)
        router.push({path: "/ticket/"});
    };

    function logout() {
        const authStore = useAuthStore();
        authStore.logout()
    }
</script>

<template>
    <div class="delayed">
        <RouterLink to="/" @click="logout">&lt- Logga ut</RouterLink>
        <h1>Försenade tåg</h1>

        <div id="delayed-trains" class="delayed-trains" v-for="item in delayedTrains">
            <div @click="ticketHref(item)">
                <div class="train-number">
                    {{ item.OperationalTrainNumber }}
                </div>
                <div class="current-station">
                    <div>{{ item.LocationSignature }}</div>
                    <div>{{ item.FromLocation ? item.FromLocation[0].LocationName + " -> " : "" }} {{ item.ToLocation ? item.ToLocation[0].LocationName : "" }}</div>
                </div>
                <div class="delay">
                    {{ utils.outputDelay(item) }}
                </div>
            </div>
        </div>
    </div>
</template>