/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useEffect, useState, useContext } from "react";
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
import logo from "@/assets/sign.png";
import SignatureSendDoc from "@/pages/dasboard/contract/sdk/SignatureSendDoc";
import { ContractContext } from "@/context/ContractContext";
import InputAdornment from "@mui/material/InputAdornment";
type FormValues = {
  name: string;
  checkboxName: any;
};
interface SignatureAddSignatoryProps {
  onButtonClick: () => void; // Ensure this matches the expected usage
}

const SignatureAddSignatory: React.FC<SignatureAddSignatoryProps> = ({
  onButtonClick,
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
  const {
    signatories,
    setSignatories,
    selectedModule,
    setSidebarExpanded,
    setSelectedModule,
  } = useContext(ContractContext);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [inputValue, setInputValue] = useState(""); // Track the input value
  const [openDialog, setOpenDialog] = useState(false);
  console.log(selectedModule, "selectedModule");

  // Function to handle adding new signatory
  const handleAddSignatory = (newSignatoryEmail: string) => {
    if (newSignatoryEmail && !signatories.includes(newSignatoryEmail)) {
      setSignatories((prev: any) => [...prev, newSignatoryEmail]);
      reset(); // Assuming reset is a function to clear the form
      setInputValue(""); // Assuming you manage the input value for Autocomplete
    }
  };

  const handleAddSignatoryClick = () => {
    setSelectedModule("quickSign");
    setSidebarExpanded(true);
  };

  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setSignatories(
      signatories.filter((signatory: any) => signatory !== signatoryToRemove)
    );
  };

  // Handle input change to track current value
  const handleInputChange = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
  };

  // Handle "Enter" key press in the input
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddSignatory(inputValue);
    }
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);
      console.log({ data });

      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

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
  const bubbleColors = ["#FEC85E", "#BC3D89", "#725FE7,#00A7B1"];
  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong style={{ display: "flex", alignItems: "center" }}>
          {" "}
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: isMobile ? "20px" : "50px",
              marginRight: "10px",
            }}
          />
          Residential Rental Agreement
        </strong>
      </DialogTitle>
      <Typography variant="body2" sx={{ mt: -2, ml: 7 }}>
        Can sign and receive a copy of the document
      </Typography>
      <DialogContent sx={{ maxHeight: "300px" }}>
        <Grid item xs={12} sm={7}>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                // Changed from endAdornment to startAdornment
                startAdornment: (
                  <InputAdornment position="start">
                    <Button
                      variant="text"
                      color="primary"
                      sx={{ textTransform: "none" }}
                      onClick={handleAddSignatoryClick}
                    >
                      Add Signatory
                    </Button>
                  </InputAdornment>
                ),
              }}
              onClick={handleAddSignatoryClick}
            />
            {signatories.length !== 0 && (
              <Card
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between", // This spreads out the children
                  mt: 1,
                  p: 1,
                }}
              >
                {signatories.map((signatory: any, index: any) => (
                  <>
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          key={signatory._id}
                          sx={{
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            backgroundColor:
                              bubbleColors[index % bubbleColors.length],
                            color: "#FFFFFF",
                            marginRight: -1,
                            fontSize: "8px",
                            mr: 1,
                          }}
                        >
                          <Typography>
                            {signatory?.charAt(0).toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography
                          onClick={() => onButtonClick()}
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            width: "120px",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                          }}
                        >
                          {signatory}
                        </Typography>
                      </Box>

                      <Button
                        variant="text"
                        color="primary"
                        sx={{ textTransform: "none" }}
                        onClick={() => handleRemoveSignatory(signatory)}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                ))}
              </Card>
            )}
          </form>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", float: "right", mt: 2 }}
            onClick={() => onButtonClick()}
          >
            Send document
          </Button>
        </Grid>
      </DialogContent>
    </>
  );
};

export default SignatureAddSignatory;
