import React from "react";

const tabList = [
  { label: "User", key: "user" },
  { label: "Meal Logs", key: "meal" },
  { label: "Exercise Logs", key: "exercise" },
  { label: "Daily Log", key: "progress" },
  { label: "Physical Stats", key: "physicalStats" },
  { label: "Scans", key: "foodScans" },
];

const UserDetailTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginLeft: "10px",
        marginTop: "16px",
        flexWrap: "wrap", // allows wrapping on small screens
        rowGap: "8px",
        overflowX: "auto", // scrollable if needed
        scrollbarWidth: "none", // hide scrollbar (Firefox)
      }}
    >
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          style={{
            flexShrink: 0,
            padding: "10px 14px",
            backgroundColor: activeTab === tab.key ? "black" : "white",
            color: activeTab === tab.key ? "white" : "black",
            borderRadius: "10px",
            border: "1px solid #ddd",
            cursor: "pointer",
            transition: "all 0.25s ease",
            fontSize: "0.9rem",
            whiteSpace: "nowrap",
            minWidth: "fit-content",
          }}
        >
          {tab.label}
        </button>
      ))}
      <style>
        {`
          /* hide scrollbar for webkit browsers */
          div::-webkit-scrollbar {
            display: none;
          }

          @media (max-width: 600px) {
            button {
              padding: 8px 12px;
              font-size: 0.8rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default UserDetailTabs;
