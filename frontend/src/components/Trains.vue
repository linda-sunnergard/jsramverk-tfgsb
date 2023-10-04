<script setup>
    import { useRouter } from 'vue-router';
    import { onMounted, ref } from 'vue';

    import { useAuthStore } from '../stores/auth.store';
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';

    const router= useRouter();
    const delayedTrains = ref([]);

    api.delayed().then((result) => {
        delayedTrains.value = result;
    });

    function ticketHref(train) {
        router.push({path: "/ticket/" + train.ActivityId });
    };

    function logout() {
        const authStore = useAuthStore();
        authStore.logout()
        router.push('/');
    }
</script>

<template>
    <div class="delayed">
        <a href="#/" @click.prevent="logout">&lt- Logga ut</a>
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