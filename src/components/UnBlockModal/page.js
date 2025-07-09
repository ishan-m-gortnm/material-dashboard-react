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

const ConfirmUnblock = ({ onsubmit, onClose, isOpen }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Dialog open={isOpen} onClose={() => onClose()} sx={{ width: "100%" }}>
        <Box
          sx={{
            height: "130px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <DialogContent
            sx={{
              textAlign: "center",
              fontSize: "20px",
              color: "black",
              fontWeight: "bold",
              marginBottom: "4px",
              width: "400px",
            }}
          >
            {" "}
            Are you sure you want to Block?
          </DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "10px",
            }}
          >
            <MDButton variant="gradient" color="success" onClick={() => onsubmit()}>
              Yes
            </MDButton>
            <MDButton variant="gradient" color="error" onClick={() => onClose()}>
              NO
            </MDButton>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ConfirmUnblock;
