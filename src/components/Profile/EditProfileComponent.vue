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
      <Form :validation-schema="schemaProfile" @submit="onSubmit">
        <div class="p-4">
          <div class="form-group mb-1 flex space-x-3">
            <div class="flex-1">
              <label for="" class="text-13 text-gray-600">Họ</label>
              <Field
                class="input-form"
                type="text"
                placeholder="Họ"
                name="firstName"
                :value="data.firstName"
              />
              <ErrorMessage name="firstName" class="text-error" />
            </div>
            <div class="flex-1">
              <label for="" class="text-13 text-gray-600">Tên</label>
              <Field
                class="input-form"
                type="text"
                placeholder="Tên"
                name="lastName"
                :value="data.lastName"
              />
              <ErrorMessage name="lastName" class="text-error" />
            </div>
          </div>
          <div class="form-group mb-1">
            <label for="" class="text-13 text-gray-600">Địa chỉ</label>
            <Field
              class="input-form"
              type="text"
              placeholder="Địa chỉ"
              name="address"
              :value="data.address"
            />
            <ErrorMessage name="address" class="text-error" />
          </div>
          <div class="form-group mb-1">
            <label for="" class="text-13 text-gray-600">Ngày sinh</label>
            <div class="flex space-x-3 mt-0.5">
              <Field
                as="select"
                class="select-form"
                name="day"
                id="day"
                :value="new Date(data.dateOfBirth).getDate()"
              >
                <option v-for="day in days" :key="day" :value="day">
                  {{ day }}
                </option>
              </Field>
              <Field
                as="select"
                class="select-form"
                name="month"
                id="month"
                :value="new Date(data.dateOfBirth).getMonth() + 1"
              >
                <option
                  v-for="month in months"
                  :key="month.value"
                  :value="month.value"
                >
                  {{ month.text }}
                </option>
              </Field>
              <Field
                as="select"
                class="select-form"
                name="year"
                id="year"
                :value="new Date(data.dateOfBirth).getFullYear()"
              >
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
                <Field
                  id="male"
                  type="radio"
                  name="gender"
                  :value="Number(1)"
                  v-model="gender"
              /></label>
              <label for="female" class="radio-form"
                >Nữ
                <Field
                  id="female"
                  type="radio"
                  name="gender"
                  :value="Number(2)"
                  v-model="gender"
              /></label>
            </div>
            <ErrorMessage name="gender" class="text-error" />
          </div>
        </div>

        <div class="edit-profile-action">
          <button
            class="profile-action-btn btn--second me-auto"
            type="reset"
            @click="onChangePassword"
          >
            Đổi mật khẩu
          </button>
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
import { days, months, years } from "@/utilities/dateUtils";

export default {
  props: {
    data: {
      type: Object,
    },
  },
  components: { Form, Field, ErrorMessage },
  emits: ["onClose", "onSubmit", "onChangePassword"],
  setup(props, { emit }) {
    function onClose() {
      emit("onClose");
    }

    function onChangePassword() {
      emit("onChangePassword");
    }

    function onSubmit(data) {
      const date = new Date();
      date.setDate(data.day);
      date.setMonth(data.month - 1);
      date.setFullYear(data.year);
      emit("onSubmit", {
        ...data,
        dateOfBirth: date,
      });
    }

    const gender = { ...props.data }.gender;

    const schemaProfile = yup.object().shape({
      firstName: yup.string().required("Họ không được trống"),
      lastName: yup.string().required("Tên không được trống"),
      address: yup.string(),
      day: yup.number().required("Vui lòng chọn ngày sinh"),
      month: yup.number().required("Vui lòng chọn tháng sinh"),
      year: yup.number().required("Vui lòng chọn năm sinh"),
      gender: yup.number().required("Vui lòng chọn giới tính"),
    });

    return {
      schemaProfile,
      onClose,
      onSubmit,
      onChangePassword,
      Form,
      Field,
      ErrorMessage,
      days,
      months,
      years,
      gender,
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
