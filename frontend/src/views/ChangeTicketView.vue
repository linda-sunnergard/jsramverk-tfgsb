<script setup>
    import { defineAsyncComponent } from 'vue'

    const ChangeComponent = defineAsyncComponent(() =>
        import('../components/ChangeComponent.vue')
    )
</script>

<template>
    <Suspense>
        <ChangeComponent />
    </Suspense>
</template>