import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";
import {
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import MDBox from "components/MDBox";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
import MDTypography from "components/MDTypography";
import { toast, ToastContainer } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MDButton from "components/MDButton";
import capitalizeWords from "utils";

const ContactUs = () => {
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState(1);
  const [fullMessageOpen, setFullMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [renewOpen, setRenewOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingToggleUser, setPendingToggleUser] = useState(null);

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Subscription", accessor: "subscription", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "added By", accessor: "addedBy", align: "center" },

    { Header: "purchase Date", accessor: "purchaseDate", align: "center" },

    { Header: "amount Paid", accessor: "amountPaid", align: "center" },
    { Header: "amount Refunded", accessor: "amountRefunded", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const truncateWords = (text, wordLimit) => {
    const words = text?.split(" ") || [];
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    setFullMessageOpen(true);
  };

  const handleRenewClick = (userId) => {
    setSelectedUserId(userId);
    setSelectedPlan("");
    setRenewOpen(true);
  };

  const handleRenewSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/subscription/status`,
        {
          status: "renew",
          userId: selectedUserId,
          planType: selectedPlan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Subscription renewed successfully");
      setRenewOpen(false);
      setReload(reload + 1);
    } catch (error) {
      console.error("Renewal failed:", error);
      toast.error("Failed to renew subscription");
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    if (currentStatus === "active") {
      setPendingToggleUser({ userId, currentStatus });
      setConfirmOpen(true);
    } else {
      toggleStatus(userId, currentStatus);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const token = localStorage.getItem("token");
    if (currentStatus === "canceled") {
      toast.error("Subscription is already canceled");
      return;
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/subscription/status`,
        {
          status: "cancel",
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Subscription canceled successfully");

      setReload(reload + 1);
    } catch (error) {
      const apiMessage = error.response?.data?.message || "Failed to update user status";
      toast.error(apiMessage);
      console.error("API Error:", error);
    }
  };

  const fetchUsers = async ({ pageIndex, pageSize }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${process.env.REACT_APP_API_URL}/api/v1/admin/user`);

      const params = new URLSearchParams();
      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);
      if (searchQuery) params.append("search", searchQuery);

      url.search = params.toString();

      const response = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = response.data?.data.data || [];

      const formattedRows = users.map((user, index) => {
        const status = user?.subscription?.status;
        return {
          sno: <div>{pageSize * pageIndex + index + 1}</div>,
          name: <div>{user.details.name || "N/A"}</div>,
          phone: <div>{user.mobileNumber}</div>,
          subscription: <div>{capitalizeWords(user?.subscription?.planType) || "-"}</div>,
          status: <div>{capitalizeWords(user?.subscription?.status) || "-"}</div>,
          addedBy: <div>{capitalizeWords(user?.subscription?.addedBy) || "-"}</div>,

          purchaseDate: (
            <div>
              {" "}
              {user?.subscription?.purchaseDate
                ? new Date(user.subscription.purchaseDate).toLocaleDateString("en-GB")
                : "-"}
            </div>
          ),
          amountPaid: <div>{user?.subscription?.amountPaid || "0"}</div>,
          amountRefunded: <div>{user?.subscription?.amountRefunded || "0"}</div>,

          action: (
            <>
              <IconButton color="primary" onClick={() => handleRenewClick(user._id)}>
                <AutorenewIcon />
              </IconButton>
              <IconButton
                color={status === "active" ? "success" : "error"}
                onClick={() => handleToggleStatus(user._id, status)}
              >
                {status === "active" ? <CheckCircleIcon /> : <CancelIcon />}
              </IconButton>
            </>
          ),
        };
      });

      return {
        data: formattedRows,
        total: response.data?.data?.count,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    setReload(reload + 1);
  }, [searchQuery]);
  return (
    <DashboardLayout>
      {/* <ToastContainer /> */}
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
            Subscription & Payment Management
          </MDTypography>
        </MDBox>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            fetchDataRows={fetchUsers}
            canSearch={true}
            onSearch={(val) => {
              setSearchQuery(val);
            }}
            noEndBorder
            reload={reload}
          />
        </MDBox>
      </Card>

      {/* Full Message Dialog */}
      <Dialog
        open={fullMessageOpen}
        onClose={() => setFullMessageOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Full Message
          <IconButton
            aria-label="close"
            onClick={() => setFullMessageOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <MDAlertCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{selectedMessage}</DialogContent>
      </Dialog>

      {/* Renew Subscription Dialog */}
      <Dialog open={renewOpen} onClose={() => setRenewOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          Renew Subscription
          <IconButton
            aria-label="close"
            onClick={() => setRenewOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <MDAlertCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="plan-select-label">Plan Type</InputLabel>
            <Select
              labelId="plan-select-label"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              label="Plan Type"
              sx={{ height: "40px" }}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton
            variant="outlined"
            sx={{
              width: "90%",
              backgroundColor: "#E1E1E1",
              color: "gray",
              "&:hover": {
                border: "1px solid #164275",
                color: "#164275",
                backgroundColor: "white",
              },
            }}
            onClick={() => setRenewOpen(false)}
          >
            Cancel
          </MDButton>
          <MDButton
            onClick={handleRenewSubmit}
            disabled={!selectedPlan}
            sx={{ width: "90%" }}
            variant="gradient"
            color="info"
          >
            Submit
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Confirm Inactivation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
          Confirm Inactivation
        </DialogTitle>
        <DialogContent sx={{ marginTop: "4px" }}>
          Are you sure you want to mark this user as inactive?
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              width: "90%",
              backgroundColor: "#E1E1E1",
              color: "gray",
              "&:hover": {
                border: "1px solid #164275",
                color: "#164275",
                backgroundColor: "white",
              },
            }}
          >
            Cancel
          </MDButton>
          <MDButton
            onClick={() => {
              if (pendingToggleUser) {
                toggleStatus(pendingToggleUser.userId, pendingToggleUser.currentStatus);
              }
              setConfirmOpen(false);
            }}
            sx={{ width: "90%" }}
            variant="gradient"
            color="info"
          >
            Yes, Inactivate
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ContactUs;
