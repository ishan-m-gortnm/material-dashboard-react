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
    // <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    //   <Dialog open={isOpen} onClose={() => onClose()} sx={{ width: "100%" }}>
    //     <Box
    //       sx={{
    //         height: "130px",
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         marginBottom: "10px",
    //       }}
    //     >
    //       <DialogContent
    //         sx={{
    //           textAlign: "center",
    //           fontSize: "20px",
    //           color: "black",
    //           fontWeight: "bold",
    //           marginBottom: "4px",
    //           width: "400px",
    //         }}
    //       >
    //         {" "}
    //         Are you sure you want to UnBlock?
    //       </DialogContent>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           justifyContent: "center",
    //           gap: "20px",
    //           marginBottom: "10px",
    //         }}
    //       >
    //         <MDButton variant="gradient" color="success" onClick={() => onsubmit()}>
    //           Yes
    //         </MDButton>
    //         <MDButton variant="gradient" color="error" onClick={() => onClose()}>
    //           NO
    //         </MDButton>
    //       </Box>
    //     </Box>
    //   </Dialog>
    // </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Dialog
        open={open}
        onClose={onClose}
        sx={{ width: "100%" }}
        PaperProps={{
          sx: {
            borderRadius: "14px",
          },
        }}
      >
        <Box
          sx={{
            // height: "150px",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          {/* <DialogTitle sx={{ textAlign: "center", marginTop: "6px" }}>{title}</DialogTitle> */}
          <DialogContent sx={{ fontSize: "20px", color: "black", fontWeight: "bold" }}>
            Are you sure you want to unBlock?
          </DialogContent>
          {/* <DialogContent sx={{ textAlign: "center", marginTop: "-48px" }}>
            {description}
          </DialogContent> */}

          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "95%",
            }}
          >
            <MDButton
              onClick={onClose}
              variant="outlined"
              sx={{
                width: "95%",
                backgroundColor: "#E1E1E1",
                color: "gray",
                "&:hover": { border: "1px solid red", color: "red" },
              }}
            >
              Cancel
            </MDButton>
            <MDButton onClick={onsubmit} color="error" variant="gradient" sx={{ width: "95%" }}>
              Confirm{" "}
            </MDButton>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default Confirmblock;
