import React from "react";
import Icon from "@iconify/react";
import linkIcon from "@iconify/icons-fa-solid/link";
import { Fragment } from "react";
import Loading from "../../Components/UI/Loading/Loading";

const StreamNodes = ({ nodes }) => {
  return (
    <div className="px-10 py-4 space-y-2">
      {nodes.length !== 0 ? (
        <Fragment>
          {nodes[0].loading ? (
            <Loading />
          ) : (
            <Fragment>
              {nodes.map((node, index) => (
                <a
                  key={index}
                  className="flex dir-ltr bg-white rounded-lg p-1"
                  href={`https://${node.url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="p-2 px-4 flex items-center justify-center">
                    <Icon icon={linkIcon} className="text-lg" />
                  </div>
                  <div>
                    <div>{node.description}</div>
                    <div className="text-sm text-mid-gray">{node.url}</div>
                  </div>
                </a>
              ))}
            </Fragment>
          )}
        </Fragment>
      ) : (
        <p className="my-24 text-center">گره ای برای نمایش وجود ندارد.</p>
      )}
    </div>
  );
};

export default StreamNodes;
