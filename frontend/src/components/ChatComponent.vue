<script setup>
//ChatComponent.vue
import { ref, onMounted, onBeforeUnmount } from "vue";
import io from "socket.io-client";
import HugeiconsSearch01 from "./icons/HugeiconsSearch01.vue";
import MaterialSymbolsCancel from "./icons/MaterialSymbolsCancel.vue";
import MingcuteSendLine from "./icons/MingcuteSendLine.vue";
import HugeiconsFileUpload from "./icons/HugeiconsFileUpload.vue";
import MaterialSymbolsImageOutline from "./icons/MaterialSymbolsImageOutline.vue";
import moment from "moment";

const socket = io("/");

const displaySearchElements = ref(false);
const searchResults = ref([]);
const search = ref("");
const isSearching = ref(false);

const messages = ref([]);
const message = ref();

// Pagination state
const page = ref(1);
const limit = 10;
const isLoading = ref(false);

//File Variables
const image = ref(null);
const imageInput = ref(null);
const isImage = ref(true);
const file = ref(null);
const fileInput = ref(null);
const isFile = ref(true);

const props = defineProps({
  username: String,
});

// *** SEARCH METHODS AND VALIDATIONS

const activateSearchElements = (e) => {
  e.preventDefault();
  displaySearchElements.value = true;
};

const deactivateSearchElements = (e) => {
  e.preventDefault();
  displaySearchElements.value = false;
  clearSearch();
};

const handleSearch = async () => {
  if (!search.value.trim()) {
    isSearching.value = false;
    return;
  }

  try {
    const response = await fetch(
      `/api/search/messages?query=${encodeURIComponent(search.value.trim())}`
    );
    if (response.ok) {
      const result = await response.json();
      searchResults.value = result;
      isSearching.value = true;
    } else {
      console.error("Error searching messages:", response.statusText);
    }
  } catch (error) {
    console.error("Error searching messages:", error);
  }
};

const clearSearch = () => {
  search.value = "";
  isSearching.value = false;
};

const handleSubmit = async () => {
  if (message.value.trim()) {
    const newMessage = {
      userId: socket.id, // Include the user ID
      body: message.value,
      username: props.username,
      time: moment().format("LTS"),
    };
    //Send new message to server
    console.log("New Message", newMessage);
    await sendMessage(newMessage);
    message.value = ""; // Clearing the input field
  }
};

const sendMessage = async (messageData) => {
  try {
    await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Get More Messages
const fetchMessages = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(
      `/api/messages?page=${page.value}&limit=${limit}`
    );
    if (response.ok) {
      const result = await response.json();
      messages.value.unshift(...result);
      page.value++;
    } else {
      console.error("Error fetching messages:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    isLoading.value = false;
  }
};

// *** UPLOADING AMD SENDING IMAGE METHODS ***

const isValidImage = (image) => {
  const validImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
  return validImageTypes.includes(image.type);
};

const handleImageChange = async (e) => {
  const selectedImage = e.target.files[0];
  if (selectedImage && isValidImage(selectedImage)) {
    isImage.value = true;
    image.value = e.target.files[0];
    console.log("Image Uploaded", image.value);
  } else {
    //When this variable is set to false an alert will be displayed on the modal.
    isImage.value = false;
    imageInput.value.value = "";
  }
};

const handleImageUpload = async (e) => {
  e.preventDefault();

  if (!image.value) return;
  const formData = new FormData();
  formData.append("userId", socket.id);
  formData.append("image", image.value);
  formData.append("username", props.username);
  formData.append("time", moment().format("LTS"));

  try {
    await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });
    image.value = null;
    imageInput.value.value = "";
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

const resetImageValues = async () => {
  image.value = null;
  imageInput.value.value = null;
  isImage.value = true;
};

// *** UPLOAD FILE METHODS ***

const isValidFile = (file) => {
  const validFileTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];
  return validFileTypes.includes(file.type);
};

const handleFileChange = async (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile && isValidFile(selectedFile)) {
    isFile.value = true;
    file.value = e.target.files[0];
    console.log("File Uploaded", file.value);
  } else {
    //When this variable is set to false an alert will be displayed on the modal.
    isFile.value = false;
    fileInput.value.value = "";
  }
};

const handleFileUpload = async (e) => {
  e.preventDefault();

  if (!file.value) return;
  const formData = new FormData();
  formData.append("userId", socket.id);
  formData.append("file", file.value);
  formData.append("username", props.username);
  formData.append("time", moment().format("LTS"));

  try {
    await fetch("/api/upload/file", {
      method: "POST",
      body: formData,
    });
    file.value = null;
    fileInput.value.value = "";
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const resetFileValues = async () => {
  file.value = null;
  fileInput.value.value = null;
  isFile.value = true;
};

//Listen for new messages
const receiveMessage = (message) => {
  messages.value.push(message);
};

const handleScroll = (e) => {
  if (e.target.scrollTop < -100 && !isLoading.value) {
    fetchMessages();
  }
};

//Loading Chat History
socket.on("chat history", (history) => {
  console.log("History : ", history);
  messages.value = history;
});

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
  fetchMessages(); // Fetch the first batch of messages
  document.querySelector(".chat").addEventListener("scroll", handleScroll);
});

// Clean up when component is unmounted
onBeforeUnmount(() => {
  socket.off("message", receiveMessage);
  socket.disconnect();
  document.querySelector(".chat").removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="card shadow-none border-0">
    <!-- Card Header -->
    <div
      class="card-header bg-white border-bottom border-secondary border-opacity-10"
    >
      <div class="row">
        <div class="col-12 col-md-6 my-auto">
          <h2
            class="text-center text-primary fw-bold text-center text-md-start"
          >
            Chat Room
          </h2>
        </div>
        <!-- Search Elements Starts here-->
        <div class="col-10 col-md-5 my-auto text-end">
          <input
            type="text"
            class="form-control"
            placeholder="Search in Chat"
            v-if="displaySearchElements"
            v-model="search"
            @input="handleSearch"
          />
        </div>
        <div class="col-2 col-md-1 text-center px-0">
          <button
            type="button"
            class="btn btn-light my-auto"
            v-if="displaySearchElements"
            @click="deactivateSearchElements"
          >
            <MaterialSymbolsCancel />
          </button>
          <button
            type="button"
            class="btn btn-light my-auto"
            v-if="!displaySearchElements"
            @click="activateSearchElements"
          >
            <HugeiconsSearch01 />
          </button>
        </div>
        <!-- Search Elements ends here-->
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-body bg-white">
      <div class="chat">
        <ul
          class="content"
          v-if="isSearching ? searchResults.length > 0 : messages.length > 0"
        >
          <li
            v-for="msg in isSearching ? searchResults : messages"
            :key="msg.id"
            :class="{
              'current-user': msg.username === props.username,
              'roommate-user': msg.username !== props.username,
            }"
            class="item px-3 py-1 mb-4"
          >
            <h5 class="name">{{ msg.username }}</h5>
            <p class="message" v-if="msg.body">
              {{ msg.body }}
            </p>
            <!-- Image -->
            <img
              v-if="msg.image"
              :src="`/api/image/${msg._id}`"
              alt="User uploaded image"
              class="img-fluid image"
            />
            <!-- File -->
            <div class="file" v-if="msg.file">
              <p class="title mb-2">{{ msg.file.name }}</p>
              <!--Improvement: We can add the File Size-->
              <a
                :href="`/api/file/${msg._id}`"
                target="_blank"
                class="btn btn-sm btn-secondary mx-2"
                >Abrir</a
              >
              <a
                :href="`/api/file/${msg._id}`"
                download
                class="btn btn-sm btn-secondary mx-2"
                >Download</a
              >
            </div>
            <p class="time">
              {{ moment(msg.time, "hh:mm:ss A").format("hh:mm A") }}
            </p>
          </li>
        </ul>
        <div class="alert alert-warning" role="alert" v-else>
          Messages not found.
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div
      class="card-footer bg-white border-top border-secondary border-opacity-10 pt-4 pb-3"
    >
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-9 col-lg-10 my-auto">
            <textarea
              name="message"
              id="message"
              placeholder="Type a message"
              class="form-control border-0"
              v-model="message"
            ></textarea>
          </div>
          <div class="col-3 col-lg-2 my-auto text-center text-md-end">
            <div class="row">
              <div class="col-12 col-md-6 text-center text-lg-end">
                <!-- Show Upload Image Modal -->
                <button
                  type="button"
                  class="btn btn-outline-secondary mb-2 mb-md-0 mb-lg-3"
                  data-bs-toggle="modal"
                  data-bs-target="#uploadImageModal"
                  title="Show Upload Image Modal"
                  v-if="!message"
                >
                  <MaterialSymbolsImageOutline />
                </button>
              </div>
              <div class="col-12 col-md-6 text-center text-lg-start">
                <!-- Show Upload File Modal -->
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#uploadFileModal"
                  v-if="!message"
                  title="Show Upload File Modal"
                >
                  <HugeiconsFileUpload />
                </button>
              </div>
              <div class="col-12">
                <!-- Button To send a message -->
                <button
                  class="btn btn-primary my-auto px-md-3"
                  type="submit"
                  v-if="message"
                >
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
          </div>
        </div>
      </form>
    </div>

    <!-- Upload Image Modal -->
    <div
      class="modal fade"
      id="uploadImageModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="uploadImageModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fs-5" id="uploadImageModalLabel">
              Choose an image to upload...
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetImageValues"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Display Alert just in case the element uploaded is a wrong type file. -->
            <div class="alert alert-danger" role="alert" v-if="!isImage">
              <strong>Attention!</strong>
              <br />
              Invalid File Type. Please select a JPG, PNG or GIF File.
            </div>
            <!-- Image is uploaded on this input -->
            <input
              type="file"
              ref="imageInput"
              @change="(e) => handleImageChange(e)"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
              @click="resetImageValues"
            >
              Close
            </button>
            <!-- Image is sent by clicking this button -->
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click.prevent="(e) => handleImageUpload(e)"
            >
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
      </div>
    </div>

    <!-- Upload File Modal -->
    <div
      class="modal fade"
      id="uploadFileModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="uploadFileModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fs-5" id="uploadFileModalLabel">
              Choose a File to upload...
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resetFileValues"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Display Alert just in case the element uploaded is a wrong type file. -->
            <div class="alert alert-danger" role="alert" v-if="!isFile">
              <strong>Attention!</strong>
              <br />
              Invalid File Type. Please select a PDF, CSV, TXT, DOCX or XLSX.
            </div>
            <!-- File is uploaded on this input -->
            <input
              type="file"
              ref="fileInput"
              @change="(e) => handleFileChange(e)"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
              @click="resetFileValues"
            >
              Close
            </button>
            <!-- File is sent by clicking this button -->
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click.prevent="(e) => handleFileUpload(e)"
            >
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
      </div>
    </div>
  </div>
</template>
