<template>
  <div class="w-90 px-2 py-4">
    <!-- Main navigation -->
    <ul>
      <li>
        <router-link to="/" class="navigation-item">
          <div class="navigation-img">
            <img
              class=""
              src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
              alt=""
            />
          </div>
          <div class="navigation-text">Phạm Dương</div>
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
        <li>
          <router-link to="/" class="navigation-item">
            <div class="navigation-img">
              <img
                src="https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/411618776_698171142406309_3686587092606417502_n.png?stp=c8.0.50.50a_cp0_dst-png_p50x50&_nc_cat=105&ccb=1-7&_nc_sid=f22548&_nc_eui2=AeEuNmEWTAGFb8fNr--6UcSQfZlm0kUNTqV9mWbSRQ1OpTR2crskwaj7JYLZ_PMoQtahLrJinoaR-1F9On9Bd_YG&_nc_ohc=ZGuGdvjStm4AX-l_8o8&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&oh=00_AfAIzBnoq5TvGWmZwISbuN0V-HGP0K4t094xENJCKTrgeg&oe=65AEDB65"
                alt=""
              />
            </div>
            <div class="navigation-text">Lộ trình DevOps $1000</div>
          </router-link>
        </li>
        <li>
          <router-link to="/" class="navigation-item">
            <div class="navigation-img">
              <img
                src="https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2081-6/42630609_2166936443330818_3464735768197464064_n.png?stp=c6.6.31.31a_dst-png_p36x36&_nc_cat=1&ccb=1-7&_nc_sid=ed3f67&_nc_eui2=AeGy-3g-G3WO2TnOKtS7ucN9kGwkPrvJAp6QbCQ-u8kCnj-diNovdvqAexDLGWcrvN5rArqGCrQUCAh-23YIKMxC&_nc_ohc=IADXVFKK50QAX-E476G&_nc_ht=scontent-hkg1-1.xx&oh=00_AfBgmdY9nlQ1KamfFP2Wj18ApYVn5pZ2Lno3ntbFXCzVuQ&oe=65AFC96F"
                alt=""
              />
            </div>
            <div class="navigation-text">8 Ball Pool</div>
          </router-link>
        </li>
        <li>
          <router-link to="/" class="navigation-item">
            <div class="navigation-img">
              <img
                src="https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-1/272875164_326636889481145_4153457764686574298_n.jpg?stp=c22.0.40.40a_cp0_dst-jpg_p40x40&_nc_cat=104&ccb=1-7&_nc_sid=4da83f&_nc_eui2=AeF4vNGAEVvff0qlRec7dArQiEodLQfByZuISh0tB8HJm55qBUlVG8w-Ir93O_QsLgWKx8dAG--C_LZE7ELZsZvX&_nc_ohc=n-vsmeFUIbYAX__JHZ5&_nc_ht=scontent-hkg1-2.xx&oh=00_AfDv41NKdsHw8d6Wo57RIqXgnp4MobgWctKJ2hyPFRHafQ&oe=65B05ABF"
                alt=""
              />
            </div>
            <div class="navigation-text">World of Tanks Blitz - DP x TK</div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const isShowMore = ref(false);
    const isShowEditSubNav = ref(false);
    return { isShowMore, isShowEditSubNav };
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
