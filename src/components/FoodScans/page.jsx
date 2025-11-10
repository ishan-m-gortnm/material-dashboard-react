import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import { IconButton, Tabs, Tab, Badge } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationPopUp from "components/confirmationPopup/page";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FoodScans = () => {
  const { id } = useParams();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [reloadTable, setReloadTable] = useState(false);

  // ------------------ Tab Counts ------------------
  const [tabCounts, setTabCounts] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "Date", accessor: "createdAt", align: "center" },
    { Header: "Food Name", accessor: "name", align: "center" },
    { Header: "Quantity", accessor: "quantity", align: "center" },
    { Header: "Serving Type", accessor: "servingType", align: "center" },
    { Header: "Protein", accessor: "protein", align: "center" },
    { Header: "Fat", accessor: "fat", align: "center" },
    { Header: "Carbs", accessor: "carbs", align: "center" },
    { Header: "Method", accessor: "method", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  // ---------------- Date Range Calculation ----------------
  const calculateDateRange = (period) => {
    const today = new Date();
    let from = new Date();

    switch (period) {
      case "daily":
        from = today;
        break;
      case "weekly":
        from.setDate(today.getDate() - 6);
        break;
      case "monthly":
        from.setDate(today.getDate() - 29);
        break;
    }

    const formatDate = (date) => date.toISOString().split("T")[0];
    return { from: formatDate(from), to: formatDate(today) };
  };

  // ---------------- Fetch Food Scans ----------------
  const fetchFoodScans = async ({ pageIndex = 1, pageSize = 10, period = activeTab }) => {
    try {
      const token = localStorage.getItem("token");
      const { from, to } = calculateDateRange(period);

      const url = new URL(`${process.env.REACT_APP_API_URL}/api/v1/admin/log`);
      const params = new URLSearchParams();
      params.append("userId", id);
      params.append("type", "food");
      params.append("period", period);
      params.append("limit", pageSize);
      params.append("page", Math.max(pageIndex - 1, 0));
      params.append("from", from);
      params.append("to", to);
      url.search = params.toString();

      const response = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data.data || [];

      // Update count for this tab
      setTabCounts((prev) => ({
        ...prev,
        [period]: response.data?.data?.count || 0,
      }));

      const formattedRows = data.map((item, index) => ({
        sno: <div>{index + 1}</div>,
        createdAt: <div>{new Date(item.createdAt).toLocaleDateString()}</div>,
        name: <div>{item.food.name}</div>,
        quantity: <div>{item.food.quantity}</div>,
        servingType: <div>{item.food.servingType}</div>,
        protein: <div>{item.food.macros.protein}</div>,
        fat: <div>{item.food.macros.fat}</div>,
        carbs: <div>{item.food.macros.carbs}</div>,
        method: <div>{item.food.method}</div>,
        action: (
          <IconButton color="error" onClick={() => handleDeleteClick(item._id)}>
            <DeleteIcon />
          </IconButton>
        ),
      }));

      return { data: formattedRows, total: response.data?.data?.count };
    } catch (error) {
      console.error("Error fetching food scans:", error);
      return { data: [], total: 0 };
    }
  };

  // ---------------- Tab Change ----------------
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setReloadTable((prev) => !prev);
  };

  // ---------------- Delete Handlers ----------------
  const handleDeleteClick = (id) => {
    setLogToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/admin/log/${logToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmOpen(false);
      setLogToDelete(null);
      setReloadTable((prev) => !prev);
      toast.success("Food Scan deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setLogToDelete(null);
  };

  // ---------------- Fetch counts for all tabs on mount ----------------
  useEffect(() => {
    ["daily", "weekly", "monthly"].forEach((period) =>
      fetchFoodScans({ pageIndex: 1, pageSize: 1, period })
    );
  }, []);

  return (
    <MDBox>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        {["daily", "weekly", "monthly"].map((period) => (
          <Tab
            key={period}
            value={period}
            label={
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 4 }}>
                <span>{period.charAt(0).toUpperCase() + period.slice(1)}</span>
                <Badge
                  color="primary"
                  badgeContent={tabCounts[period]}
                  max={99}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                />
              </div>
            }
          />
        ))}
      </Tabs>

      <DataTable
        table={{ columns, rows: [] }}
        isSorted={false}
        entriesPerPage={true}
        showTotalEntries={true}
        fetchDataRows={({ pageIndex, pageSize }) =>
          fetchFoodScans({ pageIndex, pageSize, period: activeTab })
        }
        canSearch={true}
        noEndBorder
        reload={reloadTable}
      />

      <ConfirmationPopUp
        open={confirmOpen}
        onClose={handleCancelDelete}
        onSubmit={handleConfirmDelete}
        title={"Delete Food Scan"}
        content={"Are you sure you want to delete this food scan?"}
        description={"This action cannot be undone."}
      />
    </MDBox>
  );
};

export default FoodScans;
