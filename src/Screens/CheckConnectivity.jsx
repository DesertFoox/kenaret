import Icon from "@iconify/react";
import connectionSignalOff from '@iconify/icons-carbon/connection-signal-off';
import reloadCircle from '@iconify/icons-ion/reload-circle';
import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/MainLayout/Header/Header";
import MainLayout from "../Components/MainLayout/MainLayout";

const CheckConnectivity = () => {

  return (
    <MainLayout headerPadding bg="low-gray" text="black">
      <Header bg="white">
        <div className="kenaret-container">
          <div className="flex justify-between py-4 items-center">
            <p className="text-lg"></p>
          </div>
          <p className="text-lg text-center">مشکل در برقراری ارتباط</p>
        </div>
      </Header>
      <div className="h-full space-y-4 flex justify-center items-center flex-col kenaret-container">
        <Icon icon={connectionSignalOff} className="text-8xl" />
        <div>{"لطفاً اتصال اینترنت خود را بررسی کنید"}</div>
        <Link to="/" className="text-orange text-6xl">
          <Icon icon={reloadCircle}/>
        </Link>
      </div>
    </MainLayout>
  );
};

export default CheckConnectivity;
