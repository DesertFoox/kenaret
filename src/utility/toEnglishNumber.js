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