import React from "react";

const tabList = [
  { label: "User", key: "user" },
  { label: "Meal Logs", key: "meal" },
  { label: "Exercise Logs", key: "exercise" },
  { label: "DailyLog", key: "progress" },
  // { label: "Rating & Feedback", key: "feedback" },
  { label: "Physical Stats", key: "physicalStats" },
];

const UserDetailTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ display: "flex", gap: "8px", marginLeft: "10px", marginTop: "16px" }}>
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          style={{
            margin: "4px",
            padding: "12px 16px",
            backgroundColor: activeTab === tab.key ? "black" : "white",
            color: activeTab === tab.key ? "white" : "black",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default UserDetailTabs;
