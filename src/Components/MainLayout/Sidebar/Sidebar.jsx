import React from "react";

const Sidebar = ({ children }) => {
  const right = window.innerWidth > 640 ? (window.innerWidth - 640) / 2 + 16 : 16;

  // return <div className="absolute bottom-12 w-30 h-30" style={{right: `${right}px`}}>{children}</div>;
  return <div className="absolute bottom-12 w-30 h-30 right-4">{children}</div>;
};

export default Sidebar;
