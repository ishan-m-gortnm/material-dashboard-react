import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Card,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DeleteIcon from "@mui/icons-material/Delete";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    status: "",
    employmentDate: "",
  });

  const columns = [
    { Header: "author", accessor: "author", width: "45%", align: "left" },
    { Header: "function", accessor: "function", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "employed", accessor: "employed", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const formatRows = (userList) =>
    userList.map((user) => ({
      author: <div>{user.name}</div>,
      function: <div>{user.role}</div>,
      status: <div>{user.status}</div>,
      employed: <div>{user.employmentDate}</div>,
      action: (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            color="primary"
            onClick={() => handleEdit(user)}
            sx={{ border: "1px solid green" }}
          >
            Edit
          </Button>
          <Button
            color="error"
            onClick={() => handleDelete(user.id)}
            sx={{ border: "1px solid red" }}
          >
            Delete
          </Button>
        </div>
      ),
    }));

  useEffect(() => {
    const dummyUsers = [
      {
        id: 1,
        name: "Alice Smith",
        role: "Developer",
        status: "Active",
        employmentDate: "2023-04-01",
      },
      {
        id: 2,
        name: "Bob Johnson",
        role: "Designer",
        status: "Inactive",
        employmentDate: "2022-11-12",
      },
    ];
    setUsers(dummyUsers);
    setRows(formatRows(dummyUsers));
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setFormData({
      name: user.name,
      role: user.role,
      status: user.status,
      employmentDate: user.employmentDate,
    });
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setFormData({
      name: "",
      role: "",
      status: "",
      employmentDate: "",
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setRows(formatRows(updatedUsers));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    if (isEditMode) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      setRows(formatRows(updatedUsers));
    } else {
      const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        ...formData,
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setRows(formatRows(updatedUsers));
    }
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
            Content and Nutrition Database
          </MDTypography>
        </MDBox>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            canSearch={true}
            noEndBorder
            button={
              <MDButton
                variant="gradient"
                color="info"
                // sx={{ backgroundColor: "#262629", color: "black" }}
                onClick={handleAdd}
              >
                Add User
              </MDButton>
            }
          />
        </MDBox>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>
          {isEditMode ? "Edit User" : "Add User"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Employment Date"
            name="employmentDate"
            value={formData.employmentDate}
            onChange={handleChange}
            fullWidth
            placeholder="YYYY-MM-DD"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
