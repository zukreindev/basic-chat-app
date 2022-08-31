<script setup>
import { RouterView } from 'vue-router';
import { onMounted, ref } from 'vue';

let loaded = ref(false);

onMounted(() => {
    loaded.value = true;
});
</script>

<template>
    <RouterView />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');

body {
    background-color: #191919;
    font-family: 'Roboto', sans-serif;
    color: #fff;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background: #282828;
    border-radius: 10px;
    background-clip: padding-box;
}

::-webkit-scrollbar-track {
    background: transparent;
}

#preloader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;

    #loader {
        width: 8px;
        height: 40px;
        border-radius: 4px;
        display: block;
        margin: 20px auto;
        position: relative;
        background: currentColor;
        color: #fff;
        box-sizing: border-box;
        animation: loader 0.3s 0.3s linear infinite alternate;

        &::after,
        &::before {
            content: '';
            width: 8px;
            height: 40px;
            border-radius: 4px;
            background: currentColor;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 20px;
            box-sizing: border-box;
            animation: loader 0.3s 0.45s linear infinite alternate;
        }

        &::before {
            left: -20px;
            animation-delay: 0s;
        }
    }

    @keyframes loader {
        0% {
            height: 48px;
        }
        100% {
            height: 4px;
        }
    }
}
</style>
