<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-image">
        <img
          src="https://www.facebook.com/images/comet/empty_states_icons/permissions/permissions_gray_wash.svg"
          alt=""
        />
      </div>
      <div class="not-found-header">Bạn hiện không xem được nội dung này</div>
      <div class="not-found-desc">
        Lỗi này thường do chủ sở hữu chỉ chia sẻ nội dung với một nhóm nhỏ, thay
        đổi người được xem hoặc đã xóa nội dung.
      </div>
      <div class="not-found-action">
        <router-link
          :to="{
            name: 'home',
          }"
          class="go-home-btn btn block"
          >Đi tới bảng tin</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  @apply h-screen w-screen flex items-center justify-center pt-14 bg-gray-100;

  .not-found-container {
    @apply flex flex-col items-center justify-center p-4;
    width: 600px;

    .not-found-image {
      @apply w-32 h-32;

      img {
        @apply w-full h-full object-contain;
      }
    }
    .not-found-header {
      @apply font-bold text-lg text-gray-600;
    }
    .not-found-desc {
      @apply text-gray-500 text-center text-17 leading-5;
    }
    .not-found-action {
      .go-home-btn {
        @apply bg-primary text-white mt-4;
      }
    }
  }
}
</style>
