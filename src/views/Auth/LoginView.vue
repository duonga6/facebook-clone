<template>
  <div class="mx-auto bg-gray-100">
    <div class="flex w-screen h-screen space-x-20">
      <div class="flex-1 flex items-center">
        <div class="flex flex-col ms-auto w-500px">
          <div class="">
            <img src="/src/images/big-logo.png" class="w-80" alt="" />
          </div>
          <div class="text-2xl">
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
            của bạn.
          </div>
        </div>
      </div>
      <div class="flex-1 flex justify-start items-center">
        <Form
          @submit="handleLogin"
          class="bg-white p-4 rounded-lg drop-shadow-md flex flex-col space-y-3"
          :validation-schema="schemaLogin"
        >
          <div class="form-group">
            <Field
              type="text"
              class="p-3 rounded-md border border-gray-300 outline-none focus:border-blue-400 w-96"
              placeholder="Nhập email của bạn"
              autocomplete="username"
              name="email"
            />
            <ErrorMessage name="email" class="text-error block mt-1" />
          </div>
          <div class="form-group">
            <Field
              type="password"
              class="p-3 rounded-md border border-gray-300 outline-none focus:border-blue-400 w-96"
              placeholder="Mật khẩu"
              autocomplete="current-password"
              name="password"
            />
            <ErrorMessage name="password" class="text-error block mt-1" />
            <span
              class="text-error block"
              v-for="message in messagesLogin"
              :key="message"
              >{{ message }}</span
            >
          </div>
          <div class="form-group">
            <button
              class="text-white w-full py-3 text-lg font-semibold rounded-md mt-1"
              :class="isLogging ? 'bg-blue-400' : 'bg-primary'"
              :disabled="isLogging"
            >
              Đăng nhập
            </button>
          </div>
          <div class="form-group">
            <div class="w-full py-3 text-center border-b border-gray-200">
              <router-link
                :to="{
                  name: 'forgot-password',
                }"
                class="text-primary"
                >Quên mật khẩu</router-link
              >
            </div>
          </div>
          <div class="form-group flex justify-center">
            <button
              class="text-white bg-green-500 w-64 py-3 text-lg font-semibold rounded-md my-3"
              @click.prevent="isShowRegister = true"
            >
              Tạo tài khoản mới
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-70 transition-all"
    :class="isShowRegister ? 'visible opacity-100' : 'invisible opacity-0'"
  >
    <Form
      class="bg-white rounded-lg shadow-lg border border-gray-100 max-w-register-form"
      :validation-schema="schemaRegister"
      @submit="handleRegisger"
    >
      <div class="p-4 pb-3 flex justify-between items-baseline">
        <div class="">
          <div class="text-3xl font-bold">Đăng ký</div>
          <div class="text-gray-600">Nhanh chóng và dễ dàng.</div>
        </div>
        <button class="" @click.prevent="isShowRegister = false">
          <img
            class="text-gray-600"
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yO/r/zgulV2zGm8t.png"
            alt=""
            width="24"
            height="24"
            id="u_9_9_xV"
          />
        </button>
      </div>
      <hr />
      <div class="p-4">
        <div class="form-group mb-2.5 flex space-x-3">
          <div class="flex-1">
            <Field
              class="input-form"
              type="text"
              placeholder="Họ"
              name="firstName"
            />
            <ErrorMessage name="firstName" class="text-error" />
          </div>
          <div class="flex-1">
            <Field
              class="input-form"
              type="text"
              placeholder="Tên"
              name="lastName"
            />
            <ErrorMessage name="lastName" class="text-error" />
          </div>
        </div>
        <div class="form-group mb-2.5">
          <Field
            class="input-form"
            type="text"
            placeholder="Địa chỉ email"
            name="email"
            autocomplete="username"
          />
          <ErrorMessage name="email" class="text-error" />
        </div>
        <div class="form-group mb-1">
          <Field
            class="input-form"
            type="password"
            placeholder="Mật khẩu mởi"
            name="password"
            autocomplete="password"
          />
          <ErrorMessage name="password" class="text-error" />
        </div>
        <div class="form-group mb-1">
          <label for="" class="text-13 text-gray-600">Ngày sinh</label>
          <div class="flex space-x-3 mt-0.5">
            <Field as="select" class="select-form" name="day" id="day">
              <option v-for="day in days" :key="day" :value="day">
                {{ day }}
              </option>
            </Field>
            <Field as="select" class="select-form" name="month" id="month">
              <option
                v-for="month in months"
                :key="month.value"
                :value="month.value"
              >
                {{ month.text }}
              </option>
            </Field>
            <Field as="select" class="select-form" name="year" id="year">
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </Field>
          </div>
          <ErrorMessage name="day" class="text-error block" />
          <ErrorMessage name="month" class="text-error block" />
          <ErrorMessage name="year" class="text-error block" />
        </div>
        <div class="form-group mb-2.5">
          <label for="" class="text-13 text-gray-600">Giới tính</label>
          <div class="flex space-x-3">
            <label for="male" class="radio-form"
              >Nam
              <Field id="male" type="radio" name="gender" :value="Number(1)"
            /></label>
            <label for="female" class="radio-form"
              >Nữ
              <Field id="female" type="radio" name="gender" :value="Number(2)"
            /></label>
          </div>
          <ErrorMessage name="gender" class="text-error" />
          <span
            class="text-error block"
            v-for="message in messagesRegister"
            :key="message"
            >{{ message }}</span
          >
        </div>
        <div class="form-group mb-2.5">
          <p class="text-11 text-gray-700 leading-4">
            Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên
            hệ của bạn lên Facebook.
            <a
              href=""
              class="text-primary hover:underline hover:decoration-primary"
              >Tìm hiểu thêm</a
            >.
          </p>
          <p class="text-11 text-gray-700 leading-4 mt-3">
            Bằng cách nhấp vào Đăng ký, bạn đồng ý với
            <a
              href=""
              class="text-primary hover:underline hover:decoration-primary"
              >Điều khoản</a
            >,
            <a
              href=""
              class="text-primary hover:underline hover:decoration-primary"
              >Chính sách quyền riêng tư</a
            >
            và
            <a
              href=""
              class="text-primary hover:underline hover:decoration-primary"
              >Chính sách Cookie</a
            >. của chúng tôi. Bạn có thể nhận được thông báo của chúng tôi qua
            SMS và hủy nhận bất kỳ lúc nào.
          </p>
        </div>
        <div class="form-group text-center my-2 mt-4">
          <button
            class="text-white font-bold text-ld rounded-md bg-green-500 px-8 py-2 transition-all"
            :class="{ 'bg-green-300': isRegistering }"
            :disabled="isRegistering"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { days, months, years } from "@/utilities/dateUtils";

export default {
  components: { Form, Field, ErrorMessage },
  setup() {
    const isShowRegister = ref(false);
    const isShowForgotPassword = ref(false);
    const messagesLogin = reactive([]);
    const messagesRegister = reactive([]);
    const isLogging = ref(false);
    const isRegistering = ref(false);

    const store = useStore();
    const router = useRouter();

    const schemaLogin = yup.object().shape({
      email: yup
        .string()
        .email("Vui lòng nhập địa chỉ email")
        .required("Email không được để trống"),
      password: yup.string().required("Mật khẩu không được để trống"),
    });

    const schemaRegister = yup.object().shape({
      firstName: yup.string().required("Họ không được trống"),
      lastName: yup.string().required("Tên không được trống"),
      email: yup
        .string()
        .email("Email chưa đúng định dạng")
        .required("Email không được trống"),
      password: yup
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .required("Mật khẩu không được trống"),
      day: yup.number().required("Vui lòng chọn ngày sinh"),
      month: yup.number().required("Vui lòng chọn tháng sinh"),
      year: yup.number().required("Vui lòng chọn năm sinh"),
      gender: yup.number().required("Vui lòng chọn giới tính"),
    });

    function handleLogin(user) {
      isLogging.value = true;
      store
        .dispatch("auth/login", user)
        .then(
          async () => {
            await router.push({
              name: "home",
              params: null,
            });
          },
          (error) => {
            messagesLogin.length = 0;
            messagesLogin.push(...error.errors);
          }
        )
        .finally(() => {
          isLogging.value = false;
        });
    }

    function handleRegisger(user) {
      user.dateOfBirth = new Date(
        user.year,
        user.month - 1,
        user.day
      ).toISOString();

      isRegistering.value = true;
      store
        .dispatch("auth/register", user)
        .then(
          () => {
            router.push({
              name: "home",
              params: null,
            });
          },
          (error) => {
            messagesRegister.length = 0;
            messagesRegister.push(...error);
          }
        )
        .finally(() => {
          isRegistering.value = false;
        });
    }

    return {
      isShowRegister,
      isShowForgotPassword,
      schemaLogin,
      schemaRegister,
      messagesLogin,
      messagesRegister,
      isLogging,
      isRegistering,
      handleLogin,
      handleRegisger,
      Form,
      Field,
      ErrorMessage,
      days,
      months,
      years,
    };
  },
};
</script>

<style lang="scss" scoped>
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
