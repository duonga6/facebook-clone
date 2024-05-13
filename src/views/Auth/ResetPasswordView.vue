<template>
  <div class="forgot-password-container">
    <Form
      class="forgot-password-form"
      :validation-schema="schemaEmail"
      @submit="onSubmit"
    >
      <div class="form-header">Đặt lại mật khẩu</div>
      <div class="form-content">
        <div class="form-input">
          <label for="" class="text-13 text-gray-600">Mật khẩu mới</label>
          <Field type="password" name="newPassword" />
          <ErrorMessage name="newPassword" class="text-error"></ErrorMessage>
        </div>
        <div class="form-input">
          <label for="" class="text-13 text-gray-600">Nhập lại khẩu mới</label>
          <Field type="password" name="reNewPassword" />
          <ErrorMessage name="reNewPassword" class="text-error"></ErrorMessage>
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const schemaEmail = yup.object().shape({
      newPassword: yup
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .required("Vui lòng nhập mật khẩu"),
      reNewPassword: yup
        .string()
        .required("Vui lòng nhập lại mật khẩu mới")
        .test("match-password", "Mật khẩu không trùng khớp", function (value) {
          return this.parent.newPassword === value;
        }),
    });

    const error = ref(null);
    const message = ref(null);

    async function onSubmit(data) {
      error.value = null;
      message.value = null;

      const submitData = {
        email: route.query.email,
        code: route.query.code,
        password: data.newPassword,
      };

      try {
        await userService.resetPassword(submitData);
        await store.dispatch("auth/login", {
          email: submitData.email,
          password: submitData.password,
        });

        toastAlert.success("Đặt lại mật khẩu thành công");

        await router.push({
          name: "home",
          params: null,
        });
      } catch (err) {
        console.error(err);
        error.value = "Có lỗi khi đặt lại mật khẩu";
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
