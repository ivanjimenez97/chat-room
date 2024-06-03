<template>
  <div class="chat">
    <ul class="content">
      <li class="item roommate-user p-3 mb-4">
        <h5 class="name">Mayra MH</h5>
        <p class="message">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
          reprehenderit libero consectetur nihil saepe perferendis excepturi,
          omnis, vitae at natus corporis. Explicabo nulla unde quibusdam
          voluptate animi quisquam labore eligendi?
        </p>
        <p class="time">5:00 pm</p>
      </li>
      <li class="item current-user p-3 mb-4">
        <h5 class="name">Ivan Jimenez</h5>
        <p class="message">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
          reprehenderit libero consectetur nihil saepe perferendis excepturi,
          omnis, vitae at natus corporis. Explicabo nulla unde quibusdam
          voluptate animi quisquam labore eligendi?
        </p>
        <p class="time">5:00 pm</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { state } from "@/socket";
const messages = state.messages;
</script>
