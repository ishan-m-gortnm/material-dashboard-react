import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import ConfirmationPopUp from "components/confirmationPopup/page";
// import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";

import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Box,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import Approve from "components/BlockModal/page";
import UnBlock from "components/UnBlockModal/page";
import MDButton from "components/MDButton";
import Dropdown from "components/Dropdown";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isunBlockOpen, setIsunBlockOpen] = useState(false);
  const [goalFilter, setGoalFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [bmiFilter, setBmiFilter] = useState("");
  const [diet, setDiet] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reload, setReload] = useState(1);

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
    { Header: "action", accessor: "action", align: "center" },
  ];

  const goals = [
    { label: "All", value: "" },
    { label: "Gain weight", value: "gain_weight" },
    { label: "Loose weight", value: "loose_weight" },
    { label: "Maintain weight", value: "maintain_weight" },
  ];

  const genderOptions = [
    { label: "All", value: "" },
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const dietOptions = [
    { label: "All", value: "" },
    { label: "classic", value: "classic" },
    { label: "pescatarian", value: "pescatarian" },
    { label: "vegetarian", value: "vegetarian" },
    { label: "vegan", value: "vegan" },
  ];

  const bmiOptions = [
    { label: "All", value: "" },
    { label: "underweight", value: "underweight" },
    { label: "normal", value: "normal" },
    { label: "overweight", value: "overweight" },
    { label: "obese", value: "obese" },
    { label: "morbidlyObese", value: "morbidly_obese" },
  ];
  const handleView = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setOpen(false);
    setIsunBlockOpen(false);
    setUser(null);
  };

  const handleBlockToggle = (user, status) => {
    setObj({ ...user, status: status.toString() });
    setIsOpen(true);
  };

  const fetchUsers = async ({ pageIndex, pageSize, globalFilter }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/user");

      const params = new URLSearchParams();
      if (goalFilter) params.append("goal", goalFilter);
      if (genderFilter) params.append("gender", genderFilter);
      if (diet) params.append("dietType", diet);
      if (bmiFilter) params.append("bmiCategory", bmiFilter);
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
        name: <a href={`/user/${user._id}`}>{user.details.name || "-"}</a>,
        goal: <div>{user.details.goal || "-"}</div>,
        gender: <div>{user.details.gender || "-"}</div>,
        diet: <div>{user.details.diet || "-"}</div>,
        phone: <div>{user.mobileNumber || "-"}</div>,
        subscription: <div>{user?.subscription?.planType || "-"}</div>,
        bmiCategory: <div>{user.details?.bmi?.toFixed(3) || "-"}</div>,
        regDate: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
        action: (
          <div>
            <a href={`/user/${user._id}`}>
              <IconButton color="secondary">
                <VisibilityIcon />
              </IconButton>
            </a>
            {user.isDisabled ? (
              <IconButton
                color="secondary"
                onClick={() => {
                  setIsunBlockOpen(true);
                  setUser(user);
                }}
              >
                <FaLock />{" "}
              </IconButton>
            ) : (
              <IconButton
                color="secondary"
                onClick={() => {
                  setIsOpen(true);
                  setUser(user);
                }}
              >
                <FaLockOpen />{" "}
              </IconButton>
            )}
          </div>
        ),
      }));

      return {
        data: formattedRows,
        total: response.data?.data?.count,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    // fetchUsers();
    setReload(reload + 1);
  }, [goalFilter, genderFilter, searchQuery, diet, bmiFilter]);

  const onsubmit = async () => {
    console.log(user, "user"); // Check the data on submit

    // Mapping status to Block and Unblock (1 = Block, 2 = Unblock)
    const url =
      user.isDisabled === true
        ? `https://api.qa.nutriverseai.in/api/v1/admin/user/${user._id}/enable`
        : `https://api.qa.nutriverseai.in/api/v1/admin/user/${user._id}/disable`;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Status updated successfully");
        toast.success("Status updated successfully");
        // fetchUsers();
        setReload(reload + 1);
        handleClose();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  function handlegoalFilter(e) {
    console.log(e.target.value, "ishan");
    setGoalFilter(e.target.value);
    // setPage(0);
    // setSearchKeyword("");
  }

  function handledietFilter(e) {
    console.log(e.target.value, "ishan");
    setDiet(e.target.value);
    // setPage(0);
    // setSearchKeyword("");
  }

  function handlegenderFilter(e) {
    console.log(e.target.value, "ishan");
    setGenderFilter(e.target.value);
    // setPage(0);
    // setSearchKeyword("");
  }

  function handlebmiFilter(e) {
    console.log(e.target.value, "ishan");
    setBmiFilter(e.target.value);
    // setPage(0);
    // setSearchKeyword("");
  }
  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <Box sx={{ display: "flex" }}>
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
          <Dropdown options={goals} onChange={handlegoalFilter} label="Goal" />
        </Box>
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
          <Dropdown
            options={genderOptions}
            onChange={handlegenderFilter}
            label="Gender"
            // IconComponent={ArrowDropDownIcon}
          />
        </Box>
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
          <Dropdown options={dietOptions} onChange={handledietFilter} label="Diet" />
        </Box>
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
          <Dropdown options={bmiOptions} onChange={handlebmiFilter} label="BMI" />
        </Box>
      </Box>
      <Card sx={{ mt: 5 }}>
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
            User Management
          </MDTypography>
        </MDBox>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "200px",
            marginTop: "20px",
            marginLeft: "20px",
          }}
        >
          <Dropdown options={goals} onChange={handlegoalFilter} label="Gender" />
        </Box> */}
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            canSearch={true}
            noEndBorder
            reload={reload}
            fetchDataRows={fetchUsers}
            onSearch={(val) => {
              setSearchQuery(val);
              // setPage(0); // reset to first page on new search
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
              <Box
                sx={{
                  gridColumn: "span 2",
                  margin: 2,
                  display: "flex",
                  gap: 2,
                }}
              >
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
                <TextField
                  label="Subscription"
                  // value={selectedUser.subscription}
                  disabled
                  sx={{ width: "50%" }}
                />
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
      {/* {isOpen && <Approve onClose={handleClose} onsubmit={onsubmit} isOpen={isOpen} />} */}
      <ConfirmationPopUp
        open={isOpen}
        onClose={handleClose}
        onSubmit={onsubmit}
        title={"Block User"}
        content={"Are you sure you want to Block this User?"}
        description={"This action can be reverted later."}
      />
      {/* {isunBlockOpen && (
        <UnBlock onClose={handleClose} onsubmit={onsubmit} isOpen={isunBlockOpen} />
      )} */}
      <ConfirmationPopUp
        open={isunBlockOpen}
        onClose={handleClose}
        onSubmit={onsubmit}
        title={"UnBlock User"}
        content={"Are you sure you want to UnBlock this User?"}
        description={"This action can be reverted later."}
      />
    </DashboardLayout>
  );
};

export default UserManagement;
