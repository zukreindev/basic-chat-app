<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';

const token = localStorage.getItem('token');

let user = ref(null);
let loaded = ref(false);

if (token) {
    fetch(`${import.meta.env.VITE_API_SERVER}/users`, {
        headers: {
            authorization: token,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (!data.error) {
                user.value = data;
            } else {
                localStorage.removeItem('token');
            }

            loaded.value = true;
        });
} else {
    onMounted(() => {
        loaded.value = true;
    });
}

document.title = 'Chat App';
</script>

<template>
    <div id="header">
        <div v-if="!loaded" id="preloader">
            <span id="loader"></span>
        </div>
        <div v-else>
            <div v-if="user">
                <RouterLink type="button" role="button" id="btn" to="/app">App</RouterLink>
                <RouterLink type="button" role="button" id="btn" to="/auth/logout"
                    >Logout</RouterLink
                >
            </div>
            <div v-else>
                <RouterLink type="button" role="button" id="btn" to="/auth/login">Login</RouterLink>
                <RouterLink type="button" role="button" id="btn" to="/auth/register"
                    >Register</RouterLink
                >
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
#header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 5rem;

    #btn {
        padding: 3rem;
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
