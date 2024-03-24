<template>
  <div class="z-10 fixed top-0 right-0 w-full bg-white shadow-sm">
    <div class="flex justify-between items-center shadow-sm">
      <div class="flex-1 flex py-2 items-center">
        <router-link
          :to="{
            name: 'home',
            params: null,
          }"
          class="ms-4"
        >
          <img
            class="w-10"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
            alt=""
          />
        </router-link>
        <div class="relative">
          <input
            type="text"
            class="bg-gray-100 ms-2 py-2 w-60 rounded-3xl outline-none ps-9 placeholder:text-gray-500 text-md"
            placeholder="Tìm kiếm trên Facebook"
          />
          <div class="absolute left-5 top-1/2 -translate-y-1/2">
            <svg
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
              class="text-gray-500"
            >
              <g fill-rule="evenodd" transform="translate(-448 -544)">
                <g fill-rule="nonzero">
                  <path
                    d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z"
                    transform="translate(448 544)"
                  ></path>
                  <path
                    d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z"
                    transform="translate(448 544)"
                  ></path>
                  <path
                    d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z"
                    transform="translate(448 544)"
                  ></path>
                  <path
                    d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z"
                    transform="translate(448 544)"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <ul class="flex justify-center items-center space-x-2.5 flex-1">
        <li>
          <div class="nav-header-center active">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              class="text-gray-600"
            >
              <path
                d="M9.464 1.286C10.294.803 11.092.5 12 .5c.908 0 1.707.303 2.537.786.795.462 1.7 1.142 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.53 2.268.528 4.006v4.3c0 1.355 0 2.471-.119 3.355-.124.928-.396 1.747-1.052 2.403-.657.657-1.476.928-2.404 1.053-.884.119-2 .119-3.354.119H7.93c-1.354 0-2.471 0-3.355-.119-.928-.125-1.747-.396-2.403-1.053-.656-.656-.928-1.475-1.053-2.403C1 18.541 1 17.425 1 16.07v-4.3c0-1.738-.002-2.947.528-4.006.53-1.06 1.497-1.784 2.888-2.826L6.65 3.263c1.114-.835 2.02-1.515 2.815-1.977zM10.5 13A1.5 1.5 0 0 0 9 14.5V21h6v-6.5a1.5 1.5 0 0 0-1.5-1.5h-3z"
              ></path>
            </svg>
          </div>
        </li>
        <li>
          <div class="nav-header-center">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              class="text-gray-600"
            >
              <path
                d="M10.996 8.132A1 1 0 0 0 9.5 9v4a1 1 0 0 0 1.496.868l3.5-2a1 1 0 0 0 0-1.736l-3.5-2z"
              ></path>
              <path
                d="M14.573 2H9.427c-1.824 0-3.293 0-4.45.155-1.2.162-2.21.507-3.013 1.31C1.162 4.266.817 5.277.655 6.477.5 7.634.5 9.103.5 10.927v.146c0 1.824 0 3.293.155 4.45.162 1.2.507 2.21 1.31 3.012.802.803 1.813 1.148 3.013 1.31C6.134 20 7.603 20 9.427 20h5.146c1.824 0 3.293 0 4.45-.155 1.2-.162 2.21-.507 3.012-1.31.803-.802 1.148-1.813 1.31-3.013.155-1.156.155-2.625.155-4.449v-.146c0-1.824 0-3.293-.155-4.45-.162-1.2-.507-2.21-1.31-3.013-.802-.802-1.813-1.147-3.013-1.309C17.866 2 16.397 2 14.573 2zM3.38 4.879c.369-.37.887-.61 1.865-.741C6.251 4.002 7.586 4 9.5 4h5c1.914 0 3.249.002 4.256.138.978.131 1.496.372 1.865.74.37.37.61.888.742 1.866.135 1.007.137 2.342.137 4.256 0 1.914-.002 3.249-.137 4.256-.132.978-.373 1.496-.742 1.865-.369.37-.887.61-1.865.742-1.007.135-2.342.137-4.256.137h-5c-1.914 0-3.249-.002-4.256-.137-.978-.132-1.496-.373-1.865-.742-.37-.369-.61-.887-.741-1.865C2.502 14.249 2.5 12.914 2.5 11c0-1.914.002-3.249.138-4.256.131-.978.372-1.496.74-1.865zM8 21.5a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8z"
              ></path>
            </svg>
          </div>
        </li>
        <li>
          <div class="nav-header-center">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              class="text-gray-600"
            >
              <path
                d="M4.581 1c-1.38 0-2.597.905-2.993 2.227l-.816 2.72A6.45 6.45 0 0 0 .5 7.8c0 1.425.573 2.716 1.501 3.655L2 11.5v4.57c0 1.355 0 2.471.119 3.355.124.928.396 1.747 1.053 2.403.656.657 1.475.928 2.403 1.053.884.12 2 .119 3.354.119h6.142c1.354 0 2.47 0 3.354-.119.928-.125 1.747-.396 2.403-1.053.657-.656.928-1.475 1.053-2.403.12-.884.119-2 .119-3.354V11.5l-.001-.045A5.183 5.183 0 0 0 23.5 7.8a6.47 6.47 0 0 0-.272-1.854l-.816-2.719A3.125 3.125 0 0 0 19.42 1H4.58zM20 12.716V16c0 1.442-.002 2.424-.1 3.159-.096.706-.263 1.033-.486 1.255-.222.223-.55.39-1.255.485-.551.074-1.24.094-2.159.1V17.5a2.5 2.5 0 0 0-2.5-2.5h-3A2.5 2.5 0 0 0 8 17.5v3.498c-.918-.005-1.608-.025-2.159-.099-.706-.095-1.033-.262-1.255-.485-.223-.222-.39-.55-.485-1.255C4.002 18.424 4 17.443 4 16v-3.284A5.192 5.192 0 0 0 5.7 13a5.18 5.18 0 0 0 3.15-1.062A5.18 5.18 0 0 0 12 13a5.18 5.18 0 0 0 3.15-1.062A5.18 5.18 0 0 0 18.3 13a5.2 5.2 0 0 0 1.7-.284zM14 21h-4v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V21z"
              ></path>
            </svg>
          </div>
        </li>
        <li>
          <div class="nav-header-center">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              class="text-gray-600"
            >
              <path
                d="M12 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
              ></path>
              <path
                d="M.5 12C.5 5.649 5.649.5 12 .5S23.5 5.649 23.5 12 18.351 23.5 12 23.5.5 18.351.5 12zm2.21-2a9.537 9.537 0 0 0 0 3.993l.3.007A2 2 0 0 0 3 10h-.29zm.663-1.983a4 4 0 0 1 0 7.966 9.523 9.523 0 0 0 1.948 2.773A5.002 5.002 0 0 1 10 15.523h4a5.002 5.002 0 0 1 4.679 3.233 9.523 9.523 0 0 0 1.948-2.773 4 4 0 0 1 0-7.966A9.501 9.501 0 0 0 12 2.5a9.501 9.501 0 0 0-8.627 5.517zM21.5 12a9.55 9.55 0 0 0-.212-2.007l-.265.007H21a2 2 0 0 0-.01 4l.3-.007c.138-.643.21-1.31.21-1.993zM12 21.5a9.455 9.455 0 0 0 4.97-1.402A3 3 0 0 0 14 17.523h-4a3 3 0 0 0-2.97 2.575A9.456 9.456 0 0 0 12 21.5z"
              ></path>
            </svg>
          </div>
        </li>
        <li>
          <div class="nav-header-center">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              class="text-gray-600"
            >
              <path
                d="M8 8a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2H9v2a1 1 0 1 1-2 0v-2H5a1 1 0 1 1 0-2h2V9a1 1 0 0 1 1-1zm8 2a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zm-2 4a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"
              ></path>
              <path
                d="M.5 11a7 7 0 0 1 7-7h9a7 7 0 0 1 7 7v2a7 7 0 0 1-7 7h-9a7 7 0 0 1-7-7v-2zm7-5a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5h9a5 5 0 0 0 5-5v-2a5 5 0 0 0-5-5h-9z"
              ></path>
            </svg>
          </div>
        </li>
      </ul>
      <ul class="flex justify-end items-center space-x-2 flex-1">
        <li>
          <div class="nav-header-right">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
              class="text-gray-950"
            >
              <path
                d="M12 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
              ></path>
            </svg>
          </div>
        </li>
        <li>
          <div class="nav-header-right">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
              class="text-gray-950"
            >
              <path
                d="M.5 12C.5 5.649 5.649.5 12 .5S23.5 5.649 23.5 12 18.351 23.5 12 23.5c-1.922 0-3.736-.472-5.33-1.308a.63.63 0 0 0-.447-.069l-3.4.882a1.5 1.5 0 0 1-1.828-1.829l.882-3.4a.63.63 0 0 0-.07-.445A11.454 11.454 0 0 1 .5 12zm17.56-1.43a.819.819 0 0 0-1.125-1.167L14 11.499l-3.077-2.171a1.5 1.5 0 0 0-2.052.308l-2.93 3.793a.819.819 0 0 0 1.123 1.167L10 12.5l3.076 2.172a1.5 1.5 0 0 0 2.052-.308l2.931-3.793z"
              ></path>
            </svg>
            <div class="count-notification">1</div>
          </div>
        </li>
        <li>
          <div class="nav-header-right">
            <notification></notification>
          </div>
        </li>
        <li>
          <div class="relative" v-if="user">
            <div class="nav-header-right-avatar" @click="handleToggleUserMenu">
              <img
                class="object-cover w-full h-full"
                :src="user.avatarUrl"
                alt=""
              />
            </div>
            <div
              class="absolute top-11 right-4 transition-all"
              :class="
                isShowUserMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
              "
            >
              <ul
                class="rounded-lg bg-white border border-gray-200 shadow-lg w-90 px-4 py-3"
              >
                <li
                  class="rounded-lg border border-gray-200 shadow-lg p-1 mb-4"
                >
                  <router-link
                    :to="{
                      name: 'profile',
                      params: null,
                    }"
                    @click="isShowUserMenu = false"
                    class="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <div
                      class="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center"
                    >
                      <img
                        class="object-cover w-full h-full"
                        :src="user.avatarUrl"
                        alt=""
                      />
                    </div>
                    <div class="ms-2">
                      <span class="text-17 font-semibold">{{
                        `${user.firstName} ${user.lastName}`
                      }}</span>
                    </div>
                  </router-link>
                </li>
                <li
                  class="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-all rounded-lg"
                  @click="handleLogout"
                >
                  <div
                    class="rounded-full bg-gray-200 w-9 h-9 flex justify-center items-center"
                  >
                    <i
                      style="
                        background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/3OVYvwCR-Cs.png?_nc_eui2=AeGr2q1Bz9_FGagNy4A53ZhidhsKN6OrHc92Gwo3o6sdz6Z_hysejmvvTHzrv-yYDIGey5vrszMdPmUMCqoVB3-A');
                        background-position: 0px -280px;
                        background-size: auto;
                        width: 20px;
                        height: 20px;
                        background-repeat: no-repeat;
                        display: inline-block;
                      "
                    ></i>
                  </div>
                  <div class="font-semibold ms-4">Đăng xuất</div>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import eventBus from "@/common/EventBus";
import tokenService from "@/services/token.service";
import Notification from "./NotificationComponent.vue";

export default {
  components: {
    Notification,
  },
  setup() {
    const isShowUserMenu = ref(false);
    const user = tokenService.getUser();
    function handleToggleUserMenu() {
      isShowUserMenu.value = !isShowUserMenu.value;
    }

    function handleLogout() {
      eventBus.dispatch("logout");
    }

    return {
      user,
      isShowUserMenu,
      handleToggleUserMenu,
      handleLogout,
    };
  },
};
</script>

<style lang="scss" scoped>
.nav-header-center {
  @apply flex justify-center items-center relative w-32 py-3 rounded-lg transition-all;
  @apply hover:bg-gray-100;

  &.active {
    svg {
      @apply text-primary;
    }
    &::before {
      @apply absolute bottom-0 -mb-1 block w-full h-0.75 bg-primary;
      content: "";
    }
  }
}

.nav-header-right {
  @apply flex justify-center items-center p-2.5 bg-gray-200 rounded-full cursor-pointer transition-all relative;
  @apply hover:bg-gray-300;
  .count-notification {
    @apply absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex justify-center items-center font-semibold;
    font-size: 12px;
    content: "";
  }
}

.nav-header-right-avatar {
  @apply w-10 h-10 rounded-full overflow-hidden mr-4 cursor-pointer;
}
</style>
