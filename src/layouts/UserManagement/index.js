import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import ConfirmationPopUp from "components/confirmationPopup/page";

import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import MDButton from "components/MDButton";
import Dropdown from "components/Dropdown";
import { toast } from "react-toastify";
import capitalizeWords from "utils";
import { apiClient } from "api/apiClient";
import { Link } from "react-router-dom";

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
    { Header: "S no.", accessor: "sno", width: "5%", align: "left" },
    { Header: "name", accessor: "name", width: "25%", align: "left" },
    { Header: "Phone/Email", accessor: "phoneEmail", align: "left" },
    { Header: "Device", accessor: "device", align: "center" },
    { Header: "goal", accessor: "goal", align: "left" },
    { Header: "gender", accessor: "gender", align: "left" },
    { Header: "Scans", accessor: "scans", align: "left" },
    { Header: "Streak", accessor: "streak", align: "left" },
    { Header: "reg Date", accessor: "regDate", align: "left" },
    { Header: "subscription", accessor: "subscription", align: "left" },
    { Header: "status", accessor: "status", align: "left" },
    { Header: "added By", accessor: "addedBy", align: "left" },
    { Header: "Total Referrals", accessor: "referredUsersCount", align: "left" },
    { Header: "Referral Code", accessor: "referCode", align: "left" },
    {
      Header: "Referred Monthly Plan Users",
      accessor: "referredMonthlyPlanUsersCount",
      align: "left",
    },
    {
      Header: "Referred Yearly Plan Users",
      accessor: "referredYearlyPlanUsersCount",
      align: "left",
    },

    { Header: "purchase Date", accessor: "purchaseDate", align: "left" },
    { Header: "amount Paid", accessor: "amountPaid", align: "left" },
    { Header: "amount Refunded", accessor: "amountRefunded", align: "left" },
    { Header: "Disabled", accessor: "isDisabled", align: "left" },
    { Header: "deletion Requested At", accessor: "deletionRequestedAt", align: "left" },
    { Header: "action", accessor: "action", align: "left" },
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
      const baseURL = process.env.REACT_APP_API_URL;

      const url = new URL(`/api/v1/admin/user`, baseURL);

      const params = new URLSearchParams();

      if (goalFilter) params.append("goal", goalFilter);
      if (genderFilter) params.append("gender", genderFilter);
      if (diet) params.append("dietType", diet);
      if (bmiFilter) params.append("bmiCategory", bmiFilter);
      if (searchQuery) params.append("search", searchQuery);
      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);

      url.search = params.toString();

      const response = await apiClient.get(url.toString());
      const users = response.data?.data?.data || [];

      const formattedRows = users.map((user, index) => ({
        sno: <div>{pageSize * pageIndex + index + 1}</div>,
        name: <Link to={`/user/${user._id}`}>{capitalizeWords(user.details.name) || "User"}</Link>,
        goal: <div>{capitalizeWords(user.details.goal) || "-"}</div>,
        gender: <div>{capitalizeWords(user.details.gender) || "-"}</div>,
        scans: <div>{user.dailyFoodScans ?? "-"}</div>,
        streak: <div>{user.bestStreak || "0"}</div>,
        diet: <div>{capitalizeWords(user.details.diet) || "-"}</div>,
        phoneEmail: <div>{user.mobileNumber || user.email || "-"}</div>,
        device: <div>{capitalizeWords(user?.deviceInfo?.platform) || "-"}</div>,
        subscription: <div>{capitalizeWords(user?.subscription?.planType) || "-"}</div>,
        status: <div>{capitalizeWords(user?.subscription?.status) || "-"}</div>,
        addedBy: <div>{capitalizeWords(user?.subscription?.addedBy) || "-"}</div>,
        referredUsersCount: <div>{user.referredUsersCount || "0"}</div>,
        referCode: <div>{user.referCode || "0"}</div>,
        referredMonthlyPlanUsersCount: <div>{user.referredMonthlyPlanUsersCount || "0"}</div>,
        referredYearlyPlanUsersCount: <div>{user.referredYearlyPlanUsersCount || "0"}</div>,
        amountPaid: <div>{user?.subscription?.amountPaid || "0"}</div>,
        amountRefunded: <div>{user?.subscription?.amountRefunded || "0"}</div>,
        isDisabled: <div>{user?.isDisabled ? "Yes" : "No"}</div>,
        deletionRequestedAt: (
          <div>
            {user?.deletionRequestedAt
              ? new Date(user.deletionRequestedAt).toLocaleDateString("en-GB")
              : "-"}
          </div>
        ),
        purchaseDate: (
          <div>
            {user?.subscription?.purchaseDate
              ? new Date(user.subscription.purchaseDate).toLocaleDateString("en-GB")
              : "-"}
          </div>
        ),
        bmiCategory: <div>{user.details?.bmi?.toFixed(3) || "-"}</div>,
        regDate: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
        action: (
          <div>
            <Link to={`/user/${user._id}`}>
              <IconButton color="secondary">
                <VisibilityIcon />
              </IconButton>
            </Link>

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
    // Mapping status to Block and Unblock (1 = Block, 2 = Unblock)
    const url =
      user.isDisabled === true
        ? `${process.env.REACT_APP_API_URL}/api/v1/admin/user/${user._id}/enable`
        : `${process.env.REACT_APP_API_URL}/api/v1/admin/user/${user._id}/disable`;

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
        setReload(reload + 1);
        handleClose();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  function handlegoalFilter(e) {
    setGoalFilter(e.target.value);
  }

  function handledietFilter(e) {
    setDiet(e.target.value);
  }

  function handlegenderFilter(e) {
    setGenderFilter(e.target.value);
  }

  function handlebmiFilter(e) {
    setBmiFilter(e.target.value);
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
          <Dropdown options={goals} onChange={handlegoalFilter} label="Select Goal" />
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
          <Dropdown options={genderOptions} onChange={handlegenderFilter} label="Select Gender" />
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
          <Dropdown options={dietOptions} onChange={handledietFilter} label=" Select Diet" />
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
          <Dropdown options={bmiOptions} onChange={handlebmiFilter} label="Select BMI" />
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

        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            showTotalEntries={true}
            canSearch={true}
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
      <ConfirmationPopUp
        open={isOpen}
        onClose={handleClose}
        onSubmit={onsubmit}
        title={"Block User"}
        content={"Are you sure you want to Block this User?"}
        description={"This action can be reverted later."}
      />

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
