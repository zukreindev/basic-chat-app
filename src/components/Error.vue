<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    title: String,
    description: String,
});
</script>

<template>
    <div id="error">
        <h1 id="title">{{ props.title }}</h1>
        <p id="desc">{{ props.description }}</p>
        <RouterLink to="/" id="btn">Go Home</RouterLink>
    </div>
</template>

<style scoped lang="scss">
#error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;

    #title {
        font-size: 3rem;
        font-weight: 700;
    }

    #desc {
        font-size: 1.5rem;
        font-weight: 500;
        color: rgb(113 113 122);
    }

    #btn {
        padding: 1rem 2rem;
        background-color: #413fa8;
        color: #fff;
        text-decoration: none;
        border-radius: 8px;
        margin-left: 1rem;
        transition: all 0.3s;

        &:hover {
            background-color: #2d2c86;
        }
    }
}
</style>
