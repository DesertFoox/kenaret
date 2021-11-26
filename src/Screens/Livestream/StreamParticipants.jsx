import React, { useState } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LazyLoad from "react-lazyload";

import GetStreamParticipants from "../../Core/Services/Api/SingleStreamApi/GetStreamParticipants";
import { errorToast } from "../../utility/toastSettings";
import Icon from "@iconify/react";
import micMute from "@iconify/icons-bi/mic-mute";

const StreamParticipants = ({
  participants,
  streamerData,
  scrollable,
  isLoggedIn,
  id,
  hasAudio,
}) => {
  const [audience, setAudience] = useState([]);
  const [updated, setUpdated] = useState(false);

  let wrapClass = scrollable ? "flex-wrap" : "";

  const updateParticipants = async (id) => {
    setUpdated(true);
    console.log("updating participants");
    const result = await GetStreamParticipants(id);
    if (result.success) {
      console.log("GetStreamParticipants Result", result.result);
      const streamParticipants = result.result;
      setAudience(streamParticipants);
    } else {
      errorToast(result.error);
    }
  };

  const participantsToShow = updated ? audience : participants;

  return (
    <div className={`mx-4 overflow-auto ${wrapClass}`}>
      <div className="py-4 font-bold">لیدر</div>
      <div
        className={`grid grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 gap-x-4`}
        style={{ maxHeight: "50vh" }}
      >
        <div className="flex-shrink-0 w-16 h-20 mb-4 ml-4">
          <div className="w-full h-16 flex justify-center items-center bg-cover relative">
            <LazyLoad height={200}>
              <img
                src={
                  streamerData.avatar
                    ? `https://6064645837b7e20018e99fd5.iran.liara.space/avatars/${streamerData.avatar}`
                    : require("../../Assets/Image/defaultimage.png").default
                }
                className="w-full h-auto rounded"
                alt=""
              />
            </LazyLoad>
            {hasAudio === false && (
              <div className="absolute w-6 h-6 rounded bg-red text-white flex justify-center items-center -left-3 -bottom-3">
                <Icon icon={micMute} />
              </div>
            )}
          </div>

          <div className="w-full h-6 overflow-hidden text-center">
            <p className="dir-ltr">{streamerData.fullname}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center font-bold">
          <div className="py-4 ">شرکت کنندگان تأیید شده</div>
          <div
            className="p-2 m-1 text-orange rounded cursor-pointer"
            onClick={() => updateParticipants(id)}
          >
            {"(بروزرسانی)"}
          </div>
        </div>
        {isLoggedIn ? (
          <span></span>
        ) : (
          <Link to="/login" className="text-orange">
            وارد شوید
          </Link>
        )}
      </div>
      {participantsToShow.length !== 0 ? (
        <Fragment>
          <Fragment>
            {/*<div
              className={`grid grid-cols-3 xsm:grid-cols-4 sm:grid-cols-5 gap-x-4`}
              style={{ maxHeight: scrollable ? "540px" : "" }}
            >  */}
            <div
              className={`flex overflow-auto ${wrapClass}`}
              style={{ maxHeight: "40vh" }}
            >
              {participantsToShow.map((p, index) => (
                <div className="flex-shrink-0 w-16 h-20 mb-4 ml-4" key={index}>
                  <LazyLoad height={200}>
                    <div className="w-full h-16 overflow-hidden flex justify-center items-center rounded bg-cover">
                      <img
                        src={
                          p?.avatar === undefined || p?.avatar === null
                            ? require("../../Assets/Image/defaultimage.png")
                                .default
                            : `https://6064645837b7e20018e99fd5.iran.liara.space/avatars/${p?.avatar}`
                        }
                        className="w-full h-auto"
                        alt=""
                      />
                    </div>
                  </LazyLoad>

                  <div className="w-full h-6 overflow-hidden text-left">
                    <p className="dir-ltr text-center">{p?.firstName}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* </div> */}
          </Fragment>
        </Fragment>
      ) : (
        <div>شرکت کننده ای وجود ندارد</div>
      )}
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    isLoggedIn: store.isLoggedIn,
  };
};

export default connect(mapStateToProps)(StreamParticipants);
