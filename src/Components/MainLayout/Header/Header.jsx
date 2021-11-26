import React, { useState } from "react";

const Header = ({children, isLoggedIn, bg, positionAbsolute, className, modalHeader }) => {
  let position = "fixed";
  if (positionAbsolute) position = "absolute"

  let zIndex = modalHeader ? "z-30" : "z-20";
  return (
    <div className={`h-28 top-0 w-full bg-${bg} ${position} ${className} ${zIndex}`}>
      {children}
    </div>
  );
};
export default Header;
