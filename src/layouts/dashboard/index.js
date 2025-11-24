import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import { HttpStatusCode } from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";
import capitalizeWords from "../../utils";
import Tooltip from "@mui/material/Tooltip";
import { apiClient } from "api/apiClient";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reload, setReload] = useState(1);

  const columns = [
    // { Header: "S.No", accessor: "sno", align: "left" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Scans", accessor: "scans", align: "left" },
    { Header: "Streak", accessor: "streak", align: "left" },
    { Header: "Position", accessor: "position", align: "left" },
    { Header: "Phone/Email", accessor: "phoneEmail", align: "left" },
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await apiClient.get("/api/v1/admin/stats/dashboard");

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
              title: "Daily Food Scans",
              count: stats?.foodStats?.dailyFoodScans,
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
              icon: "person",
              title: "Paid Users",
              count: stats?.users?.paidUsers,
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
                {item.title === "Paid Users" ? (
                  <Tooltip
                    title={`Monthly: ${stats?.users?.monthlyPaidUsers || 0}, Yearly: ${
                      stats?.users?.yearlyPaidUsers || 0
                    }`}
                    arrow
                    placement="top"
                  >
                    <div>
                      <ComplexStatisticsCard
                        color={item.color}
                        icon={item.icon}
                        title={item.title}
                        count={item.count}
                        percentage={{ amount: "", label: "", color: "success" }}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <ComplexStatisticsCard
                    color={item.color}
                    icon={item.icon}
                    title={item.title}
                    count={item.count}
                    percentage={{ amount: "", label: "", color: "success" }}
                  />
                )}
              </MDBox>
            </Grid>
          ))}
        </Grid>

        {/* Users Table */}
        <MDBox mt={5}>
          <DataTable
            table={{ columns, rows: [] }}
            fetchDataRows={async ({ pageIndex, pageSize }) => {
              const response = await apiClient.get(
                `/api/v1/admin/user/top-streaks?page=${pageIndex}&limit=${pageSize}`
              );

              const data = response.data.data || [];
              console.log("data", data);
              return {
                data: data.map((entry, index) => ({
                  createdAt: <div>{new Date(entry.createdAt).toLocaleDateString()}</div>,
                  name: <div>{capitalizeWords(entry.details.name) || "User"}</div>,
                  scans: <div>{entry.dailyFoodScans || "0"}</div>,
                  streak: <div>{entry.streak || "0"}</div>,
                  position: <div>{entry.position || "0"}</div>,
                  phoneEmail: <div>{entry.mobileNumber || entry.email || "-"}</div>,
                })),
                total: response.data?.count || 0,
              };
            }}
            isSorted={false}
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
