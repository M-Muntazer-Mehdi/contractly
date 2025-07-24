/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
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
type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  onClose: any;
  onButtonClick: () => void;
  handleCloseDialog: () => void;
}
const OpenSignatureSignAll: React.FC<DetailDialogProps> = ({
  onButtonClick,
  handleCloseDialog,
  onClose,
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
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={handleCloseDialog}
          aria-label="close"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            fontSize: "15px",
            whiteSpace: "nowrap",
          }}
        >
          “Residential Rental Agreement” document has been signed by all parties
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2">To: {"abc@gmail.com"}</Typography>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mt: 3,
            p: 1,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              // maxWidth: isMobile ? "20px" : "50px",
              width: "30%",
              // height: "auto",
              // Adjust as needed
            }}
          />
          <Typography variant="body1" sx={{ mt: 3, mb: 3 }}>
            “Residential Rental Agreement” document has been signed by all
            parties.
          </Typography>
        </Card>

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
            color="success"
            sx={{ textTransform: "none", mt: "4" }}
            onClick={() => onButtonClick()}
          >
            Open the document
          </Button>
        </div>
      </DialogContent>
    </>
  );
};

export default OpenSignatureSignAll;
