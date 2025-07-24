// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DataTable from "examples/Tables/DataTable";
// import ConfirmationPopUp from "components/confirmationPopup/page";
// // import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";

// import {
//   Card,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   TextField,
//   Box,
//   Button,
// } from "@mui/material";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { FaLock } from "react-icons/fa";
// import { FaLockOpen } from "react-icons/fa";
// import Approve from "components/BlockModal/page";
// import UnBlock from "components/UnBlockModal/page";
// import MDButton from "components/MDButton";
// import Dropdown from "components/Dropdown";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";

// const UserManagement = () => {
//   const [rows, setRows] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState({});
//   const [isunBlockOpen, setIsunBlockOpen] = useState(false);
//   const [goalFilter, setGoalFilter] = useState("");
//   const [genderFilter, setGenderFilter] = useState("");
//   const [bmiFilter, setBmiFilter] = useState("");
//   const [diet, setDiet] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [reload, setReload] = useState(1);
//   const { id } = useParams();
//   const [month, setMonth] = useState("");

//   const columns = [
//     { Header: "S no.", accessor: "sno", width: "5%", align: "center" },

//     { Header: "name", accessor: "name", width: "25%", align: "center" },
//     { Header: "phone", accessor: "phone", align: "center" },
//     { Header: "goal", accessor: "goal", align: "center" },
//     { Header: "gender", accessor: "gender", align: "center" },
//     { Header: "diet", accessor: "diet", align: "center" },
//     { Header: "bmi", accessor: "bmiCategory", align: "center" },
//     { Header: "reg Date", accessor: "regDate", align: "center" },
//     { Header: "subscription", accessor: "subscription", align: "center" },
//   ];

//   const monthOptions = [
//     { label: "All", value: "" },
//     { label: "January", value: "1" },
//     { label: "February", value: "2" },
//     { label: "March", value: "3" },
//     { label: "April", value: "4" },
//     { label: "May", value: "5" },
//     { label: "June", value: "6" },
//     { label: "July", value: "7" },
//     { label: "August", value: "8" },
//     { label: "September", value: "9" },
//     { label: "October", value: "10" },
//     { label: "November", value: "11" },
//     { label: "December", value: "12" },
//   ];
//   const handleClose = () => {
//     setIsOpen(false);
//     setOpen(false);
//     setIsunBlockOpen(false);
//     setUser(null);
//   };

//   const handleBlockToggle = (user, status) => {
//     setObj({ ...user, status: status.toString() });
//     setIsOpen(true);
//   };

//   const fetchUsers = async ({ pageIndex, pageSize, globalFilter }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const url = new URL(
//         `https://api.qa.nutriverseai.in/api/v1/admin/special-user/${id}/referred`
//       );

//       const params = new URLSearchParams();
//       if (month) params.append("month", month);
//       if (searchQuery) params.append("search", searchQuery);
//       if (pageSize) params.append("limit", pageSize);
//       if (pageIndex) params.append("page", pageIndex);

//       url.search = params.toString();

//       const response = await axios.get(url.toString(), {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const users = response.data?.data?.data || [];

//       const formattedRows = users.map((user, index) => ({
//         sno: <div>{pageSize * pageIndex + index + 1}</div>,
//         name: <div>{user.details.name || "-"}</div>,
//         goal: <div>{user.details.goal || "-"}</div>,
//         gender: <div>{user.details.gender || "-"}</div>,
//         diet: <div>{user.details.diet || "-"}</div>,
//         phone: <div>{user.mobileNumber || "-"}</div>,
//         subscription: <div>{user?.subscription?.planType || "-"}</div>,
//         bmiCategory: <div>{user.details?.bmi?.toFixed(3) || "-"}</div>,
//         regDate: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
//       }));

//       return {
//         data: formattedRows,
//         total: response.data?.data?.count,
//       };
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     // fetchUsers();
//     setReload(reload + 1);
//   }, [, searchQuery, month]);

//   function handlemonthFilter(e) {
//     console.log(e.target.value, "ishan");
//     setMonth(e.target.value);
//     // setPage(0);
//     // setSearchKeyword("");
//   }
//   return (
//     <DashboardLayout>
//       {/* <DashboardNavbar /> */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           width: "200px",
//           marginTop: "10px",
//           marginLeft: "20px",
//           marginBottom: "10px",
//         }}
//       >
//         <Dropdown
//           options={monthOptions}
//           onChange={handlemonthFilter}
//           label="Month"
//           // IconComponent={ArrowDropDownIcon}
//         />
//       </Box>

//       <Card sx={{ mt: 5 }}>
//         <MDBox
//           mx={2}
//           mt={-3}
//           py={3}
//           px={2}
//           variant="gradient"
//           bgColor="info"
//           borderRadius="lg"
//           coloredShadow="info"
//         >
//           <MDTypography variant="h6" color="white">
//             Referral Details{" "}
//           </MDTypography>
//         </MDBox>

//         <MDBox>
//           <DataTable
//             table={{ columns, rows }}
//             isSorted={false}
//             entriesPerPage={true}
//             showTotalEntries={true}
//             canSearch={true}
//             noEndBorder
//             reload={reload}
//             fetchDataRows={fetchUsers}
//             onSearch={(val) => {
//               setSearchQuery(val);
//               // setPage(0); // reset to first page on new search
//             }}
//           />
//         </MDBox>
//       </Card>

//       {/* View User Popup */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle sx={{ marginLeft: "20px" }}>User Details</DialogTitle>
//         <DialogContent dividers>
//           {selectedUser && (
//             <div>
//               <Box
//                 sx={{
//                   gridColumn: "span 2",
//                   margin: 2,
//                   display: "flex",
//                   gap: 2,
//                 }}
//               >
//                 <TextField
//                   label="Name"
//                   value={selectedUser.details.name}
//                   disabled
//                   sx={{ width: "50%" }}
//                 />
//                 <TextField
//                   label="Phone"
//                   value={selectedUser.mobileNumber}
//                   sx={{ width: "50%" }}
//                   disabled
//                 />
//               </Box>

//               <Box
//                 sx={{
//                   gridColumn: "span 2",
//                   margin: 2,
//                   marginTop: "30px",
//                   justifyContent: "center",
//                   display: "flex",
//                   gap: 2,
//                 }}
//               >
//                 <TextField
//                   label="Goal"
//                   value={selectedUser.details.goal}
//                   disabled
//                   sx={{ width: "50%" }}
//                 />
//                 <TextField
//                   label="BMI"
//                   value={selectedUser.details.bmi}
//                   disabled
//                   sx={{ width: "50%" }}
//                 />
//               </Box>
//               <Box
//                 sx={{
//                   gridColumn: "span 2",
//                   margin: 2,
//                   marginTop: "30px",

//                   justifyContent: "center",
//                   display: "flex",
//                   gap: 2,
//                 }}
//               >
//                 <TextField
//                   label="Subscription"
//                   // value={selectedUser.subscription}
//                   disabled
//                   sx={{ width: "50%" }}
//                 />
//                 <TextField
//                   label="Registered On"
//                   value={new Date(selectedUser.createdAt).toLocaleString()}
//                   disabled
//                   sx={{ width: "50%" }}
//                 />
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   marginTop: "30px",
//                 }}
//               >
//                 <MDButton
//                   onClick={handleClose}
//                   variant="gradient"
//                   color="info"
//                   sx={{ width: "20%" }}
//                 >
//                   OK
//                 </MDButton>
//               </Box>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//       {/* {isOpen && <Approve onClose={handleClose} onsubmit={onsubmit} isOpen={isOpen} />} */}
//       <ConfirmationPopUp
//         open={isOpen}
//         onClose={handleClose}
//         onSubmit={onsubmit}
//         title={"Block User"}
//         content={"Are you sure you want to Block this User?"}
//         description={"This action can be reverted later."}
//       />
//       {/* {isunBlockOpen && (
//         <UnBlock onClose={handleClose} onsubmit={onsubmit} isOpen={isunBlockOpen} />
//       )} */}
//       <ConfirmationPopUp
//         open={isunBlockOpen}
//         onClose={handleClose}
//         onSubmit={onsubmit}
//         title={"UnBlock User"}
//         content={"Are you sure you want to UnBlock this User?"}
//         description={"This action can be reverted later."}
//       />
//     </DashboardLayout>
//   );
// };

// export default UserManagement;

import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import ConfirmationPopUp from "components/confirmationPopup/page";

import { Card, Dialog, DialogTitle, DialogContent, TextField, Box, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Dropdown from "components/Dropdown";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UserManagement = () => {
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isunBlockOpen, setIsunBlockOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reload, setReload] = useState(1);
  const { id } = useParams();
  const [month, setMonth] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMonthLabel, setSelectedMonthLabel] = useState("All");

  const columns = [
    { Header: "S no.", accessor: "sno", width: "5%", align: "center" },
    { Header: "name", accessor: "name", width: "25%", align: "center" },
    { Header: "phone", accessor: "phone", align: "center" },
    { Header: "goal", accessor: "goal", align: "center" },
    { Header: "gender", accessor: "gender", align: "center" },
    { Header: "diet", accessor: "diet", align: "center" },
    { Header: "bmi", accessor: "bmiCategory", align: "center" },
    { Header: "reg Date", accessor: "regDate", align: "center" },
    { Header: "subscription", accessor: "subscription", align: "center" },
  ];

  const monthOptions = [
    { label: "All", value: "" },
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const handleClose = () => {
    setIsOpen(false);
    setOpen(false);
    setIsunBlockOpen(false);
    setUser(null);
  };

  const fetchUsers = async ({ pageIndex, pageSize, globalFilter }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL(
        `https://api.qa.nutriverseai.in/api/v1/admin/special-user/${id}/referred`
      );

      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (searchQuery) params.append("search", searchQuery);
      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);

      url.search = params.toString();

      const response = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = response.data?.data?.data || [];

      const formattedRows = users.map((user, index) => ({
        sno: <div>{pageSize * pageIndex + index + 1}</div>,
        name: <div>{user.details.name || "-"}</div>,
        goal: <div>{user.details.goal || "-"}</div>,
        gender: <div>{user.details.gender || "-"}</div>,
        diet: <div>{user.details.diet || "-"}</div>,
        phone: <div>{user.mobileNumber || "-"}</div>,
        subscription: <div>{user?.subscription?.planType || "-"}</div>,
        bmiCategory: <div>{user.details?.bmi?.toFixed(3) || "-"}</div>,
        regDate: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
      }));

      setTotalCount(response.data?.data?.count || 0);

      return {
        data: formattedRows,
        total: response.data?.data?.count,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    setReload((prev) => prev + 1);
  }, [searchQuery, month]);

  const handlemonthFilter = (e) => {
    const selectedValue = e.target.value;
    setMonth(selectedValue);
    const selectedOption = monthOptions.find((option) => option.value === selectedValue);
    setSelectedMonthLabel(selectedOption ? selectedOption.label : "All");
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "200px",
          marginTop: "10px",
          marginLeft: "20px",
          marginBottom: "10px",
        }}
      >
        <Dropdown options={monthOptions} onChange={handlemonthFilter} label="Month" />
      </Box>

      {/* Show selected month and total count */}

      <Card sx={{ mt: 4 }}>
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
            Referral Details{" "}
          </MDTypography>
        </MDBox>
        <Box
          sx={{
            marginLeft: "20px",
            fontWeight: 500,
            fontSize: "16px",
            color: "#333",
            marginTop: "10px",
          }}
        >
          {selectedMonthLabel}: {totalCount} users
        </Box>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            // canSearch={true}
            noEndBorder
            reload={reload}
            fetchDataRows={fetchUsers}
            onSearch={(val) => {
              setSearchQuery(val);
            }}
          />
        </MDBox>
      </Card>

      {/* View User Popup */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ marginLeft: "20px" }}>User Details</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <div>
              <Box sx={{ gridColumn: "span 2", margin: 2, display: "flex", gap: 2 }}>
                <TextField
                  label="Name"
                  value={selectedUser.details.name}
                  disabled
                  sx={{ width: "50%" }}
                />
                <TextField
                  label="Phone"
                  value={selectedUser.mobileNumber}
                  sx={{ width: "50%" }}
                  disabled
                />
              </Box>

              <Box
                sx={{
                  gridColumn: "span 2",
                  margin: 2,
                  marginTop: "30px",
                  justifyContent: "center",
                  display: "flex",
                  gap: 2,
                }}
              >
                <TextField
                  label="Goal"
                  value={selectedUser.details.goal}
                  disabled
                  sx={{ width: "50%" }}
                />
                <TextField
                  label="BMI"
                  value={selectedUser.details.bmi}
                  disabled
                  sx={{ width: "50%" }}
                />
              </Box>

              <Box
                sx={{
                  gridColumn: "span 2",
                  margin: 2,
                  marginTop: "30px",
                  justifyContent: "center",
                  display: "flex",
                  gap: 2,
                }}
              >
                <TextField label="Subscription" disabled sx={{ width: "50%" }} />
                <TextField
                  label="Registered On"
                  value={new Date(selectedUser.createdAt).toLocaleString()}
                  disabled
                  sx={{ width: "50%" }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <MDButton
                  onClick={handleClose}
                  variant="gradient"
                  color="info"
                  sx={{ width: "20%" }}
                >
                  OK
                </MDButton>
              </Box>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Confirmation Popup */}
      <ConfirmationPopUp
        open={isOpen}
        onClose={handleClose}
        onSubmit={() => {}}
        title={"Block User"}
        content={"Are you sure you want to Block this User?"}
        description={"This action can be reverted later."}
      />

      {/* Unblock Confirmation Popup */}
      <ConfirmationPopUp
        open={isunBlockOpen}
        onClose={handleClose}
        onSubmit={() => {}}
        title={"UnBlock User"}
        content={"Are you sure you want to UnBlock this User?"}
        description={"This action can be reverted later."}
      />
    </DashboardLayout>
  );
};

export default UserManagement;
