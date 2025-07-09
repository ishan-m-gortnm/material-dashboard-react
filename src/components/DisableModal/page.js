import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import MDButton from "components/MDButton";

const Confirmblock = ({ onsubmit, onClose, isOpen }) => {
  return (
    <Dialog open={isOpen} onClose={() => onClose()} fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          textAlign: "center",
          fontSize: "20px",
          color: "black",
          fontWeight: "bold",
          marginBottom: "4px",
        }}
      >
        {" "}
        Are you sure you want to UnBlock?
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <MDButton variant="gradient" color="info" onClick={() => onsubmit()}>
          Yes
        </MDButton>
        <MDButton onClick={() => onClose()}>NO</MDButton>
      </Box>
    </Dialog>
  );
};

export default Confirmblock;
