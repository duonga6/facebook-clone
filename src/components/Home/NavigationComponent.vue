<template>
  <div class="w-90 px-2 py-4 fixed left-0 top-14">
    <!-- Main navigation -->
    <ul>
      <li>
        <router-link
          :to="{
            name: 'profile-post',
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
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/4GR4KRf3hN2.png?_nc_eui2=AeFIXQPsFYRG66mrN-D5Xqa5iXYVTRy2fzKJdhVNHLZ_MiK6mQKXH64KCTPtj8BVGRImdcUBok2HyccNYz6sVmuN');
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
        <router-link to="/" class="navigation-item">
          <div class="navigation-img">
            <i
              data-visualcompletion="css-img"
              class=""
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/4GR4KRf3hN2.png?_nc_eui2=AeFIXQPsFYRG66mrN-D5Xqa5iXYVTRy2fzKJdhVNHLZ_MiK6mQKXH64KCTPtj8BVGRImdcUBok2HyccNYz6sVmuN');
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
      <li>
        <router-link to="/" class="navigation-item">
          <div class="navigation-img">
            <i
              data-visualcompletion="css-img"
              class=""
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/4GR4KRf3hN2.png?_nc_eui2=AeFIXQPsFYRG66mrN-D5Xqa5iXYVTRy2fzKJdhVNHLZ_MiK6mQKXH64KCTPtj8BVGRImdcUBok2HyccNYz6sVmuN');
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
        </router-link>
      </li>
      <li>
        <router-link to="/" class="navigation-item">
          <div class="navigation-img">
            <i
              data-visualcompletion="css-img"
              class=""
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/4GR4KRf3hN2.png?_nc_eui2=AeFIXQPsFYRG66mrN-D5Xqa5iXYVTRy2fzKJdhVNHLZ_MiK6mQKXH64KCTPtj8BVGRImdcUBok2HyccNYz6sVmuN');
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
        </router-link>
      </li>
      <li>
        <router-link to="/" class="navigation-item">
          <div class="navigation-img">
            <i
              data-visualcompletion="css-img"
              class=""
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/4GR4KRf3hN2.png?_nc_eui2=AeFIXQPsFYRG66mrN-D5Xqa5iXYVTRy2fzKJdhVNHLZ_MiK6mQKXH64KCTPtj8BVGRImdcUBok2HyccNYz6sVmuN');
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
        </router-link>
      </li>
      <template v-if="isShowMore">
        <li>
          <router-link to="/" class="navigation-item">
            <div class="navigation-img">
              <i
                data-visualcompletion="css-img"
                class=""
                style="
                  background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/CXXXUbkUNi7.png?_nc_eui2=AeEB9QwGC5TkpnIKD5xnbKMwBhjYlFUuXDcGGNiUVS5cN3rlavV6s_mYzCmiEi3FKhORTxJRSP_aVwVVQW9sC3fy');
                  background-position: 0px 0px;
                  background-size: auto;
                  width: 36px;
                  height: 36px;
                  background-repeat: no-repeat;
                  display: inline-block;
                "
              ></i>
            </div>
            <div class="navigation-text">Messenger</div>
          </router-link>
        </li>
      </template>
      <li v-if="isShowMore" @click="isShowMore = !isShowMore">
        <router-link to="/" class="navigation-item">
          <div class="navigation-img"></div>
          <div class="navigation-text">Ẩn bớt</div>
        </router-link>
      </li>
      <li v-else @click="isShowMore = !isShowMore">
        <router-link to="/" class="navigation-item">
          <div class="navigation-img"></div>
          <div class="navigation-text">Xem thêm</div>
        </router-link>
      </li>
    </ul>
    <hr class="mt-2 mx-2" />
    <!-- Sub navigation -->
    <div
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
          <router-link to="/" class="navigation-item">
            <div class="navigation-img">
              <img
                src="https://scontent-hkg1-2.xx.fbcdn.net/v/t1.6435-9/118473811_924398421381823_1175556635789774528_n.jpg?stp=c19.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=104&ccb=1-7&_nc_sid=f2fd11&_nc_eui2=AeEnUmAH4ofp7d2xNu9GWt6zHdapBAUkRNsd1qkEBSRE27wWru_E0lHlYwvKDzsyOrvqfbXmweQKfJ2Ieu-Z0zG4&_nc_ohc=NRjLBnlqc1wAX8JaiFi&_nc_ht=scontent-hkg1-2.xx&oh=00_AfAa_p69OY_VrSb2F48-WS-khRFEpPGWZ_H21qoGbD9rhw&oe=65D1F74F"
                alt=""
              />
            </div>
            <div class="navigation-text">
              Chia sẻ kiến thức lập trình - RHP Team
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="/" class="navigation-item">
            <div class="navigation-img">
              <img
                src="https://scontent-hkg1-1.xx.fbcdn.net/v/t1.18169-9/1483207_10150001784124944_240076833_n.png?stp=cp0_dst-png_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=abdf32&_nc_eui2=AeFXPPojlTuwBQRNcBR7AAOdQif8GfH4WC9CJ_wZ8fhYL_-9rkxhkIGhVQIZqpbHwEqJf-QS6naEddxuBTkl33lP&_nc_ohc=GMdzM6dw-F0AX_m7YPe&_nc_ht=scontent-hkg1-1.xx&oh=00_AfB2AZ2tB1goapXpT3LvQ5eeJ3Il7fp5G5saqQKCLkKvkA&oe=65D1F847"
                alt=""
              />
            </div>
            <div class="navigation-text">K15CNTT2_FIT-HaUI</div>
          </router-link>
        </li>
      </ul>
    </div>
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
