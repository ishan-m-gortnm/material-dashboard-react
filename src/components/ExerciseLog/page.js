import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";
import ConfirmationPopUp from "components/confirmationPopup/page";

import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ExerciseLogs = () => {
  const [rows, setRows] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const { id } = useParams();

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "createdAt", accessor: "createdAt", align: "left" },
    { Header: "rawType", accessor: "rawType", align: "center" },
    { Header: "duration", accessor: "duration", align: "center" },
    { Header: "caloriesBurned", accessor: "caloriesBurned", align: "center" },
    { Header: "intensity", accessor: "intensity", align: "center" },
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
      fetchUsers(); // Refresh data after delete
      toast.success("Exercise Log deleted successfully");
    } catch (error) {
      console.error("Failed to delete log:", error);
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
      //   "https://api.qa.nutriverseai.in/api/v1/admin/log/?page=0&limit=10&type=exercise",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/log/");

      const params = new URLSearchParams();

      if (pageSize) params.append("limit", pageSize);
      if (pageIndex) params.append("page", pageIndex);
      params.append("userId", id);
      params.append("type", "exercise");

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
        rawType: <div>{user.exercise.rawType}</div>,
        duration: <div>{user.exercise.duration}</div>,
        caloriesBurned: <div>{user.exercise.caloriesBurned}</div>,
        intensity: <div>{user.exercise.intensity}</div>,
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
        canSearch={true}
        fetchDataRows={fetchUsers}
        noEndBorder
      />

      {/* Confirmation Dialog */}
      <ConfirmationPopUp
        open={confirmOpen}
        onClose={handleCancelDelete}
        onSubmit={handleConfirmDelete}
        title={"Delete Exercise Log"}
        content={"Are you sure you want to delete this  Meal log?"}
        description={"This action cannot be undone."}
      />
    </MDBox>
  );
};

export default ExerciseLogs;
