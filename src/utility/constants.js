const SMS_FAILED_FA = "ارسال کد با خطا مواجه شد";
const SMS_SUCCEEDED_FA = "کد فعالسازی برای شما پیامک شد";
const CONTENT_COPIED_FA = "با موفقیت کپی شد";
const COPY_LINK_FA = "کپی لینک";
const LOGIN_FA = "ورود | عضویت";
const ACCOUNT_FA = "حساب کاربری";
const GO_LIVE_FA = "پخش استریم";
const GO_LIVE_DES_FA = "با پخش زنده دانسته هات رو با تمام جهان به اشتراک بگذار";

export const textFailedSMS = () => {
  return SMS_FAILED_FA;
};

export const textSucceededSMS = () => {
  return SMS_SUCCEEDED_FA;
};

export const textContentCopied = () => {
  return CONTENT_COPIED_FA;
};

export const copyLink = () => {
  return COPY_LINK_FA;
};

export const loginText = () => {
  return LOGIN_FA;
};

export const accountText = () => {
  return ACCOUNT_FA;
};

export const goLiveText = () => {
  return GO_LIVE_FA;
};
export const goLiveDes = () => {
  return GO_LIVE_DES_FA;
};
