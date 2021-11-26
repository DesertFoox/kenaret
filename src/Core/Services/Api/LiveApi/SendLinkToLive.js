import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const SendLinkToLive = async (data,Liveid) => {
  try {
    const result = await http.post(
      `${serverBackendURL}/livestreams/${Liveid}/links`,
      data
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default SendLinkToLive;
