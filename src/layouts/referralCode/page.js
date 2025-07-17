// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DataTable from "examples/Tables/DataTable";
// import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";

// import {
//   Card,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   TextField,
//   Box,
//   Button,
//   Typography,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
// } from "@mui/material";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import { FaLock, FaLockOpen } from "react-icons/fa";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MDButton from "components/MDButton";
// import ConfirmationPopUp from "components/confirmationPopup/page";
// import { toast } from "react-toastify";

// const ReferralCode = () => {
//   const [rows, setRows] = useState([]);
//   const [user, setUser] = useState({});
//   const [isOpen, setIsOpen] = useState(false);
//   const [isunBlockOpen, setIsunBlockOpen] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [storyToDelete, setStoryToDelete] = useState(null);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [storyForm, setStoryForm] = useState({ text: "", type: "", duration: 24, image: null });
//   const [preview, setPreview] = useState(null);
//   const [editStoryId, setEditStoryId] = useState(null);
//   const [reload, setReload] = useState(1);
//   const [iseditconfirmopen, setIseditconfirmopen] = useState(false);
//   const [fullTextDialog, setFullTextDialog] = useState({ open: false, content: "" });

//   const handleClose = () => {
//     setIsOpen(false);
//     setIsunBlockOpen(false);
//     setConfirmOpen(false);
//     setCreateDialogOpen(false);
//     setEditDialogOpen(false);
//     setIseditconfirmopen(false);
//     setUser({});
//     setStoryForm({ text: "", type: "", duration: 24, image: null });
//     setPreview(null);
//     setStoryToDelete(null);
//     setFullTextDialog({ open: false, content: "" });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStoryForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreateStory = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       await axios.post(
//         "https://api.qa.nutriverseai.in/api/v1/admin/special-user",
//         {
//           text: storyForm.text,
//           type: storyForm.type,
//           duration: Number(storyForm.duration),
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Story created successfully");
//       setReload(reload + 1);
//       handleClose();
//     } catch (err) {
//       console.error("Story creation failed:", err);
//     }
//   };

//   const handleEditStory = async () => {
//     const token = localStorage.getItem("token");
//     const imageUrl =
//       storyForm.image instanceof File ? await handleImageUpload(storyForm.image) : storyForm.image;

//     try {
//       await axios.patch(
//         `https://api.qa.nutriverseai.in/api/v1/admin/story/${editStoryId}`,
//         {
//           text: storyForm.text,
//           type: storyForm.type,
//           duration: Number(storyForm.duration),
//           ...(imageUrl && { fileUrl: imageUrl }),
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Story updated successfully");
//       setReload(reload + 1);
//       handleClose();
//     } catch (err) {
//       console.error("Story update failed:", err);
//     }
//   };

//   const handleEditPopup = (story) => {
//     setEditDialogOpen(true);
//     setEditStoryId(story._id);
//     setStoryForm({
//       text: story.text,
//       type: story.type,
//       duration: story.duration || 24,
//       image: story.image,
//     });
//     setPreview(story.image);
//   };

//   const handleDelete = (id) => {
//     setStoryToDelete(id);
//     setConfirmOpen(true);
//   };

//   const confirmDelete = async () => {
//     const token = localStorage.getItem("token");
//     console.log(token, "ishan");
//     try {
//       await axios.patch(
//         `https://api.qa.nutriverseai.in/api/v1/admin/special-user/${storyToDelete}/disable`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Referral Code deleted successfully");
//       setConfirmOpen(false);
//       setReload(reload + 1);
//       handleClose();
//     } catch (error) {
//       console.error("Failed to delete story:", error);
//     }
//   };

//   const onsubmit = async () => {
//     const url =
//       user.isDisabled === true
//         ? `https://api.qa.nutriverseai.in/api/v1/admin/story/${user._id}/enable`
//         : `https://api.qa.nutriverseai.in/api/v1/admin/story/${user._id}/disable`;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });
//       setReload(reload + 1);
//       toast.success("Status updated successfully");
//       handleClose();
//     } catch (error) {
//       console.error("Failed to update status:", error);
//     }
//   };

//   const fetchUsers = async ({ pageIndex, pageSize }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/special-user");
//       const params = new URLSearchParams();

//       if (pageSize) params.append("limit", pageSize);
//       if (pageIndex) params.append("page", pageIndex);

//       url.search = params.toString();

//       const response = await axios.get(url.toString(), {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const users = response.data?.data?.data || [];
//       const formattedRows = users.map((user, index) => ({
//         sno: <div>{pageSize * pageIndex + index + 1}</div>,
//         createdAt: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
//         name: <div>{user.details.name}</div>,
//         specialUserType: <div>{user.specialUserType}</div>,
//         specialUserIndex: <div>{"1"}</div>,
//         referCode: <div>{user.referCode}</div>,

//         action: (
//           <div>
//             <IconButton color="secondary" onClick={() => handleEditPopup(user)}>
//               <EditIcon />
//             </IconButton>
//             {/* <IconButton
//               color="secondary"
//               onClick={() => {
//                 user.isDisabled ? setIsunBlockOpen(true) : setIsOpen(true);
//                 setUser(user);
//               }}
//             >
//               {user.isDisabled ? <FaLock /> : <FaLockOpen />}
//             </IconButton> */}
//             <IconButton color="error" onClick={() => handleDelete(user._id)}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         ),
//       }));

//       return {
//         data: formattedRows,
//         total: response.data?.data?.count,
//       };
//     } catch (error) {
//       console.error("Error fetching stories:", error);
//     }
//   };

//   const columns = [
//     { Header: "S.No", accessor: "sno", align: "center" },
//     { Header: "User Name", accessor: "name", align: "center" },
//     { Header: "User Profile", accessor: "specialUserType", align: "center" },
//     { Header: "Total Refferal Users", accessor: "specialUserIndex", align: "center" },
//     { Header: "ReferralCode", accessor: "referCode", align: "center" },
//     { Header: "Action", accessor: "action", align: "center" },
//   ];

//   return (
//     <DashboardLayout>
//       <Card sx={{ mt: 3 }}>
//         <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg">
//           <MDTypography variant="h6" color="white">
//             Referral Code{" "}
//           </MDTypography>
//         </MDBox>
//         <MDBox>
//           <DataTable
//             table={{ columns, rows }}
//             isSorted={false}
//             entriesPerPage={{ defaultValue: 10, values: [5, 10, 20, 50] }}
//             showTotalEntries={true}
//             fetchDataRows={fetchUsers}
//             reload={reload}
//             canSearch={true}
//             noEndBorder
//             button={
//               <MDButton variant="gradient" color="info" onClick={() => setCreateDialogOpen(true)}>
//                 Add Code
//               </MDButton>
//             }
//           />
//         </MDBox>
//       </Card>

//       {/* Dialog for Create/Edit Story */}
//       <Dialog
//         open={createDialogOpen || editDialogOpen}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="xs"
//       >
//         <DialogTitle>{editDialogOpen ? "Edit Referral Code" : "Create Referral Code"}</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="type-label">Type</InputLabel>
//             <Select
//               labelId="type-label"
//               value={storyForm.type}
//               label="Type"
//               onChange={handleInputChange}
//               name="type"
//               sx={{ height: "45px" }}
//               IconComponent={ArrowDropDownIcon}
//             >
//               <MenuItem value="text">Text</MenuItem>
//               <MenuItem value="image">Image</MenuItem>
//               <MenuItem value="video">Video</MenuItem>
//             </Select>
//           </FormControl>
//           {storyForm.type === "text" && (
//             <TextField
//               fullWidth
//               margin="normal"
//               name="text"
//               label="Text"
//               value={storyForm.text}
//               onChange={handleInputChange}
//             />
//           )}
//           <TextField
//             fullWidth
//             margin="normal"
//             name="duration"
//             label="Duration (in hrs)"
//             type="number"
//             value={storyForm.duration}
//             onChange={handleInputChange}
//           />
//           {(storyForm.type === "image" || storyForm.type === "video") && (
//             <Button component="label" variant="outlined" sx={{ mt: 2, color: "gray" }}>
//               Upload File
//               <input type="file" hidden onChange={handleImageChange} />
//             </Button>
//           )}
//           {preview && (
//             <Box mt={2}>
//               <Typography variant="subtitle2">Preview:</Typography>
//               <img
//                 src={preview}
//                 alt="preview"
//                 style={{ width: "100%", maxHeight: "300px", borderRadius: "8px" }}
//               />
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <MDButton
//             variant="outlined"
//             onClick={handleClose}
//             fullWidth
//             sx={{ color: "gray", backgroundColor: "#E1E1E1" }}
//           >
//             Cancel
//           </MDButton>
//           <MDButton
//             onClick={editDialogOpen ? () => setIseditconfirmopen(true) : handleCreateStory}
//             disabled={uploading}
//             variant="gradient"
//             color="info"
//             fullWidth
//           >
//             {uploading ? "Uploading..." : editDialogOpen ? "Update" : "Create"}
//           </MDButton>
//         </DialogActions>
//       </Dialog>

//       {/* Confirmation and Full Text Modals */}
//       <Dialog open={confirmOpen} onClose={handleClose}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>Are you sure you want to delete this story?</DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={confirmDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <ConfirmationPopUp
//         open={isOpen}
//         onClose={handleClose}
//         onSubmit={onsubmit}
//         title={"Disable Story"}
//         content={"Are you sure you want to Disable this Story?"}
//         description={"This action can be reverted later."}
//       />
//       <ConfirmationPopUp
//         open={isunBlockOpen}
//         onClose={handleClose}
//         onSubmit={onsubmit}
//         title={"Enable Story"}
//         content={"Are you sure you want to Enable this Story?"}
//         description={"This action can be reverted later."}
//       />
//       <ConfirmationPopUp
//         open={iseditconfirmopen}
//         onClose={() => setIseditconfirmopen(false)}
//         onSubmit={handleEditStory}
//         title={"Edit Story"}
//         content={"Are you sure you want to Edit this Story?"}
//         description={"This action can be reverted later."}
//       />
//       <ConfirmationPopUp
//         open={confirmOpen}
//         onClose={handleClose}
//         onSubmit={confirmDelete}
//         title={"Edit Story"}
//         content={"Are you sure you want to Delete this Code?"}
//         description={"This action can't be reverted later."}
//       />
//       <Dialog open={fullTextDialog.open} onClose={handleClose}>
//         <DialogTitle>Full Story Text</DialogTitle>
//         <DialogContent>
//           <Typography>{fullTextDialog.content}</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </DashboardLayout>
//   );
// };

// export default ReferralCode;

import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MDButton from "components/MDButton";
import ConfirmationPopUp from "components/confirmationPopup/page";
import { toast } from "react-toastify";

const ReferralCode = () => {
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

  // const handleCreateStory = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     await axios.post(
  //       "https://api.qa.nutriverseai.in/api/v1/admin/special-user",
  //       {
  //         name: storyForm.userName,
  //         specialUserType: storyForm.userProfile,
  //         mobileNumber: storyForm.mobileNumber,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     toast.success("Referral code created successfully");
  //     setReload(reload + 1);
  //     handleClose();
  //   } catch (err) {
  //     console.error("Referral creation failed:", err);
  //     toast.error("Failed to create referral code");
  //   }
  // };
  const handleCreateStory = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "https://api.qa.nutriverseai.in/api/v1/admin/special-user",
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
      handleClose();
    } catch (err) {
      console.error("Referral creation failed:", err);

      const errorMessage =
        err?.response?.data?.message || // Most common
        err?.response?.data?.error || // Some APIs use this
        (Array.isArray(err?.response?.data?.errors) && err.response.data.errors[0]?.msg) || // If error is an array
        "Failed to create referral code"; // Fallback message

      toast.error(errorMessage);
    }
  };

  const handleEditStory = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `https://api.qa.nutriverseai.in/api/v1/admin/special-user/${editStoryId}`,
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
    }
  };

  const handleEditPopup = (story) => {
    setEditDialogOpen(true);
    setEditStoryId(story._id);
    setStoryForm({
      userName: story.details?.name || "",
      userProfile: story.specialUserType || "",
      // mobileNumber: story.mobileNumber || "",
    });
  };

  const handleDelete = (id) => {
    setStoryToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `https://api.qa.nutriverseai.in/api/v1/admin/special-user/${storyToDelete}/disable`,
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
    }
  };

  const fetchUsers = async ({ pageIndex, pageSize }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/special-user");
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
        name: <div>{user.userName || user.details?.name}</div>,
        mobileNumber: <div>{user.mobileNumber}</div>,

        specialUserType: <div>{user.userProfile || user.specialUserType}</div>,
        specialUserIndex: <div>{user.referredUsersCount || 0}</div>,
        referCode: <div>{user.referCode}</div>,
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
            // canSearch={true}
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
          >
            Cancel
          </MDButton>
          <MDButton
            onClick={editDialogOpen ? () => setIseditconfirmopen(true) : handleCreateStory}
            variant="gradient"
            color="info"
            fullWidth
          >
            {editDialogOpen ? "Update" : "Create"}
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this code?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
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
