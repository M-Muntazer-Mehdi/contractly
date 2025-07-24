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
  ClickData: any;
}

const DocumentNameErrorDial: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  ClickData,
}) => {
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
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            lineHeight: "auto",
            maxHeight: "30vh",
            alignItems: "center",

            // height: "30vh",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              flexDirection: "column",

              mb: "1rem",
            }}
          >
            Please add document name before sharing
          </Typography>

          {/* Using another flexbox for laying out button to the right */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "8px",
              width: "100%",
            }}
          >
            <Button
              sx={{
                textTransform: "none",
                mt: "4",
                height: "26px",
                fontSize: "10px",
              }}
              variant="outlined"
              color="error"
              onClick={() => {
                onClose(); // Assuming onClose is a function that needs to be called here
              }}
            >
              Close
            </Button>
            <Button
              sx={{
                textTransform: "none",
                mt: "4",
                height: "25px",
                fontSize: "10px",
                ml: 2,
                backgroundColor: "#174B8B", // Set the button color to green
                "&:hover": {
                  backgroundColor: "#2B6EC2", // Darker green on hover
                },
              }}
              variant="contained"
              onClick={() => {
                onClose(); // Assuming onClose is a function that needs to be called here

                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(
                      inputRef.current.value.length,
                      inputRef.current.value.length
                    );
                  }
                }, 0);
              }}
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default DocumentNameErrorDial;
