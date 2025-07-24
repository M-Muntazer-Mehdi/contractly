/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from "react";

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
import logo from "@/assets/collaburater_icon.png";
import signAll from "@/assets/signAll.png";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { ContractContext } from "@/context/ContractContext";

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
}

const AlertBackDilog: React.FC<DetailDialogProps> = ({ open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const { setDucomentName, setSelectedModule, inputRef } =
    useContext(ContractContext);
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
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #174B8B",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            Please fill the document title first
          </Typography>
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ position: "absolute", top: -4, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            lineHeight: "auto",
            maxHeight: "30vh",
            // height: "30vh",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              flexDirection: "column",

              mt: "1rem",
            }}
          >
            Click to add button for fill document Name
          </Typography>

          {/* Using another flexbox for laying out button to the right */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
              width: "100%",
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
              // disabled={!requestOption}
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
              // onClick={() => {
              //   handleClick();
              //   updateDocument(); // Call the new function here
              // }}
            >
              Share document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AlertBackDilog;
