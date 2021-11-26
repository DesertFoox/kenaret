import React, { useState, useRef, Fragment, useEffect } from "react";
import { Icon } from "@iconify/react";
import micMute from "@iconify/icons-bi/mic-mute";
import eyeFilled from "@iconify-icons/ant-design/eye-filled";
import shapeHexagon from "@iconify/icons-gg/shape-hexagon";
import shareIcon from "@iconify/icons-fa-solid/share";

import Header from "../../Components/MainLayout/Header/Header";
import Sidebar from "../../Components/MainLayout/Sidebar/Sidebar";
import StreamParticipants from "./StreamParticipants";
import StreamShare from "./StreamShare";
import StreamNodes from "./StreamNodes";
import Broadcast from "../../classes/Broadcast";
import GetStreamNodes from "../../Core/Services/Api/SingleStreamApi/GetStreamNodes";
import GetStreamParticipants from "../../Core/Services/Api/SingleStreamApi/GetStreamParticipants";
import { Player } from "video-react";

import { mediaTypes } from "../../utility/mediasoupConfigs";
import { getItem } from "../../Core/Services/Common/storage/storage.service";
import Footer from "../../Components/MainLayout/Footer/Footer";
import { connect } from "react-redux";
import Drawer from "../../Components/MainLayout/Drawer/Drawer";
import { errorToast } from "../../utility/toastSettings";
const BroadcastComponent = ({
  mediaInputs,
  streamData,
  scrollableParticipants,
  endBroadcast,
  socket,
  userId,
}) => {
  const [broadcast, setBroadcast] = useState(null);
  const [viewers, setViewers] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [mic, setMic] = useState();
  const [camera, setCamera] = useState();
  const [nodes, setNodes] = useState([]);
  const [nodesShow, setNodesShow] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantsShow, setParticipantsShow] = useState(false);
  const [shareShow, setShareShow] = useState(false);
  const [drawerShow, setDrawerShow] = useState(false);

  const mediaEl = useRef();

  useEffect(() => {
    startLiveBroadcast();
    getBroadcastData();
    setMic(mediaInputs.mic);
    setCamera(mediaInputs.video);
  }, []);

  const micToggler = () => {
    setMic(!mic);
    if (mic) {
      broadcast.pauseProducer(mediaTypes.audio);
    } else {
      broadcast.resumeProducer(mediaTypes.audio);
    }
  };
  const cameraToggler = () => {
    if (camera) {
      console.log("ss" + camera);
      broadcast.pauseProducer(mediaTypes.video);
    } else {
      broadcast.resumeProducer(mediaTypes.video);
    }
    setCamera(!camera);
  };

  const startLiveBroadcast = () => {
    if (broadcast && broadcast.isOpen()) {
      alert("هم اکنون در حال استریم هستید");
    } else {
      const accessToken = getItem("Authorization");
      const refreshToken = getItem("refreshToken");
      setBroadcast(
        new Broadcast(
          socket,
          streamData.id,
          mediaEl.current,
          mediaInputs.mic,
          mediaInputs.video,
          streamData.title,
          userId,
          true,
          deleteStream,
          hasVideoHandler,
          hasAudioHandler,
          countHandler,
          accessToken,
          refreshToken
        )
      );
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

  const deleteStream = () => {
    setBroadcast(null);
    endBroadcast();
  };

  const getBroadcastData = async () => {
    await getStreamNodes(streamData.id);
    await getStreamParticipants(streamData.id);
  };

  const getStreamNodes = async (id) => {
    const streamNodes = await GetStreamNodes(id);
    if (streamNodes.success) {
      setNodes(streamNodes.result);
    } else {
      errorToast("خطا در دریافت گره ها");
    }
  };
  const getStreamParticipants = async (id) => {
    const streamParticipants = await GetStreamParticipants(id);
    if (streamParticipants.success) {
      setParticipants(streamParticipants.result);
    } else {
      console.log(streamParticipants.error);
    }
  };

  const exitBroadcast = () => {
    if (broadcast) {
      broadcast.exit();
    }
  };

  const drawerClose = () => {
    setDrawerShow(false);
    setNodesShow(false);
    setShareShow(false);
    setParticipantsShow(false);
  };

  const nodesHandler = () => {
    drawerClose();
    setNodesShow(true);
    setDrawerShow(true);
  };
  const participantsHandler = () => {
    drawerClose();
    setParticipantsShow(true);
    setDrawerShow(true);
  };
  const shareHandler = () => {
    drawerClose();
    setShareShow(true);
    setDrawerShow(true);
  };

  return (
    <div
      className={`w-screen h-screen relative overflow-hidden ${
        hasVideo ? "text-white" : "text-black bg-low-gray pt-32"
      }`}
      style={{ direction: "rtl" }}
    >
      {hasVideo ? (
        <Header positionAbsolute bg="gradient-to-b from-black-50">
          <div className="kenaret-container">
            <div className="flex justify-between items-center mx-4 mt-4 mb-2">
              <div className="flex truncate">{streamData.worldTitle}</div>
              <div className="flex-1 text-center">پایپ</div>
              <div className="flex-1 text-sm">
                <div className="flex float-left">
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
                  <div className="text-white bg-black flex justify-center items-center px-2 rounded-xl">
                    <div className="m-0 pt-1">{viewers}</div>
                    <Icon icon={eyeFilled} className="m-0 p-0 mr-2" />
                  </div>
                  <div className="text-white bg-black flex justify-center items-center px-2 rounded-xl mr-2">
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

      <div
        ref={mediaEl}
        style={{ transform: "scaleX(-1)" }}
        className={`${
          hasVideo ? "h-full w-full" : "h-0 w-0"
        } flex justify-center items-center`}
      >
        <Player
          playsInline
          poster="/assets/poster.png"
        />
      </div>
      <div>
        {hasVideo ? (
          <Fragment>
            <div className="flex items-center absolute left-0 bottom-16 pl-4">
              <div className="">
                <p className="text-sm dir-rtl text-left">لیدر:</p>
                <p className="dir-ltr">{`${streamData.streamerFullName}`}</p>
              </div>
              {hasAudio === false && (
                <div className="w-8 h-8 rounded bg-red text-white flex justify-center items-center mx-2">
                  <Icon icon={micMute} className="text-lg" />
                </div>
              )}
            </div>
          </Fragment>
        ) : (
          <div className="kenaret-container">
            <StreamParticipants
              streamerData={{
                username: streamData.streamerFullName,
                avatar: streamData.streamerAvatarAddress,
              }}
              hasAudio={hasAudio}
              participants={participants}
              id={streamData.id}
            />
          </div>
        )}
      </div>

      <Sidebar>
        <div
          className={`flex flex-col text-center`}
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
            className="w-10 h-10 bg-white text-black rounded-full flex justify-center items-center mb-4"
            onClick={shareHandler}
          >
            <Icon icon={shareIcon} className="text-3xl" />
            {/* <div className="text-sm">اشتراک گذاری</div> */}
          </div>
          {hasVideo ? (
            <div className="relative h-16" onClick={participantsHandler}>
              <div>
                <div className="w-10 h-10 bg-cover bg-center rounded-full overflow-hidden absolute bottom-2 z-30">
                  <img
                    src={
                      streamData.streamerAvatarAddress === null
                        ? require("../../Assets/Image/defaultimage.png").default
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
                        ? require("../../Assets/Image/defaultimage.png").default
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
                        ? require("../../Assets/Image/defaultimage.png").default
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

      <Footer
        isBroadcast
        micToggler={micToggler}
        videoToggler={cameraToggler}
        endBroadcast={exitBroadcast}
        hasAudio={mic}
        hasVideo={camera}
      />

      <Drawer show={drawerShow} close={drawerClose}>
        <div className="flex justify-center align-center w-full pt-2 mb-4 font-bold">
          {nodesShow && "گره ها"}
          {participantsShow && "شرکت کننده ها"}
          {shareShow && "اشتراک گذاری"}
        </div>
        <div className="w-full">
          {nodesShow && <StreamNodes nodes={nodes} />}
          {participantsShow && (
            <StreamParticipants
              scrollable
              participants={participants}
              streamerData={{
                fullname: streamData.streamerFullName,
                avatar: streamData.streamerAvatarAddress,
              }}
              hasAudio={hasAudio}
              id={streamData.id}
            />
          )}
          {shareShow && <StreamShare id={streamData.id} />}
        </div>
      </Drawer>
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    socket: store.socket,
    userId: store.id,
  };
};

export default connect(mapStateToProps)(BroadcastComponent);
