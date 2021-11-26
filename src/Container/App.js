import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import {
  getItem,
  removeItem,
} from "../Core/Services/Common/storage/storage.service";
import UnAuthenticationApp from "../App/UnAuthenticationApp";
import AuthenticationApp from "../App/AuthenticationApp/index";
import Footer from "../Components/MainLayout/Footer/Footer";
import GetUser from "../Core/Services/Api/User/GetUser";
import { connect } from "react-redux";
import { login, setSocket } from "../store/actions/auth";
import Loading from "../Components/UI/Loading/Loading";
import { MyToastContainer } from "../utility/toastSettings";
import { Fragment } from "react";
import Socket from "socket.io-client";
import { MySocket, serverURL } from "../utility/mediasoupConfigs";
import CheckConnectivity from "../Screens/CheckConnectivity";

const App = ({ logIn, isLoggedIn, setSocketIO }) => {
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const history = useHistory();

  useEffect(() => {
    initGlobalSockets();
    console.log(
      "can login?:",
      getItem("Authorization") && getItem("Authorization") !== "undefined"
    );
    if (getItem("Authorization") && getItem("Authorization") !== "undefined") {
      loadUserData();
    } else if (getItem("Authorization") === "undefined") {
      alert("Authorization", getItem("Authorization"));
      removeItem("Authorization");
      removeItem("refreshToken");
    }

    if (!navigator.onLine) {
      setIsOffline(true);
    }
    window.addEventListener('offline', () => setIsOffline(true));
    window.addEventListener('online', () => setIsOffline(false));
  }, []);

  const initGlobalSockets = () => {
    const socket = Socket(serverURL);
    const theSocket = new MySocket(socket);
    setLoading(true);
    setSocketIO(theSocket);
    socket.emit("init");
    theSocket.socket.on("connect", () => {
      setLoading(false);
    });
    setTimeout(() => {
      if (!theSocket.socket.connected) {
        setLoading(false);
        setIsOffline(true);
      }
    }, 30000)
  };

  const loadUserData = async () => {
    setLoading(true);
    const userResponse = await GetUser();
    if (userResponse.success) {
      logIn(true, userResponse.result);
    }
    setLoading(false);
  };

  if (history.location.pathname === "/") {
    history.push("/e-commerce/pipes/");
  }

  return (
    <div className="App bg-black min-h-screen text-white">
      {loading ? (
        <Loading loading={loading} fullScreen text="در حال اتصال به سرور" />
      ) : (
        <Fragment>
          <Footer />

          {isOffline ? (
            <CheckConnectivity />
          ) : (
            <Fragment>
              {isLoggedIn || getItem("Authorization") ? (
                <AuthenticationApp />
              ) : (
                <UnAuthenticationApp />
              )}
            </Fragment>
          )}
          <MyToastContainer />
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    isLoggedIn: store.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (isRegister, user) => dispatch(login(isRegister, user)),
    setSocketIO: (socket) => dispatch(setSocket(socket)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
