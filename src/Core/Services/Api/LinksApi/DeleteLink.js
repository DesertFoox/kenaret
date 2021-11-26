import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const DeleteLink = async (id) => {
  try {
    const result = await http.delete(
      `${serverBackendURL}/links?linkid=${id}`
    );
    console.log(id);
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default DeleteLink;
