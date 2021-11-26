export const iranianPhoneNumberValidation = (number) => {
  let mobileReg =
      /(0|\+98)?([ ]|-|[()]){0,2}9[0-9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/gi,
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

export const persianNumbersHandler = (number) => {
  const persinNum = [
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
  ];
  const num2en = (str) => {
    for (let i = 0; i < 10; i++) {
      str = str.replace(persinNum[i], i);
    }
    return str;
  };
  return num2en(number);
};
