/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useEffect, useState, useContext } from "react";
import DialogActions from "@mui/material/DialogActions";
import { useLocation } from "react-router-dom";
import { TextareaAutosize } from "@mui/material";
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
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import logo from "@/assets/logo.jpg";
import { ContractContext } from "@/context/ContractContext";
import { log } from "console";
import { getcontractById } from "@/service/api/contract";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  email: any;
  open: any;
  onClose: () => void;
}
const OpenSignatureAddFrwd: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  email,
}) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const theme = useTheme();
  const { recipients, setRecipients, setOpenMultiDialog } =
    useContext(ContractContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<any>("");
  const [message, setMessage] = useState<any>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [newEmail, setNewEmail] = useState("");
  console.log(email, "email");

  useEffect(() => {
    // Reset requestOption when dialog opens or the ClickData changes

    const index = recipients.findIndex(
      (recip: any) =>
        recip?.email?.trim().toLowerCase() === email?.trim().toLowerCase()
    );

    if (index !== -1) {
      setNewEmail(recipients[index].permission || ""); // Assume each collaborator has a `permission` field
    }
  }, [email, recipients, open]);

  // New function to update the collaborator's permission, called on button click

  console.log(recipients, "new");

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getcontractById(user?._id);
      console.log(data);

      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    // try {
    //   const payload = {
    //     user: data.name,
    //   };
    //   console.log(payload);
    //   return;
    //   const response = await createTeam(payload);
    //   if (response.ok === true) {
    //     toast.success(response.message);
    //   } else {
    //     const errorMessage = response.data || response.message;
    //     toast.error(errorMessage);
    //   }
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // } catch (error: any) {
    //   console.log(error);
    //   let errorMessage = "failed";
    //   if (error.response) {
    //     errorMessage = error.response.data || error.response.data.message;
    //   } else {
    //     errorMessage = error.message;
    //   }
    //   toast.error(errorMessage);
    //   // Handle error
    //   console.error(errorMessage);
    // }
  };
  console.log(userList, "userList");

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{ alignItems: "center" }}
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
          <Typography variant="body1" sx={{ mt: 2 }}>
            New recipient
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ height: "370px" }}>
          <Typography variant="subtitle2" sx={{}}>
            Email*
          </Typography>
          <TextField
            fullWidth
            type="text"
            size="small"
            name="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder=""
          />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Add message
          </Typography>
          <Box
            sx={{
              width: "100%",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              // padding: 16px (2 * theme spacing unit)
              mt: 0.5, // margin-top: 8px (1 * theme spacing unit)
              mb: 1, // margin-bottom: 16px (2 * theme spacing unit)
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              name="message"
              placeholder="Add message (optional)"
              maxLength={150}
              rows={5}
              style={{
                width: "100%",
                boxSizing: "border-box",
                fontSize: "13px",
                lineHeight: "20px",
                padding: "10px 10px",
                borderRadius: "4px",
                resize: "block",
              }}
            />

            {/* Display remaining characters */}
          </Box>
          <div style={{ textAlign: "left", fontSize: "12px" }}>
            {150 - message?.length} characters remaining
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              float: "right",
              marginTop: "29px",
            }}
          >
            <Button
              variant="outlined"
              sx={{ textTransform: "none", mt: "4" }}
              onClick={onClose}
              // onClick={() => setOpenDialog(true)}
            >
              Cancel
            </Button>
            <Button
              disabled={!newEmail}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", mt: "4", ml: 2 }}
              onClick={() => {
                const updatedRecipients = recipients.map((recipient: any) => {
                  if (recipient.email === email) {
                    console.log("ok");

                    // Correctly updating recipient while also setting the message
                    return {
                      ...recipient,
                      email: newEmail,
                      ReqOption: {
                        ...recipient.ReqOption,
                        message: message, // Assuming 'message' holds the new message you want to set
                      },
                    };
                  }
                  // Otherwise, return the recipient unchanged
                  return recipient;
                });
                console.log(updatedRecipients, "updatedRecipients");

                setRecipients(updatedRecipients); // Update the state with the modified array
                onClose(); // Optionally close the dialog after updating.
              }}
            >
              Forward
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpenSignatureAddFrwd;
