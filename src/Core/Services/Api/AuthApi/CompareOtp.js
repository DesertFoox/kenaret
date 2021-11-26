import http from "../../Interceptor/http.interceptor";

import { serverBackendURL } from '../../../../utility/Config'
const GetOtp = async (otp, phoneNumber) => {
  try {
    const result = await http.post(
      `${serverBackendURL}/users/otpcodeauthentication`,
      { phoneNumber: phoneNumber, code: otp }
    );
    return result.data.result;
  } catch (error) {
    console.log(error.response.data);
  }
  return {};
};
export default GetOtp;
