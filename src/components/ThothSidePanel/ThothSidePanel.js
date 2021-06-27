import React, { useState } from "react";

import css from "./sidepanel.module.css";
import Heiroglyphs from "./Heiroglyphs";
import Playtest from "./Playtest";

const ThothSidePanel = ({ nodeList, nodeMap, editor, ...props }) => {
  const [activeTab, setActiveTab] = useState("playtest");
  const tabs = {
    spellBrowser: {
      title: "Heiroglyphs",
      component: (
        <Heiroglyphs nodeMap={nodeMap} nodeList={nodeList} editor={editor} />
      ),
    },
    gameStateManager: {
      title: "Game State Manager",
      component: <Playtest />,
    },
    playtest: {
      title: "Playtest",
      component: <Playtest />,
    },
  };

  return (
    <div className={css["th-sidepanel"]}>
      <div className={css["tabs"]}>
        {Object.keys(tabs).map((item) => {
          return (
            <div
              onClick={() => {
                setActiveTab(item);
              }}
              className={`${css["tab"]} ${
                css[activeTab === item ? "active" : ""]
              }`}
            >
              {tabs[item].title}
            </div>
          );
        })}
      </div>
      <div className={css["tab-page"]}>{tabs[activeTab].component}</div>
    </div>
  );
};

export default ThothSidePanel;
