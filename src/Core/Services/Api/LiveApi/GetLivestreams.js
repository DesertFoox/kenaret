import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const GetLiveStreams = async (pageNumber) => {
  try {
    const result = await http.get(
      `${serverBackendURL}/livestreams?PageNumber=${pageNumber}&PageSize=10
      `
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default GetLiveStreams;
