import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import { Button, Card, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";

const UserManagement = () => {
  const columns = [
    { Header: "author", accessor: "author", width: "45%", align: "left" },
    { Header: "function", accessor: "function", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "employed", accessor: "employed", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];
  const rows = [
    {
      author: <div>Author</div>,
      function: <div>job</div>,
      status: <div>Status</div>,
      employed: <div>Employed</div>,
      action: <div>Action</div>,
    },
  ];
  return (
    <DashboardLayout>
      <div>
        <DashboardNavbar />
        <Card sx={{ mt: 3 }}>
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
            <MDTypography variant="h6" color="white">
              User Management{" "}
            </MDTypography>
          </MDBox>
          {/* <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
            <MDButton variant="gradient" color="info">
              Add User{" "}
            </MDButton>
          </div> */}

          <MDBox>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={true}
              showTotalEntries={true}
              // button={
              //   <MDButton variant="gradient" color="info">
              //     Add User{" "}
              //   </MDButton>
              // }
              canSearch={true}
              noEndBorder
            />
          </MDBox>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
