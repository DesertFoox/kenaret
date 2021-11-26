import React from "react";

const PageBackButton = ({ className, children, clicked, disabled }) => {
  return (
    <div className="flex-1 justify-self-start">
      <button
        className={`flex flex-row justify-center items-center h-8 w-max px-5 text-sm ${className}`}
        onClick={clicked}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default PageBackButton;
