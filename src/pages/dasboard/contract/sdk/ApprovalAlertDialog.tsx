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
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import logo from "@/assets/sign.png";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface ApprovalAlertDialogProps {
  open: boolean;
  onClose: () => void;
  // onSubmit: (
  //   status: string,
  //   reason: string,
  //   approver: any,
  //   Resolved: string
  // ) => void;
  // dialogData: any;
}

const ApprovalAlertDialog: React.FC<ApprovalAlertDialogProps> = ({
  open,
  onClose,
  // onSubmit,
  // dialogData,
}) => {
  const [reason, setReason] = useState("");

  // useEffect(() => {
  //   if (dialogData?.reason) {
  //     setReason(dialogData.reason);
  //   }
  // }, [dialogData]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        // maxWidth=""
        sx={{ alignItems: "center" }}
        // aria-labelledby="responsive-dialog-title"
        fullWidth={true}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mt: 3, mb: 5 }}>
            An approval workflow is already active for this document. To create
            a new approval process, please remove the existing one first.
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalAlertDialog;
