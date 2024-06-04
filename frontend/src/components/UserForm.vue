<script setup>
import { ref, defineEmits } from "vue";
import IconamoonEnter from "./icons/IconamoonEnter.vue";

const username = ref();

const userSubmit = () => {
  // Emit an event with the username
  emit("usernameSubmitted", username.value);
  //console.log("Username:", username.value);
};

// Define the emitted events
const emit = defineEmits(["usernameSubmitted"]);
</script>

<template>
  <div class="card shadow-none border-0">
    <div
      class="card-header bg-white border-bottom border-secondary border-opacity-10 py-4"
    >
      <h1 class="text-center text-primary fw-bold">Chat Room</h1>
    </div>
    <div class="card-body py-4">
      <form @submit.prevent="userSubmit">
        <div class="row">
          <div class="col-12">
            <label for="username" class="form-label"> Username: </label>
            <input
              type="text"
              name="username"
              id="username"
              class="form-control mb-3"
              placeholder="Enter a value"
              v-model="username"
            />
          </div>
          <div class="col-12 text-end">
            <button type="submit" class="btn btn-outline-primary">
              Join <IconamoonEnter />
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
