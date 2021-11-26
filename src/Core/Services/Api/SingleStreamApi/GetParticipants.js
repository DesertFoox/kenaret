import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const GetLiveStreams = async (id) => {
  try {
    const result = await http.get(
      `${serverBackendURL}/livestreams/${id}/participants`
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default GetLiveStreams;
