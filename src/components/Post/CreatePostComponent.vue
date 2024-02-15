<template>
  <div class="add-post">
    <div class="add-post__top-section">
      <div class="top-section__user-img">
        <img
          src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
          alt=""
        />
      </div>
      <div class="top-section__input" @click="handleOpenAddPostForm">
        Dương ơi, bạn đang nghĩ gì thể?
      </div>
    </div>
    <hr class="mt-3" />
    <div class="add-post__bottom-section">
      <div class="bottom-section__type-post-list">
        <div class="type-post-item">
          <div class="type-post__img">
            <img
              height="24"
              width="24"
              alt=""
              class="xz74otr"
              referrerpolicy="origin-when-cross-origin"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeEEpubiubg8wBpryItUxUPyVnUPE18ZZ-dWdQ8TXxln5yPcETCQgPF7XlpGIi-i9EfIOjAbpVVyRhI5eVbdrtUz"
            />
          </div>
          <div class="type-post__text">Video trực tiếp</div>
        </div>
        <div class="type-post-item">
          <div class="type-post__img">
            <img
              height="24"
              width="24"
              alt=""
              class="xz74otr"
              referrerpolicy="origin-when-cross-origin"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeHiOb2walsELzNmiIvTVE6WPL4YoeGsw5I8vhih4azDkiXTBIXsRGzgyEzQwR5FJ4H7A3rfvpb_p5SqhmStK7mf"
            />
          </div>
          <div class="type-post__text">Ảnh/video</div>
        </div>
        <div class="type-post-item">
          <div class="type-post__img">
            <img
              height="24"
              width="24"
              alt=""
              class="xz74otr"
              referrerpolicy="origin-when-cross-origin"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHWXCnwisQ8ILfV-PmweUTivPIN-OmHLJy88g346YcsnFLgec4vNEAEUDT0dQcgBGYPYxwLVuNCOcF57wAm7r-j"
            />
          </div>
          <div class="type-post__text">Cảm xúc hoạt động</div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="add-post__form"
    :class="isShowAddPostForm ? 'visible opacity-100' : 'invisible opacity-0'"
  >
    <form class="form-container" @submit.prevent="handleSubmitAddForm">
      <div class="form-heading">
        <p class="form-heading__title">Tạo bài viết</p>
        <div
          class="form-heading__icon-container"
          @click="handleCloseAddPostForm"
        >
          <i
            class="form-heading__icon"
            data-visualcompletion="css-img"
            style="
              background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/W36oMOXK6VG.png?_nc_eui2=AeEWr61o6UQDE05Ob-mQ3ShLE0nt2lFbHYITSe3aUVsdgvQSWYvHM2Mz8oUt7oAVbrNuSZ4PXI9cL02hX3pApnt1');
              background-position: -147px -84px;
              background-size: auto;
              background-repeat: no-repeat;
            "
          ></i>
        </div>
      </div>
      <hr />
      <div class="user-info-container">
        <div class="avatar-container">
          <img class="avatar-img" :src="user?.avatarUrl" alt="" />
        </div>
        <div class="user-info">
          <p class="user-info__name">Phạm Dương</p>
          <drop-down
            v-model="selectedAccessRange"
            :options="dataAccessRange"
            optionLabel="name"
            :pt="{
              root: 'px-2 py-0.5 inline-flex items-center relative rounded-md cursor-pointer rounded-md bg-gray-200',
              input: 'p-0 text-13 font-semibold',
              trigger:
                'flex items-center justify-center shrink-0 text-surface-500 rounded-tr-md rounded-br-md ms-1 mt-1',
            }"
          >
          </drop-down>
        </div>
      </div>
      <div class="post-content">
        <textarea
          class="post-content__text"
          placeholder="Dương ơi, bạn đang nghĩ gì thế?"
        />
      </div>
      <div class="additional-container">
        <p class="additional-text">Thêm vào bài viết của bạn</p>
        <ul class="additional-list">
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeHiOb2walsELzNmiIvTVE6WPL4YoeGsw5I8vhih4azDkiXTBIXsRGzgyEzQwR5FJ4H7A3rfvpb_p5SqhmStK7mf"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/b37mHA1PjfK.png?_nc_eui2=AeHjtBDQ5D8hPuN0zwPAG1TwohqwRjkkxMOiGrBGOSTEw5_kDePWZwXdQgWiraOKQRI1ScaUYVfZlRPNLTeGsayj"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHWXCnwisQ8ILfV-PmweUTivPIN-OmHLJy88g346YcsnFLgec4vNEAEUDT0dQcgBGYPYxwLVuNCOcF57wAm7r-j"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/8zlaieBcZ72.png?_nc_eui2=AeFJhV5xsU5h9xpbGLBUjqP_88Ps36vvyGDzw-zfq-_IYLeH_VlwZ1_kY7vyFx3DLJC_LKqGDvHMJpN9lSJhlGjO"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/q7MiRkL7MLC.png?_nc_eui2=AeHFoxOAcdIpT_tHJd8e69uKJTqz5hgP3TklOrPmGA_dOSX7t3MUg1G_3ZWa3572gbyRtmvhe3_5_ES8YXapAGdr"
                alt=""
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="p-4">
        <button
          class="w-full bg-primary rounded-lg text-white p-2 font-semibold"
        >
          Đăng
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const isShowAddPostForm = ref(false);
    const dataAccessRange = ref([
      {
        name: "Công khai",
        value: 1,
        icon: "",
      },
      {
        name: "Bạn bè",
        value: 2,
        icon: "",
      },
      {
        name: "Chỉ mình tôi",
        value: 3,
        icon: "",
      },
    ]);

    const selectedAccessRange = ref(dataAccessRange.value[0]);

    function handleCloseAddPostForm() {
      isShowAddPostForm.value = false;
    }

    function handleOpenAddPostForm() {
      isShowAddPostForm.value = true;
    }

    function handleSubmitAddForm() {
      console.log(selectedAccessRange.value.value);
    }

    return {
      handleCloseAddPostForm,
      handleOpenAddPostForm,
      handleSubmitAddForm,
      dataAccessRange,
      selectedAccessRange,
      isShowAddPostForm,
      user: computed(() => store.getters["user/getUser"]),
    };
  },
};
</script>

<style lang="scss" scoped>
.add-post {
  @apply flex flex-col bg-white rounded-lg p-3 mt-6 border border-gray-200 shadow-sm;
  .add-post__top-section {
    @apply flex px-1;
    .top-section__user-img {
      @apply w-10 h-10 rounded-full overflow-hidden;
      img {
        @apply w-full h-full object-cover;
      }
    }
    .top-section__input {
      @apply ms-2 flex-1 bg-gray-100 rounded-full py-2 px-3 text-17 text-gray-500 cursor-pointer hover:bg-gray-200 transition-all;
    }
  }

  .add-post__bottom-section {
    @apply mt-2;
    .bottom-section__type-post-list {
      @apply flex items-center justify-center;
      .type-post-item {
        @apply flex-1 flex space-x-2 items-center justify-center px-1 py-1.5  rounded-lg hover:bg-gray-100 transition-all cursor-pointer;
        .type-post__img {
          @apply w-6 h-6;
          img {
            @apply w-full h-full;
          }
        }
        .type-post__text {
          @apply font-semibold text-gray-500 text-15;
        }
      }
    }
  }
}

.add-post__form {
  @apply fixed top-0 left-0 bottom-0 right-0 bg-gray-100 bg-opacity-80 z-10 flex justify-center items-center transition-all;

  .form-container {
    @apply bg-white w-500px rounded-lg shadow-lg;

    .form-heading {
      @apply relative;

      .form-heading__title {
        @apply mb-0 text-xl font-bold text-center p-4;
      }

      .form-heading__icon-container {
        @apply absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full overflow-hidden bg-gray-200 cursor-pointer transition-all;

        &:hover {
          @apply bg-gray-300;
        }

        .form-heading__icon {
          @apply w-5 h-5 inline-block;
        }
      }
    }

    .user-info-container {
      @apply flex p-4 pb-0;

      .avatar-container {
        @apply w-10 h-10 rounded-full flex items-center justify-center overflow-hidden;

        .avatar-img {
          @apply object-cover w-full h-full;
        }
      }

      .user-info {
        @apply ms-3;

        .user-info__name {
          @apply font-semibold text-15;
        }
      }
    }

    .post-content {
      @apply p-4 pb-10;

      .post-content__text {
        @apply text-2xl placeholder:text-gray-600 outline-none w-full;
      }
    }

    .additional-container {
      @apply m-4 mb-0 px-4 py-2 flex items-center justify-between border border-gray-300 rounded-lg;

      .additional-text {
        @apply mb-0 font-semibold text-15;
      }

      .additional-list {
        @apply flex space-x-1;

        .additional-item {
          @apply w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all;

          &:hover {
            @apply bg-gray-100;
          }
          .additional-item__img {
            @apply w-6 h-6 object-cover;
          }
        }
      }
    }
  }
}
</style>
