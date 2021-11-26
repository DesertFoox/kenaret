import React from "react";
import { Icon } from "@iconify/react";

const FooterButton = ({ theIcon, className, onClick }) => {
  return (
    <div
      className={
        "p-1 pt-2 flex-1 h-full flex flex-col justify-center items-center " +
        className
      }
      onClick={onClick}
    >
      <Icon
        className="min-h-footer-icon text-2xl"
        icon={theIcon}
      />
    </div>
  );
};

export default FooterButton;
