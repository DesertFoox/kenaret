import React, { useState } from "react";
import { Icon } from "@iconify/react";
import formatTitle from "@iconify-icons/mdi/format-title";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import closeIcon from "@iconify-icons/mdi/close";
import trashCanOutline from "@iconify-icons/mdi/trash-can-outline";
import linkVariantPlus from "@iconify-icons/mdi/link-variant-plus";
import linkVariant from "@iconify-icons/mdi/link-variant";

import Footer from "../../Components/MainLayout/Footer/Footer";
import Header from "../../Components/MainLayout/Header/Header";
import MainLayout from "../../Components/MainLayout/MainLayout";
import Button from "../../Components/UI/Button/Button";
import Input from "../../Components/UI/Input/Input";
import Loading from "../../Components/UI/Loading/Loading";
import { Fragment } from "react";
import PageBackButton from "../../Components/UI/Button/PageBackButton";
import PageNextButton from "../../Components/UI/Button/PageNextButton";

const Links = ({
  className,
  close,
  links,
  urlChange,
  titleChange,
  deleteLink,
  addLink,
}) => {
  const [newLinkTilte, setNewLinkTilte] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [deleteLinkIndex, setDeleteLinkIndex] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [titleRequired, setTitleRequired] = useState(false);
  const [linkAddressRequired, setLinkAddressRequired] = useState(false);

  const addLinkHandler = async () => {
    // const data = {
    //   description: newLinkTilte,
    //   url: newLinkUrl,
    // };
    // const result = await CreateLink(data); // API call
    setIsLoad(true);
    if (newLinkTilte === "") {
      setTitleRequired(true);
    } else if (newLinkUrl === "") {
      setLinkAddressRequired(true);
    } else {
      addLink(newLinkTilte, newLinkUrl);
      setNewLinkTilte("");
      setNewLinkUrl("");
      setLinkAddressRequired(false);
      setTitleRequired(false);
    }
    setIsLoad(false);
  };

  // const DeleteLinks = async (ind) => {
  //   try {
  //     const id = links[ind].id;
  //     await DeleteLink(id);
  //   } catch (er) {
  //     console.log(er);
  //   }
  // };

  return (
    <MainLayout headerPadding bg="low-gray" text="black" className={className}>
      <Header bg="white">
        <div className="kenaret-container">
          <div className="flex justify-between py-4 items-center">
            <PageBackButton
              className="bg-transparent text-orange"
              size="small"
              clicked={() => close()}
            >
              <Icon icon={chevronRight} /> ذخیره 
            </PageBackButton>
            <h3 className="flex-1 text-center text-lg">گره ها</h3>
            <PageNextButton
              className="bg-transparent text-orange"
              size="small"
              clicked={() => close()}
            >

            </PageNextButton>
          </div>
        </div>
      </Header>

      {isLoad ? (
        <Loading />
      ) : (
        <Fragment>
          <div className="kenaret-container">
            <div className="text-sm flex flex-col p-5 pb-16 w-full  place-content-center place-items-center">
              <div className="rounded flex flex-col w-full">
                <form
                  className={`rounded bg-white mb-2 overflow-hidden ${
                    linkAddressRequired && "border border-red"
                  } ${titleRequired && "border border-red"}`}
                  onSubmit={(e) => {
                    e.preventDefault();
                    addLinkHandler()
                  }}
                >
                  <Input
                    required={titleRequired}
                    placeholder="عنوان گره"
                    onChange={(e) => setNewLinkTilte(e.target.value)}
                    type="text"
                    label={<Icon icon={formatTitle} className="ml-2 text-xl" />}
                    value={newLinkTilte}
                  />
                  <hr className="text-low-gray" />
                  <Input
                    required={linkAddressRequired}
                    placeholder="آدرس گره"
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    type="text"
                    label={<Icon icon={linkVariant} className="ml-2 text-xl" />}
                    value={newLinkUrl}
                  />
                  <hr className="text-low-gray" />
                  <div
                    className="flex bg-orange p-2 text-white cursor-pointer"
                    onClick={() => {
                      addLinkHandler();
                    }}
                  >
                    <Icon icon={linkVariantPlus} className="ml-2 text-xl" />
                    <p>ایجاد گره</p>
                  </div>
                </form>
                {links.map((link, ind) => (
                  <form
                    className="rounded bg-white mb-2 overflow-hidden"
                    key={ind}
                  >
                    <Input
                      placeholder="عنوان گره"
                      onChange={(e) => titleChange(e.target.value, ind)}
                      type="text"
                      label={
                        <Icon icon={formatTitle} className="ml-2 text-xl" />
                      }
                      value={link.description}
                    />
                    <hr className="text-low-gray" />
                    <Input
                      placeholder="آدرس گره"
                      onChange={(e) => urlChange(e.target.value, ind)}
                      type="text"
                      label={
                        <Icon icon={linkVariant} className="ml-2 text-xl" />
                      }
                      value={link.url}
                    />
                    <hr className="text-low-gray" />
                    {ind === deleteLinkIndex ? (
                      <div className=" flex justify-between">
                        <p className="text-center pt-2 pr-4">
                          آیا مطمئن هستید؟
                        </p>
                        <div className="flex justify-around">
                          <Button
                            className="bg-orange text-white"
                            size="extra-small"
                            clicked={() => {
                              setDeleteLinkIndex(null);
                            }}
                          >
                            <Icon icon={closeIcon} className="ml-2 text-xl" />{" "}
                            خیر
                          </Button>
                          <Button
                            className="bg-red text-white"
                            size="extra-small"
                            clicked={() => {
                              deleteLink(ind);
                              // DeleteLinks(ind);
                              setDeleteLinkIndex(null);
                            }}
                          >
                            <Icon
                              icon={trashCanOutline}
                              className="ml-2 text-xl"
                            />
                            بله
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex p-2 text-orange"
                        onClick={() => setDeleteLinkIndex(ind)}
                      >
                        <Icon icon={trashCanOutline} className="ml-2 text-xl" />
                        <p>حذف</p>
                      </div>
                    )}
                  </form>
                ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </MainLayout>
  );
};

export default Links;
