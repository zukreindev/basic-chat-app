<script setup>
import { ref } from 'vue';
import Error from '../components/Error.vue';

const token = localStorage.getItem('token');

let ws = new WebSocket(import.meta.env.VITE_SOCKET_SERVER);
let messages = ref([]);
let user = ref(null);
let online = ref(0);
let isLogined = ref(false);
let messageContent = ref(null);
let loaded = ref(false);

ws.onmessage = ({ data }) => {
    const { op, d, t } = JSON.parse(data);

    switch (op) {
        case 1:
            ws.send(
                JSON.stringify({
                    op: 2,
                    d: {
                        token,
                    },
                }),
            );
            break;
        case 3:
            user.value = d.user;
            online.value = d.online;
            messages.value = d.messages;

            loaded.value = true;

            setTimeout(() => {
                goLastMessage();
            }, 1);
            break;
        case 4:
            switch (t) {
                case 'USER_JOIN':
                    online.value = d.online;

                    messages.value.push({
                        system: true,
                        appendix: d.user,
                        suffix: 'Just joined the chat!',
                    });

                    setTimeout(() => {
                        goLastMessage();
                    }, 1);
                    break;
                case 'USER_LEAVE':
                    online.value = d.online;

                    messages.value.push({
                        system: true,
                        appendix: d.user,
                        suffix: 'Just leaved the chat!',
                    });

                    setTimeout(() => {
                        goLastMessage();
                    }, 1);
                    break;
                case 'CREATE_MESSAGE':
                    messages.value.push(d);

                    setTimeout(() => {
                        goLastMessage();
                    }, 1);
                    break;
            }
            break;
    }
};

ws.onclose = ({ code }) => {
    switch (code) {
        case 4001:
            window.location.reload();
            break;
        case 4002:
            localStorage.removeItem('token');
            window.location.href = '/#/auth/register';
            break;
        case 4003:
            window.location.href = '/';
            break;
        case 4004:
            isLogined.value = true;
            break;
        default:
            window.location.href = '/';
            break;
    }
};

const sendMessage = () => {
    if (
        messageContent.value &&
        messageContent.value.length &&
        !/^[\s]+$/g.test(messageContent.value)
    ) {
        ws.send(
            JSON.stringify({
                op: 5,
                t: 'CREATE_MESSAGE',
                d: {
                    content: messageContent.value,
                },
            }),
        );

        messageContent.value = null;
    }
};

const onEnter = (e) => {
    if (e.keyCode === 13) {
        sendMessage();
    }
};

const goLastMessage = () => {
    const element = document.getElementById('messages');
    element.scrollTop = element.scrollHeight - element.clientHeight;
};

document.title = 'Chat App';
</script>

<template>
    <Error
        title="Error!"
        description="Your session here has ended because you logged in to the application on a different page."
        v-if="isLogined"
    />
    <div id="header" v-else>
        <div v-if="loaded">
            <h1 id="online">Online: {{ online }}</h1>
            <div id="messages">
                <div v-for="message in messages" v-if="messages.length">
                    <div id="message" v-if="!message.system">
                        <br /><br />
                        <a id="author">
                            ︳{{ message.author }}
                            <span id="createdAt">{{
                                new Date(message.createdTimestamp).toLocaleTimeString()
                            }}</span>
                        </a>
                        <p id="content">
                            {{ message.content }}
                        </p>
                    </div>
                    <div id="message" v-else>
                        <p id="content">{{ message.appendix }} {{ message.suffix }}</p>
                    </div>
                    <br />
                </div>
                <p v-else id="no">Hmm, looks like there's nothing to see here..</p>
                <input
                    type="text"
                    placeholder="Send some messages..."
                    v-model="messageContent"
                    @keypress="onEnter"
                    id="message-send"
                />
            </div>
        </div>
        <div v-else>
            <div id="preloader">
                <span id="loader"></span>
            </div>
        </div>
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
}

#header {
    display: block;
    justify-content: space-between;
    align-items: center;
    height: 100vh;

    #online {
        text-align: center;
    }

    #messages {
        margin: auto auto;
        background-color: #202020;
        border-radius: 8px;
        width: 50%;
        height: 80vh;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        padding: 1rem;
        flex-direction: column;

        #message-send {
            width: 95%;
            height: 5%;
            border: none;
            border-radius: 8px;
            padding: 0 1rem;
            font-size: 1.2rem;
            font-weight: 500;
            color: rgb(113 113 122);
            outline: none;
        }

        #message {
            background-color: #242424;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 6px;

            #author {
                color: #fff;
                font-size: 18px;
                font-weight: 500;
                line-height: 0;

                #createdAt {
                    color: rgb(113 113 122);
                    font-size: 15px;
                    font-weight: 400;
                    margin-left: 0.7rem;
                }
            }

            #content {
                color: rgb(187, 184, 184);
                font-size: 17px;
                font-weight: 400;
                line-height: 1rem;
                word-wrap: break-word;
                margin-left: 1rem;
                margin-right: 1rem;
            }
        }

        #no {
            color: rgb(187, 184, 184);
            font-size: 19px;
            font-weight: 400;
            line-height: 0;
            margin-left: 5px;
        }

        input {
            background-color: #202020;
            color: #eee;
            font-size: 18px;
            height: 100%;
            padding: 1rem 3rem;
            transition: all 0.3s;
            margin-top: auto;
            border-top: 1px solid #333;
        }
    }
}
</style>
