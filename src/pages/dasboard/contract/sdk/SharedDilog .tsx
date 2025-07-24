/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

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

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: any;
}

const SharedDilog: React.FC<DetailDialogProps> = ({ open, onClose, title }) => {
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];

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
            maxHeight: "30vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            lineHeight: "auto",
            height: "47vh",
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <strong style={{ display: "flex" }}> {title}</strong>
          </DialogTitle>
          {title == "Document has been sent to sign!" ||
          title ==
            "Document will be shared for signing in the order you specified." ? (
            <img
              src={signAll}
              alt="Logo"
              style={{
                // maxWidth: isMobile ? "20px" : "50px",
                width: "18%",
                // height: "auto",
                marginTop: "1rem", // Adjust as needed
                marginBottom: "2rem", // Adjust as needed
              }}
            />
          ) : (
            <img
              src={logo}
              alt="Logo"
              style={{
                // maxWidth: isMobile ? "20px" : "50px",
                width: "15%",
                // height: "auto",
                marginTop: "0rem", // Adjust as needed
                marginBottom: "1rem", // Adjust as needed
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              float: "right",
              marginTop: "8px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                mt: "2",
                backgroundColor: "#174B8B", // Set the button color to green
                "&:hover": {
                  backgroundColor: "#2B6EC2", // Darker green on hover
                },
              }}
              onClick={onClose}
              // onClick={() => setOpenDialog(true)}
            >
              {title == "Document has been sent to sign!" ||
              title ==
                "Document will be shared for signing in the order you specified."
                ? "Close"
                : "Continue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SharedDilog;
