import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDButton from "components/MDButton";
import React from "react";

const confirmationPopUp = ({ onClose, open, onSubmit, title, content, description }) => {
  return (
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
            borderRadius: "30px",
          },
        }}
      >
        <Box
          sx={{
            height: "230px",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <DialogTitle sx={{ textAlign: "center", marginTop: "6px" }}>{title}</DialogTitle>
          <DialogContent>{content}</DialogContent>
          <DialogContent sx={{ textAlign: "center", marginTop: "-48px" }}>
            {description}
          </DialogContent>

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
                "&:hover": {
                  border: "1px solid #164275",
                  color: "#164275",
                  backgroundColor: "white",
                },
              }}
            >
              Cancel
            </MDButton>
            <MDButton onClick={onSubmit} color="info" variant="gradient" sx={{ width: "95%" }}>
              Confirm{" "}
            </MDButton>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default confirmationPopUp;
