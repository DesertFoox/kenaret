import React from "react";

const button = (props) => {
  let size = null;
  let color = null;
  let equal = props.equal ? props.equal : false;
  let result = null;

  if (props.size) {
    switch (props.size) {
      case "large":
        result = props.equal ? "h-12 w-12" : "h-12 w-40";
        size = `flex flex-row place-content-center place-items-center select-none ${result} text-lg text-ml  font-sans-bold  align-middle`;
        break;
      case "medium":
        result = props.equal ? "h-10 w-10" : "h-10 w-36";
        size = `flex flex-row place-content-center place-items-center select-none ${result}  text-base  font-sans-bold align-middle`;
        break;
      case "small":
        result = props.equal ? "h-8 w-8" : "h-8 w-28";
        size = `flex flex-row place-content-center place-items-center select-none ${result} text-sm  font-sans-bold  align-middle`;
        break;
      case "extra-small":
        result = props.equal ? "h-8 w-8" : "h-8 w-20";
        size = `flex flex-row place-content-center place-items-center select-none ${result} text-sm  font-sans-bold  align-middle`;
        break;
      case "content-small":
        result = props.equal ? "h-8 w-8" : "h-8 w-32";
        size = `flex flex-grow px-5 place-content-center place-items-center select-none ${result} text-sm  font-sans-bold  align-middle`;
        break;
      case "full":
        result = "w-full";
        size = `flex flex-row place-content-center place-items-center select-none ${result} text-sm  font-sans-bold  align-middle`;
        break;
      default:
        size =
          "select-none h-auto px-2 w-auto text-base  font-sans-bold  align-middle";
        break;
    }
  }

  if (props.color) {
    let c = props.color;

    let init = "  hover:bg-${c}-600 focus:outline-none rounded".replace(
      "${c}",
      c
    );

    color = "bg-${c}-500 cursor-pointer text-white".replace("${c}", c) + init;

    switch (props.color) {
      case "blue":
        break;
      case "red":
        break;
      case "green":
        break;
      case "transparent":
        color =
          "bg-${c} cursor-pointer border-2 border-text  border-opacity-100 text-text  hover:bg-text hover:text-bg".replace(
            "${c}",
            c
          ) + init;
        break;
      case "noBorder":
        color =
          "bg-${c} cursor-pointer text-text bg-primary border-opacity-0 border-white hover:border-text hover:bg-bg".replace(
            "${c}",
            c
          ) + init;
        break;
      default:
        color =
          "bg-gray-300 cursor-not-allowed text-gray-600".replace("${c}", c) +
          init;
        break;
    }
  }

  return (
    <button
      className={[size, color].join(" ") + " " + props.className }
      onClick={props.clicked}
      disabled={props.disabled}
      type={props.type}
      title={props.title}
    >
      {props.children}
    </button>
  );
};

export default button;
