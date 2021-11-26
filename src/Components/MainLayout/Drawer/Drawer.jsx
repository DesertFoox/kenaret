import React from "react";
import closeIcon from "@iconify-icons/mdi/close";
import Icon from "@iconify/react";

const Drawer = ({ show, children, close }) => {
  let drawerLeft;
  const pageWidth = window.innerWidth;
  if (pageWidth > 670) {
    drawerLeft = (pageWidth - 670) / 2;
  } else {
    drawerLeft = 0;
  }

  const drawerClassName = show
    ? "bottom-0 z-50 opacity-100"
    : "-bottom-full z-0 opacity-0";

  return (
    <div
      className={`max-w-2xl text-black fixed w-full h-max max-h-full bg-low-gray rounded-t border border-mid-gray transition-all duration-500  ${drawerClassName}`}
      style={{ left: `${drawerLeft}px` }}
    >
      <div className="absolute top-2.5 right-3" onClick={() => close()}>
        <Icon icon={closeIcon} className="text-xl" />
      </div>
      {children}
    </div>
  );
};

export default Drawer;
