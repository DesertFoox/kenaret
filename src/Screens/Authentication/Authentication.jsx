import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { Icon } from "@iconify/react";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import { Link, useHistory } from "react-router-dom";
import { loginText } from "../../utility/constants";
import { Fragment } from "react";
import { Helmet } from "react-helmet";

import {
  login,
  phoneNumberEntered,
  registerUser,
  decreaseProgressLevel,
  increaseProgressLevel,
} from "../../store/actions/auth";
import {
  setItem,
  getItem,
  clearStorage,
} from "../../Core/Services/Common/storage/storage.service";
import MainLayout from "../../Components/MainLayout/MainLayout";
import Input from "../../Components/UI/Input/Input";
import Header from "../../Components/MainLayout/Header/Header";
import {
  iranianPhoneNumberValidation,
  persianNumbersHandler,
} from "../../utility/iranianPhoneNumber";
import Loading from "../../Components/UI/Loading/Loading";
import AuthorizeApi from "../../Core/Services/Api/AuthApi/AuthoirzeNumber";
import CompareOtp from "../../Core/Services/Api/AuthApi/CompareOtp";
import Register from "../../Core/Services/Api/AuthApi/Register";
import GetUser from "../../Core/Services/Api/User/GetUser";
import PageBackButton from "../../Components/UI/Button/PageBackButton";
import PageNextButton from "../../Components/UI/Button/PageNextButton";
import { errorToast, successToast } from "../../utility/toastSettings";

const Authentication = (props) => {
  const history = useHistory();
  const [pphoneNumber, setPhoneNumber] = useState("");
  const [ootp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [ffirstName, setFirstName] = useState("");
  const [llastName, setLastName] = useState("");
  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [warnings, setWarnings] = useState({
    phoneNumberValidation: [],
    otpValidation: [],
    userInfoValidation: [],
  });

  useEffect(() => {
    if (props.progress === 3) {
      setSuccessfulLogin(true);
      successToast("با موفقیت وارد شدید");
      props.increaseProgressLevel();
      if (history.location.pathname === "/login") {
        history.push("/");
      } else {
        props.toggler();
      }
    }
  }, [props.progres]);

  const headerNextHandler = (e) => {
    switch (props.progress) {
      case 0:
        e.preventDefault();
        return phoneNumberSubmitHandler();
      case 1:
        e.preventDefault();
        return otpSubmitHandler();
      case 2:
        e.preventDefault();

        return userInfoSubmitHandler();
      default:
        break;
    }
    props.increaseProgressLevel();
  };

  const onPhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value.trim());
  };

  const phoneNumberSubmitHandler = async (e) => {
    const phoneNumber = pphoneNumber.trim();
    setPhoneNumber(phoneNumber);
    if (phoneNumber === "")
      setWarnings({ phoneNumberValidation: ["لطفاً تلفن همراه را وارد کنید"] });
    else if (phoneNumber.length <= 13 && phoneNumber.length >= 10) {
      if (iranianPhoneNumberValidation(phoneNumber).length !== 0) {
        setIsLoad(true);
        const PhoneNumberAuthResult = await AuthorizeApi(
          iranianPhoneNumberValidation(phoneNumber)[0]
        );
        setIsLoad(false);
        setPhoneNumber(iranianPhoneNumberValidation(phoneNumber)[0]);
        setOtpCode(`${PhoneNumberAuthResult.result.code}`);
        setIsRegistered(PhoneNumberAuthResult.result.isRegisterCompleted);

        alert("newOtpcode: " + PhoneNumberAuthResult.result.code);
        props.phoneNumberEntered();
      } else {
        setWarnings({
          ...warnings,
          phoneNumberValidation: ["تلفن همراه وارد شده معتبر نیست"],
        });
      }
    } else {
      setWarnings({
        ...warnings,
        phoneNumberValidation: ["تعداد ارقام وارد شده اشتباه است"],
      });
    }
  };

  const onOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const otpSubmitHandler = async (e) => {
    const otp = persianNumbersHandler(ootp.trim());
    setOtp(otp);
    setIsLoad(true);

    if (otp.match(/^\d+$/)) {
      if (otp.length === 5) {
        if (otp === otpCode) {
          const OtpResult = await CompareOtp(otp, pphoneNumber);
          setItem("Authorization", OtpResult.accessToken);
          setItem("refreshToken", OtpResult.refreshToken);
          const user = await GetUser();
          if (user.success) {
            props.login(isRegistered, await user.result);
          } else {
            errorToast("مشکلی پیش امده است دوباره وارد حساب خود شوید");
            history.push("/");
          }
        } else {
          setWarnings({
            ...warnings,
            otpValidation: ["کد اشتباه است"],
          });
        }
      } else {
        setWarnings({
          ...warnings,
          otpValidation: ["تعداد ارقام وارد شده اشتباه است"],
        });
      }
    } else {
      setWarnings({
        ...warnings,
        otpValidation: ["کاراکترهای نامرتبط"],
      });
    }

    setIsLoad(false);
  };

  const onFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const onLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const userInfoSubmitHandler = async (e) => {
    const firstName = ffirstName.trim();
    const lastName = llastName.trim();
    setFirstName(firstName);
    setLastName(lastName);
    let userInfoWarnings = [];
    let valid = true;
    if (firstName === "" || lastName === "") {
      valid = false;
      userInfoWarnings.push("لطفاً همه‌ی قسمت ها را پر کنید");
    } else {
      if (
        !/^[پچجحخهعغآ؟.،آفقثصضشسیبلاتنمکگوئدذرزطظژ!!ؤإأءًٌٍَُِّ a-zA-Z\s]+$/.test(
          firstName
        )
      ) {
        valid = false;
        userInfoWarnings.push("نام معتبر نیست");
      }
      if (
        !/^[پچجحخهعغآ؟.،آفقثصضشسیبلاتنمکگوئدذرزطظژ!!ؤإأءًٌٍَُِّ a-zA-Z\s]+$/.test(
          lastName
        )
      ) {
        valid = false;
        userInfoWarnings.push("نام خانوادگی معتبر نیست");
      }
    }
    if (valid) {
      setIsLoad(true);
      const registerResult = await Register(firstName, lastName);
      clearStorage();
      setItem("Authorization", registerResult.accessToken);
      setItem("refreshToken", registerResult.refreshToken);
      const theUser = await GetUser();
      console.log("user info", theUser);
      props.register(
        theUser.result.firstName,
        theUser.result.lastName,
        theUser.result.phoneNumber,
        theUser.result.username,
        theUser.result.id,
        theUser.result.createDateTime,
        theUser.result.avatar
      );
      setIsLoad(false);

    } else {
      setWarnings({
        ...warnings,
        userInfoValidation: userInfoWarnings,
      });
    }
  };

  const decreaseProgress = (e) => {
    e.preventDefault();
    if (props.progress === 0) {
      if (history.location.pathname === "/login") {
        history.goBack();
      } else {
        props.toggler();
      }
    } else {
      props.decreaseProgressLevel();
    }
  };

  return (
    <MainLayout headerPadding bg="low-gray" text="black" isModal>
      <Helmet>
        <title>کنارت | ورود</title>
      </Helmet>
      <Header positionAbsolute bg="white">
        <div className="kenaret-container">
          <div className="flex justify-between py-4">
            <div>
              <PageBackButton
                className={`bg-transparent text-orange`}
                clicked={(e) => decreaseProgress(e)}
              >
                <Icon icon={chevronRight} />{" "}
                {props.progress === 0 ? "بازگشت" : "قبلی"}
              </PageBackButton>
            </div>
            <h3 className="flex-1 text-center text-lg">{loginText()}</h3>
            <div>
              <PageNextButton
                className="bg-transparent text-orange"
                clicked={(e) => headerNextHandler(e)}
              >
                بعدی <Icon icon={chevronLeft} />
              </PageNextButton>
            </div>
          </div>
          <p className="text-sm text-center">
            وارد شو تا بتونی از همه‌ی امکانات استفاده کنی
          </p>
        </div>
      </Header>

      {isLoad ? (
        <Loading />
      ) : (
        <Fragment>
          <div className="kenaret-container">
            {props.isLoggedIn ? (
              <Fragment>
                {!successfulLogin && (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div>
                      در حال حاضر وارد شده اید و دسترسی به این صفحه ندارید
                    </div>
                    <Link to="/account" className="text-orange">
                      رفتن به بخش مدیریت حساب کاربری
                    </Link>
                  </div>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {props.progress === 0 ? (
                  <div className="flex flex-col space-y-5 w-full place-content-center place-items-center">
                    <form
                      className="w-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        phoneNumberSubmitHandler();
                      }}
                    >
                      <div className="overflow-hidden px-5 flex flex-col w-full">
                        <Input
                          placeholder="مثلا 09123456789"
                          onChange={(e) => onPhoneNumberChange(e)}
                          label="شماره تلفن همراه"
                          type="text"
                          value={pphoneNumber}
                          warnings={warnings.phoneNumberValidation}
                          number
                          autoFocus={props.progress === 0 ? true : false}
                        />
                      </div>
                    </form>
                  </div>
                ) : null}
                {props.progress === 1 ? (
                  <div className="flex flex-col space-y-5 w-full place-content-center place-items-center">
                    <form
                      className="w-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        otpSubmitHandler();
                      }}
                    >
                      <div className="overflow-hidden px-5 flex flex-col w-full">
                        <Input
                          placeholder="مثلا 12345"
                          onChange={(e) => onOtpChange(e)}
                          label="کد فعالسازی"
                          type="text"
                          value={ootp}
                          warnings={warnings.otpValidation}
                          number
                          autoFocus={props.progress === 1 ? true : false}
                        />
                      </div>
                    </form>
                  </div>
                ) : null}
                {props.progress === 2 ? (
                  <div className="flex flex-col space-y-2 pb-2 w-full  place-content-center place-items-center">
                    <form
                      className="w-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        userInfoSubmitHandler();
                      }}
                    >
                      <div className="overflow-hidden flex px-5 space-y-1 flex-col w-full">
                        <Input
                          placeholder="نام"
                          onChange={(e) => onFirstNameChange(e)}
                          type="fname"
                          label="نام"
                          value={ffirstName}
                          autoFocus={props.progress === 2 ? true : false}
                        />
                        <Input
                          placeholder="نام‌خانوادگی"
                          onChange={(e) => onLastNameChange(e)}
                          type="lname"
                          label="نام خانوادگی"
                          value={llastName}
                          warnings={warnings.userInfoValidation}
                        />
                      </div>
                    </form>
                  </div>
                ) : null}
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </MainLayout>
  );
};

const mapStateToProps = (store) => {
  return {
    progress: store.progress,
    isLoggedIn: store.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (isRegister, user) => dispatch(login(isRegister, user)),
    phoneNumberEntered: () => dispatch(phoneNumberEntered()),
    increaseProgressLevel: () => dispatch(increaseProgressLevel()),
    decreaseProgressLevel: () => dispatch(decreaseProgressLevel()),
    register: (
      firstName,
      lastName,
      phoneNumber,
      username,
      id,
      createDateTime,
      avatar
    ) =>
      dispatch(
        registerUser(
          firstName,
          lastName,
          phoneNumber,
          username,
          id,
          createDateTime,
          avatar
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
