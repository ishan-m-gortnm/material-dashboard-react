import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Card } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import UserDetailTabs from "components/UserDetailTab/page";
import MealLogs from "components/MealLog/page";
import ExerciseLogs from "components/ExerciseLog/page";
import DailyLog from "components/DailyLog/page";
import RatingFeedback from "components/RatingFeedback/page";
import User from "components/userDetail/page";
import PhysicalStats from "components/physicalStats/page";

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("user");

  const fetchUserDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://api.qa.nutriverseai.in/api/v1/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data?.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <Box textAlign="center" mt={10}>
          <MDTypography variant="h6">User not found</MDTypography>
        </Box>
      </DashboardLayout>
    );
  }

  // Define columns
  const columns = [
    { Header: "name", accessor: "name", width: "25%", align: "left" },
    { Header: "phone", accessor: "phone", align: "center" },
    { Header: "goal", accessor: "goal", align: "center" },
    { Header: "bmiCategory", accessor: "bmiCategory", align: "center" },
    { Header: "regDate", accessor: "regDate", align: "center" },
    { Header: "subscription", accessor: "subscription", align: "center" },

    { Header: "action", accessor: "action", align: "center" },
  ];

  // Format single user as a row
  const rows = [
    {
      name: user.details?.name || "N/A",
      phone: user.mobileNumber || "N/A",
      goal: user.details?.goal || "N/A",
      bmiCategory: user.details?.bmi || "N/A",
      regDate: new Date(user.createdAt).toLocaleDateString(),
      // subscription: user.subscription || "N/A",
      action: <span style={{ color: "gray" }}>N/A</span>, // Add buttons if needed
    },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "user":
        return <User user={user} />;
      case "meal":
        return <MealLogs />;
      case "exercise":
        return <ExerciseLogs />;
      case "progress":
        return <DailyLog />;
      case "feedback":
        return <RatingFeedback />;
      case "physicalStats":
        return <PhysicalStats />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <UserDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
        <button
          style={{
            margin: "4px",
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          MealLogs
        </button>
        <button
          style={{
            margin: "4px",
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ExerciseLogs
        </button>
        <button
          style={{
            margin: "4px",
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Progress History
        </button>
        <button
          style={{
            margin: "4px",
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Rateing & Feedback
        </button>
      </div> */}

      <Card sx={{ mt: 6 }}>
        <MDBox
          mx={2}
          mt={-3}
          py={3}
          px={2}
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
        >
          <MDTypography variant="h4" color="white">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </MDTypography>
        </MDBox>

        {/* <MDBox p={3}>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            canSearch={true}
            noEndBorder
          />
        </MDBox> */}
        <MDBox p={3}>{renderTabContent()}</MDBox>
      </Card>
    </DashboardLayout>
  );
};

export default UserDetailPage;
