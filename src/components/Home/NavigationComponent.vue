<template>
  <div class="w-90 px-2 py-4 fixed left-0 top-14">
    <!-- Main navigation -->
    <ul>
      <li>
        <router-link
          :to="{
            name: 'profile',
            params: {
              id: userData.id,
            },
          }"
          class="navigation-item"
        >
          <div class="navigation-img">
            <img class="" :src="userData.avatarUrl" alt="" />
          </div>
          <div class="navigation-text">
            {{ userData.firstName + " " + userData.lastName }}
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{
            name: 'friends',
            params: null,
          }"
          class="navigation-item"
        >
          <div class="navigation-img">
            <i
              data-visualcompletion="css-img"
              class=""
              style="
                background-image: url('/src/images/icons/nav-icon.png');
                background-position: 0 -296px;
                background-size: auto;
                width: 36px;
                height: 36px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navigation-text">Bạn bè</div>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{
            name: 'group-feed',
            params: null,
          }"
          class="navigation-item"
        >
          <div class="navigation-img">
            <i
              style="
                background-image: url('/src/images/icons/nav-icon.png');
                background-position: 0 -37px;
                background-size: auto;
                width: 36px;
                height: 36px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navigation-text">Nhóm</div>
        </router-link>
      </li>
      <!-- <li>
        <div class="navigation-item">
          <div class="navigation-img">
            <i
              style="
                background-image: url('/src/images/icons/nav-icon.png');
                background-position: 0 -518px;
                background-size: auto;
                width: 36px;
                height: 36px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navigation-text">Video</div>
        </div>
      </li> -->
      <!-- <li>
        <div class="navigation-item">
          <div class="navigation-img">
            <i
              style="
                background-image: url('/src/images/icons/nav-icon.png');
                background-position: 0 -444px;
                background-size: auto;
                width: 36px;
                height: 36px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navigation-text">Kỷ niệm</div>
        </div>
      </li> -->
      <!-- <li>
        <div class="navigation-item">
          <div class="navigation-img">
            <i
              style="
                background-image: url('/src/images/icons/nav-icon.png');
                background-position: 0 -185px;
                background-size: auto;
                width: 36px;
                height: 36px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navigation-text">Đã lưu</div>
        </div>
      </li> -->
    </ul>
    <hr class="mt-2 mx-2" />
    <!-- Sub navigation -->
    <!-- <div
      @mouseover="isShowEditSubNav = true"
      @mouseleave="isShowEditSubNav = false"
    >
      <div class="flex items-center justify-between mt-1">
        <span class="text-gray-500 p-2 font-semibold cursor-default text-17"
          >Lối tắt của bạn</span
        >
        <button
          class="text-primary text-sm hover:bg-gray-200 px-2 py-2 rounded-md transition-all"
          v-show="isShowEditSubNav"
        >
          Chỉnh sửa
        </button>
      </div>
      <ul>
        <li>
          <div class="navigation-item">
            <div class="navigation-img">
              <img src="" alt="" />
            </div>
            <div class="navigation-text">
              Chia sẻ kiến thức lập trình - RHP Team
            </div>
          </div>
        </li>
        <li>
          <div class="navigation-item">
            <div class="navigation-img">
              <img src="" alt="" />
            </div>
            <div class="navigation-text">K15CNTT2_FIT-HaUI</div>
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import { ref } from "vue";
import tokenService from "@/services/token.service";
export default {
  setup() {
    const isShowMore = ref(false);
    const isShowEditSubNav = ref(false);

    return { isShowMore, isShowEditSubNav, userData: tokenService.getUser() };
  },
};
</script>

<style lang="scss" scoped>
.navigation-item {
  @apply flex items-center p-2 rounded-lg hover:bg-gray-200 transition-all;

  .navigation-img {
    @apply w-9 h-9 rounded-full overflow-hidden flex justify-center items-center;

    img {
      @apply w-full h-full object-cover;
    }
  }

  .navigation-text {
    @apply font-semibold ms-3 text-md text-dark;
  }
}
</style>
