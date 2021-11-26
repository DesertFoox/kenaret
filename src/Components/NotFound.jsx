import React from "react";
import { Icon } from '@iconify/react';
import emojiSad from '@iconify/icons-entypo/emoji-sad';
import MainLayout from "./MainLayout/MainLayout";
import Header from "./MainLayout/Header/Header";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <MainLayout headerPadding bg="low-gray" text="black">
      <Header bg="white">
        <div className="kenaret-container">
          <div className="flex justify-between py-4 items-center">
            <h3 className="text-lg"></h3>
          </div>
          <p className="text-sm text-center">صفحه موردنظر پیدا نشد</p>
        </div>
      </Header>
      <div className="h-full space-y-4 flex justify-center items-center flex-col kenaret-container">
        <Icon icon={emojiSad} className="text-8xl" />
        <div>
          {"متأسفانه صفحه ای دنبالشی وجود نداره"}
        </div>
        <Link to="/" className="text-orange">
          رفتن به صفحه اصلی
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
