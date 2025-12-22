import { useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MDButton from "components/MDButton";
import ConfirmationPopUp from "components/confirmationPopup/page";
import { toast } from "react-toastify";
import capitalizeWords from "utils";
import { Link } from "react-router-dom";
import UserQRCode from "components/Common/QR_Code_Generator";

const ReferralCode = () => {
  const [loading, setLoading] = useState(false); // Add this

  const [rows, setRows] = useState([]);
  const [user, setUser] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [reload, setReload] = useState(1);
  const [iseditconfirmopen, setIseditconfirmopen] = useState(false);
  const [editStoryId, setEditStoryId] = useState(null);

  const [storyForm, setStoryForm] = useState({
    userName: "",
    userProfile: "",
    mobileNumber: "",
  });

  const handleClose = () => {
    setConfirmOpen(false);
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setIseditconfirmopen(false);
    setUser({});
    setStoryForm({ userName: "", userProfile: "" });
    setStoryToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateStory = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true); // start loading

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/special-user`,
        {
          name: storyForm.userName,
          specialUserType: storyForm.userProfile,
          mobileNumber: storyForm.mobileNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Referral code created successfully");
      setReload(reload + 1);
    } catch (err) {
      console.error("Referral creation failed:", err);

      const errorMessage =
        err?.response?.data?.message || // Most common
        err?.response?.data?.error || // Some APIs use this
        (Array.isArray(err?.response?.data?.errors) && err.response.data.errors[0]?.msg) || // If error is an array
        "Failed to create referral code"; // Fallback message

      toast.error(errorMessage);
    } finally {
      setLoading(false); // start loading
    }
  };

  const handleEditStory = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true); // start loading

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/special-user/${editStoryId}`,
        {
          name: storyForm.userName,
          specialUserType: storyForm.userProfile,
          // mobileNumber: storyForm.mobileNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Referral code updated successfully");
      setReload(reload + 1);
      handleClose();
    } catch (err) {
      console.error("Referral update failed:", err);
      toast.error("Failed to update referral code");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleEditPopup = (story) => {
    setEditDialogOpen(true);
    setEditStoryId(story._id);
    setStoryForm({
      userName: story.details?.name || "",
      userProfile: story.specialUserType || "",
    });
  };

  const handleDelete = (id) => {
    setStoryToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/special-user/${storyToDelete}/disable`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Referral code deleted successfully");
      setConfirmOpen(false);
      setReload(reload + 1);
      handleClose();
    } catch (error) {
      console.error("Failed to delete referral code:", error);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async ({ pageIndex, pageSize }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${process.env.REACT_APP_API_URL}/api/v1/admin/special-user`);
      const params = new URLSearchParams();

      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);

      url.search = params.toString();

      const response = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = response.data?.data?.data || [];
      const formattedRows = users.map((user, index) => ({
        sno: <div>{pageSize * pageIndex + index + 1}</div>,
        createdAt: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
        name: (
          <Link to={`/referral/${user._id}`}>
            {capitalizeWords(user.userName || user.details?.name) || "N/A"}
          </Link>
        ),
        mobileNumber: <div>{user.mobileNumber}</div>,

        specialUserType: <div>{capitalizeWords(user.userProfile || user.specialUserType)}</div>,
        specialUserIndex: <div>{user.referredUsersCount || 0}</div>,
        referCode: <div>{user.referCode}</div>,
        qrCodeString: <UserQRCode qrCodeString={user?.qrCodeString} /> || <div>-</div>,
        action: (
          <div>
            <IconButton color="secondary" onClick={() => handleEditPopup(user)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(user._id)}>
              <DeleteIcon />
            </IconButton>
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

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "User Name", accessor: "name", align: "center" },
    { Header: "User Profile", accessor: "specialUserType", align: "center" },
    { Header: "Total Referral Users", accessor: "specialUserIndex", align: "center" },
    { Header: "ReferralCode", accessor: "referCode", align: "center" },
    { Header: "Mobile Number", accessor: "mobileNumber", align: "center" },
    { Header: "QR Code", accessor: "qrCodeString", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  return (
    <DashboardLayout>
      <Card sx={{ mt: 3 }}>
        <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg">
          <MDTypography variant="h6" color="white">
            Referral Code
          </MDTypography>
        </MDBox>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{ defaultValue: 10, values: [5, 10, 20, 50] }}
            showTotalEntries={true}
            fetchDataRows={fetchUsers}
            reload={reload}
            noEndBorder
            button={
              <MDButton variant="gradient" color="info" onClick={() => setCreateDialogOpen(true)}>
                Add Code
              </MDButton>
            }
          />
        </MDBox>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {editDialogOpen ? "Edit Referral Code" : "Create Referral Code"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="userName"
            label="User Name"
            value={storyForm.userName}
            onChange={handleInputChange}
          />
          {!editDialogOpen && (
            <TextField
              fullWidth
              margin="normal"
              name="mobileNumber"
              label="Mobile Number"
              value={storyForm.mobileNumber}
              onChange={handleInputChange}
            />
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel id="user-profile-label">User Profile</InputLabel>
            <Select
              labelId="user-profile-label"
              name="userProfile"
              value={storyForm.userProfile}
              onChange={handleInputChange}
              label="User Profile"
              sx={{ height: "45px" }}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="influencer">Influencer</MenuItem>
              <MenuItem value="fitness-coach">Fitness Coach</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton
            variant="outlined"
            onClick={handleClose}
            fullWidth
            sx={{ color: "gray", backgroundColor: "#E1E1E1" }}
            disabled={loading}
          >
            Cancel
          </MDButton>
          <MDButton
            onClick={editDialogOpen ? () => setIseditconfirmopen(true) : handleCreateStory}
            variant="gradient"
            color="info"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                {editDialogOpen ? "Updating..." : "Creating..."}
              </>
            ) : editDialogOpen ? (
              "Update"
            ) : (
              "Create"
            )}
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this code?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Edit */}
      <ConfirmationPopUp
        open={iseditconfirmopen}
        onClose={() => setIseditconfirmopen(false)}
        onSubmit={handleEditStory}
        title={"Edit Referral Code"}
        content={"Are you sure you want to edit this code?"}
        description={"This action can be reverted later."}
      />
      <ConfirmationPopUp
        open={confirmOpen}
        onClose={handleClose}
        onSubmit={confirmDelete}
        title={"Delete Referral Code"}
        content={"Are you sure you want to Delete this code?"}
        description={"This action cant be reverted later."}
      />
    </DashboardLayout>
  );
};

export default ReferralCode;
