<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import { request } from 'axios';

let name = ref(null);
let pass = ref(null);
let error = ref(null);
let registering = ref(false);

const register = () => {
    registering.value = true;

    request({
        url: `${import.meta.env.VITE_API_SERVER}/auth/register`,
        body: JSON.stringify({
            name: name.value,
            pass: pass.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then(({ data }) => {
        if (!data.error) {
            error = null;

            localStorage.setItem('token', data.token);
            window.location.href = '/app';
        } else {
            error.value = `Error - ${data.error}`;
            registering.value = false;
        }
    });
};

const onEnter = (e) => {
    if (e.keyCode === 13) {
        register();
    }
};

document.title = 'Register';
</script>

<template>
    <div id="header">
        <form>
            <h1 id="title">Register</h1>
            <p id="error">{{ error }}</p>
            <input
                type="firstname"
                placeholder="Enter name"
                id="input"
                v-model="name"
                @keypress="onEnter"
            />
            <br /><br />
            <input
                type="password"
                placeholder="Enter password"
                v-model="pass"
                @keypress="onEnter"
            />
            <br /><br />
            <button @click="register" id="btn" type="button" role="button" v-if="!registering">
                Register
            </button>
            <button id="btn" type="button" role="button" v-else>Registering...</button>
            <p id="register">
                Already have an account?
                <RouterLink to="/auth/login" id="link">Login</RouterLink>
            </p>
        </form>
    </div>
</template>

<style scoped lang="scss">
#header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;

    #btn {
        padding: 0.8rem 2rem;
        background-color: #413fa8;
        color: #fff;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s;
        width: 100%;

        &:hover {
            background-color: #2d2c86;
        }
    }

    #title {
        font-size: 2.7rem;
        font-weight: bold;
    }

    form {
        text-align: center;

        input {
            background-color: #202020;
            border-radius: 8px;
            border: 0;
            color: #eee;
            font-size: 18px;
            height: 100%;
            outline: 0;
            padding: 1rem 3rem;
            transition: all 0.3s;

            &:focus {
                outline: 1px solid #2d2c86;
            }
        }

        #link {
            color: #413fa8;
            text-decoration: none;
            transition: all 0.3s;

            &:hover {
                color: #2d2c86;
            }
        }

        #error {
            color: rgb(145, 0, 0);
        }
    }
}
</style>
