import http from "../../Interceptor/http.interceptor";
import { serverBackendURL } from '../../../../utility/Config'

const CreateLink = async (data) => {
  try {
    const result = await http.post(
      `${serverBackendURL}/links`,
      data
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
  return {};
};
export default CreateLink;
