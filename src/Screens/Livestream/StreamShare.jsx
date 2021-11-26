import React, { useState } from "react";
import Icon from "@iconify/react";
import contentCopy from "@iconify-icons/mdi/content-copy";
import telegramIcon from "@iconify-icons/logos/telegram";
import twitterIcon from "@iconify-icons/logos/twitter";
import linkedinIcon from "@iconify-icons/logos/linkedin-icon";

const StreamShare = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true)
    setTimeout(() => setCopied(false),1000)
  };

  return (
    <div className=" px-10 py-4">
      <div
        className="flex dir-ltr bg-white rounded-lg py-2 relative overflow-hidden"
        onClick={() =>
          copyToClipboard(`https://kenaret.com/main/e-commerce/pipes/${id}`)
        }
      >
          <div 
            className="w-full h-full bg-black-50 flex transition-opacity duration-150 justify-center items-center absolute top-0 left-0 text-lg text-white"
            style={{opacity: copied ? "1" : "0"}}
          >
            !کپی شد
          </div>
        <div className="flex justify-start items-center whitespace-nowrap overflow-hidden overflow-ellipsis">
          <div className="text-2xl px-2">
            <Icon icon={contentCopy} />
          </div>
          {`https://kenaret.com/main/e-commerce/pipes/${id}`}
        </div>
      </div>
      <div className="flex text-4xl justify-around my-10">
        <a
          href={`https://t.me/share/url?url=https://kenaret.com/main/e-commerce/pipes/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon={telegramIcon} />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=https://kenaret.com/main/e-commerce/pipes/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon={twitterIcon} className="w-9" />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=https://kenaret.com/main/e-commerce/pipes/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon={linkedinIcon} />
        </a>
      </div>
    </div>
  );
};

export default StreamShare;
