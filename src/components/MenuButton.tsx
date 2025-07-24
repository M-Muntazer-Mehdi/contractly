// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import Checkbox from "@mui/material/Checkbox";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import toast from "react-hot-toast";
// import { branchFilter } from "@/service/api/apiMethods";

// interface CheckedState {
//   name: boolean;
//   manager: boolean;
//   status: boolean;
//   activeContract: boolean;
//   annualValue: boolean;
// }
// function MenuButton() {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [checked, setChecked] = useState({
//     name: false,
//     manager: false,
//     status: false,
//     activeContract: false,
//     annualValue: false,
//   });

//   const handleClick = (event: any) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const updateFiltersInBackend = async (updatedFilters: any) => {
//     try {
//       console.log({ updatedFilters });

//       const response = await branchFilter(updatedFilters);
//       if (response.ok === true) {
//         toast.success(response.message);
//         // navigate("");
//       } else {
//         const errorMessage = response.data || response.message;
//         toast.error(errorMessage);
//       }
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       console.log(error);

//       let errorMessage = "failed";
//       if (error.response) {
//         errorMessage = error.response.data || error.response.message;
//       } else {
//         errorMessage = error.message;
//       }
//       toast.error(errorMessage);
//       console.error(errorMessage);
//     }
//   };

//   const handleCheck = (option: any) => {
//     setChecked((prev) => {
//       const updatedFilters = {
//         ...prev,
//         [option]: !prev[option],
//       };

//       updateFiltersInBackend(updatedFilters); // Call the function to update backend
//       return updatedFilters;
//     });
//   };

//   return (
//     <div>
//       <Button
//         aria-controls="filter-menu"
//         aria-haspopup="true"
//         onClick={handleClick}
//         startIcon={<FilterListIcon />}
//         variant="outlined"
//       >
//         Filter
//       </Button>
//       <Menu
//         id="filter-menu"
//         anchorEl={anchorEl}
//         keepMounted
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//       >
//         <MenuItem onClick={() => handleCheck("name")}>
//           <Checkbox checked={checked.name} />
//           Name
//         </MenuItem>
//         <MenuItem onClick={() => handleCheck("manager")}>
//           <Checkbox checked={checked.manager} />
//           Manager
//         </MenuItem>
//         <MenuItem onClick={() => handleCheck("status")}>
//           <Checkbox checked={checked.status} />
//           Status
//         </MenuItem>
//         <MenuItem onClick={() => handleCheck("activeContract")}>
//           <Checkbox checked={checked.activeContract} />
//           Active Contract
//         </MenuItem>
//         <MenuItem onClick={() => handleCheck("annualValue")}>
//           <Checkbox checked={checked.annualValue} />
//           Annual Value
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// }

// export default MenuButton;
