import { useState } from "react";
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";
import { Fragment } from "react";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
`;

const Loading = ({ loading, fullScreen, text }) => {
  let [color, setColor] = useState("#fa7d09");

  return (
    <Fragment>
      {fullScreen ? (
        <div className="fixed top-0 left-0 z-40 w-screen h-screen flex flex-col justify-center items-center bg-black-50">
          <p className="text-lg">{text}</p>
          <PulseLoader
            color={color}
            loading={loading}
            css={override}
            width={300}
            height={6}
          />
        </div>
      ) : (
        <div className="h-full w-full flex justify-start items-center">
          <PulseLoader
            color={color}
            loading={loading}
            css={override}
            width={300}
            height={6}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Loading;
