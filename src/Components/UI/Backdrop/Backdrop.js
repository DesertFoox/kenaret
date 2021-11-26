import React from "react";

const backdrop = (props) => {
  const opacity = props.opacity ? props.opacity : "100";
  const color = props.color ? props.color : "bg";
  return props.show ? (
    <div
      className={
        "fixed z-30 w-screen h-screen left-0 top-0 bg-" +
        color +
        " opacity-" +
        opacity
      }
      onClick={props.clicked}
    ></div>
  ) : null;
};

export default backdrop;
