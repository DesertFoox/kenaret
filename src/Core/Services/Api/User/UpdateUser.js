import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const UpdateUser = async (data) => {
  try {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const result = await http.put(
      `${serverBackendURL}/users`,
      data,
      config
    );
    console.log("UpdteUser result",result);
    return result.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
  return {};
};
export default UpdateUser;
