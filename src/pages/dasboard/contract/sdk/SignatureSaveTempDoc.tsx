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
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import logo from "@/assets/signLarge.png";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  onButtonClick: () => void;
  onClose: () => void;
}
const SignatureSaveTempDoc: React.FC<DetailDialogProps> = ({
  onButtonClick,
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
        <strong style={{ display: "flex", textAlign: "center" }}>
          Do you want to save as template before sending the document for
          signature?
        </strong>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* <Card> */}
        <img
          src={logo}
          alt="Logo"
          style={{
            // maxWidth: isMobile ? "20px" : "50px",
            width: "14%",
            // height: "auto",
            marginTop: "0rem", // Adjust as needed
            marginBottom: "0.5rem", // Adjust as needed
          }}
        />
        <Button
          variant="contained"
          color="success"
          sx={{ textTransform: "none", mt: 2, width: "fit-content" }}
          onClick={() => onClose()}
        >
          Save as template
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", mt: 2, width: "fit-content" }}
          onClick={() => onButtonClick()}
        >
          Send document
        </Button>
      </DialogContent>
    </>
  );
};

export default SignatureSaveTempDoc;
