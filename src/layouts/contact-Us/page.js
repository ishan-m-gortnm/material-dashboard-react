import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";
import ConfirmationPopUp from "components/confirmationPopup/page";

import {
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
import MDTypography from "components/MDTypography";
import { toast, ToastContainer } from "react-toastify";

const ContactUs = () => {
  const [rows, setRows] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [reload, setReload] = useState(1);
  const [fullMessageOpen, setFullMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "createdAt", accessor: "createdAt", align: "left" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "First Name", accessor: "firstName", align: "center" },
    { Header: "Last Name", accessor: "lastName", align: "center" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Message", accessor: "message", align: "center" },
    { Header: "Subject", accessor: "subject", align: "center" },

    { Header: "action", accessor: "action", align: "center" },
  ];

  const handleDeleteClick = (id) => {
    setLogToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://api.qa.nutriverseai.in/api/v1/admin/contact-us/${logToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmOpen(false);
      setLogToDelete(null);
      setReload(reload + 1);
      toast.success("ContactUs deleted successfully");
    } catch (error) {
      console.error("Failed to delete log:", error);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setLogToDelete(null);
  };

  const truncateWords = (text, wordLimit) => {
    const words = text?.split(" ") || [];
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleOpenMessage = ({ open, content }) => {
    setSelectedMessage(content);
    setFullMessageOpen(true);
  };

  const fetchUsers = async ({ pageIndex, pageSize, globalFilter }) => {
    try {
      const token = localStorage.getItem("token");
      // const response = await axios.get(
      //   "https://api.qa.nutriverseai.in/api/v1/admin/contact-us/?page=0&limit=10",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/contact-us");

      const params = new URLSearchParams();

      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);

      url.search = params.toString();

      const response = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = response.data?.data.data || [];

      const formattedRows = users.map((user, index) => ({
        sno: <div>{index + 1}</div>,
        createdAt: <div>{new Date(user.createdAt).toLocaleDateString()}</div>,
        firstName: <div>{user.firstName}</div>,
        lastName: <div>{user.lastName}</div>,
        email: <div>{user.email}</div>,
        phone: <div>{user.phone}</div>,
        subject: <div>{user.subject}</div>,

        message: (
          // <div
          //   style={{ width: "400px", cursor: "pointer" }}
          //   onClick={() => handleOpenMessage(user.message || "-")}
          // >
          //   {truncateWords(user.message || "-", 5)}
          // </div>
          <div>
            {user.message?.split(" ").length > 2 ? (
              <span>
                {user.message.split(" ").slice(0, 2).join(" ")}...
                <Button
                  onClick={() => handleOpenMessage({ open: true, content: user.message })}
                  size="small"
                  variant="text"
                  sx={{ textTransform: "none", ml: 1 }}
                >
                  View
                </Button>
              </span>
            ) : (
              user.message || "Na"
            )}
          </div>
        ),

        action: (
          <IconButton color="error" onClick={() => handleDeleteClick(user._id)}>
            <DeleteIcon />
          </IconButton>
        ),
      }));

      // setRows(formattedRows);
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
  }, []);

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
            Contact Us
          </MDTypography>
        </MDBox>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            fetchDataRows={fetchUsers}
            canSearch={false}
            noEndBorder
            reload={reload}
          />

          {/* Confirmation Dialog */}
          <ConfirmationPopUp
            open={confirmOpen}
            onClose={handleCancelDelete}
            onSubmit={handleConfirmDelete}
            title={"Delete Contact Us"}
            content={"Are you sure you want to delete this Contact US?"}
            description={"This action cannot be undone."}
          />
        </MDBox>
      </Card>
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

export default ContactUs;
