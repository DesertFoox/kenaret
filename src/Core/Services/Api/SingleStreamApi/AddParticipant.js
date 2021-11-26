import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const AddParticipant = async (data, id) => {
  try {
    const result = await http.put(
      `${serverBackendURL}/livestreams/${id}/participants`,
      data
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default AddParticipant;