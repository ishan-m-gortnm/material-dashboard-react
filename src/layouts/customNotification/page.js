import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Button,
  FormHelperText,
  IconButton,
} from "@mui/material";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
import { toast, ToastContainer } from "react-toastify";

const CustomNotification = () => {
  const [rows, setRows] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("loose_weight");
  const [reload, setReload] = useState(1);

  // Validation Errors
  const [errors, setErrors] = useState({
    title: "",
    message: "",
    type: "",
  });

  // Pagination State
  const [page, setPage] = useState(0); // 0-indexed for DataTable
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [fullMessageOpen, setFullMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const columns = [
    { Header: "S no.", accessor: "sno", width: "10%", align: "center" },
    { Header: "Created At", accessor: "createdAt", width: "20%", align: "center" },
    { Header: "Title", accessor: "title", align: "center" },
    {
      Header: "Description (Click to view full message)",
      accessor: "body",
      align: "center",
    },
  ];

  const truncateWords = (text, wordLimit) => {
    const words = text?.split(" ") || [];
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...   ";
  };

  const handleOpenMessage = ({ open, content }) => {
    setSelectedMessage(content);
    setFullMessageOpen(true);
  };

  const fetchNotifications = async ({ pageIndex, pageSize, globalFilter }) => {
    try {
      const token = localStorage.getItem("token");
      // const response = await axios.get(`https://api.qa.nutriverseai.in/api/v1/admin/notification`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/notification");
      const params = new URLSearchParams();

      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);

      url.search = params.toString();

      const response = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const notifications = response.data?.data?.data || [];
      // const total = response.data?.data?.count || 0;

      const formattedRows = notifications.map((notification, index) => ({
        sno: <div>{pageSize * pageIndex + index + 1}</div>,
        createdAt: <div>{new Date(notification.createdAt).toLocaleDateString()}</div>,
        title: <div>{notification.title || "-"}</div>,
        // body: <div style={{ width: "400px" }}>{notification.body || "-"}</div>,
        body: (
          // <div
          //   style={{ width: "400px", cursor: "pointer" }}
          //   onClick={() => handleOpenMessage(notification.body || "-")}
          // >
          //   {truncateWords(notification.body || "-", 5)}
          // </div>
          <div>
            {notification.body?.split(" ").length > 2 ? (
              <span>
                {notification.body.split(" ").slice(0, 2).join(" ")}...
                <Button
                  onClick={() => handleOpenMessage({ open: true, content: notification.body })}
                  size="small"
                  variant="text"
                  sx={{ textTransform: "none", ml: 1 }}
                >
                  View
                </Button>
              </span>
            ) : (
              notification.body || "Na"
            )}
          </div>
        ),
      }));

      // setRows(formattedRows);
      return {
        data: formattedRows,
        total: response.data?.data?.count,
      };
      // setTotalCount(total);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // fetchNotifications(page, rowsPerPage, searchQuery);
  }, []);

  const validateForm = () => {
    const newErrors = {
      title: title.trim() === "" ? "Title is required" : "",
      message: message.trim() === "" ? "Message is required" : "",
      type: type === "" ? "Type is required" : "",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const payload = {
        title,
        message,
        goal: type,
      };

      await axios.post("https://api.qa.nutriverseai.in/api/v1/admin/notification", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCreateDialogOpen(false);
      setTitle("");
      setMessage("");
      setType("loose_weight");
      setErrors({ title: "", message: "", type: "" });

      // fetchNotifications(page, rowsPerPage);
      setReload(reload + 1);

      toast.success("Notification created successfully");
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}

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
            Notification Management
          </MDTypography>
        </MDBox>

        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{
              defaultValue: rowsPerPage,
              entries: [5, 10, 20, 50],
            }}
            fetchDataRows={fetchNotifications}
            reload={reload}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setPage(0); // reset to first page on new search
            }}
            canSearch={true}
            noEndBorder
            button={
              <MDButton variant="gradient" color="info" onClick={() => setCreateDialogOpen(true)}>
                Add Notification
              </MDButton>
            }
          />
        </MDBox>
      </Card>

      {/* Modal for Creating Notification */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center" }}>Create Notification</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
            />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={!!errors.message}
              helperText={errors.message}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              error={!!errors.type}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value=""> </option>
              <option value="loose_weight">Loose Weight</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="gain_weight">Gain Weight</option>
            </TextField>
            {errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
          </Box>

          <Box display="flex" gap={2} mt={3}>
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
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </MDButton>
            <MDButton sx={{ width: "90%" }} variant="gradient" color="info" onClick={handleSubmit}>
              Submit
            </MDButton>
          </Box>
        </DialogContent>
      </Dialog>
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
    </DashboardLayout>
  );
};

export default CustomNotification;
