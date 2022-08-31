<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

let name = ref(null);
let pass = ref(null);
let error = ref(null);
let logging = ref(false);

const login = () => {
    logging.value = true;

    fetch(`${import.meta.env.VITE_API_SERVER}/auth/login`, {
        body: JSON.stringify({
            name: name.value,
            pass: pass.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })
        .then((res) => res.json())
        .then((data) => {
            if (!data.error) {
                error.value = null;

                localStorage.setItem('token', data.token);
                window.location.href = '/app';
            } else {
                error.value = `Error - ${data.error}`;
                logging.value = false;
            }
        });
};

const onEnter = (e) => {
    if (e.keyCode === 13) {
        login();
    }
};

document.title = 'Login';
</script>

<template>
    <div id="header">
        <form>
            <h1 id="title">Login</h1>
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
            <button @click="login" id="btn" type="button" role="button" v-if="!logging">
                Login
            </button>
            <button id="btn" type="button" role="button" v-else>Logging...</button>
            <p id="register">
                Don't have an account?
                <RouterLink to="/auth/register" id="link">Register</RouterLink>
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
