import { toast } from "react-toastify";

import * as constants from "./constants";

export const failedSMS = () => {
  return toast.error(constants.textFailedSMS());
};

export const succeededSMS = () => {
  return toast.success(constants.textSucceededSMS());
};

export const textCopied = () => {
  return toast.success(constants.textContentCopied(), { autoClose: 2000 });
};
