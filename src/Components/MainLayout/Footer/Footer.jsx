import React, { Fragment, useEffect, useState } from "react";
import FooterButton from "./FooterButton";
import { connect } from "react-redux";
import channelShare12Regular from "@iconify/icons-fluent/channel-share-12-regular";
import accessPoint from "@iconify-icons/mdi/access-point";
import roundLogin from "@iconify/icons-ic/round-login";
import cameraVideo from "@iconify/icons-bi/camera-video";
import hangupIcon from "@iconify/icons-raphael/hangup";
import micIcon from "@iconify/icons-bi/mic";
import micMute from "@iconify/icons-bi/mic-mute";
import cameraVideoOff from "@iconify/icons-bi/camera-video-off";
import { NavLink, useHistory } from "react-router-dom";
import profileIcon from "@iconify/icons-gg/profile";

import { logout } from "../../../store/actions/auth";
import Authentication from "../../../Screens/Authentication/Authentication";
import Account from "../../../Container/Account";

const Footer = ({
  isLoggedIn,
  progress,
  isBroadcast,
  videoToggler,
  hasVideo,
  micToggler,
  hasAudio,
  endBroadcast,
}) => {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [accountModalShow, setAccountModalShow] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authsection, setAuthsection] = useState(false);
  const [goLiveSection, setGoLiveSection] = useState(false);
  const [liveSection, setLivesSection] = useState(false);

  const history = useHistory();

  const loginHnadler = () => {
    if (!isLoggedIn) setLoginModalShow(!loginModalShow);
    if (history.location.pathname === "/broadcast") {
      setAuthsection(false);
      setLivesSection(false);
      setGoLiveSection(true);
    } else {
      setAuthsection(false);
      setLivesSection(true);
      setGoLiveSection(false);
    }
  };

  const closeAllModals = () => {
    setLoginModalShow(false);
    setAccountModalShow(false);
  };

  const accountHandler = () => {
    setAccountModalShow(!accountModalShow);
    if (history.location.pathname === "/broadcast") {
      console.log("account button clicked");
      setAuthsection(false);
      setLivesSection(false);
      setGoLiveSection(true);
    } else {
      console.log("account button clicked");
      setAuthsection(false);
      setLivesSection(true);
      setGoLiveSection(false);
    }
  };

  useEffect(() => {
    if (
      history.location.pathname === "/login" ||
      history.location.pathname === "/account"
    ) {
      setAuthsection(true);
    } else if (history.location.pathname === "/broadcast") {
      setGoLiveSection(true);
    } else {
      setLivesSection(true);
    }
  }, []);

  useEffect(() => {
    if (progress === 3) {
      setTimeout(() => {
        setLoginModalShow(false);
      }, 2000);
    }
  }, [progress]);

  return (
    <Fragment>
      {isBroadcast ? (
        <Fragment>
          <div className="h-12 bg-black text-white z-40  fixed bottom-0 w-full text-2xl">
            <div className="kenaret-container flex justify-around items-center">
              <FooterButton
                theIcon={hasAudio ? micIcon : micMute}
                onClick={() => micToggler()}
              />
              <FooterButton
                theIcon={hangupIcon}
                className="text-orange"
                onClick={() => endBroadcast()}
              />
              <FooterButton
                onClick={() => videoToggler()}
                theIcon={hasVideo ? cameraVideo : cameraVideoOff}
                active
              />
            </div>
          </div>
          {loginModalShow && <Authentication />}
          {accountModalShow && <Account toggler={accountHandler} />}
        </Fragment>
      ) : (
        <Fragment>
          <div className="h-12 bg-black text-white z-40 fixed bottom-0 w-full text-2xl">
            <div className="kenaret-container flex justify-around items-center ">
              <div className="flex-1 h-full">
                {isLoggedIn ? (
                  <NavLink activeClassName="text-orange" to="/account">
                    <FooterButton
                      styles={authsection && true}
                      theIcon={profileIcon}
                    />
                  </NavLink>
                ) : (
                  <NavLink activeClassName="text-orange" to="/login">
                    <FooterButton
                      styles={authsection && true}
                      theIcon={roundLogin}
                    />
                  </NavLink>
                )}
              </div>
              <div className="flex-1 h-full">
                <NavLink activeClassName="text-orange" to="/broadcast">
                  <FooterButton
                    styles={goLiveSection && true}
                    theIcon={accessPoint}
                  />
                </NavLink>
              </div>
              <div className="flex-1 h-full">
                <NavLink activeClassName="text-orange" to="/main/e-commerce/pipes/">
                  <FooterButton
                    theIcon={channelShare12Regular}
                    active
                  />
                </NavLink>
              </div>
            </div>
          </div>
          {loginModalShow && <Authentication toggler={loginHnadler} />}
          {accountModalShow && <Account toggler={accountHandler} />}
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (store) => {
  return {
    progress: store.progress,
    isLoggedIn: store.isLoggedIn,
    firstName: store.firstName,
    lastName: store.lastName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
