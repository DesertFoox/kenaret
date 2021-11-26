import React, { useState } from "react";
import LinkContext from "./LinkContext";

const LinkProvider = (props) => {
  const [linkLength, setLinkLength] = useState(null);
  const setlength = (e) => {
    setLinkLength(e);
  };
  return (
    <LinkContext.Provider
      value={{
        linkLength: linkLength,
        setLinkLength: { setlength },
      }}
    >
      {props.children}
    </LinkContext.Provider>
  );
};

export default LinkProvider;
