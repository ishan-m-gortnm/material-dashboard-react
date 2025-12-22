import { useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import { ArrowDropDown as ArrowDropDownIcon, ArrowUpward } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OutlinedInput from "@mui/material/OutlinedInput";

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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
    setConfirmDeleteOpen(false);
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
    if (file) {
      setStoryForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file)); // show new file instantly
    }
  };

  const handleImageUpload = async (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/story/upload`,
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
        `${process.env.REACT_APP_API_URL}/api/v1/admin/story`,
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
    // if user uploaded new file, upload it, else keep old preview (fileUrl)
    const imageUrl =
      storyForm.image instanceof File ? await handleImageUpload(storyForm.image) : preview; // keep existing fileUrl

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/story/${editStoryId}`,
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
      text: story.text || "",
      type: story.type || "",
      duration: story.duration || 24,
      image: null, // keep null so we only set if new upload
    });
    setPreview(story.fileUrl || null); // show existing file in preview
  };

  const handleDelete = (id) => {
    setStoryToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/story/${storyToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmDeleteOpen(false);
      setReload(reload + 1);
      handleClose();
      toast.success("Story deleted successfully");
    } catch (error) {
      console.error("Failed to delete story:", error);
      setConfirmDeleteOpen(false);
    }
  };

  const fetchUsers = async ({ pageIndex = 1, pageSize = 10 }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${process.env.REACT_APP_API_URL}/api/v1/admin/story`);
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
          ) : user.type === "video" ? (
            <video
              src={user.fileUrl}
              style={{ width: "60px", height: "60px", borderRadius: "6px" }}
              controls
            />
          ) : (
            <div>N/A</div>
          ),
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

  const [open, setOpen] = useState(false);

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
            canSearch={false}
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
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="type-label">Select Type</InputLabel>
            <Select
              labelId="type-label"
              label="Select Type"
              name="type"
              value={storyForm.type}
              onChange={handleInputChange}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              input={
                <OutlinedInput
                  endAdornment={
                    <InputAdornment position="end">
                      <ExpandMoreIcon />
                    </InputAdornment>
                  }
                />
              }
              sx={{ height: 45 }}
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
              {storyForm.type === "image" ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: "100%", maxHeight: "300px", borderRadius: "8px" }}
                />
              ) : storyForm.type === "video" ? (
                <video
                  src={preview}
                  controls
                  style={{ width: "100%", maxHeight: "300px", borderRadius: "8px" }}
                />
              ) : null}
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

      {/* Confirmation Popups */}
      <ConfirmationPopUp
        open={isOpen}
        onClose={handleClose}
        onSubmit={() => {}}
        title={"Disable Story"}
        content={"Are you sure you want to Disable this Story?"}
        description={"This action can be reverted later."}
      />
      <ConfirmationPopUp
        open={confirmDeleteOpen}
        onClose={handleClose}
        onSubmit={confirmDelete}
        title={"Delete Story"}
        content={"Are you sure you want to Delete this Story?"}
        description={"This action can not be reverted later."}
      />
      <ConfirmationPopUp
        open={isunBlockOpen}
        onClose={handleClose}
        onSubmit={() => {}}
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
