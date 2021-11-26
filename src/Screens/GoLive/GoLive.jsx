import React, { Fragment, useState } from "react";
import { Icon } from "@iconify/react";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import micIcon from "@iconify/icons-bi/mic";
import micMute from "@iconify/icons-bi/mic-mute";
import cameraVideo from "@iconify/icons-bi/camera-video";
import cameraVideoOff from "@iconify/icons-bi/camera-video-off";
import { useHistory } from "react-router";

import MainLayout from "../../Components/MainLayout/MainLayout";
import Header from "../../Components/MainLayout/Header/Header";
import Worlds from "./Worlds";
import Links from "./Links";
import TextArea from "../../Components/UI/Input/TextArea";
import Broadcast from "../Livestream/Broadcast";
import { goLiveText, goLiveDes } from "../../utility/constants";

import CreateLive from "../../Core/Services/Api/LiveApi/CreateLive";
import Loading from "../../Components/UI/Loading/Loading";
import { getItem } from "../../Core/Services/Common/storage/storage.service";
import { Helmet } from "react-helmet";
import PageBackButton from "../../Components/UI/Button/PageBackButton";
import PageNextButton from "../../Components/UI/Button/PageNextButton";
import { useEffect } from "react";
import RefreshToken from "../../Core/Services/Api/AuthApi/refreshToken";

const GoLive = ({ toggler }) => {
  const isAuthenticated = getItem("Authorization");
  const history = useHistory();

  const [state, setState] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [world, setWorld] = useState({});
  const [links, setLinks] = useState([]);
  const [configs, setConfigs] = useState({ mic: true, video: true });
  const [isLoad, setIsLoad] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [broadcastData, setBroadcastData] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const worldsHandler = () => setState(1);
  const linksHandler = () => setState(2);
  const mainHandler = () => setState(0);

  const endBroadcast = () => {
    setIsLive(false);
    setBroadcastData(null);
  };

  // useEffect(() => {
  //   RefreshToken(getItem("Authorization"),getItem("refreshToken"));
  //   // RefreshToken("egerg", "ergerg", () => {
  //   //   history.push("/login")
  //   // });
  // }, []);

  const goLive = async () => {
    let goLiveWarnings = [];
    let valid = true;
    if (title === "" || description === "" || world === {}) {
      valid = false;
      goLiveWarnings.push("لطفاً همه‌ی قسمت ها را پر کنید");
    }
    if (valid) {
      const streamData = {
        title: title.trim(),
        mainQuestion: description.trim(),
        worldId: world.id,
        links,
      };
      setIsLoad(true);
      const createBroadcastResult = await CreateLive(streamData);
      setIsLoad(false);
      if (createBroadcastResult.success) {
        const result = createBroadcastResult.result;
        if (result.id !== undefined && (configs.mic || configs.video)) {
          console.log("beginning broadcast: ", result);
          setBroadcastData(result);
          setIsLive(true);
        } else if (!configs.mic || !configs.video) {
          alert("باید حداقل با ویدیو یا صدای باز استریم را شروع کنید");
        }
      } else {
        setWarnings(createBroadcastResult.error);
      }
    } else {
      setWarnings(goLiveWarnings);
    }
    // SendLinkToLive(Links, result.id);
  };
  const mainComponentClass = state === 0 ? "left-0" : "left-full";
  const worldsComponentClass = state === 1 ? "right-0" : "right-full";
  const linksComponentClass = state === 2 ? "right-0" : "right-full";

  const urlChange = (e, index) => {
    let prevLinks = [...links];
    prevLinks[index].url = e;
    setLinks(prevLinks);
  };
  const titleChange = (e, index) => {
    let prevLinks = [...links];
    prevLinks[index].description = e;
    setLinks(prevLinks);
  };
  const deleteLink = async (index) => {
    try {
      let prevLinks = [...links];
      prevLinks.splice(index, 1);

      setLinks(prevLinks);
    } catch (err) {
      console.log(err);
    }
  };
  const addLink = (title, url) => {
    let prevLinks = [...links];
    prevLinks.push({ description: title, url });
    setLinks(prevLinks);
  };

  return (
    <Fragment>
      {isLive ? (
        <Fragment>
          <Helmet>
            <title>کنارت | در حال استریم</title>
          </Helmet>
          <Broadcast
            mediaInputs={configs}
            streamData={broadcastData}
            scrollableParticipants
            endBroadcast={endBroadcast}
          />
        </Fragment>
      ) : (
        <Fragment>
          <Helmet>
            <title>کنارت | پخش استریم</title>
          </Helmet>
          <MainLayout
            headerPadding
            bg="low-gray"
            text="black"
            className={mainComponentClass}
          >
            <Header bg="white">
              <div className="kenaret-container">
                <div className="flex justify-between py-4 items-center">
                  <PageBackButton
                    className="bg-transparent font-bold  text-orange"
                    clicked={() => history.goBack()}
                  >
                    <Icon icon={chevronRight} /> بازگشت
                  </PageBackButton>
                  <h3 className="flex-1 text-center text-lg">{goLiveText()}</h3>
                  <PageNextButton
                    className="bg-orange font-bold rounded text-white px-2"
                    clicked={() => goLive()}
                    disabled={!isAuthenticated}
                  >
                    پخش زنده <Icon icon={chevronLeft} />
                  </PageNextButton>
                </div>
                <p className="text-sm text-center truncate">{goLiveDes()}</p>
              </div>
            </Header>

            {isLoad && <Loading />}
            <Fragment>
              <div className="kenaret-container">
                <div className="text-sm flex flex-col space-y-2 pb-16 w-full  place-content-center place-items-center">
                  <div className="overflow-hidden flex px-5 space-y-2 flex-col w-full">
                    <div
                      className="flex justify-between bg-white px-2 py-2 rounded cursor-pointer"
                      onClick={worldsHandler}
                    >
                      <p>منبع</p>
                      <p className={world.title ? "text-navy" : "opacity-50"}>
                        {world.title || "منبع استریم خود را انتخاب کنید"}{" "}
                        <Icon
                          icon={chevronLeft}
                          className="text-xl text-orange inline"
                        />
                      </p>
                    </div>
                    <TextArea
                      placeholder="عنوان استریم خود را بنویسید"
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      label="عنوان"
                      value={title}
                      labelSize={32}
                      inputDir="ltr"
                    />
                    <TextArea
                      placeholder="موضوع استریم"
                      onChange={(e) => setDescription(e.target.value)}
                      type="text"
                      label="توضیحات"
                      value={description}
                      labelSize={32}
                      inputDir="ltr"
                    />
                    <div
                      className="flex bg-white px-2 py-2 rounded justify-between mb-2 cursor-pointer"
                      onClick={linksHandler}
                    >
                      <p>گره ها</p>
                      <p
                        className={
                          links.length !== 0 ? "text-navy" : "opacity-50"
                        }
                      >
                        {links.length === 0
                          ? "گره های لایو خود را انتخاب کنید"
                          : `${links.length} گره`}
                        <Icon
                          icon={chevronLeft}
                          className="text-xl text-orange inline"
                        />
                      </p>
                    </div>
                    <div className="flex bg-white px-2 py-2 rounded justify-between mb-2">
                      <p>تنظیمات</p>
                      <div
                        className="flex text-xl space-x-3"
                        style={{ direction: "ltr" }}
                      >
                        <div
                          onClick={() =>
                            setConfigs({ ...configs, mic: !configs.mic })
                          }
                        >
                          {configs.mic ? (
                            <Icon icon={micIcon} />
                          ) : (
                            <Icon icon={micMute} />
                          )}
                        </div>
                        <div
                          onClick={() =>
                            setConfigs({ ...configs, video: !configs.video })
                          }
                        >
                          {configs.video ? (
                            <Icon icon={cameraVideo} />
                          ) : (
                            <Icon icon={cameraVideoOff} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          </MainLayout>
          <Worlds
            className={worldsComponentClass}
            close={mainHandler}
            worldSelected={(w) => setWorld(w)}
          />
          <Links
            className={linksComponentClass}
            close={mainHandler}
            links={links}
            urlChange={urlChange}
            titleChange={titleChange}
            deleteLink={deleteLink}
            addLink={addLink}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default GoLive;
