<template>
  <div class="forgot-password-container">
    <Form
      class="forgot-password-form"
      :validation-schema="schemaEmail"
      @submit="onSubmit"
    >
      <div class="form-header">Quên mật khẩu</div>
      <div class="form-content">
        <div class="form-text">
          Vui lòng nhập email của bạn để thiết lập lại mật khẩu
        </div>
        <div class="form-input">
          <Field type="text" name="email" />
          <ErrorMessage name="email" class="text-error"></ErrorMessage>
          <p class="text-15 text-error">
            {{ error }}
          </p>
          <p class="text-15 text-green-500">
            {{ message }}
          </p>
        </div>
      </div>
      <div class="form-action">
        <router-link
          :to="{
            name: 'login',
          }"
          class="form-url"
          >Đã có tài khoản? Đăng nhập</router-link
        >
        <button class="form-btn btn-primary">Xác nhận</button>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { userService } from "@/services/user.service";
import { ref } from "vue";
import { toastAlert } from "@/utilities/toastAlert";
export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const schemaEmail = yup.object().shape({
      email: yup
        .string()
        .email("Vui lòng nhập địa chỉ email")
        .required("Vui lòng nhập địa chỉ email"),
    });

    const error = ref(null);
    const message = ref(null);

    async function onSubmit(data) {
      error.value = null;
      message.value = null;

      try {
        await userService.getByEmail(data.email);
        await userService.forgotPassword(data.email);
        message.value =
          "Email đã được gửi tới hòm thư của bạn. Hãy truy cập để đặt lại mật khẩu";
      } catch (err) {
        if (err.status == 404) {
          error.value = "Không tìm thấy địa chỉ email của bạn";
        } else {
          toastAlert.error("Có lỗi xảy ra");
        }
      }
    }

    return {
      schemaEmail,
      onSubmit,
      error,
      message,
    };
  },
};
</script>

<style lang="scss" scoped>
.forgot-password-container {
  @apply w-screen h-screen bg-gray-200 flex items-center justify-center;

  .forgot-password-form {
    @apply w-500px bg-white rounded-lg border border-e-gray-200 mb-40;

    .form-header {
      @apply font-bold text-lg p-4 py-3 border-b border-gray-200;
    }

    .form-content {
      @apply p-4;

      .form-text {
        @apply text-15;
      }

      .form-input {
        @apply mt-4;

        input {
          @apply border border-gray-200 outline-none w-full text-15 rounded-lg p-2;
        }
      }
    }
    .form-action {
      @apply p-4 flex items-center justify-between;
      .form-url {
        @apply text-primary text-15;
      }

      .form-btn {
        @apply p-2 px-3 text-white bg-primary rounded-lg;
      }
    }
  }
}
</style>
