<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import io from "socket.io-client";
import HugeiconsSearch01 from "./icons/HugeiconsSearch01.vue";
import MingcuteSendLine from "./icons/MingcuteSendLine.vue";
import moment from "moment";

const socket = io("/");

const messages = ref([]);
const message = ref();

const props = defineProps({
  username: String,
});

const handleSubmit = () => {
  const newMessage = {
    userType: "current", // Include the user ID
    body: message.value,
    username: props.username,
    time: moment().format("LT"),
  };

  console.log("New Message", newMessage);

  if (message.value.trim()) {
    receiveMessage(newMessage);
    //Send new message to server
    socket.emit("message", newMessage);
    message.value = ""; // Clearing the input field
  }
};

//Listen for new messages
const receiveMessage = (message) => {
  messages.value.push(message);
};

socket.on("message", (message) => {
  console.log(message);
  receiveMessage(message);
});

//Display notification when user join or left the chat.
socket.on("notification", (notification) => {
  console.log(notification);
});

onMounted(() => {
  socket.connect();
});

// Clean up when component is unmounted
onBeforeUnmount(() => {
  socket.off("message", receiveMessage);
  socket.disconnect();
});
</script>

<template>
  <div class="card shadow-none border-0">
    <!-- Card Header -->
    <div
      class="card-header bg-white border-bottom border-secondary border-opacity-10"
    >
      <div class="row">
        <div class="col-8 my-auto">
          <h1 class="text-dark screen-title">Chat Room!</h1>
        </div>
        <div class="col-4 my-auto text-end">
          <button class="btn">
            <HugeiconsSearch01 />
          </button>
        </div>
      </div>
    </div>
    <!-- Card Content -->
    <div class="card-body bg-white">
      <div class="chat">
        <ul class="content" v-if="messages.length > 0">
          <li
            v-for="msg in messages"
            :key="msg.id"
            :class="{
              'current-user': msg.userType === 'current',
              'roommate-user': msg.userType !== 'current',
            }"
            class="item px-3 py-1 mb-4"
          >
            <h5 class="name">{{ msg.username }}</h5>
            <p class="message">
              {{ msg.body }}
            </p>
            <p class="time">{{ msg.time }}</p>
          </li>
        </ul>
        <div class="alert alert-primary" role="alert" v-else>
          Aun no tenemos mensajes para mostrar.
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div
      class="card-footer bg-white border-top border-secondary border-opacity-10 pt-4 pb-3"
    >
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-9 col-sm-10 my-auto">
            <textarea
              name="message"
              id="message"
              placeholder="Type a message"
              class="form-control border-0"
              v-model="message"
            ></textarea>
          </div>
          <div class="col-3 col-sm-2 my-auto text-center text-md-end">
            <button class="btn btn-primary my-auto px-md-3" type="submit">
              <div class="row">
                <div class="col text-center d-none d-md-block pe-md-1">
                  Send
                </div>
                <div class="col text-center ps-md-0">
                  <MingcuteSendLine />
                </div>
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
