<template>
  <div class="friend-page-container">
    <div class="friend-navbar">
      <div class="navbar-heading">
        <span class="navbar-heading-text">Bạn bè</span>
        <div class="navbar-heading-icon">
          <i class="pi pi-cog" />
        </div>
      </div>
      <ul class="navbar-list">
        <li class="navbar-item active">
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/CRLJEFo9FdO.png?_nc_eui2=AeGIFHGpeofWzn2LIni6V1-JTjs76a6-l_VOOzvprr6X9QbWXmoavjlayCtrJiVNd3sbCC24EjimHcnz9JhGaYFC');
                background-position: 0px -247px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Trang chủ</div>
          <div class="navbar-item-arrow"></div>
        </li>
        <li class="navbar-item">
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/P9mM2ciwWWP.png?_nc_eui2=AeGEZP96V1VC8zTjOCTXfZEcugNPbDBDFjG6A09sMEMWMfqjN0TnZ2ovsFAI6XC0t8hUAjIeGRXvEkXKxHGSi9kJ');
                background-position: 0px -264px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Lời mời kết bạn</div>
          <div class="navbar-item-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </li>
        <li class="navbar-item">
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/P9mM2ciwWWP.png?_nc_eui2=AeGEZP96V1VC8zTjOCTXfZEcugNPbDBDFjG6A09sMEMWMfqjN0TnZ2ovsFAI6XC0t8hUAjIeGRXvEkXKxHGSi9kJ');
                background-position: 0px -180px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Gợi ý</div>
          <div class="navbar-item-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </li>
        <li class="navbar-item">
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/P9mM2ciwWWP.png?_nc_eui2=AeGEZP96V1VC8zTjOCTXfZEcugNPbDBDFjG6A09sMEMWMfqjN0TnZ2ovsFAI6XC0t8hUAjIeGRXvEkXKxHGSi9kJ');
                background-position: 0px -222px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Tất cả bạn bè</div>
          <div class="navbar-item-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </li>
        <li class="navbar-item">
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/P9mM2ciwWWP.png?_nc_eui2=AeGEZP96V1VC8zTjOCTXfZEcugNPbDBDFjG6A09sMEMWMfqjN0TnZ2ovsFAI6XC0t8hUAjIeGRXvEkXKxHGSi9kJ');
                background-position: 0px -222px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Lời mời đã gửi</div>
          <div class="navbar-item-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </li>
      </ul>
    </div>
    <div class="friend-type-list">
      <div class="friend-type-item">
        <div class="friend-type-heading">Lời mời kết bạn</div>
        <ul class="friend-list">
          <li
            class="friend-item"
            v-for="item in friendAcceptPending.data"
            :key="item.id"
          >
            <div class="friend-avatar">
              <img class="friend-img" :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="friend-info">
              <div class="friend-name">
                {{ item.user.firstName + " " + item.user.lastName }}
              </div>
              <div class="friend-action">
                <template v-if="item.status == FRIEND_TYPE.PENDING_OTHER">
                  <button
                    class="friend-btn friend-btn--accept"
                    @click="handleAcceptFriend(item.id)"
                  >
                    Xác nhận
                  </button>
                  <button
                    class="friend-btn friend-btn--remove"
                    @click="handleRefuseFriend(item.id)"
                  >
                    Xóa
                  </button>
                </template>
                <template v-else-if="item.status == FRIEND_TYPE.ACCEPTED">
                  <button class="friend-btn friend-btn--disable" disabled>
                    Đã chấp nhận lời mời
                  </button>
                </template>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="friend-type-item">
        <div class="friend-type-heading">Những người bạn có thể biết</div>
        <ul class="friend-list">
          <li class="friend-item" v-for="number in 10" :key="number">
            <div class="friend-avatar">
              <img
                class="friend-img"
                src="https://scontent.fhan5-5.fna.fbcdn.net/v/t39.30808-1/354042207_1598633840646756_2143386141373116572_n.jpg?stp=dst-jpg_p240x240&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFps095tzy_szdbfj3uPqNVepgJJ3ThRgB6mAkndOFGALHLPQewddyYLEd1G3AuC-r_ut1alYqCrCWX7il8leWH&_nc_ohc=uVfXpt4NSRkAX_0foqS&_nc_ht=scontent.fhan5-5.fna&oh=00_AfD-MyPxiQsihu-gyXkXl7Ou-qbGVgwyHwu7WFzYPx3elQ&oe=65F48C45"
                alt=""
              />
            </div>
            <div class="friend-info">
              <div class="friend-name">Phạm Dương</div>
              <div class="friend-action">
                <button class="friend-btn friend-btn--accept">
                  Thêm bạn bè
                </button>
                <button class="friend-btn friend-btn--remove">Xóa</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { friendshipService } from "@/services/friendship.service";
import { reactive } from "vue";
import { FRIEND_TYPE } from "@/constants";
import tokenService from "@/services/token.service";
import { userService } from "@/services/user.service";
export default {
  setup() {
    const user = tokenService.getUser();
    const friendAcceptPending = reactive({
      total: 0,
      pageSize: 14,
      pageNumber: 0,
      data: [],
    });

    async function loadAcceptPending() {
      try {
        const res = await friendshipService.get({
          pageSize: friendAcceptPending.pageSize,
          pageNumber: friendAcceptPending.pageNumber + 1,
          type: FRIEND_TYPE.PENDING_OTHER,
        });

        const userPendingMapped = await Promise.all(
          res.data.map(async (item) => {
            const userOtherId =
              item.requestUserId == user.id
                ? item.targetUserId
                : item.requestUserId;
            const userOtherData = await userService.getById(userOtherId);

            return {
              id: item.id,
              user: userOtherData.data,
              status: FRIEND_TYPE.PENDING_OTHER,
            };
          })
        );

        friendAcceptPending.data = userPendingMapped;
        friendAcceptPending.pageNumber++;
        friendAcceptPending.total = res.totalItems;

        console.log(friendAcceptPending);
      } catch (err) {
        console.log(err);
      }
    }

    function handleAcceptFriend(id) {
      const friendPending = friendAcceptPending.data.find((x) => x.id == id);
      if (friendPending) {
        friendshipService
          .accept(id)
          .then(() => {
            friendPending.status = FRIEND_TYPE.ACCEPTED;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Không tìm thấy user này");
      }
    }

    function handleRefuseFriend(id) {
      const friendPending = friendAcceptPending.data.find((x) => x.id == id);
      if (friendPending) {
        friendshipService
          .refuseFriend(id)
          .then(() => {
            friendAcceptPending.data = friendAcceptPending.data.filter(
              (x) => x.id != id
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Không tìm thấy user này");
      }
    }

    loadAcceptPending();

    return {
      FRIEND_TYPE,
      friendAcceptPending,
      handleAcceptFriend,
      handleRefuseFriend,
    };
  },
};
</script>

<style lang="scss" scoped>
.friend-page-container {
  height: calc(100vh - 56px);
  @apply flex;
}

.friend-navbar {
  @apply w-90 border-r border-gray-200;
  .navbar-heading {
    @apply flex items-center justify-between px-4 py-2;
    .navbar-heading-text {
      @apply text-2xl font-bold;
    }
    .navbar-heading-icon {
      @apply text-xl font-bold w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center;
    }
  }

  .navbar-list {
    @apply p-2;
    .navbar-item {
      @apply flex items-center p-2 hover:bg-gray-100 hover:cursor-pointer transition-all rounded-lg;

      &.active {
        @apply bg-gray-100;

        .navbar-item-icon {
          @apply bg-primary;

          i {
            filter: invert(100%);
          }
        }
      }

      .navbar-item-icon {
        @apply w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center;
      }
      .navbar-item-text {
        @apply font-semibold ms-2 text-17;
      }
      .navbar-item-arrow {
        @apply text-lg ms-auto text-gray-500;
      }
    }
  }
}

.friend-type-list {
  @apply flex flex-col flex-1 space-y-6 bg-gray-200 px-9 py-8 overflow-y-auto;
  .friend-type-item {
    .friend-type-heading {
      @apply text-xl font-bold;
    }
    .friend-list {
      @apply mt-4 grid grid-cols-7 gap-3;
      .friend-item {
        @apply rounded-lg overflow-hidden h-86 flex flex-col border border-gray-300;
        .friend-avatar {
          @apply aspect-square;
          .friend-img {
            @apply w-full h-full object-cover;
          }
        }
        .friend-info {
          @apply p-3 bg-white flex-1 flex flex-col border-t border-gray-300;
          .friend-name {
            @apply text-17 font-semibold;
          }
          .friend-action {
            @apply mt-auto flex flex-col space-y-2;
            .friend-btn {
              @apply w-full rounded-lg p-1.5 text-15 font-semibold;
              &.friend-btn--accept {
                @apply bg-primary text-white;
              }

              &.friend-btn--remove {
                @apply bg-gray-200;
              }

              &.friend-btn--disable {
                @apply bg-gray-200 text-gray-400;
              }
            }
          }
        }
      }
    }
  }
}
</style>
