import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const GetUser = async () => {
  try {
    const result = await http.get(
      `${serverBackendURL}/users`
    );
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default GetUser;
