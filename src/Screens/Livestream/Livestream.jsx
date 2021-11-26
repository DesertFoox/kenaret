import React, { useState, Fragment, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import eyeFilled from "@iconify-icons/ant-design/eye-filled";
import shapeHexagon from "@iconify/icons-gg/shape-hexagon";
import shareIcon from "@iconify/icons-fa-solid/share";
import { connect } from "react-redux";

import Header from "../../Components/MainLayout/Header/Header";
import Sidebar from "../../Components/MainLayout/Sidebar/Sidebar";
import StreamParticipants from "./StreamParticipants";
import Livestream from "../../classes/LiveStream";
import { getItem } from "../../Core/Services/Common/storage/storage.service";
import AddGuest from "../../Core/Services/Api/SingleStreamApi/AddGuest";
import AddParticipant from "../../Core/Services/Api/SingleStreamApi/AddParticipant";
import StreamLoading from "../../Components/UI/StreamLoading/StreamLoading";
import { useParams } from "react-router-dom";
import GetSingleLivestream from "../../Core/Services/Api/LiveApi/GetSingleLivestream";
import { errorToast, successToast } from "../../utility/toastSettings";
const LivestreamComponent = ({
  data,
  nodesHandler,
  participantsHandler,
  shareHandler,
  participants,
  scrollableParticipants,
  isLive,
  socket,
  userId,
}) => {
  const [viewers, setViewers] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [stream, setStream] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [streamData, setStreamData] = useState(data);

  let { streamId } = useParams();
  const videoEl = useRef();
  const audioEl = useRef();
  const leftClass =
    window.innerWidth > 640 ? (window.innerWidth - 640) / 2 + 16 : 16;

  const theStream = useRef();
  theStream.current = stream;

  useEffect(() => {
    return () => {
      if (isLive) {
        stream?.exit();
      }
    };
  }, [stream]);

  useEffect(() => {
    if (isLive) {
      console.log("streamData :", streamData);
      startLivestream();
      updateStreamData();
    } else {
      exitLiveStream();
    }
  }, [isLive]);

  const updateStreamData = async () => {
    const theNewStreamDTO = await GetSingleLivestream(data.id);
    if (theNewStreamDTO.success) {
      console.log(theNewStreamDTO);
      setStreamData(theNewStreamDTO.result);
      if (theNewStreamDTO.result.isFinished) {
        exitLiveStream();
      }
    } else {
      errorToast("مشکلی از سمت سرور وجود دارد");
    }
  };

  const exitLiveStream = () => {
    if (stream) {
      console.log("exiting stream:", stream);
      stream.exit();
      stream.clean();
    }
  };

  const deleteStream = (isEnded) => {
    setStream(null);
    if (isEnded) {
      setIsEnded(true);
      successToast("این استریم پایان یافته است");
    }
  };

  const hasVideoHandler = (hv) => {
    setHasVideo(hv);
  };

  const hasAudioHandler = (ha) => {
    setHasAudio(ha);
  };

  const countHandler = (count) => {
    setViewers(count);
  };

  const startLivestream = async () => {
    if (stream && stream.isOpen()) {
      alert("هم اکنون در حال استریم هستید");
    } else {
      if (getItem("Authorization") && getItem("Authorization") !== undefined) {
        await AddParticipant({ userId, isConnected: true }, streamData.id);
      } else {
        await AddGuest(streamData.id);
      }
      setStream(
        new Livestream(
          socket,
          videoEl.current,
          audioEl.current,
          streamData.id,
          (userId && userId !== "") ? userId : socket.socket.id,
          false,
          deleteStream,
          hasVideoHandler,
          hasAudioHandler,
          countHandler
        )
      );
    }
  };

  return (
    <div
      className={`w-screen h-screen  relative overflow-hidden ${
        hasVideo
          ? "text-white"
          : isLive
          ? "text-black bg-low-gray pt-32"
          : "bg-black "
      }`}
      style={{ direction: "rtl" }}
    >
      {isEnded ? (
        <div className="h-full w-full flex flex-col justify-center items-center">
          <div>استریم مورد نظر از طرف استریمر به پایان رسید</div>
        </div>
      ) : (
        <Fragment>
          {isLive ? (
            <Fragment>
              {hasVideo ? (
                <Header positionAbsolute bg="gradient-to-b from-black-50">
                  <div className="kenaret-container">
                    <div className="flex justify-between items-center mx-4 mt-4 mb-2">
                      <div className="flex-1 truncate">
                        {streamData.worldTitle}
                      </div>
                      <div className="flex-1 text-center">پایپ</div>
                      <div className=" flex-1  text-sm">
                        <div className="float-left flex">
                          <div className="bg-black flex justify-center items-center px-2 rounded-xl">
                            <div className="m-0 pt-1">{viewers}</div>
                            <Icon icon={eyeFilled} className="m-0 p-0 mr-2" />
                          </div>
                          <div className="bg-black flex justify-center items-center px-2 rounded-xl mr-2">
                            <div className="m-0 pt-1">LIVE</div>
                            <div className="w-3.5 h-3.5 rounded-full bg-red mr-2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mx-4 ">
                      <div className="text-lg truncate">{streamData.title}</div>
                      <div className="truncate">{streamData.mainQuestion}</div>
                    </div>
                  </div>
                </Header>
              ) : (
                <Header positionAbsolute bg="white" className="text-black">
                  <div className="kenaret-container">
                    <div className="flex justify-between items-center mx-4 mt-4 mb-2">
                      <div className="flex-1 text-lg truncate">
                        {streamData.worldTitle}
                      </div>
                      <div className="flex-1 text-lg text-center">پایپ</div>
                      <div className="flex-1 text-sm">
                        <div className="float-left flex">
                          <div className="text-white bg-lowblack flex justify-center items-center px-2 rounded-xl">
                            <div className="m-0 pt-1">{viewers}</div>
                            <Icon icon={eyeFilled} className="m-0 p-0 mr-2" />
                          </div>
                          <div className="text-white bg-lowblack flex justify-center items-center px-2 rounded-xl mr-2">
                            <div className="m-0 pt-1 ">LIVE</div>
                            <div className="w-3.5 h-3.5 rounded-full bg-red mr-2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mx-4 ">
                      <div className="text-lg font-bold truncate">
                        {streamData.title}
                      </div>
                      <div className="truncate">{streamData.mainQuestion}</div>
                    </div>
                  </div>
                </Header>
              )}

              <Sidebar>
                <div
                  className={`flex flex-col text-center z-10 relative`}
                  style={{ maxWidth: "40px" }}
                >
                  <div
                    className="w-10 h-10 bg-white text-black rounded-full flex justify-center items-center mb-4"
                    onClick={nodesHandler}
                  >
                    <Icon icon={shapeHexagon} className="text-4xl" />
                    {/* <div className="text-sm">گره ها</div> */}
                  </div>
                  <div
                    className="w-10 h-10 bg-white text-black rounded-full flex justify-center items-center mb-4 "
                    onClick={shareHandler}
                  >
                    <Icon icon={shareIcon} className="text-3xl" />
                    {/* <div className="text-sm">اشتراک گذاری</div> */}
                  </div>
                  {hasVideo ? (
                    <div
                      className="relative h-16"
                      onClick={participantsHandler}
                    >
                      <div>
                        <div className="w-10 h-10 bg-cover bg-center rounded-full overflow-hidden absolute bottom-2 z-30">
                          <img
                            src={
                              streamData.streamerAvatarAddress === null
                                ? require("../../Assets/Image/defaultimage.png")
                                    .default
                                : `https://6064645837b7e20018e99fd5.iran.liara.space/avatars/${streamData.streamerAvatarAddress}`
                            }
                            className="w-full h-auto"
                            alt=""
                          />
                        </div>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-cover bg-center rounded-full overflow-hidden absolute bottom-4 z-20 opacity-60">
                          <img
                            src={
                              participants[0]?.avatar === null
                                ? require("../../Assets/Image/defaultimage.png")
                                    .default
                                : `https://6064645837b7e20018e99fd5.iran.liara.space/avatars/${participants[0]?.avatar}`
                            }
                            className="w-full h-auto"
                            alt=""
                          />
                        </div>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-cover bg-center rounded-full overflow-hidden absolute bottom-6 z-10 opacity-30">
                          <img
                            src={
                              participants[1]?.avatar === null
                                ? require("../../Assets/Image/defaultimage.png")
                                    .default
                                : `https://6064645837b7e20018e99fd5.iran.liara.space/avatars/${participants[1]?.avatar}`
                            }
                            className="w-full h-auto"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Sidebar>

              <div
                ref={videoEl}
                style={{ transform: "scaleX(-1)" }}
                className={`${
                  hasVideo ? "h-full w-full" : "h-0 w-0"
                } flex justify-center items-center relative z-0`}
              ></div>
              <div className="h-0 w-0" ref={audioEl}></div>

              {hasVideo ? (
                <div
                  className={`absolute bottom-16 pl-4`}
                  style={{ left: `${leftClass}px` }}
                >
                  <p className="text-sm dir-rtl text-left">لیدر:</p>
                  <p className="text-lg dir-ltr">{`${streamData.streamerFullName}`}</p>
                </div>
              ) : (
                <div className="kenaret-container">
                  <StreamParticipants
                    streamerData={{
                      fullname: streamData.streamerFullName,
                      avatar: streamData.streamerAvatarAddress,
                    }}
                    hasAudio={hasAudio}
                    participants={participants}
                    id={streamData.id}
                  />
                </div>
              )}
            </Fragment>
          ) : (
            <div className="w-screen rounded h-screen text-white bg-black mx-auto">
              <StreamLoading fullScreen />
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    socket: store.socket,
    userId: store.id,
  };
};

export default connect(mapStateToProps)(LivestreamComponent);
