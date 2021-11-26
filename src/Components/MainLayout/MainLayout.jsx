import React from "react";

const MainLayout = ({children, headerPadding, bg, text, className, isModal}) => {
  const zIndexClass = isModal ? "30" : "10";
  return (
    <div className={`fixed duration-300 overflow-auto transition-all z-${zIndexClass} top-0 left-0 w-full h-full pb-20 bg-${bg} text-${text} ${headerPadding  ? " pt-36" : null} ${className}`}>
      {children}
    </div>
  );
};

export default MainLayout;