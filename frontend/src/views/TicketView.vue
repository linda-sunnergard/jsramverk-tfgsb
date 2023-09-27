<script setup>
    import { defineAsyncComponent, ref } from 'vue'

    const TicketComponent = defineAsyncComponent(() =>
        import('../components/TicketComponent.vue')
    )
</script>

<template>
    <Suspense>
        <TicketComponent />
    </Suspense>
</template>

<style>

</style>
