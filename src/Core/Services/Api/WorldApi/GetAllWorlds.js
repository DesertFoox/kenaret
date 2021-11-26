import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const GetAllWords = async () => {
  try {
    const result = await http.get(
      `${serverBackendURL}/worlds`
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default GetAllWords;
