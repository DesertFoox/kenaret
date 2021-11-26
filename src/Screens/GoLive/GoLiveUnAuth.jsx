import React from "react";
import Icon from "@iconify/react";
import roundLogin from "@iconify/icons-ic/round-login";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import { Link, useHistory } from "react-router-dom";

import Header from "../../Components/MainLayout/Header/Header";
import MainLayout from "../../Components/MainLayout/MainLayout";
import Button from "../../Components/UI/Button/Button";
import { goLiveDes, goLiveText } from "../../utility/constants";
import PageBackButton from "../../Components/UI/Button/PageBackButton";
import PageNextButton from "../../Components/UI/Button/PageNextButton";

const GoLiveUnAuth = () => {
  const history = useHistory();

  return (
    <MainLayout headerPadding bg="low-gray" text="black">
      <Header bg="white">
        <div className="kenaret-container">
          <div className="flex justify-between py-4 items-center">
            <h3 className="text-lg mx-auto">{goLiveText()}</h3>
          </div>
          <p className="text-sm text-center">{goLiveDes()}</p>
        </div>
      </Header>

      <div className="kebaret-container flex flex-col space-y-4 pt-20 justify-center items-center p-4">
        <div>
          <Icon icon={roundLogin} className="text-8xl" />
        </div>
        <div className="text-center">
          برای ورود به بخش پخش استریم وارد حسابت شو
        </div>
        <div>
          <Link to="/login" className="text-orange">
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default GoLiveUnAuth;
