import React, { useEffect, useState } from "react";

const Input = (props) => {
  const [inputId, setInputId] = useState();
  const directionClass = props.rtl ? "focus:dir-rtl" : "";
  /* -------------------------------------------------------------------------- */
  const warnings = props?.warnings?.map((item, index) => (
    <li key={index} className="text-white font-sans-bold text-xs">
      {"- " + item}
    </li>
  ));
  /* -------------------------------------------------------------------------- */
  let labelSizeClass = "";
  if (props.labelSize) {
    labelSizeClass = `w-${props.labelSize}`;
  } else {
    labelSizeClass = "w-max whitespace-nowrap";
  }
  /* -------------------------------------------------------------------------- */
  let warningMarginClass;
  if (props.warnings) {
    warningMarginClass = props?.warnings?.length !== 0 ? "mt-4 p-2" : "h-0";
  }
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!props.id) {
      const idNum = Math.random() * 1000000000000000;
      setInputId(`input_id_${idNum}`);
    } else {
      setInputId(props.id);
    }
  }, []);
  /* -------------------------------------------------------------------------- */
  return (
    <React.Fragment>
      <div className={`flex bg-white px-2 rounded`}>
        <label
          htmlFor={inputId}
          className={`text-sm ml-3 flex items-center ${labelSizeClass}`}
        >
          {props.label}
        </label>
        <input
          id={inputId}
          required
          dir="ltr"
          ref={props.ref}
          autoFocus={props.autoFocus}
          disabled={props.disabled}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          className={`text-sm w-full bg-transparent text-black h-9 rounded-lg flex
             flex-auto px-1 bg-text text-bg outline-none transistion-all duration-300 opacity-70
             focus:opacity-100 ${directionClass} `}
          value={props.value}
          onChange={props.onChange}
          type={props.type}
          inputMode={props.number ? "numeric" : ""}
        />
      </div>
      {props.warnings ? (
        <ul
          className={`flex flex-col space-y-2 w-full rounded bg-red ${warningMarginClass}`}
        >
          {warnings}
        </ul>
      ) : null}
    </React.Fragment>
  );
};

export default Input;
