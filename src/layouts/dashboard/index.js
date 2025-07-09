import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import axios from "axios";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [contactUsStats, setContactUsStats] = useState(null);
  const [reload, setReload] = useState(1);

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "Created At", accessor: "createdAt", align: "left" },
    { Header: "Name", accessor: "name", align: "center" },

    { Header: "Goal", accessor: "goal", align: "center" },
    { Header: "Gender", accessor: "gender", align: "center" },
    { Header: "Diet", accessor: "diet", align: "center" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Subscription", accessor: "subscription", align: "center" },
    { Header: "BMI", accessor: "bmiCategory", align: "center" },
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userStatsRes, contactUsRes] = await Promise.all([
          axios.get("https://api.qa.nutriverseai.in/api/v1/admin/stats/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://api.qa.nutriverseai.in/api/v1/admin/contact-us?limit=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(userStatsRes.data.data.users);
        setContactUsStats(contactUsRes.data.data.count);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const fetchContactUsData = async ({ pageIndex = 0, pageSize = 10 }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.qa.nutriverseai.in/api/v1/admin/user?page=${pageIndex}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contactUsData = response.data?.data?.data || [];

      const formattedRows = contactUsData.map((entry, index) => ({
        sno: <div>{index + 1 + pageIndex * pageSize}</div>,
        createdAt: <div>{new Date(entry.createdAt).toLocaleDateString()}</div>,
        name: <div>{entry.details.name || "-"}</div>,
        goal: <div>{entry.details.goal || "-"}</div>,
        gender: <div>{entry.details.gender || "-"}</div>,
        diet: <div>{entry.details.diet || "-"}</div>,
        phone: <div>{entry.mobileNumber || "-"}</div>,
        subscription: <div>{entry?.subscription?.planType || "-"}</div>,
        bmiCategory: <div>{entry.details?.bmi?.toFixed(3) || "-"}</div>,
        // regDate: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
        message: (
          <div
            style={{
              maxWidth: "300px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {entry.message}
          </div>
        ),
      }));

      return {
        data: formattedRows,
        total: response.data?.data?.count || 0,
      };
    } catch (err) {
      console.error("Error fetching contact us data:", err);
      return {
        data: [],
        total: 0,
      };
    }
  };

  if (!stats) return <div></div>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Users"
                count={stats.total}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title="Active Users" count={stats.active} />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Disabled Accounts"
                count={stats.disabled}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Subscribed Users"
                count={stats.subscribed}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="person_off"
                title="Non-Subscribed Users"
                count={stats.nonSubscribed}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Contact Us Table */}
        <MDBox mt={5}>
          <DataTable
            table={{ columns, rows: [] }}
            fetchDataRows={fetchContactUsData}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            // canSearch={true}
            reload={reload}
            noEndBorder
          />
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
