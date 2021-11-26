import React from "react";

const PageNextButton = ({ className, children, clicked, disabled }) => {
  return (
    <div className="flex-1 text-left">
      <button
        className={`float-left flex flex-row justify-center items-center h-8 w-max text-sm ${className} mx-5 `}
        onClick={clicked}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default PageNextButton;