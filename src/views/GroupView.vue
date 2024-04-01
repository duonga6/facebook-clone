<template>
  <div class="group-container">
    <div class="group-navbar">
      <div class="group-navbar-header">
        <div class="navbar-header-text">Nhóm</div>
      </div>
      <div class="group-navbar-search">
        <i class="navbar-search-icon pi pi-search"></i>
        <input class="navbar-search-input" placeholder="Tìm kiếm nhóm" />
      </div>
      <div class="navbar-scroll-container">
        <div class="group-navbar-list">
          <div class="group-navbar-item active">
            <div class="navbar-item-icon">
              <i
                data-visualcompletion="css-img"
                class="x1b0d499 xep6ejk"
                aria-hidden="true"
                style="
                  background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/V84HF6KodYe.png?_nc_eui2=AeEJhnmNUWYmAGlM4Us7Hx_zl6X9bCTjl-WXpf1sJOOX5QzLuSY3s-n2AK5BG_2okKD9Q978OY-J_dcrosirGd_i');
                  background-position: 0px -200px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: block;
                "
              ></i>
            </div>
            <div class="navbar-item-text">Bảng feed của bạn</div>
          </div>
          <div class="group-navbar-item">
            <div class="navbar-item-icon">
              <i
                data-visualcompletion="css-img"
                class="x1b0d499 xep6ejk"
                aria-hidden="true"
                style="
                  background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/5sdipnX2kSG.png?_nc_eui2=AeE-ZiCxfwYIHBx_AKd4Oj74OnN4bgtqB2A6c3huC2oHYIn45UUJeDtZ7IPePxRF7yaXIQXVf5pZdqffTSUPMdjv');
                  background-position: 0px -21px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: block;
                "
              ></i>
            </div>
            <div class="navbar-item-text">Nhóm của bạn</div>
          </div>
        </div>
        <div class="group-create">
          <button class="group-create-btn">
            <i class="group-btn-icon pi pi-plus"></i>
            Tạo nhóm mới
          </button>
        </div>
        <div class="group-joined-container">
          <div class="group-joined-header">
            <div class="grp-joined-header-text">Nhóm do bạn quản lý</div>
            <div class="grp-joined-link">Xem tất cả</div>
          </div>
          <div class="group-joined-list">
            <div
              class="group-joined-item"
              v-for="(item, index) in 2"
              :key="index"
            >
              <div class="group-joined-image">
                <img
                  src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
                  alt=""
                />
              </div>
              <div class="group-joined-name">
                Ngọc Rồng Online 7sv Thảo Luận - Mua Bán - Trao Đổi Gr Quang Huy
              </div>
            </div>
          </div>
        </div>
        <div class="group-joined-container">
          <div class="group-joined-header">
            <div class="grp-joined-header-text">Nhóm bạn đã tham gia</div>
            <div class="grp-joined-link">Xem tất cả</div>
          </div>
          <div class="group-joined-list">
            <div
              class="group-joined-item"
              v-for="(item, index) in 10"
              :key="index"
            >
              <div class="group-joined-image">
                <img
                  src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
                  alt=""
                />
              </div>
              <div class="group-joined-name">
                Ngọc Rồng Online 7sv Thảo Luận - Mua Bán - Trao Đổi Gr Quang Huy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="group-content"></div>
  </div>
  <CreateGroup @onSubmit="onSubmitCreateGroup"></CreateGroup>
</template>

<script>
export default {
  setup() {
    function onSubmitCreateGroup(data) {
      console.log(data);
    }

    return {
      onSubmitCreateGroup,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-container {
  @apply pt-14 h-screen;
  .group-navbar {
    @apply w-90 shadow-md h-full flex flex-col;
    .group-navbar-header {
      @apply px-4 py-2;
      .navbar-header-text {
        @apply text-xl font-bold;
      }
    }

    .group-navbar-search {
      @apply px-4 relative;
      .navbar-search-icon {
        @apply absolute left-6 top-1/2 -translate-y-1/2 text-15 text-gray-400;
      }
      .navbar-search-input {
        @apply rounded-full bg-gray-100 text-15 px-8 py-1 w-full;
      }
    }

    .navbar-scroll-container {
      @apply flex-1 overflow-y-auto;

      &::-webkit-scrollbar {
        @apply w-2 left-0;
      }

      &::-webkit-scrollbar-thumb {
        @apply rounded-lg bg-gray-300;
      }

      &::-webkit-scrollbar-track {
        @apply hidden;
      }

      .group-navbar-list {
        @apply p-2;
        .group-navbar-item {
          @apply p-2 rounded-lg flex items-center hover:bg-gray-100 transition-all cursor-pointer;
          .navbar-item-icon {
            @apply rounded-full w-8 h-8 flex items-center justify-center bg-gray-100;
          }
          .navbar-item-text {
            @apply ms-2 text-15 font-semibold;
          }

          &.active {
            @apply bg-gray-100;
            .navbar-item-icon {
              @apply bg-primary;
              i {
                filter: invert(100);
              }
            }
          }
        }
      }

      .group-create {
        @apply mx-4;
        .group-create-btn {
          @apply flex items-center justify-center bg-primary bg-opacity-5 text-primary font-semibold text-15 w-full p-2 rounded-lg hover:bg-opacity-10 transition-all;

          .group-btn-icon {
            @apply me-1 text-13 font-bold;
          }
        }
      }

      .group-joined-container {
        @apply px-2 py-4;
        .group-joined-header {
          @apply flex justify-between items-center mx-2 py-2 border-t;
          .grp-joined-header-text {
            @apply text-17 font-semibold;
          }
          .grp-joined-link {
            @apply text-15 text-primary;
          }
        }

        .group-joined-list {
          .group-joined-item {
            @apply flex items-center p-2 hover:bg-gray-100 transition-all rounded-lg cursor-pointer;

            .group-joined-image {
              @apply w-12 h-12 min-w-12 min-h-12 rounded-md overflow-hidden;

              img {
                @apply w-full h-full object-cover;
              }
            }

            .group-joined-name {
              @apply ms-3 text-15 font-semibold leading-18;
            }
          }
        }
      }
    }
  }
}
</style>
