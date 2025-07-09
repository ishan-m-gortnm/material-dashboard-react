// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DataTable from "examples/Tables/DataTable";
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
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { FaLock, FaLockOpen } from "react-icons/fa";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MDButton from "components/MDButton";
// import Approve from "components/EnableModal/page";
// import UnBlock from "components/DisableModal/page";
// import ConfirmationPopUp from "components/confirmationPopup/page";
// import { toast, ToastContainer } from "react-toastify";

// const StoryManagement = () => {
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
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStoryForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setStoryForm((prev) => ({ ...prev, image: file }));
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleImageUpload = async (file) => {
//     const token = localStorage.getItem("token");
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setUploading(true);
//       const res = await axios.post(
//         "https://api.qa.nutriverseai.in/api/v1/admin/story/upload",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setUploading(false);
//       return res.data.data.fileUrl;
//     } catch (err) {
//       setUploading(false);
//       console.error("Image upload failed:", err);
//     }
//   };

//   const handleCreateStory = async () => {
//     const token = localStorage.getItem("token");
//     const imageUrl =
//       storyForm.image instanceof File ? await handleImageUpload(storyForm.image) : storyForm.image;

//     try {
//       await axios.post(
//         "https://api.qa.nutriverseai.in/api/v1/admin/story",
//         {
//           text: storyForm.text.length > 0 ? storyForm.text : undefined,
//           type: storyForm.type,
//           duration: Number(storyForm.duration),
//           ...(imageUrl && { fileUrl: imageUrl }),
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       // fetchUsers();
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
//       // fetchUsers();
//       toast.success("Story updated successfully");
//       setReload(reload + 1);
//       handleClose();
//     } catch (err) {
//       console.error("Story update failed:", err);
//     }
//   };

//   const handleEditPopup = (story) => {
//     if ("Are you sure you want to edit this story?") {
//       setEditDialogOpen(true);
//       setEditStoryId(story._id);
//       setStoryForm({
//         text: story.text,
//         type: story.type,
//         duration: story.duration || 24,
//         image: story.image,
//       });
//       setPreview(story.image);
//     }
//   };

//   const handleDelete = (id) => {
//     setStoryToDelete(id);
//     setConfirmOpen(true);
//   };

//   const confirmDelete = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       await axios.delete(
//         `https://api.qa.nutriverseai.in/api/v1/admin/user/story/${storyToDelete}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       // fetchUsers();
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
//       // fetchUsers();
//       setReload(reload + 1);
//       toast.success("Status updated successfully");
//       handleClose();
//     } catch (error) {
//       console.error("Failed to update status:", error);
//     }
//   };

//   const fetchUsers = async ({ pageIndex, pageSize, globalFilter }) => {
//     try {
//       const token = localStorage.getItem("token");
//       // const response = await axios.get(
//       //   "https://api.qa.nutriverseai.in/api/v1/admin/story?page=0&limit=10",
//       //   {
//       //     headers: { Authorization: `Bearer ${token}` },
//       //   }
//       // );
//       const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/story");

//       const params = new URLSearchParams();

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
//         sno: <div>{index + 1}</div>,
//         createdAt: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
//         expiresAt: <div>{new Date(user.expiresAt).toLocaleDateString()}</div>,
//         text: <div>{user.text || "Na"}</div>,
//         type: <div>{user.type}</div>,
//         // fileUrl: <div>{user.fileUrl}</div>,
//         ...(user.type === "image"
//           ? {
//               image: (
//                 <img
//                   src={user.fileUrl}
//                   alt="preview"
//                   style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
//                 />
//               ),
//             }
//           : {
//               image: <div>Na </div>,
//             }),
//         action: (
//           <div>
//             <IconButton color="secondary" onClick={() => handleEditPopup(user)}>
//               <EditIcon />
//             </IconButton>
//             {user.isDisabled ? (
//               <IconButton
//                 color="secondary"
//                 onClick={() => {
//                   setIsunBlockOpen(true);
//                   setUser(user);
//                 }}
//               >
//                 <FaLock />
//               </IconButton>
//             ) : (
//               <IconButton
//                 color="secondary"
//                 onClick={() => {
//                   setIsOpen(true);
//                   setUser(user);
//                 }}
//               >
//                 <FaLockOpen />
//               </IconButton>
//             )}
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

//   useEffect(() => {
//     // fetchUsers();
//   }, []);

//   const columns = [
//     { Header: "S.No", accessor: "sno", align: "center" },
//     { Header: "created At", accessor: "createdAt", align: "center" },
//     { Header: "expires At", accessor: "expiresAt", width: "25%", align: "left" },
//     { Header: "text", accessor: "text", align: "center" },
//     { Header: "type", accessor: "type", align: "center" },
//     { Header: "image", accessor: "image", align: "center" },

//     { Header: "action", accessor: "action", align: "center" },
//   ];

//   return (
//     <DashboardLayout>
//       {/* <DashboardNavbar /> */}
//       <Card sx={{ mt: 3 }}>
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
//             Story Management
//           </MDTypography>
//         </MDBox>

//         <MDBox>
//           <DataTable
//             table={{ columns, rows }}
//             isSorted={false}
//             entriesPerPage={true}
//             showTotalEntries={true}
//             fetchDataRows={fetchUsers}
//             reload={reload}
//             canSearch={true}
//             noEndBorder
//             button={
//               <MDButton variant="gradient" color="info" onClick={() => setCreateDialogOpen(true)}>
//                 Add Story
//               </MDButton>
//             }
//           />
//         </MDBox>
//       </Card>

//       {/* Create/Edit Dialog */}
//       <Dialog
//         open={createDialogOpen || editDialogOpen}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="xs"
//       >
//         <DialogTitle sx={{ alignItems: "center", display: "flex", justifyContent: "center" }}>
//           {editDialogOpen ? "Edit Story" : "Create Story"}
//         </DialogTitle>
//         <DialogContent>
//           {/* {storyForm.type === "text" && (
//             <TextField
//               fullWidth
//               margin="normal"
//               name="text"
//               label="Text"
//               value={storyForm.text}
//               onChange={handleInputChange}
//             />
//           )} */}

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="type-label">Type</InputLabel>
//             <Select
//               labelId="type-label"
//               id="type-select"
//               value={storyForm.type}
//               label="Type"
//               onChange={handleInputChange}
//               name="type"
//               sx={{ height: "45px" }}
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
//             <Button
//               component="label"
//               variant="outlined"
//               color="primary"
//               sx={{ mt: 2, color: "gray" }}
//             >
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
//             sx={{
//               width: "95%",
//               backgroundColor: "#E1E1E1",
//               color: "gray",
//               "&:hover": {
//                 border: "1px solid #164275",
//                 color: "#164275",
//                 backgroundColor: "white",
//               },
//             }}
//             onClick={handleClose}
//           >
//             Cancel
//           </MDButton>
//           <MDButton
//             sx={{ width: "95%" }}
//             onClick={
//               editDialogOpen
//                 ? () => {
//                     setIseditconfirmopen(true);
//                   }
//                 : handleCreateStory
//             }
//             disabled={uploading}
//             variant="gradient"
//             color="info"
//           >
//             {uploading ? "Uploading..." : editDialogOpen ? "Update" : "Create"}
//           </MDButton>
//         </DialogActions>
//       </Dialog>

//       {/* Confirm Delete */}
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

//       {/* Approve & Unblock Dialogs */}
//       {/* {isOpen && <Approve onClose={handleClose} onsubmit={onsubmit} isOpen={isOpen} />} */}
//       <ConfirmationPopUp
//         open={isOpen}
//         onClose={handleClose}
//         onSubmit={onsubmit}
//         title={"Disable Story"}
//         content={"Are you sure you want to Disable this Story?"}
//         description={"This action can be reverted later."}
//       />
//       {/* {isunBlockOpen && (
//         <UnBlock onClose={handleClose} onsubmit={onsubmit} isOpen={isunBlockOpen} />
//       )} */}
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
//     </DashboardLayout>
//   );
// };

// export default StoryManagement;

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
  Box,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { FaLock, FaLockOpen } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MDButton from "components/MDButton";
import ConfirmationPopUp from "components/confirmationPopup/page";
import { toast } from "react-toastify";

const StoryManagement = () => {
  const [rows, setRows] = useState([]);
  const [user, setUser] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isunBlockOpen, setIsunBlockOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [storyForm, setStoryForm] = useState({ text: "", type: "", duration: 24, image: null });
  const [preview, setPreview] = useState(null);
  const [editStoryId, setEditStoryId] = useState(null);
  const [reload, setReload] = useState(1);
  const [iseditconfirmopen, setIseditconfirmopen] = useState(false);
  const [fullTextDialog, setFullTextDialog] = useState({ open: false, content: "" });

  const handleClose = () => {
    setIsOpen(false);
    setIsunBlockOpen(false);
    setConfirmOpen(false);
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setIseditconfirmopen(false);
    setUser({});
    setStoryForm({ text: "", type: "", duration: 24, image: null });
    setPreview(null);
    setStoryToDelete(null);
    setFullTextDialog({ open: false, content: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setStoryForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(
        "https://api.qa.nutriverseai.in/api/v1/admin/story/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploading(false);
      return res.data.data.fileUrl;
    } catch (err) {
      setUploading(false);
      console.error("Image upload failed:", err);
    }
  };

  const handleCreateStory = async () => {
    const token = localStorage.getItem("token");
    const imageUrl =
      storyForm.image instanceof File ? await handleImageUpload(storyForm.image) : storyForm.image;

    try {
      await axios.post(
        "https://api.qa.nutriverseai.in/api/v1/admin/story",
        {
          text: storyForm.text.length > 0 ? storyForm.text : undefined,
          type: storyForm.type,
          duration: Number(storyForm.duration),
          ...(imageUrl && { fileUrl: imageUrl }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Story created successfully");
      setReload(reload + 1);
      handleClose();
    } catch (err) {
      console.error("Story creation failed:", err);
    }
  };

  const handleEditStory = async () => {
    const token = localStorage.getItem("token");
    const imageUrl =
      storyForm.image instanceof File ? await handleImageUpload(storyForm.image) : storyForm.image;

    try {
      await axios.patch(
        `https://api.qa.nutriverseai.in/api/v1/admin/story/${editStoryId}`,
        {
          text: storyForm.text,
          type: storyForm.type,
          duration: Number(storyForm.duration),
          ...(imageUrl && { fileUrl: imageUrl }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Story updated successfully");
      setReload(reload + 1);
      handleClose();
    } catch (err) {
      console.error("Story update failed:", err);
    }
  };

  const handleEditPopup = (story) => {
    setEditDialogOpen(true);
    setEditStoryId(story._id);
    setStoryForm({
      text: story.text,
      type: story.type,
      duration: story.duration || 24,
      image: story.image,
    });
    setPreview(story.image);
  };

  const handleDelete = (id) => {
    setStoryToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://api.qa.nutriverseai.in/api/v1/admin/user/story/${storyToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReload(reload + 1);
      handleClose();
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const onsubmit = async () => {
    const url =
      user.isDisabled === true
        ? `https://api.qa.nutriverseai.in/api/v1/admin/story/${user._id}/enable`
        : `https://api.qa.nutriverseai.in/api/v1/admin/story/${user._id}/disable`;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      setReload(reload + 1);
      toast.success("Status updated successfully");
      handleClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const fetchUsers = async ({ pageIndex, pageSize }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/story");
      const params = new URLSearchParams();

      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);

      url.search = params.toString();

      const response = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = response.data?.data?.data || [];
      const formattedRows = users.map((user, index) => ({
        sno: <div>{index + 1}</div>,
        createdAt: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
        expiresAt: <div>{new Date(user.expiresAt).toLocaleDateString()}</div>,
        text: (
          <div>
            {user.text?.split(" ").length > 5 ? (
              <span>
                {user.text.split(" ").slice(0, 5).join(" ")}...
                <Button
                  onClick={() => setFullTextDialog({ open: true, content: user.text })}
                  size="small"
                  variant="text"
                  sx={{ textTransform: "none", ml: 1 }}
                >
                  View
                </Button>
              </span>
            ) : (
              user.text || "Na"
            )}
          </div>
        ),
        type: <div>{user.type}</div>,
        image:
          user.type === "image" ? (
            <img
              src={user.fileUrl}
              alt="preview"
              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
            />
          ) : (
            <div>Na</div>
          ),
        action: (
          <div>
            <IconButton color="secondary" onClick={() => handleEditPopup(user)}>
              <EditIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => {
                user.isDisabled ? setIsunBlockOpen(true) : setIsOpen(true);
                setUser(user);
              }}
            >
              {user.isDisabled ? <FaLock /> : <FaLockOpen />}
            </IconButton>
          </div>
        ),
      }));

      return {
        data: formattedRows,
        total: response.data?.data?.count,
      };
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "Created At", accessor: "createdAt", align: "center" },
    { Header: "Expires At", accessor: "expiresAt", align: "center" },
    { Header: "Text", accessor: "text", align: "center" },
    { Header: "Type", accessor: "type", align: "center" },
    { Header: "Image", accessor: "image", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  return (
    <DashboardLayout>
      <Card sx={{ mt: 3 }}>
        <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg">
          <MDTypography variant="h6" color="white">
            Story Management
          </MDTypography>
        </MDBox>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            fetchDataRows={fetchUsers}
            reload={reload}
            canSearch={true}
            noEndBorder
            button={
              <MDButton variant="gradient" color="info" onClick={() => setCreateDialogOpen(true)}>
                Add Story
              </MDButton>
            }
          />
        </MDBox>
      </Card>

      {/* Dialog for Create/Edit Story */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{editDialogOpen ? "Edit Story" : "Create Story"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              value={storyForm.type}
              label="Type"
              onChange={handleInputChange}
              name="type"
              sx={{ height: "45px" }}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="video">Video</MenuItem>
            </Select>
          </FormControl>
          {storyForm.type === "text" && (
            <TextField
              fullWidth
              margin="normal"
              name="text"
              label="Text"
              value={storyForm.text}
              onChange={handleInputChange}
            />
          )}
          <TextField
            fullWidth
            margin="normal"
            name="duration"
            label="Duration (in hrs)"
            type="number"
            value={storyForm.duration}
            onChange={handleInputChange}
          />
          {(storyForm.type === "image" || storyForm.type === "video") && (
            <Button component="label" variant="outlined" sx={{ mt: 2, color: "gray" }}>
              Upload File
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          )}
          {preview && (
            <Box mt={2}>
              <Typography variant="subtitle2">Preview:</Typography>
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", maxHeight: "300px", borderRadius: "8px" }}
              />
            </Box>
          )}
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
            disabled={uploading}
            variant="gradient"
            color="info"
            fullWidth
          >
            {uploading ? "Uploading..." : editDialogOpen ? "Update" : "Create"}
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Confirmation and Full Text Modals */}
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this story?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationPopUp
        open={isOpen}
        onClose={handleClose}
        onSubmit={onsubmit}
        title={"Disable Story"}
        content={"Are you sure you want to Disable this Story?"}
        description={"This action can be reverted later."}
      />
      <ConfirmationPopUp
        open={isunBlockOpen}
        onClose={handleClose}
        onSubmit={onsubmit}
        title={"Enable Story"}
        content={"Are you sure you want to Enable this Story?"}
        description={"This action can be reverted later."}
      />
      <ConfirmationPopUp
        open={iseditconfirmopen}
        onClose={() => setIseditconfirmopen(false)}
        onSubmit={handleEditStory}
        title={"Edit Story"}
        content={"Are you sure you want to Edit this Story?"}
        description={"This action can be reverted later."}
      />
      <Dialog open={fullTextDialog.open} onClose={handleClose}>
        <DialogTitle>Full Story Text</DialogTitle>
        <DialogContent>
          <Typography>{fullTextDialog.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default StoryManagement;
