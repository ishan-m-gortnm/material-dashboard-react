// import React from "react";
// import PropTypes from "prop-types";
// import { Modal, Box, Typography, Button, Stack } from "@mui/material";

// const Logout = ({ isOpen, onClose, onConfirm }) => (
//   <Modal
//     open={isOpen}
//     onClose={onClose}
//     aria-labelledby="logout-modal-title"
//     aria-describedby="logout-modal-description"
//   >
//     <Box
//       sx={{
//         p: 4,
//         bgcolor: "white",
//         borderRadius: 2,
//         maxWidth: 400,
//         mx: "auto",
//         mt: "20%",
//       }}
//     >
//       <Typography
//         id="logout-modal-title"
//         variant="h6"
//         mb={2}
//         sx={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}
//       >
//         Are you sure you want to logout?
//       </Typography>
//       <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
//         <Button
//           onClick={onClose}
//           variant="outlined"
//           sx={{
//             width: "38%",
//             height: "40px",
//             borderRadius: "40px",
//             borderColor: "#ccc",
//             color: "black",
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={onConfirm}
//           variant="contained"
//           color="error"
//           sx={{ width: "38%", height: "40px", borderRadius: "40px", borderColor: "#ccc" }}
//         >
//           Logout
//         </Button>
//       </Stack>
//     </Box>
//   </Modal>
// );

// Logout.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onConfirm: PropTypes.func.isRequired,
// };

// export default Logout;

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Typography, Button, Stack, TextField, Alert } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // or wherever you're storing it
      const response = await axios.patch(
        "https://api.qa.nutriverseai.in/api/v1/admin/profile/self",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully");
        localStorage.removeItem("token"); // logout
        navigate("/sign-in");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="change-password-title">
      <Box
        sx={{
          p: 4,
          bgcolor: "#ffffff",
          border: "1px solid #ccc",
          borderRadius: "30px",
          maxWidth: 400,
          mx: "auto",
          mt: "10%",
        }}
      >
        <Typography
          id="change-password-title"
          variant="h6"
          mb={2}
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Change Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={4}>
          <MDButton
            onClick={onClose}
            variant="gradient"
            color="info"
            disabled={loading}
            sx={{
              width: "50%",
            }}
          >
            Cancel
          </MDButton>
          <MDButton
            onClick={handleSubmit}
            // variant="contained"

            variant="gradient"
            color="error"
            disabled={loading}
            sx={{
              width: "50%",
            }}
          >
            {loading ? "Saving..." : "Change"}
          </MDButton>
        </Stack>
      </Box>
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
