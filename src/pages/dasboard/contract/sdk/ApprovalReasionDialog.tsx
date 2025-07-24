/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";

import {
  getBranchByid,
  getUserId,
  getUserListNameID,
} from "@/service/api/apiMethods";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Divider,
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
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import logo from "@/assets/sign.png";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface ApprovalReasionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    status: string,
    reason: string,
    approver: any,
    Resolved: string
  ) => void;
  dialogData: any;
}

const ApprovalReasionDialog: React.FC<ApprovalReasionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  dialogData,
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (dialogData?.reason) {
      setReason(dialogData.reason);
    }
  }, [dialogData]);

  const handleSave = () => {
    onSubmit("Rejected", reason, "", "Resolved");
    onClose(); // Optionally reset reason and close the dialog
    setReason(""); // Reset reason for next use
  };
  const handleResolve = () => {
    onSubmit("Rejected", reason, "", "resolved");
    onClose();
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        // maxWidth="md"
        sx={{ alignItems: "center" }}
        // aria-labelledby="responsive-dialog-title"
        fullWidth={true}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: -2,
          }}
        >
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="body1" sx={{ mt: 5 }}>
            <Box component="span" sx={{ color: "primary.main" }}>
              {dialogData?.email}&nbsp;
            </Box>
            has rejected the document.
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              backgroundColor: "#fredcccb", // Ensure Card takes full width
            }}
          >
            <TextareaAutosize
              placeholder="Leave a message (optional)"
              value={reason}
              minRows={6}
              maxLength={50}
              onChange={(event) => setReason(event.target.value)}
              style={{
                width: "100%", // Ensure full width
                boxSizing: "border-box", // Include padding and border in element's size
                fontSize: "16px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                paddingLeft: "10px",
                resize: "none", // Prevent manual resizing
              }}
            />
          </Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  mr: "20px",
                  textTransform: "none",
                  backgroundColor: "#DCDCDC",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                  color: "white",
                  padding: "2px 5px !important", // Force padding
                  height: "25px !important", // Reduce minimum height
                  fontSize: "0.775rem", // Adjust font size if necessary
                }}
                onClick={handleSave}
              >
                Cancel
              </Button>

              {!dialogData?.reason ? (
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#62BD6B",
                    "&:hover": {
                      backgroundColor: "#62BD6d",
                    },
                    color: "white",
                    padding: "2px 5px !important",
                    height: "25px !important",
                    fontSize: "0.775rem",
                  }}
                  // onClick={() => setShowSignatories(!showSignatories)} // Toggle visibility
                  onClick={handleSave}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#62BD6B",
                    "&:hover": {
                      backgroundColor: "#62BD6d",
                    },
                    color: "white",
                    padding: "2px 5px !important",
                    height: "25px !important",
                    fontSize: "0.775rem",
                  }}
                  // onClick={() => setShowSignatories(!showSignatories)} // Toggle visibility
                  onClick={handleResolve}
                >
                  Resolve
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalReasionDialog;
