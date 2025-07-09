// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "examples/Tables/DataTable";
// import ConfirmationPopUp from "components/confirmationPopup/page";

// import {
//   Card,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
// } from "@mui/material";
// import MDBox from "components/MDBox";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
// import MDTypography from "components/MDTypography";
// import { toast, ToastContainer } from "react-toastify";

// const ContactUs = () => {
//   const [rows, setRows] = useState([]);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [logToDelete, setLogToDelete] = useState(null);
//   const [reload, setReload] = useState(1);
//   const [fullMessageOpen, setFullMessageOpen] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState("");

//   const columns = [
//     { Header: "S.No", accessor: "sno", align: "center" },
//     { Header: "Name", accessor: "name", align: "center" },
//     { Header: "Phone", accessor: "phone", align: "center" },
//     { Header: "Subscription", accessor: "subscription", align: "center" },

//     { Header: "action", accessor: "action", align: "center" },
//   ];

//   const handleDeleteClick = (id) => {
//     setLogToDelete(id);
//     setConfirmOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       await axios.delete(`https://api.qa.nutriverseai.in/api/v1/admin/contact-us/${logToDelete}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setConfirmOpen(false);
//       setLogToDelete(null);
//       setReload(reload + 1);
//       toast.success("ContactUs deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete log:", error);
//       setConfirmOpen(false);
//     }
//   };

//   const handleCancelDelete = () => {
//     setConfirmOpen(false);
//     setLogToDelete(null);
//   };

//   const truncateWords = (text, wordLimit) => {
//     const words = text?.split(" ") || [];
//     if (words.length <= wordLimit) return text;
//     return words.slice(0, wordLimit).join(" ") + "...";
//   };

//   const handleOpenMessage = (message) => {
//     setSelectedMessage(message);
//     setFullMessageOpen(true);
//   };

//   const fetchUsers = async ({ pageIndex, pageSize, globalFilter }) => {
//     try {
//       const token = localStorage.getItem("token");
//       // const response = await axios.get(
//       //   "https://api.qa.nutriverseai.in/api/v1/admin/contact-us/?page=0&limit=10",
//       //   {
//       //     headers: {
//       //       Authorization: `Bearer ${token}`,
//       //     },
//       //   }
//       // );
//       const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/user");

//       const params = new URLSearchParams();

//       if (pageSize) params.append("limit", pageSize);
//       if (pageIndex) params.append("page", pageIndex);

//       url.search = params.toString();

//       const response = await axios.get(url.toString(), {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const users = response.data?.data.data || [];

//       const formattedRows = users.map((user, index) => ({
//         sno: <div>{pageSize * pageIndex + index + 1}</div>,

//         name: <div>{user.details.name || "Na"}</div>,
//         phone: <div>{user.mobileNumber}</div>,
//         subscription: <div>{user?.subscription?.planType || "-"}</div>,

//         action: (
//           <IconButton color="error" onClick={() => handleDeleteClick(user._id)}>
//             <DeleteIcon />
//           </IconButton>
//         ),
//       }));

//       // setRows(formattedRows);
//       return {
//         data: formattedRows,
//         total: response.data?.data?.count,
//       };
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     // fetchUsers();
//   }, []);

//   return (
//     <DashboardLayout>
//       {/* <DashboardNavbar /> */}
//       <Card sx={{ mt: 3 }}>
//         <MDBox
//           mx={2}
//           mt={-3}
//           py={3}
//           px={2}
//           variant="gradient"
//           bgColor="info"
//           borderRadius="lg"
//           coloredShadow="info"
//         >
//           <MDTypography variant="h6" color="white">
//             Subscription & Payment Management{" "}
//           </MDTypography>
//         </MDBox>
//         <MDBox>
//           <DataTable
//             table={{ columns, rows }}
//             isSorted={false}
//             entriesPerPage={true}
//             showTotalEntries={true}
//             fetchDataRows={fetchUsers}
//             canSearch={true}
//             noEndBorder
//             reload={reload}
//           />

//           {/* Confirmation Dialog */}
//           <ConfirmationPopUp
//             open={confirmOpen}
//             onClose={handleCancelDelete}
//             onSubmit={handleConfirmDelete}
//             title={"Delete Contact Us"}
//             content={"Are you sure you want to delete this Contact US?"}
//             description={"This action cannot be undone."}
//           />
//         </MDBox>
//       </Card>
//       <Dialog
//         open={fullMessageOpen}
//         onClose={() => setFullMessageOpen(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           Full Message
//           <IconButton
//             aria-label="close"
//             onClick={() => setFullMessageOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <MDAlertCloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>{selectedMessage}</DialogContent>
//       </Dialog>
//     </DashboardLayout>
//   );
// };

// export default ContactUs;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "examples/Tables/DataTable";
// import ConfirmationPopUp from "components/confirmationPopup/page";

// import {
//   Card,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import MDBox from "components/MDBox";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AutorenewIcon from "@mui/icons-material/Autorenew";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
// import MDTypography from "components/MDTypography";
// import { toast, ToastContainer } from "react-toastify";
// import { ArrowDropDownCircleOutlined } from "@mui/icons-material";
// import MDButton from "components/MDButton";

// const ContactUs = () => {
//   const [rows, setRows] = useState([]);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [logToDelete, setLogToDelete] = useState(null);
//   const [reload, setReload] = useState(1);
//   const [fullMessageOpen, setFullMessageOpen] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState("");

//   const [renewOpen, setRenewOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState("");

//   const columns = [
//     { Header: "S.No", accessor: "sno", align: "center" },
//     { Header: "Name", accessor: "name", align: "center" },
//     { Header: "Phone", accessor: "phone", align: "center" },
//     { Header: "Subscription", accessor: "subscription", align: "center" },
//     { Header: "Action", accessor: "action", align: "center" },
//   ];

//   const handleDeleteClick = (id) => {
//     setLogToDelete(id);
//     setSelectedUserId(id);
//     setConfirmOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     const token = localStorage.getItem("token");
//     console.log(token, "ishan");
//     try {
//       await axios.patch(
//         `https://api.qa.nutriverseai.in/api/v1/admin/subscription/status`,
//         {
//           status: "cancel",
//           userId: selectedUserId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setConfirmOpen(false);
//       setLogToDelete(null);
//       setReload(reload + 1);
//       toast.success("ContactUs deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete log:", error);
//       setConfirmOpen(false);
//     }
//   };

//   const handleCancelDelete = () => {
//     setConfirmOpen(false);
//     setLogToDelete(null);
//   };

//   const truncateWords = (text, wordLimit) => {
//     const words = text?.split(" ") || [];
//     if (words.length <= wordLimit) return text;
//     return words.slice(0, wordLimit).join(" ") + "...";
//   };

//   const handleOpenMessage = (message) => {
//     setSelectedMessage(message);
//     setFullMessageOpen(true);
//   };

//   const handleRenewClick = (userId) => {
//     setSelectedUserId(userId);
//     setSelectedPlan("");
//     setRenewOpen(true);
//   };

//   const handleRenewSubmit = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       await axios.patch(
//         "https://api.qa.nutriverseai.in/api/v1/admin/subscription/status",
//         {
//           status: "renew",
//           userId: selectedUserId,
//           planType: selectedPlan,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Subscription renewed successfully");
//       setRenewOpen(false);
//       setReload(reload + 1);
//     } catch (error) {
//       console.error("Renewal failed:", error);
//       toast.error("Failed to renew subscription");
//     }
//   };

//   const fetchUsers = async ({ pageIndex, pageSize }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/user");

//       const params = new URLSearchParams();
//       if (pageSize) params.append("limit", pageSize);
//       if (pageIndex) params.append("page", pageIndex);
//       url.search = params.toString();

//       const response = await axios.get(url.toString(), {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const users = response.data?.data.data || [];

//       const formattedRows = users.map((user, index) => ({
//         sno: <div>{pageSize * pageIndex + index + 1}</div>,
//         name: <div>{user.details.name || "Na"}</div>,
//         phone: <div>{user.mobileNumber}</div>,
//         subscription: <div>{user?.subscription?.planType || "-"}</div>,
//         action: (
//           <>
//             <IconButton color="primary" onClick={() => handleRenewClick(user._id)}>
//               <AutorenewIcon />
//             </IconButton>
//             <IconButton color="error" onClick={() => handleDeleteClick(user._id)}>
//               <DeleteIcon />
//             </IconButton>
//           </>
//         ),
//       }));

//       return {
//         data: formattedRows,
//         total: response.data?.data?.count,
//       };
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <ToastContainer />
//       <Card sx={{ mt: 3 }}>
//         <MDBox
//           mx={2}
//           mt={-3}
//           py={3}
//           px={2}
//           variant="gradient"
//           bgColor="info"
//           borderRadius="lg"
//           coloredShadow="info"
//         >
//           <MDTypography variant="h6" color="white">
//             Subscription & Payment Management
//           </MDTypography>
//         </MDBox>
//         <MDBox>
//           <DataTable
//             table={{ columns, rows }}
//             isSorted={false}
//             entriesPerPage={true}
//             showTotalEntries={true}
//             fetchDataRows={fetchUsers}
//             canSearch={true}
//             noEndBorder
//             reload={reload}
//           />

//           <ConfirmationPopUp
//             open={confirmOpen}
//             onClose={handleCancelDelete}
//             onSubmit={handleConfirmDelete}
//             title={"Delete Contact Us"}
//             content={"Are you sure you want to delete this Contact US?"}
//             description={"This action cannot be undone."}
//           />
//         </MDBox>
//       </Card>

//       {/* Full Message Dialog */}
//       <Dialog
//         open={fullMessageOpen}
//         onClose={() => setFullMessageOpen(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           Full Message
//           <IconButton
//             aria-label="close"
//             onClick={() => setFullMessageOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <MDAlertCloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>{selectedMessage}</DialogContent>
//       </Dialog>

//       {/* Renew Subscription Dialog */}
//       <Dialog open={renewOpen} onClose={() => setRenewOpen(false)} fullWidth maxWidth="xs">
//         <DialogTitle>
//           Renew Subscription
//           <IconButton
//             aria-label="close"
//             onClick={() => setRenewOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <MDAlertCloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="plan-select-label">Plan Type</InputLabel>
//             <Select
//               labelId="plan-select-label"
//               value={selectedPlan}
//               onChange={(e) => setSelectedPlan(e.target.value)}
//               label="Plan Type"
//               sx={{ height: "40px" }}
//               // IconComponent={() => <ArrowDropDownCircleOutlined />}
//             >
//               <MenuItem value="monthly">Monthly</MenuItem>
//               <MenuItem value="yearly">Yearly</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <MDButton
//             variant="outlined"
//             sx={{
//               width: "90%",
//               backgroundColor: "#E1E1E1",
//               color: "gray",
//               "&:hover": {
//                 border: "1px solid #164275",
//                 color: "#164275",
//                 backgroundColor: "white",
//               },
//             }}
//             onClick={() => setRenewOpen(false)}
//           >
//             Cancel
//           </MDButton>
//           <MDButton
//             onClick={handleRenewSubmit}
//             disabled={!selectedPlan}
//             sx={{ width: "90%" }}
//             variant="gradient"
//             color="info"
//           >
//             Submit
//           </MDButton>
//         </DialogActions>
//       </Dialog>
//     </DashboardLayout>
//   );
// };

// export default ContactUs;

// import React, { useState } from "react";
// import axios from "axios";
// import DataTable from "examples/Tables/DataTable";
// import {
//   Card,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import MDBox from "components/MDBox";
// import AutorenewIcon from "@mui/icons-material/Autorenew";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
// import MDTypography from "components/MDTypography";
// import { toast, ToastContainer } from "react-toastify";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import MDButton from "components/MDButton";

// const ContactUs = () => {
//   const [rows, setRows] = useState([]);
//   const [reload, setReload] = useState(1);
//   const [fullMessageOpen, setFullMessageOpen] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState("");
//   const [renewOpen, setRenewOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState("");

//   const columns = [
//     { Header: "S.No", accessor: "sno", align: "center" },
//     { Header: "Name", accessor: "name", align: "center" },
//     { Header: "Phone", accessor: "phone", align: "center" },
//     { Header: "Subscription", accessor: "subscription", align: "center" },
//     { Header: "Action", accessor: "action", align: "center" },
//   ];

//   const truncateWords = (text, wordLimit) => {
//     const words = text?.split(" ") || [];
//     if (words.length <= wordLimit) return text;
//     return words.slice(0, wordLimit).join(" ") + "...";
//   };

//   const handleOpenMessage = (message) => {
//     setSelectedMessage(message);
//     setFullMessageOpen(true);
//   };

//   const handleRenewClick = (userId) => {
//     setSelectedUserId(userId);
//     setSelectedPlan("");
//     setRenewOpen(true);
//   };

//   const handleRenewSubmit = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       await axios.patch(
//         "https://api.qa.nutriverseai.in/api/v1/admin/subscription/status",
//         {
//           status: "renew",
//           userId: selectedUserId,
//           planType: selectedPlan,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Subscription renewed successfully");
//       setRenewOpen(false);
//       setReload(reload + 1);
//     } catch (error) {
//       console.error("Renewal failed:", error);
//       toast.error("Failed to renew subscription");
//     }
//   };

//   const handleToggleStatus = async (userId, currentStatus) => {
//     const token = localStorage.getItem("token");
//     const newStatus = currentStatus === "active" ? "inactive" : "active";

//     try {
//       await axios.patch(
//         "https://api.qa.nutriverseai.in/api/v1/admin/subscription/status",
//         {
//           status: "cancel",
//           userId: userId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success(`User marked as ${newStatus}`);
//       setReload(reload + 1);
//     } catch (error) {
//       toast.error("Failed to update user status");
//       console.error("Toggle status failed:", error);
//     }
//   };

//   const fetchUsers = async ({ pageIndex, pageSize }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/user");

//       const params = new URLSearchParams();
//       if (pageSize) params.append("limit", pageSize);
//       if (pageIndex) params.append("page", pageIndex);
//       url.search = params.toString();

//       const response = await axios.get(url.toString(), {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const users = response.data?.data.data || [];

//       const formattedRows = users.map((user, index) => {
//         const status = user?.subscription?.status;
//         return {
//           sno: <div>{pageSize * pageIndex + index + 1}</div>,
//           name: <div>{user.details.name || "Na"}</div>,
//           phone: <div>{user.mobileNumber}</div>,
//           subscription: <div>{user?.subscription?.planType || "-"}</div>,
//           action: (
//             <>
//               <IconButton color="primary" onClick={() => handleRenewClick(user._id)}>
//                 <AutorenewIcon />
//               </IconButton>
//               <IconButton
//                 color={status === "active" ? "success" : "error"}
//                 onClick={() => handleToggleStatus(user._id, status)}
//               >
//                 {status === "active" ? <CheckCircleIcon /> : <CancelIcon />}
//               </IconButton>
//             </>
//           ),
//         };
//       });

//       return {
//         data: formattedRows,
//         total: response.data?.data?.count,
//       };
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <ToastContainer />
//       <Card sx={{ mt: 3 }}>
//         <MDBox
//           mx={2}
//           mt={-3}
//           py={3}
//           px={2}
//           variant="gradient"
//           bgColor="info"
//           borderRadius="lg"
//           coloredShadow="info"
//         >
//           <MDTypography variant="h6" color="white">
//             Subscription & Payment Management
//           </MDTypography>
//         </MDBox>
//         <MDBox>
//           <DataTable
//             table={{ columns, rows }}
//             isSorted={false}
//             entriesPerPage={true}
//             showTotalEntries={true}
//             fetchDataRows={fetchUsers}
//             canSearch={true}
//             noEndBorder
//             reload={reload}
//           />
//         </MDBox>
//       </Card>

//       {/* Full Message Dialog */}
//       <Dialog
//         open={fullMessageOpen}
//         onClose={() => setFullMessageOpen(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           Full Message
//           <IconButton
//             aria-label="close"
//             onClick={() => setFullMessageOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <MDAlertCloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>{selectedMessage}</DialogContent>
//       </Dialog>

//       {/* Renew Subscription Dialog */}
//       <Dialog open={renewOpen} onClose={() => setRenewOpen(false)} fullWidth maxWidth="xs">
//         <DialogTitle>
//           Renew Subscription
//           <IconButton
//             aria-label="close"
//             onClick={() => setRenewOpen(false)}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <MDAlertCloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="plan-select-label">Plan Type</InputLabel>
//             <Select
//               labelId="plan-select-label"
//               value={selectedPlan}
//               onChange={(e) => setSelectedPlan(e.target.value)}
//               label="Plan Type"
//               sx={{ height: "40px" }}
//             >
//               <MenuItem value="monthly">Monthly</MenuItem>
//               <MenuItem value="yearly">Yearly</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <MDButton
//             variant="outlined"
//             sx={{
//               width: "90%",
//               backgroundColor: "#E1E1E1",
//               color: "gray",
//               "&:hover": {
//                 border: "1px solid #164275",
//                 color: "#164275",
//                 backgroundColor: "white",
//               },
//             }}
//             onClick={() => setRenewOpen(false)}
//           >
//             Cancel
//           </MDButton>
//           <MDButton
//             onClick={handleRenewSubmit}
//             disabled={!selectedPlan}
//             sx={{ width: "90%" }}
//             variant="gradient"
//             color="info"
//           >
//             Submit
//           </MDButton>
//         </DialogActions>
//       </Dialog>
//     </DashboardLayout>
//   );
// };

// export default ContactUs;

import React, { useState } from "react";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";
import {
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import MDBox from "components/MDBox";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
import MDTypography from "components/MDTypography";
import { toast, ToastContainer } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MDButton from "components/MDButton";

const ContactUs = () => {
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState(1);
  const [fullMessageOpen, setFullMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [renewOpen, setRenewOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingToggleUser, setPendingToggleUser] = useState(null);

  const columns = [
    { Header: "S.No", accessor: "sno", align: "center" },
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Subscription", accessor: "subscription", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const truncateWords = (text, wordLimit) => {
    const words = text?.split(" ") || [];
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    setFullMessageOpen(true);
  };

  const handleRenewClick = (userId) => {
    setSelectedUserId(userId);
    setSelectedPlan("");
    setRenewOpen(true);
  };

  const handleRenewSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        "https://api.qa.nutriverseai.in/api/v1/admin/subscription/status",
        {
          status: "renew",
          userId: selectedUserId,
          planType: selectedPlan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Subscription renewed successfully");
      setRenewOpen(false);
      setReload(reload + 1);
    } catch (error) {
      console.error("Renewal failed:", error);
      toast.error("Failed to renew subscription");
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    if (currentStatus === "active") {
      setPendingToggleUser({ userId, currentStatus });
      setConfirmOpen(true);
    } else {
      toggleStatus(userId, currentStatus);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const token = localStorage.getItem("token");
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await axios.patch(
        "https://api.qa.nutriverseai.in/api/v1/admin/subscription/status",
        {
          status: "cancel",
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (newStatus === "inactive") {
        toast.success(`User marked as ${newStatus}`);
      }
      setReload(reload + 1);
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Toggle status failed:", error);
    }
  };

  const fetchUsers = async ({ pageIndex, pageSize }) => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL("https://api.qa.nutriverseai.in/api/v1/admin/user");

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

      const formattedRows = users.map((user, index) => {
        const status = user?.subscription?.status;
        return {
          sno: <div>{pageSize * pageIndex + index + 1}</div>,
          name: <div>{user.details.name || "Na"}</div>,
          phone: <div>{user.mobileNumber}</div>,
          subscription: <div>{user?.subscription?.planType || "-"}</div>,
          action: (
            <>
              <IconButton color="primary" onClick={() => handleRenewClick(user._id)}>
                <AutorenewIcon />
              </IconButton>
              <IconButton
                color={status === "active" ? "success" : "error"}
                onClick={() => handleToggleStatus(user._id, status)}
              >
                {status === "active" ? <CheckCircleIcon /> : <CancelIcon />}
              </IconButton>
            </>
          ),
        };
      });

      return {
        data: formattedRows,
        total: response.data?.data?.count,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer />
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
            Subscription & Payment Management
          </MDTypography>
        </MDBox>
        <MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            fetchDataRows={fetchUsers}
            canSearch={true}
            noEndBorder
            reload={reload}
          />
        </MDBox>
      </Card>

      {/* Full Message Dialog */}
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

      {/* Renew Subscription Dialog */}
      <Dialog open={renewOpen} onClose={() => setRenewOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          Renew Subscription
          <IconButton
            aria-label="close"
            onClick={() => setRenewOpen(false)}
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
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="plan-select-label">Plan Type</InputLabel>
            <Select
              labelId="plan-select-label"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              label="Plan Type"
              sx={{ height: "40px" }}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton
            variant="outlined"
            sx={{
              width: "90%",
              backgroundColor: "#E1E1E1",
              color: "gray",
              "&:hover": {
                border: "1px solid #164275",
                color: "#164275",
                backgroundColor: "white",
              },
            }}
            onClick={() => setRenewOpen(false)}
          >
            Cancel
          </MDButton>
          <MDButton
            onClick={handleRenewSubmit}
            disabled={!selectedPlan}
            sx={{ width: "90%" }}
            variant="gradient"
            color="info"
          >
            Submit
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Confirm Inactivation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
          Confirm Inactivation
        </DialogTitle>
        <DialogContent sx={{ marginTop: "4px" }}>
          Are you sure you want to mark this user as inactive?
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              width: "90%",
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
          <MDButton
            onClick={() => {
              if (pendingToggleUser) {
                toggleStatus(pendingToggleUser.userId, pendingToggleUser.currentStatus);
              }
              setConfirmOpen(false);
            }}
            sx={{ width: "90%" }}
            variant="gradient"
            color="info"
          >
            Yes, Inactivate
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ContactUs;
