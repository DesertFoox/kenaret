import React from "react";

const TextArea = (props) => {
  let labelSizeClass = "";
  if (props.labelSize) {
    labelSizeClass = `w-${props.labelSize}`;
  } else {
    labelSizeClass = "w-max whitespace-nowrap";
  }
  /* -------------------------------------------------------------------------- */
  let inputId;
  if (!props.id) {
    const idNum = Math.random() * 1000000000000000;
    inputId = `input_id_${idNum}`;
  } else {
    inputId = props.id;
  }
  /* -------------------------------------------------------------------------- */
  return (
    <React.Fragment>
      <div className="flex bg-white p-2 rounded">
        <label
          htmlFor={inputId}
          className={`text-sm ml-3 flex items-center ${labelSizeClass}`}
        >
          {props.label}
        </label>
        <textarea
          id={inputId}
          rows="2"
          dir={props.inputDir ? props.inputDir : "auto"}
          required
          disabled={props.disabled}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          className="text-sm w-full bg-transparent text-black lg:h-10 rounded-lg flex
             flex-auto px-1 bg-text text-bg outline-none transistion-all duration-300 opacity-70
             focus:opacity-100 resize-none focus:dir-rtl"
          value={props.value}
          onChange={props.onChange}
          type={props.type}
          style={{height: "max-content"}}
        ></textarea>
      </div>
    </React.Fragment>
  );
};

export default TextArea;
