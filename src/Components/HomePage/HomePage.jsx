import React, { useEffect, useState, Fragment } from "react";
import Slider from "react-slick";
import { useHistory, useParams } from "react-router";
import { Icon } from "@iconify/react";
import live24Filled from "@iconify/icons-fluent/live-24-filled";

import GetLiveStreams from "../../Core/Services/Api/LiveApi/GetLivestreams";
import GetStreamNodes from "../../Core/Services/Api/SingleStreamApi/GetStreamNodes";
import GetStreamParticipants from "../../Core/Services/Api/SingleStreamApi/GetStreamParticipants";
import Livestream from "../../Screens/Livestream/Livestream";
import StreamNodes from "../../Screens/Livestream/StreamNodes";
import StreamParticipants from "../../Screens/Livestream/StreamParticipants";
import StreamShare from "../../Screens/Livestream/StreamShare";
import GetSingleLivestream from "../../Core/Services/Api/LiveApi/GetSingleLivestream";

import Loading from "../UI/Loading/Loading";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Drawer from "../MainLayout/Drawer/Drawer";
import { errorToast, warnToast } from "../../utility/toastSettings";
import { Link } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import Header from "../MainLayout/Header/Header";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { setSocket } from "../../store/actions/auth";

const HomePage = ({ username }) => {
  const [onlineLivestreams, setOnlineLivestreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [nodesShow, setNodesShow] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [participantsShow, setParticipantsShow] = useState(false);
  const [shareShow, setShareShow] = useState(false);
  const [drawerShow, setDrawerShow] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const { streamId } = useParams();
  const history = useHistory();

  const getStreamParticipants = async (id) => {
    const result = await GetStreamParticipants(id);
    if (result.success) {
      const streamParticipants = result.result;
      setParticipants(streamParticipants);
    } else {
      errorToast(result.error);
    }
  };

  useEffect(() => {
    if (streamId) {
      console.log("streamId: " + streamId);
      getSingleLivestream(streamId);
    } else {
      getLiveStreams();
    }
    if (!window.mozRTCPeerConnection)
      warnToast("لطفا webRtc مرورگر خود را فعال کنید");
  }, []);

  useEffect(() => {

    setNodes([{ loading: true }]);
    setParticipants([{ loading: true }]);
    if (onlineLivestreams.length !== 0) {
      history.push(`${onlineLivestreams[sliderIndex].id}`);
      if (username === onlineLivestreams[sliderIndex].streamerUsername) {
        errorToast("نمی‌توانید به استریم خودتان وارد شوید.");
      }
      getStreamNodes(onlineLivestreams[sliderIndex].id);
      getStreamParticipants(onlineLivestreams[sliderIndex].id);
    }
    if (sliderIndex === onlineLivestreams.length - 2) {
      updateLiveStreams();
    }
  }, [sliderIndex]);

  const updateLiveStreams = async () => {
    const result = await GetLiveStreams(pageNumber + 1);
    if (result.success) {
      const liveStreams = result.result;
      if (liveStreams.length > 0) {
        setOnlineLivestreams([...onlineLivestreams, ...liveStreams]);
        setPageNumber(pageNumber + 1);
      }
    } else {
      errorToast(result.error);
    }
  };

  const getSingleLivestream = async (id) => {
    console.log("getSingleLivestream called");
    setLoading(true);
    const result = await GetSingleLivestream(id);
    if (result.success) {
      const livestream = result.result;
      console.log("the livestream:", livestream);
      setOnlineLivestreams([livestream]);
      getStreamNodes(livestream.id);
      getStreamParticipants(streamId);
    } else {
      errorToast(result.error);
    }
    setLoading(false);
  };

  const getLiveStreams = async () => {
    setLoading(true);
    const liveStreams = await GetLiveStreams(pageNumber);
    if (liveStreams.success) {
      setOnlineLivestreams(liveStreams.result);
      if (liveStreams.result.length !== 0) {
        getStreamNodes(liveStreams.result[0].id);
        getStreamParticipants(liveStreams.result[0].id);
        history.push(`${liveStreams.result[0].id}`);
        setLoading(false);
      } else {
        errorToast(liveStreams.error);
      }
    }
    setLoading(false);
  };

  const getStreamNodes = async (id) => {
    const streamNodesResult = await GetStreamNodes(id);
    if (streamNodesResult.success) {
      const streamNodes = streamNodesResult.result;
      setNodes(streamNodes);
    } else {
      errorToast(streamNodesResult.error);
    }
    // const theStream = await GetSingleLivestream(id);
    // setNodes(theStream.links);
  };
  // const getStreamParticipants = async (id) => {
  //   const streamParticipants = await GetStreamParticipants(id);
  //   setParticipants(streamParticipants);
  // };

  const drawerClose = () => {
    setDrawerShow(false);
    setNodesShow(false);
    setShareShow(false);
    setParticipantsShow(false);
  };

  const sliderSettings = {
    arrows: false,
    dots: false,
    fade: false,
    infinite: false,
    vertical: true,
    verticalSwiping: true,
    slidesToScroll: 1,
    afterChange: (index) => {
      setSliderIndex(index);
    },
  };

  return (
    <div className="w-screen rounded h-screen bg-black mx-auto">
      <Helmet>
        <title>
          کنارت |{" "}
          {onlineLivestreams.length === 1
            ? onlineLivestreams[0].title
            : "صفحه اصلی"}
        </title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          {onlineLivestreams.length !== 0 ? (
            <Fragment>
              {onlineLivestreams.length > 1 ? (
                <Slider {...sliderSettings}>
                  {onlineLivestreams.map((stream, index) => (
                    <Livestream
                      isLive={
                        index === sliderIndex &&
                        username !== stream.streamerUsername
                          ? true
                          : false
                      }
                      participants={participants}
                      key={stream.id}
                      data={stream}
                      nodesHandler={() => {
                        drawerClose();
                        setNodesShow(true);
                        setDrawerShow(true);
                      }}
                      participantsHandler={() => {
                        drawerClose();
                        setParticipantsShow(true);
                        setDrawerShow(true);
                      }}
                      shareHandler={() => {
                        drawerClose();
                        setShareShow(true);
                        setDrawerShow(true);
                      }}
                    />
                  ))}
                </Slider>
              ) : (
                <Fragment>
                  <Livestream
                    isLive={true}
                    scrollableParticipants
                    participants={participants}
                    key={onlineLivestreams[0].id}
                    data={onlineLivestreams[0]}
                    nodesHandler={() => {
                      drawerClose();
                      setNodesShow(true);
                      setDrawerShow(true);
                    }}
                    participantsHandler={() => {
                      drawerClose();
                      setParticipantsShow(true);
                      setDrawerShow(true);
                    }}
                    shareHandler={() => {
                      drawerClose();
                      setShareShow(true);
                      setDrawerShow(true);
                    }}
                  />
                </Fragment>
              )}
            </Fragment>
          ) : (
            <MainLayout headerPadding bg="low-gray" text="black">
              <Header bg="white">
                <div className="kenaret-container">
                  <div className="flex select-none justify-center py-4">
                    <h3 className="text-lg">مسیر</h3>
                  </div>
                  <p className="text-sm select-none text-center">
                    اینجا میتونی استریم هایی در رابطه با منبع موردنظرت ببینی
                  </p>
                </div>
              </Header>
              <div className="h-full select-none space-y-4 flex justify-center items-center flex-col kenaret-container">
                <Icon icon={live24Filled} className="text-8xl" />
                <div>
                  در حال حاضر در این مسیر استریم زنده ای نیست.
                  <br />
                  اولین نفری باش که توی این مسیر استریم میکنه!
                </div>
                <Link to="/broadcast" className="text-orange">
                  پخش استریم
                </Link>
              </div>
            </MainLayout>
          )}
        </Fragment>
      )}

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
                username: onlineLivestreams[sliderIndex].streamerUsername,
                avatar: onlineLivestreams[sliderIndex].streamerUsername,
              }}
              id={onlineLivestreams[sliderIndex].id}
            />
          )}
          {shareShow && <StreamShare id={onlineLivestreams[sliderIndex].id} />}
        </div>
      </Drawer>
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    username: store.username,
  };
};

export default connect(mapStateToProps)(HomePage);
