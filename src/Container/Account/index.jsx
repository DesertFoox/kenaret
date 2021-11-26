import React, { Fragment, useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import { FaCheckCircle } from "react-icons/fa";
import Cropper from "react-cropper";
import imageCompression from "browser-image-compression";
import LazyLoad from "react-lazyload";

import { successToast } from "../../utility/toastSettings";
import "cropperjs/dist/cropper.css";
import Header from "../../Components/MainLayout/Header/Header";
import MainLayout from "../../Components/MainLayout/MainLayout";
import { accountText } from "../../utility/constants";
import Button from "../../Components/UI/Button/Button";
import Loading from "../../Components/UI/Loading/Loading";

import GetUser from "../../Core/Services/Api/User/GetUser";
import UpdateUser from "../../Core/Services/Api/User/UpdateUser";
import {
  getItem,
  setItem,
  clearStorage,
} from "../../Core/Services/Common/storage/storage.service";
import { logout, updateUserData } from "../../store/actions/auth";
import Input from "../../Components/UI/Input/Input";
import { Helmet } from "react-helmet";
import PageBackButton from "../../Components/UI/Button/PageBackButton";
import PageNextButton from "../../Components/UI/Button/PageNextButton";
import { Link } from "react-router-dom";

const AccountInfo = ({
  firstName,
  lastName,
  username,
  phoneNumber,
  aavatar,
  userLogout,
  toggler,
  isLoggedIn,
  updateData,
}) => {
  let history = useHistory();

  const cropperRef = useRef(null);
  const imageRef = useRef(null);
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState(null);

  const [successfullLogout, setSuccessfullLogout] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [showCropImage, setShowCropImage] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [uusername, setUserName] = useState("");
  const [ffirstName, setFirstName] = useState("");
  const [llastName, setLastName] = useState("");
  const [pphoneNumber, setPhonenumber] = useState("");
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (successfullLogout) {
      setTimeout(() => {
        setSuccessfullLogout(false);
        if (history.location.pathname === "/account") {
          history.push("/");
        } else {
          toggler();
        }
        userLogout();
      }, 1000);
    }
  }, [successfullLogout]);

  const goBack = () => {
    if (history.location.pathname === "/account") {
      history.goBack();
    } else {
      toggler();
    }
  };

  useEffect(() => {
    setUserName(username);
    setFirstName(firstName);
    setLastName(lastName);
    setPhonenumber(phoneNumber);
  }, []);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
  };

  const updateUser = async () => {
    let userInfoWarnings = [];
    let valid = true;
    if (ffirstName === "" || llastName === "" || uusername === "") {
      valid = false;
      userInfoWarnings.push("لطفاً همه‌ی قسمت ها را پر کنید");
    } else {
      if (
        !/^[پچجحخهعغآ؟.،آفقثصضشسیبلاتنمکگوئدذرزطظژ!!ؤإأءًٌٍَُِّ a-zA-Z\s]+$/.test(
          ffirstName
        )
      ) {
        valid = false;
        userInfoWarnings.push("نام معتبر نیست");
      }
      if (
        !/^[پچجحخهعغآ؟.،آفقثصضشسیبلاتنمکگوئدذرزطظژ!!ؤإأءًٌٍَُِّ a-zA-Z\s]+$/.test(
          llastName
        )
      ) {
        valid = false;
        userInfoWarnings.push("نام خانوادگی معتبر نیست");
      }
      if (uusername.length < 5) {
        valid = false;
        userInfoWarnings.push("نام کاربری حداقل باید 5 حرف باشد");
      } else if (!/^[a-zA-Z0-9_]{5,}[a-zA-Z]*$/.test(uusername)) {
        valid = false;
        userInfoWarnings.push(
          "نام کاربری معتبر نیست. فقط از حروف کوچک و بزرگ انگلیسی، اعداد و کاراکترهای . و _ می‌توانید استفاده کنید"
        );
      }
    }
    if (valid) {
      setWarnings([]);
      let formData = new FormData();
      const blob =
        avatar !== null ? await fetch(avatar).then((res) => res.blob()) : null;

      //compressing image data
      const imageFile = blob;

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        let compressedFile;
        if (imageFile !== null) {
          compressedFile = await imageCompression(imageFile, options);
        } else {
          compressedFile =
            "https://6064645837b7e20018e99fd5.iran.liara.space/avatars/" +
            aavatar;
            console.log(compressedFile);
        }

        formData.append("Username", uusername);
        formData.append("FirstName", ffirstName);
        formData.append("LastName", llastName);
        formData.append("AvatarFile", compressedFile);
        setIsLoad(true);
        const result = await UpdateUser(formData);
        console.log("UpdateUser Result:", result);
        if (!result.success) {
          userInfoWarnings.push(result.error);
          setWarnings(userInfoWarnings);
          setIsLoad(false);
        } else {
          setIsLoad(false);
          successToast("اطلاعات شما با موفقیت بروزرسانی شد");
          console.log("result:", result);
          setItem("Authorization", result.result.accessToken);
          setItem("refreshToken", result.result.refreshToken);
          setIsLoad(true);
          const newUserData = await GetUser();
          updateData(
            newUserData.result.firstName,
            newUserData.result.lastName,
            newUserData.result.username,
            newUserData.result.avatar
          );
          setIsLoad(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setWarnings(userInfoWarnings);
    }
  };

  const saveCropImage = () => {
    if (typeof cropper !== "undefined") {
      setAvatar(cropper.getCroppedCanvas().toDataURL());
      setShowCropImage(false);
    }
  };

  const setImage = (e) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const logoutClick = () => {
    setSuccessfullLogout(true);

    clearStorage();
  };

  return (
    <MainLayout headerPadding bg="low-gray" text="black" isModal>
      <Helmet>
        <title>کنارت | حساب کاربری</title>
      </Helmet>
      <Header bg="white">
        <div className="kenaret-container">
          <div className="flex justify-between items-center py-4">
            <PageBackButton
              className="bg-transparent font-bold text-orange"
              clicked={() =>
                showCropImage ? setShowCropImage(false) : goBack()
              }
            >
              <Icon icon={chevronRight} /> بازگشت
            </PageBackButton>
            <h3 className="flex-1 text-center text-sm">{accountText()}</h3>
            <PageNextButton
              className={`bg-transparent text-orange font-bold ${
                ffirstName && llastName && uusername
                  ? ""
                  : "disabled:opacity-50"
              } `}
              size="small"
              clicked={() => (showCropImage ? saveCropImage() : updateUser())}
              disabled={ffirstName && llastName && uusername ? false : true}
            >
              ذخیره <Icon icon={chevronLeft} />
            </PageNextButton>
          </div>
          <p className="text-lg text-center">
            {showCropImage
              ? "تغییر عکس حساب کاربری"
              : ffirstName + " " + llastName}
          </p>
        </div>
      </Header>

      {isLoad ? (
        <Loading />
      ) : (
        <Fragment>
          <div className="kenaret-container">
            {successfullLogout ? (
              <div className="bg-white m-4 p-5 rounded flex flex-col place-items-center place-content-center space-y-2">
                <FaCheckCircle className="text-6xl text-orange" />
                <p className="font-sans-bold">
                  {ffirstName} عزیز، با موفقیت خارج شدید
                </p>
              </div>
            ) : (
              <Fragment>
                {!isLoggedIn ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div>
                      در حال حاضر وارد نشده اید و دسترسی به این صفحه ندارید
                    </div>
                    <Link to="/login" className="text-orange">
                      رفتن به بخش ورود به حساب کاربری
                    </Link>
                  </div>
                ) : (
                  <Fragment>
                    {showCropImage ? (
                      <div className="flex justify-center items-center">
                        {avatar ? (
                          <div className="grid grid-row ">
                            <div className="mb-5 mx-auto">
                              <label
                                htmlFor="upload-avatar"
                                className="bg-orange rounded px-4 py-2 text-white"
                              >
                                <input
                                  onChange={setImage}
                                  type="file"
                                  id="upload-avatar"
                                  className="hidden "
                                />
                                + بارگزاری عکس
                              </label>
                            </div>
                            <div>
                              <Cropper
                                src={avatar}
                                crop={onCrop}
                                ref={cropperRef}
                                style={{ height: 550, width: "70%" }}
                                aspectRatio={1}
                                preview=".img-preview"
                                viewMode={1}
                                minCropBoxHeight={10}
                                onInitialized={(instance) => {
                                  setCropper(instance);
                                }}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                guides={true}
                              />
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="upload-avatar"
                            className="bg-orange rounded px-4 py-2 text-white"
                          >
                            <input
                              onChange={setImage}
                              type="file"
                              id="upload-avatar"
                              className="hidden "
                            />
                            + بارگزاری عکس
                          </label>
                        )}
                      </div>
                    ) : (
                      <div className="mb-16">
                        <div className=" flex justify-center mb-4">
                          <label
                            onClick={() => setShowCropImage(true)}
                            className={`w-32 h-32 rounded-lg  overflow-hidden${
                              avatar || aavatar !== "" ? "" : "py-4 px-4"
                            }  flex justify-center	 bg-high-gray`}
                          >
                            <LazyLoad height={200}>
                              <div>
                                {avatar !== null || aavatar !== null ? (
                                  <img
                                    className="w-full h-auto"
                                    src={
                                      avatar
                                        ? avatar
                                        : "https://6064645837b7e20018e99fd5.iran.liara.space/avatars/" +
                                          aavatar
                                    }
                                  />
                                ) : (
                                  <img
                                    className=""
                                    src={
                                      require("../../Assets/Image/defaultimage.png")
                                        .default
                                    }
                                  />
                                )}
                              </div>
                            </LazyLoad>
                          </label>
                        </div>
                        <div className="flex flex-col space-y-2 w-full place-content-center place-items-center">
                          <div className="px-5 w-full">
                            <div className="bg-mid-gray text-sm w-full flex justify-between items-center py-2 px-4 rounded">
                              <p>شماره تلفن همراه</p>
                              <p>{pphoneNumber}</p>
                            </div>
                          </div>
                          <div className="overflow-hidden px-5 flex flex-col w-full">
                            <Input
                              onChange={(e) =>
                                setUserName(e.target.value.trim())
                              }
                              label="نام کاربری"
                              type="text"
                              value={uusername}
                              labelSize={32}
                              inputDir="ltr"
                            />
                          </div>
                          <div className="overflow-hidden px-5 flex flex-col w-full">
                            <Input
                              onChange={(e) =>
                                setFirstName(e.target.value.trim())
                              }
                              label="نام"
                              type="text"
                              value={ffirstName}
                              labelSize={32}
                              inputDir="ltr"
                            />
                          </div>
                          <div className="overflow-hidden px-5 flex flex-col w-full">
                            <Input
                              onChange={(e) =>
                                setLastName(e.target.value.trim())
                              }
                              label="نام خانوادگی"
                              type="text"
                              value={llastName}
                              labelSize={32}
                              inputDir="ltr"
                              warnings={warnings}
                            />
                          </div>
                          <div className="overflow-hidden px-5 flex flex-col w-full">
                            <Button
                              className={` text-white bg-orange px-3 py-1.5 rounded`}
                              clicked={() => logoutClick()}
                            >
                              خروج
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Fragment>
                )}
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
    firstName: store.firstName,
    lastName: store.lastName,
    username: store.username,
    isLoggedIn: store.isLoggedIn,
    phoneNumber: store.phoneNumber,
    aavatar: store.avatar,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    userLogout: () => dispatch(logout()),
    updateData: (firstName, lastName, username, avatar) =>
      dispatch(updateUserData(firstName, lastName, username, avatar)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
