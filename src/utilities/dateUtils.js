/* eslint-disable prettier/prettier */
export const days = Array.from({ length: 31 }, (_, i) => i + 1);
export const months = [
  {
    text: "Tháng 1",
    value: 1,
  },
  {
    text: "Tháng 2",
    value: 2,
  },
  {
    text: "Tháng 3",
    value: 3,
  },
  {
    text: "Tháng 4",
    value: 4,
  },
  {
    text: "Tháng 5",
    value: 5,
  },
  {
    text: "Tháng 6",
    value: 6,
  },
  {
    text: "Tháng 7",
    value: 7,
  },
  {
    text: "Tháng 8",
    value: 8,
  },
  {
    text: "Tháng 9",
    value: 9,
  },
  {
    text: "Tháng 10",
    value: 10,
  },
  {
    text: "Tháng 11",
    value: 11,
  },
  {
    text: "Tháng 12",
    value: 12,
  },
];
export const years = Array.from({ length: 100 }, (_, i) => i + 1925).reverse();

export function convertDateDisplay(date) {
  const now = new Date();
  const targetDate = date;

  const miliseconds = now - targetDate;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;

  if (miliseconds / year > 1) {
    return parseInt(miliseconds / year) + " năm";
  } else if (miliseconds / month > 1) {
    return parseInt(miliseconds / month) + " tháng";
  } else if (miliseconds / day > 1) {
    return parseInt(miliseconds / day) + " ngày";
  } else if (miliseconds / hour > 1) {
    return parseInt(miliseconds / hour) + " giờ";
  } else if (miliseconds / minute > 1) {
    return parseInt(miliseconds / minute) + " phút";
  } else {
    return "1 phút";
  }
}

export function convertTimeNotificationAlert(date) {
  const now = new Date();
  const targetDate = date;

  const miliseconds = now - targetDate;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;

  if (miliseconds / year > 1) {
    return parseInt(miliseconds / year) + " năm";
  } else if (miliseconds / month > 1) {
    return parseInt(miliseconds / month) + " tháng";
  } else if (miliseconds / day > 1) {
    return parseInt(miliseconds / day) + " ngày";
  } else if (miliseconds / hour > 1) {
    return parseInt(miliseconds / hour) + " giờ";
  } else if (miliseconds / minute > 1) {
    return parseInt(miliseconds / minute) + " phút";
  } else {
    return "vài giây trước";
  }
}

export function convertDatePostDisplay(date) {
  const now = new Date();
  const targetDate = date;

  const miliseconds = now - targetDate;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = month * 12;

  if (miliseconds / year > 1) {
    return parseInt(miliseconds / year) + " năm";
  } else if (miliseconds / week > 1) {
    return (
      targetDate.getDate() +
      " tháng " +
      (targetDate.getMonth() + 1) +
      " lúc " +
      targetDate.getHours() +
      ":" +
      (targetDate.getMinutes() < 10
        ? "0" + targetDate.getMinutes()
        : targetDate.getMinutes())
    );
  } else if (miliseconds / day > 1) {
    return parseInt(miliseconds / day) + " ngày";
  } else if (miliseconds / hour > 1) {
    return parseInt(miliseconds / hour) + " giờ";
  } else if (miliseconds / minute > 1) {
    return parseInt(miliseconds / minute) + " phút";
  } else {
    return "1 phút";
  }
}

export function convertDateStringToDateDisplay(dateString) {
  const date = new Date(dateString);
  const dateConverted = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1)
    + "/" + date.getFullYear();
  return dateConverted;
}

export function convertDateTitleMessage(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  if (now - date < 24 * 60 * 60 * 1000) {
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  } else {
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

export function converDateToDDMMYYY(dateString) {
  const date = new Date(dateString);
  return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}/${date.getFullYear()}`
}
