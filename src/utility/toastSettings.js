import React from "react";
import { toast, ToastContainer } from "react-toastify";
export const MyToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl
      draggable
      pauseOnHover
    />
  );
};

export const errorToast = (content) => toast.error(content);
export const successToast = (content) => toast.success(content);
export const warnToast = (content) => toast.warning(content);

