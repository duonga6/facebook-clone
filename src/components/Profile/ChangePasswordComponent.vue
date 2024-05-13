<template>
  <div class="edit-profile-component" @click.self="onClose">
    <div class="edit-profile-tab">
      <div class="edit-profile-header">
        <div class=""></div>
        <div class="profile-header-text">Cập nhật thông tin</div>
        <button class="close-btn" @click="onClose">
          <i class="close-btn-icon pi pi-times"></i>
        </button>
      </div>
      <Form :validation-schema="schemaPassword" @submit="onSubmit">
        <div class="p-4">
          <div class="form-group mb-1">
            <label for="" class="text-13 text-gray-600">Mật khẩu cũ</label>
            <Field class="input-form" type="password" name="oldPassword" />
            <ErrorMessage name="oldPassword" class="text-error" />
          </div>
          <div class="form-group mb-1">
            <label for="" class="text-13 text-gray-600">Mật khẩu mới</label>
            <Field class="input-form" type="password" name="newPassword" />
            <ErrorMessage name="newPassword" class="text-error" />
          </div>
          <div class="form-group mb-1">
            <label for="" class="text-13 text-gray-600"
              >Nhập lại khẩu mới</label
            >
            <Field class="input-form" type="password" name="reNewPassword" />
            <ErrorMessage name="reNewPassword" class="text-error" />
          </div>
        </div>

        <div class="edit-profile-action">
          <button
            class="profile-action-btn btn--second"
            type="reset"
            @click="onClose"
          >
            Hủy
          </button>
          <button class="profile-action-btn btn--primary" type="submit">
            Xác nhận
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { toastAlert } from "@/utilities/toastAlert";
import { userService } from "@/services/user.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["onClose"],
  setup(_, { emit }) {
    function onClose() {
      emit("onClose");
    }

    async function onSubmit(data) {
      try {
        await userService.changePassword(data);
        toastAlert.success("Đổi mật khẩu thành công");

        onClose();
      } catch (error) {
        console.error(error);
        toastAlert.error("Có lỗi khi đổi mật khẩu");
      }
    }

    const schemaPassword = yup.object().shape({
      oldPassword: yup.string().required("Vui lòng nhập mật khẩu cũ"),
      newPassword: yup
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .required("Vui lòng nhập mật khẩu mới"),
      reNewPassword: yup
        .string()
        .required("Vui lòng nhập lại mật khẩu mới")
        .test("match-password", "Mật khẩu không trùng khớp", function (value) {
          return this.parent.newPassword === value;
        }),
    });

    return {
      schemaPassword,
      onClose,
      onSubmit,
      Form,
      Field,
      ErrorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.edit-profile-component {
  @apply fixed top-0 right-0 bottom-0 left-0 bg-white bg-opacity-50 flex items-center justify-center;

  .edit-profile-tab {
    @apply w-500px bg-white rounded-lg border border-gray-200 shadow-custom-sm;

    .edit-profile-header {
      @apply flex items-center justify-between p-4 py-3 border-b border-gray-200;

      .profile-header-text {
        @apply text-xl font-bold;
      }

      .close-btn {
        @apply w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200;

        .close-btn-icon {
          @apply text-15;
        }
      }
    }
    .edit-profile-content {
      @apply text-15 p-4;
    }
    .edit-profile-action {
      @apply p-4 flex items-center justify-end space-x-3;

      .profile-action-btn {
        @apply p-2 px-4 rounded-lg text-15 font-semibold;

        &.btn--primary {
          @apply bg-primary text-white;
        }

        &.btn--second {
          @apply bg-gray-200 text-dark;
        }
      }
    }
  }
}

.input-form,
.select-form {
  @apply border border-gray-400 px-2.5 py-1.5 outline-none rounded-md w-full bg-gray-100;
}

.select-form {
  @apply bg-white;
}

.radio-form {
  @apply flex-1 px-2.5 py-1.5 bg-white rounded-md border border-gray-400 flex items-center justify-between;
}
</style>
