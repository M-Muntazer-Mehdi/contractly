/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useEffect } from "react";

import DialogActions from "@mui/material/DialogActions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Select,
  Autocomplete,
  TextField,
  FormControl,
  FormHelperText,
  Checkbox,
  IconButton,
  FormControlLabel,
  Grid,
  useMediaQuery,
  useTheme,
  Card,
  MenuItem,
} from "@mui/material";
import { getBranchByid, getUserId } from "@/service/api/apiMethods";
import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/logo.jpg";
import CollaburaterSharedDilog from "@/pages/dasboard/contract/sdk/SharedDilog ";
import { ContractContext } from "@/context/ContractContext";
import SharedDilog from "@/pages/dasboard/contract/sdk/SharedDilog ";

interface DetailDialogProps {
  open: boolean;
  ClickData: any;
  onClose: () => void;
}

const CollaburaterDilog: React.FC<DetailDialogProps> = ({
  open,
  ClickData,
  onClose,
}) => {
  const { collaborater, setCollaborater } = useContext(ContractContext);
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(
    "Can view, edit, and comment"
  );

  // useEffect(() => {
  //   // Reset selectedPermission when dialog opens or the ClickData changes
  //   console.log(ClickData, "click");

  //   const index = collaborater.findIndex(
  //     (user: any) =>
  //       user?.email?.trim().toLowerCase() ===
  //       ClickData?.email?.trim().toLowerCase()
  //   );

  //   if (index !== -1) {
  //     setSelectedPermission(collaborater[index].permission || ""); // Assume each collaborator has a `permission` field
  //   }
  // }, [ClickData, collaborater, open]);

  const handlePermissionChange = (event: any) => {
    const newPermission = event.target.value as string;
    setSelectedPermission(newPermission);
  };

  // New function to update the collaborator's permission, called on button click
  const updateCollaboratorPermission = () => {
    setCollaborater((prevCollaborater: any[]) => {
      return prevCollaborater.map((user) => {
        if (user.email === ClickData?.email) {
          return { ...user, permission: selectedPermission };
        }
        // return { ...user, permission: selectedPermission };
        return user;
      });
    });
  };

  console.log(collaborater, "collaborater");

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClick = () => {
    setOpenDialog(true);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Dialog
            border: "1.5px dashed #174B8B", // Customizing the border to dashed
            borderRadius: "16px",
          },
          alignItems: "center",
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            {/* <CloseIcon /> */}
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
          >
            <PersonAddIcon color="primary" sx={{ mt: -0.5, mr: 2 }} />
            Residential Rental Agreement
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ maxHeight: "30vh" }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "none !important",
              boxShadow: "none !important",
              // alignItems: "center",
              // textAlign: "center",
              mt: 3,
              p: 1,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",

                    backgroundColor: bubbleColors[1 % bubbleColors.length],
                    color: "#FFFFFF",
                    marginRight: -1,

                    mr: 1,
                  }}
                >
                  <Typography sx={{ fontSize: "14px" }}>
                    {ClickData?.email?.charAt(0).toUpperCase()}
                    {ClickData?.lastName?.charAt(0).toUpperCase()}
                  </Typography>
                </Box>
                <div
                  style={{
                    display: "flex", // Use flex layout
                    flexDirection: "column", // Stack children vertically
                    justifyContent: "center", // Center content vertically
                    alignItems: "center", // Center content horizontally

                    textAlign: "start",
                  }}
                >
                  {ClickData?.firstName ? (
                    <Typography
                      variant="body2"
                      sx={{
                        alignItems: "start",
                        width: "130px",
                        textOverflow: "ellipsis",
                        fontSize: "16px",
                      }}
                    >
                      {ClickData?.firstName}
                    </Typography>
                  ) : null}
                  <Typography
                    variant="body2"
                    sx={{
                      width: "130px",
                      textOverflow: "ellipsis",
                      fontSize: "16px",
                    }}
                  >
                    {ClickData?.email}
                  </Typography>
                </div>
              </div>
              <div style={{ float: "right", marginTop: 5 }}>
                <Select
                  variant="standard"
                  size="small"
                  labelId="permession-label"
                  value={selectedPermission}
                  onChange={handlePermissionChange}
                  displayEmpty
                  renderValue={(value: any) => {
                    if (value === "") {
                      return (
                        <em
                          style={{
                            color: "#C2C2C2",
                            fontStyle: "normal",
                            fontSize: "15.5px",
                          }}
                        >
                          Choose a permission
                        </em>
                      );
                    }
                    return value;
                  }}
                >
                  <MenuItem value="Can view, edit, and comment">
                    Can view, edit, and comment
                  </MenuItem>
                  <MenuItem value="Can view and comment">
                    Can view and comment
                  </MenuItem>
                </Select>
              </div>
            </div>
          </Card>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              float: "right",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              sx={{ textTransform: "none", mt: "4", mr: 2 }}
              onClick={onClose}
              // onClick={() => setOpenDialog(true)}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedPermission}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                mt: "4",
                backgroundColor: "#174B8B", // Set the button color to green
                "&:hover": {
                  backgroundColor: "#2B6EC2", // Darker green on hover
                },
              }}
              onClick={() => {
                handleClick();
                updateCollaboratorPermission(); // Call the new function here
              }}
            >
              Share document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SharedDilog
        open={openDialog}
        onClose={handleCloseDialog}
        title={"Document has been sent to Collaborate!"}
      />
    </>
  );
};

export default CollaburaterDilog;
