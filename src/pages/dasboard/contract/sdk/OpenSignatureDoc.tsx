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
import OpenSignatureAddFrwd from "@/pages/dasboard/contract/sdk/OpenSignatureAddFrwd";
import OpenDrawSignature from "@/pages/dasboard/contract/sdk/OpenDrawSignature";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  email: any;
  onButtonClick: () => void;
  handleCloseDialog: () => void;
}
const OpenSignatureDoc: React.FC<DetailDialogProps> = ({
  onButtonClick,
  handleCloseDialog,
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
  const [email, setEmail] = useState("");
  const location = useLocation();
  const [openLDialog, setOpenLDialog] = useState(false);
  const [OpenDrawSignatures, setOpenDrawSignatures] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);
  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getcontractById(user?._id);
      console.log(data);
      setRecipients(data?.signature);
      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosefwdDialog = () => {
    setOpenLDialog(false);
    handleCloseDialog();
  };

  const handleCloseDrawSigDialog = () => {
    setOpenDrawSignatures(false);
    handleCloseDialog();
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
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: -2,
        }}
      >
        <IconButton
          onClick={handleCloseDialog}
          aria-label="close"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          {/* <CloseIcon />/// */}
        </IconButton>
        <Typography variant="body1" sx={{ mt: 2 }}>
          PK ({" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            {email}
          </Box>
          ) has shared Residential Rental Agreement to sign.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2">To: {email}</Typography>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
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
          <Typography variant="body1" sx={{ mt: 1, mb: 2, ml: -14 }}>
            PK (
            <Box component="span" sx={{ color: "primary.main" }}>
              {email}
            </Box>
            ) has shared Residential Rental Agreement to sign.
          </Typography>

          <Box
            sx={{
              width: "100%",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              // padding: 16px (2 * theme spacing unit)
              mt: 2, // margin-top: 8px (1 * theme spacing unit)
              mb: 2, // margin-bottom: 16px (2 * theme spacing unit)
            }}
          >
            <textarea
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
              name="message"
              placeholder="Add message (optional)"
              maxLength={150}
              rows={5}
              style={{
                width: "100%",
                boxSizing: "border-box",
                fontSize: "13px",
                lineHeight: "20px", // Adjust line-height for better vertical alignment
                padding: "10px 10px", // Adjust vertical padding to help center the text
                // border: "1px solid #ced4da",
                borderRadius: "4px",
                resize: "block",
              }}
            />
          </Box>
        </Card>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          {userList?.signature?.map(
            (recipient: any) =>
              recipient.email === email && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ textTransform: "none" }}
                  key={recipient.email}
                  onClick={() => {
                    if (recipient?.ReqOption?.forwarding) {
                      setOpenLDialog(true);
                    } else {
                      setOpenDrawSignatures(true);
                    }
                  }}
                >
                  {recipient?.ReqOption?.forwarding
                    ? "Review and forward the document"
                    : "Review and sign"}
                </Button>
              )
          )}
        </div>
      </DialogContent>
      <OpenSignatureAddFrwd
        email={email}
        open={openLDialog}
        onClose={handleClosefwdDialog}
      />
      <OpenDrawSignature
        openDilog={OpenDrawSignatures}
        onClose={handleCloseDrawSigDialog}
        closeFirstOen={handleCloseDialog}
        selectedEmails={email}
      />
    </>
  );
};

export default OpenSignatureDoc;
