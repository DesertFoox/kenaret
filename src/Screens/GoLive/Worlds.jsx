import React, { useState, useEffect } from "react";
import { Icon, InlineIcon } from "@iconify/react";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import Footer from "../../Components/MainLayout/Footer/Footer";
import Header from "../../Components/MainLayout/Header/Header";
import MainLayout from "../../Components/MainLayout/MainLayout";
import Button from "../../Components/UI/Button/Button";

import GetAllWords from "../../Core/Services/Api/WorldApi/GetAllWorlds";
import Loading from "../../Components/UI/Loading/Loading";
import { Fragment } from "react";
import { errorToast } from "../../utility/toastSettings";
import PageBackButton from "../../Components/UI/Button/PageBackButton";
import PageNextButton from "../../Components/UI/Button/PageNextButton";

const Worlds = ({ className, close, worldSelected }) => {
  const [worlds, setWorlds] = useState([]);
  const [selectedWorld, setSelectedWorld] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const getWorlds = async () => {
    setIsLoad(true);
    const result = await GetAllWords();
    setIsLoad(false);
    if (result.success) {
      const worlds = result.result;
      setWorlds(worlds);
    } else {
      errorToast(result.error);
    }
  };
  const selectWorld = (w) => {
    setSelectedWorld(w);
  };

  useEffect(() => {
    setIsLoad(true);
    getWorlds();
    setIsLoad(false);
  }, []);
  return (
    <MainLayout headerPadding bg="low-gray" text="black" className={className}>
      <Header bg="white">
        <div className="kenaret-container">
          <div className="flex justify-between py-4 items-center">
            <PageBackButton
              className="bg-transparent text-orange"
              clicked={() => close()}
            >
              <Icon icon={chevronRight} /> بازگشت
            </PageBackButton>
            <h3 className="flex-1 text-center text-lg">منبع</h3>
            <PageNextButton
              className="bg-transparent text-orange"
            ></PageNextButton>
          </div>
          <p className="text-sm text-center"></p>
        </div>
      </Header>

      {isLoad ? (
        <Loading />
      ) : (
        <Fragment>
          <div className="kenaret-container">
            <div className="text-sm flex flex-col space-y-2 w-full  place-content-center place-items-center">
              {worlds ? (
                <div className="overflow-auto flex px-5 pb-16  space-y-2 flex-col w-full">
                  {worlds.map((item, ind) => (
                    <div
                      className={`flex cursor-pointer justify-between px-2 py-2 rounded + ${
                        item === selectedWorld ? " bg-high-gray" : " bg-white"
                      }`}
                      key={ind}
                      onClick={() => {
                        selectWorld(item.title);
                        worldSelected(item);
                        close();
                      }}
                    >
                      <p>{item.title}</p>
                      <p>
                        <InlineIcon icon={chevronLeft} className="text-xl text-orange" />
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Fragment>
      )}
    </MainLayout>
  );
};

export default Worlds;
