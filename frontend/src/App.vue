<script setup>
// Import our custom CSS
import "./assets/scss/styles.scss";
import io from "socket.io-client";
import HugeiconsSearch01 from "./components/icons/HugeiconsSearch01.vue";
import MingcuteSendLine from "./components/icons/MingcuteSendLine.vue";

const socket = io("/");
</script>

<template>
  <div class="container py-5 px-3 mx-auto">
    <div class="card shadow-none border-0">
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
      <div class="card-body bg-white">
        <div class="chat">
          <ul class="content">
            <li class="item roommate-user p-3 mb-4">
              <h5 class="name">Mayra MH</h5>
              <p class="message">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusamus reprehenderit libero consectetur nihil saepe
                perferendis excepturi, omnis, vitae at natus corporis. Explicabo
                nulla unde quibusdam voluptate animi quisquam labore eligendi?
              </p>
              <p class="time">5:00 pm</p>
            </li>
            <li class="item current-user p-3 mb-4">
              <h5 class="name">Ivan Jimenez</h5>
              <p class="message">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusamus reprehenderit libero consectetur nihil saepe
                perferendis excepturi, omnis, vitae at natus corporis. Explicabo
                nulla unde quibusdam voluptate animi quisquam labore eligendi?
              </p>
              <p class="time">5:00 pm</p>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="card-footer bg-white border-top border-secondary border-opacity-10 pt-4 pb-3"
      >
        <form action="">
          <div class="row">
            <div class="col-9 col-sm-10 my-auto">
              <textarea
                name="message"
                id="message"
                placeholder="Type a message"
                class="form-control border-0"
              ></textarea>
            </div>
            <div class="col-3 col-sm-2 my-auto text-end">
              <button class="btn btn-primary my-auto">
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
  </div>
</template>

<style scoped></style>
