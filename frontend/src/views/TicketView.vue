<script setup>
    import { defineAsyncComponent} from 'vue'

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
