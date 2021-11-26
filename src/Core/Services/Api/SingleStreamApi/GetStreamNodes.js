import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const GetStreamNodes = async (id) => {
  try {
    const result = await http.get(
      `${serverBackendURL}/livestreams/${id}/links`
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default GetStreamNodes;