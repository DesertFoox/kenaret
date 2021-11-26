import http from "../../Interceptor/http.interceptor";
import { getItem } from "../../Common/storage/storage.service";
import { serverBackendURL } from '../../../../utility/Config'

const Register = async (firstName, lastName) => {
  try {
    var data = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
    });
    var config = {
      headers: {
        Authorization: `bearer ${getItem("Authorization")} `,
        "Content-Type": "application/json",
      },
    };
    const result = await http.post(
      `${serverBackendURL}/users/register`,
      data,
      config
    );
    return result.data.result;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default Register;
