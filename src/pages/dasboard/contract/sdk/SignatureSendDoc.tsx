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
import logo from "@/assets/sign.png";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  email: any;
  onButtonClick: () => void;
}
const SignatureSendDoc: React.FC<DetailDialogProps> = ({
  onButtonClick,
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
          mt: -5,
        }}
      >
        <strong style={{ display: "flex" }}> Send document to sign</strong>
      </DialogTitle>

      <DialogContent sx={{ height: "420px" }}>
        <Typography variant="body2">To: {email}</Typography>
        {/* <Card> */}
        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
          PK (<span style={{ color: "primary" }}>{email}</span>) has shared
          Residential Rental Agreement to sign.
        </Typography>
        <Controller
          name="name"
          control={control}
          // rules={{ required: "Tag Name is required", maxLength: 50 }}
          render={({ field }: any) => (
            <>
              <TextareaAutosize
                {...field}
                placeholder="text"
                minRows={4}
                maxLength={50}
                onChange={(event) => {
                  field.onChange(event); // react-hook-form Controller handle onChange
                }}
                style={{
                  width: "100%",
                  fontSize: "16px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  padding: "10px",
                }}
              />
            </>
          )}
        />
        {/* </Card> */}

        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", float: "right", mt: 2 }}
          onClick={() => onButtonClick()}
        >
          Send document
        </Button>
      </DialogContent>
    </>
  );
};

export default SignatureSendDoc;
