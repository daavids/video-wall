<template>
    <footer class="footer bg-success text-light text-center p-4">
        &copy; <span id="year">{{ currentYear }}</span>
    </footer>
</template>

<script>
export default {
    computed: {
        currentYear: () => {
            return new Date().getFullYear();
        }
    }
}
</script>

<style lang="scss" scoped>
.footer {
    font-weight: bold;
    font-size: 1.2rem;
}
</style>