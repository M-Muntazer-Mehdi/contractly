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
  Stack,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import signAll from "@/assets/signAll.png";
import logo from "@/assets/logo.jpg";
import Collaburater from "@/assets/Collaburater.png";
import document from "@/assets/document_icon.svg";
import pencil from "@/assets/fi-sr-pencil.png";
import { CloudDownload as DownloadIcon } from "@mui/icons-material";
import chart from "@/assets/Chart.png";
import sgareTrack from "@/assets/sgareTrack.png";
import pencil2 from "@/assets/Pincil2.png";

type FormValues = {
  name: string;
  checkboxName: any;
};
interface DetailDialogProps {
  onClose: any;
  onButtonClick: () => void;
}
const OpenSignaturDownload: React.FC<DetailDialogProps> = ({
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
      <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
        <DialogContent>
          <IconButton
            onClick={onClose}
            style={{ position: "absolute", right: "8px", top: "8px" }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "45%", textAlign: "center", p: 5 }}>
              <img
                src={signAll}
                alt="Logo"
                style={{ width: "40%", margin: "auto" }}
              />
              <Button
                variant="text"
                color="primary"
                sx={{ mt: 3, textTransform: "none" }}
                onClick={onButtonClick}
              >
                You’ve finished signing!
              </Button>
              <Typography variant="body1" sx={{ marginTop: 3, mb: 1 }}>
                You can download signed pdf version of this document
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
                  color="success"
                  sx={{ textTransform: "none" }}
                  onClick={onButtonClick}
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              </div>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Box
              sx={{
                width: "45%",
                textAlign: "center",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              {/* Header Title */}
              <img
                src={logo}
                alt="Logo"
                style={{ width: "40%", margin: "auto" }}
              />
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 3, justifyContent: "center" }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img
                    src={document}
                    alt="Logo"
                    style={{ width: "30%", margin: "auto" }}
                  />
                  <Typography>Create</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img
                    src={Collaburater}
                    alt="Logo"
                    style={{ width: "20%", margin: "auto" }}
                  />
                  <Typography>Collaborate</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img
                    src={pencil}
                    alt="Logo"
                    style={{ width: "30%", margin: "auto" }}
                  />
                  <Typography>Sign</Typography>
                </Stack>
              </Stack>
              <Divider
                orientation="horizontal"
                flexItem
                sx={{ my: 1, backgroundColor: "#FFAA04", height: "2px" }} // adjust the height as needed
              />

              <Typography variant="body2" sx={{ mt: 1 }}>
                Our powerful software streamlines the entire contract lifecycle,
                from creation and negotiation to signing and storage, all in one
                user-friendly interface.
              </Typography>

              {/* Feature Points */}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,

                  borderRadius: "16px",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  {/* Each feature as a flex item */}
                  <Box sx={{ alignItems: "center" }}>
                    <img
                      src={pencil2}
                      alt="Create"
                      style={{ alignItems: "center", textAlign: "center" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "justify",
                        width: "115px",
                        wordSpacing: "-3px",
                      }}
                    >
                      Unlimited Signatures. Our inbuilt quicksign feature
                      eliminates the need for Docu Sign, Hello Sign and Adobe
                      Sign to help save you money and speed up the contract
                      process.
                    </Typography>
                  </Box>

                  <Box sx={{ alignItems: "center" }}>
                    <img
                      src={sgareTrack}
                      alt="Collaborate"
                      style={{ width: "100%" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "justify",
                        width: "115px",
                        wordSpacing: "-3px",
                      }}
                    >
                      Invite internal or external stakeholders, share documents,
                      and track progress in real-time.
                    </Typography>
                  </Box>

                  <Box sx={{ alignItems: "center" }}>
                    <img
                      src={chart}
                      alt="Sign"
                      style={{ marginRight: "8px" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "justify",
                        width: "115px",
                        wordSpacing: "-3px",
                      }}
                    >
                      Intuitive Executive Dashboard that lets you gain deep
                      insights into your contracts.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, textTransform: "none" }}
                onClick={onButtonClick}
              >
                Start 14-day free trial
              </Button>
            </Box>
            {/* <Box sx={{ width: "45%", textAlign: "center" }}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "60%", margin: "auto" }}
              />
              <Button
                variant="text"
                color="primary"
                sx={{ mt: 3, textTransform: "none" }}
                onClick={onButtonClick}
              >
                You’ve finished signing!
              </Button>
              <Typography variant="body1" sx={{ marginTop: 3, mb: 1 }}>
                You will receive a pdf copy when everyone has signed.
              </Typography>
            </Box> */}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpenSignaturDownload;
