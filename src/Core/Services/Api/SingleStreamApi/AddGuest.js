import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const AddGuest = async (id) => {
  try {
    const result = await http.put(
      `${serverBackendURL}/livestreams/${id}/addguest`
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default AddGuest;