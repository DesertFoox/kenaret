import { useState } from "react";
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";
import { Fragment } from "react";
import { Icon } from '@iconify/react';
import connectedIcon from '@iconify/icons-wpf/connected';
// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
`;

const Loading = ({ loading, fullScreen }) => {
    let [color, setColor] = useState("#fa7d09");

    return (
        <Fragment>
            {fullScreen ? (
                <div className=" top-0 left-0 z-40 w-screen h-screen flex flex-col justify-center items-center bg-opacityblack">
                    <Icon icon={connectedIcon} color="white" width="100" height="100" />
                    <p className="text-white text-2xl mt-10">درحال ارتباط با پخش شونده</p>
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
