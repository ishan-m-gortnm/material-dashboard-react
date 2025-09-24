import React, { use, useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationPopUp from "components/confirmationPopup/page";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ExerciseLogs = () => {
  const [rows, setRows] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const { id } = useParams();

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },

    { Header: "createdAt", accessor: "createdAt", align: "center" },
    { Header: "name", accessor: "name", align: "center" },
    { Header: "quantity", accessor: "quantity", align: "center" },
    { Header: "servingType", accessor: "servingType", align: "center" },
    { Header: "protein", accessor: "protein", align: "center" },
    { Header: "fat", accessor: "fat", align: "center" },
    { Header: "carbs", accessor: "carbs", align: "center" },
    { Header: "method", accessor: "method", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const handleDeleteClick = (id) => {
    setLogToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://api.qa.nutriverseai.in/api/v1/admin/log/${logToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmOpen(false);
      setLogToDelete(null);
      fetchUsers();
      toast.success("Meal Log deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setLogToDelete(null);
  };

  const fetchUsers = async ({ pageIndex, pageSize, globalFilter }) => {
    try {
      const token = localStorage.getItem("token");
      // const response = await axios.get(
      //   "https://api.qa.nutriverseai.in/api/v1/admin/log/?page=0&limit=10&type=food",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/log");

      const params = new URLSearchParams();

      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);
      params.append("userId", id);
      params.append("type", "food");

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
        name: <div>{user.food.name}</div>,
        quantity: <div>{user.food.quantity}</div>,
        servingType: <div>{user.food.servingType}</div>,
        protein: <div>{user.food.macros.protein}</div>,
        fat: <div>{user.food.macros.fat}</div>,
        carbs: <div>{user.food.macros.carbs}</div>,
        method: <div>{user.food.method}</div>,

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
    <MDBox>
      <DataTable
        table={{ columns, rows }}
        isSorted={false}
        entriesPerPage={true}
        showTotalEntries={true}
        fetchDataRows={fetchUsers}
        canSearch={true}
        noEndBorder
      />

      {/* Confirmation Dialog */}
      {/* <Dialog open={confirmOpen} onClose={handleCancelDelete} >
        <DialogContent>
          <p>Are you sure you want to delete this log?</p>
        </DialogContent>
        <DialogTitle>Are you sure you want to delete this log?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
      <ConfirmationPopUp
        open={confirmOpen}
        onClose={handleCancelDelete}
        onSubmit={handleConfirmDelete}
        title={"Delete Meal Log"}
        content={"Are you sure you want to delete this  Meal log?"}
        description={"This action cannot be undone."}
      />
    </MDBox>
  );
};

export default ExerciseLogs;
