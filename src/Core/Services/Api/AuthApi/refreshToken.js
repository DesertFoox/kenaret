import { setItem, clearStorage } from "../../Common/storage/storage.service";
import { errorToast } from "../../../../utility/toastSettings";
import { store } from "../../../../index";
import { serverBackendURL } from "../../../../utility/Config";
import http from "../../Interceptor/http.interceptor";

const RefreshToken = async (accessToken, refreshToken, failedFunction) => {
  await new Promise(async (resolve, reject) => {
    try {
      const result = await http.post(
        `${serverBackendURL}/users/refresh`,
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
        }
      );
      if (result.data.success) {
        setItem("refreshToken", result.data.result.refreshToken);
        setItem("Authorization", result.data.result.accessToken);
        resolve(true);
      } else {
        errorToast(
          "متأسفانه نشست کاربری شما به اتمام رسیده. لطفاً دوباره وارد حساب خود بشوید"
        );
        store.dispatch({ type: "LOGOUT" });
        clearStorage();
        if (failedFunction) failedFunction();
        reject(false)
      }
    } catch (error) {
      errorToast(
        "متأسفانه نشست کاربری شما به اتمام رسیده. لطفاً دوباره وارد حساب خود بشوید"
      );
      store.dispatch({ type: "LOGOUT" });
      clearStorage();
      if (failedFunction) failedFunction();
      reject(false);
    }
  })
  return {};
};

export default RefreshToken;
