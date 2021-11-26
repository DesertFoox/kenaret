import { textCopied } from "./toasts";

export const copyToClipboard = (props) => {
  navigator.clipboard.writeText(props);
  textCopied();
};

export const iranianPhoneNumberValidation = (number) => {
  let mobileReg = /(0|\+98)?([ ]|-|[()]){0,2}9[0-9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/gi,
    junkReg = /[^\d]/gi,
    persinNum = [
      /۰/gi,
      /۱/gi,
      /۲/gi,
      /۳/gi,
      /۴/gi,
      /۵/gi,
      /۶/gi,
      /۷/gi,
      /۸/gi,
      /۹/gi,
    ],
    num2en = function (str) {
      for (let i = 0; i < 10; i++) {
        str = str.replace(persinNum[i], i);
      }
      return str;
    },
    getMobiles = function (str) {
      let mobiles = num2en(str + "").match(mobileReg) || [];
      mobiles.forEach(function (value, index, arr) {
        arr[index] = value.replace(junkReg, "");
        arr[index][0] === "0" || (arr[index] = "0" + arr[index]);
      });
      return mobiles;
    };

  return getMobiles(number);
};

export const toEnglishNumber = (strNum) => {
  let pn = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  let en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let an = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let cache = strNum;
  for (let i = 0; i < 10; i++) {
    let regex_fa = new RegExp(pn[i], "g");
    let regex_ar = new RegExp(an[i], "g");
    cache = cache.replace(regex_fa, en[i]);
    cache = cache.replace(regex_ar, en[i]);
  }
  return cache;
};
