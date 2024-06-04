<script setup>
import { ref } from "vue";
// Import our custom CSS
import "./assets/scss/styles.scss";
import UserForm from "./components/UserForm.vue";
import ChatComponent from "./components/ChatComponent.vue";

const userExists = ref(false);
var username = "";
// Listen for the emitted event
const onUsernameSubmitted = (submittedUsername) => {
  //console.log("Child username submitted:", submittedUsername);

  if (submittedUsername) {
    // Set userExists to true when the user submits a username.
    userExists.value = true;
    console.log("User Exists:", userExists);
    username = submittedUsername;
    console.log("APP Username:", username);
  }
};
</script>

<template>
  <div class="container py-5 px-3 mx-auto">
    <!-- Login Component -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-7 col-xl-6">
        <UserForm v-if="!userExists" @usernameSubmitted="onUsernameSubmitted" />
      </div>
    </div>
    <!-- Chat Screen -->
    <ChatComponent v-if="userExists" :username="username" />
  </div>
</template>

<style scoped></style>
