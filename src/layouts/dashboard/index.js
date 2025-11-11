import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import axios, { HttpStatusCode } from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";
import capitalizeWords from "../../utils";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reload, setReload] = useState(1);

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "Created At", accessor: "createdAt", align: "left" },
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Goal", accessor: "goal", align: "center" },
    { Header: "Gender", accessor: "gender", align: "center" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Subscription", accessor: "subscription", align: "center" },
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/admin/stats/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === HttpStatusCode.Ok) {
          setStats(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardStats();
  }, []);

  // Loading skeleton for stats cards
  if (!stats)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={12} md={6} lg={3} key={i}>
                <Skeleton variant="rectangular" height={150} />
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        </MDBox>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {[
            {
              color: "dark",
              icon: "people",
              title: "Total Users",
              count: stats?.users?.total,
            },
            {
              color: "info",
              icon: "restaurant",
              title: "Total Food Scans",
              count: stats?.foodStats?.totalFoodScans,
            },

            {
              color: "warning",
              icon: "today",
              title: "Daily Active Users",
              count: stats?.foodStats?.dailyActiveUsers,
            },
            {
              color: "secondary",
              icon: "date_range",
              title: "Monthly Active Users",
              count: stats?.foodStats?.monthlyActiveUsers,
            },

            {
              color: "info",
              icon: "person",
              title: "Free Users",
              count: stats?.users?.freeUsers,
            },
            {
              color: "info",
              icon: "person_off",
              title: "Free Users with Zero Credits",
              count: stats?.users?.freeUsersWithZeroCredits,
            },
          ].map((item, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <MDBox mb={1.5} height="100%">
                <ComplexStatisticsCard
                  color={item.color}
                  icon={item.icon}
                  title={item.title}
                  count={item.count}
                  percentage={{ amount: "", label: "", color: "success" }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>

        {/* Users Table */}
        <MDBox mt={5}>
          <DataTable
            table={{ columns, rows: [] }}
            fetchDataRows={async ({ pageIndex, pageSize }) => {
              const token = localStorage.getItem("token");
              const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/admin/user?page=${pageIndex}&limit=${pageSize}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const data = response.data?.data?.data || [];
              return {
                data: data.map((entry, index) => ({
                  sno: <div>{index + 1 + pageIndex * pageSize}</div>,
                  createdAt: <div>{new Date(entry.createdAt).toLocaleDateString()}</div>,
                  name: <div>{capitalizeWords(entry.details.name) || "User"}</div>,
                  goal: <div>{capitalizeWords(entry.details.goal) || "-"}</div>,
                  gender: <div>{capitalizeWords(entry.details.gender) || "-"}</div>,
                  phone: <div>{entry.mobileNumber || "-"}</div>,
                  subscription: <div>{capitalizeWords(entry?.subscription?.planType) || "-"}</div>,
                })),
                total: response.data?.data?.count || 0,
              };
            }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            reload={reload}
            noEndBorder
          />
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
