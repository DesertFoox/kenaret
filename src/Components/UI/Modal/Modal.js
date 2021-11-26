import React, { Fragment, useState, useEffect } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";

import Backdrop from "../Backdrop/Backdrop";
import Loading from "../Loading/Loading";

const Modal = (props) => {
  const [modalShow, setModalShow] = useState(props.show);

  useEffect(() => {
    setModalShow(props.show);
    return () => {};
  }, [props.show]);

  return (
    <Fragment>
      {modalShow ? (
        <div className="the-modal fixed w-screen h-screen top-0">
          <Backdrop show={modalShow} clicked={props.toggler} />
          <div className="h-10 z-50 bg-bg flex justify-between items-center fixed top-0 w-full font-bold">
            <div className="logo p-4">{props.title}</div>
            <div onClick={props.toggler} className="group auth p-1 cursor-pointer p-4"> بازگشت {" "} <IoReturnUpBackOutline className="inline text-4xl pr-2" /></div>
          </div>
          <div className="flex justify-center items-center w-screen h-screen">
            <div className="flex flex-col z-50 bg-primary w-11/12 max-w-xs overflow-hidden rounded-md box-border">
              <Loading loading={props.loading ? props.loading : null} />
              <div>{props.children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default Modal;
