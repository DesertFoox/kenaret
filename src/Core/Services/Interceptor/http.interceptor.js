import axios from "axios";
import { getItem, clearStorage } from "../Common/storage/storage.service";
import refreshToken from "../Api/AuthApi/refreshToken";
import { errorToast } from "../../../utility/toastSettings";
import jwt_decode from "jwt-decode";
import { serverBackendURL } from "../../../utility/Config";

axios.interceptors.request.use(
  async (config) => {
    if (config.url !== `${serverBackendURL}/users/refresh`) {
      const token = getItem("Authorization");
      if (token) {
        const decode = jwt_decode(token);
        const expireTime = new Date((decode.exp - 20) * 1000);
        const now = new Date();
        if (now.getTime() > +expireTime.getTime()) {
          await refreshToken(getItem("Authorization"), getItem("refreshToken"));
        }
      } else if (
        getItem("Authorization") === "undefined" ||
        getItem("refreshToken") === "undefined"
      ) {
        alert("Token undefined");
        clearStorage();
      }
    } else {
      console.log("booooooooooooooooooooo");
    }
    return config;
  },
  (error) => {}
);
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      errorToast("متأسفانه مشکلی وجود دارد");
    }
    return Promise.reject(error);
  }
);

// will send token to headers request ( in x-auth-token body )
axios.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + getItem("Authorization");
  return config;
});

export default axios;
