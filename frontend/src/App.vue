<script setup>
import io from "socket.io-client";

const socket = io("/");
</script>

<template>
  <div>
    <h1>Hello Chat User!!</h1>
  </div>
</template>

<style scoped></style>
