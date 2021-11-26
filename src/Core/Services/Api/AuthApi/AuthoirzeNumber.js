import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'
const AuthorzieNumber = async (PhoneNumber) => {
  try {
    const result = await http.post(`${serverBackendURL}/users/phonenumberauthentication`, {
      PhoneNumber,
    });
    console.log("AuthorzieNumber result:", result);
    return result.data
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default AuthorzieNumber;
