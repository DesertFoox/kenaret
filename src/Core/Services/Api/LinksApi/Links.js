import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const Links = async () => {
  try {
    const result = await http.get(
     `${serverBackendURL}/links`
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default Links;
