import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const GetStreamParticipants = async (id) => {
  try {
    const result = await http.get(
      `${serverBackendURL}/livestreams/${id}/participants`
    );
    console.log("GetStreamParticipants result", result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default GetStreamParticipants;
