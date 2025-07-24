import React, { useEffect, useState, useContext } from "react";
import DialogActions from "@mui/material/DialogActions";
import {
  Dialog,
  DialogTitle,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import logo from "@/assets/sign.png";
import SignatureAddSignatory from "@/pages/dasboard/contract/sdk/SignatureAddSignatory";
import SignatureSendDoc from "@/pages/dasboard/contract/sdk/SignatureSendDoc";
import SignatureSaveTempDoc from "@/pages/dasboard/contract/sdk/SignatureSaveTempDoc";
import SignatureSentToSign from "@/pages/dasboard/contract/sdk/SignatureSentToSign";

// Assuming your form values type is correct
type FormValues = {
  name: string;
};

interface DetailDialogProps {
  open: boolean;
  onClosePre: () => void;
}

const SignatureDialog: React.FC<DetailDialogProps> = ({ open, onClosePre }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Assuming you might want to perform some actions when the component mounts
  }, []);

  const handleNextStep = () => setCurrentStep((prevStep) => prevStep + 1);

  let componentToRender;
  switch (currentStep) {
    case 1:
      componentToRender = (
        <SignatureAddSignatory onButtonClick={handleNextStep} />
      );
      break;
    case 2:
      componentToRender = (
        <SignatureSendDoc email={"abc"} onButtonClick={handleNextStep} />
      );
      break;
    case 3:
      componentToRender = (
        <SignatureSaveTempDoc
          onButtonClick={handleNextStep}
          onClose={onClosePre}
        />
      );
      break;
    case 4:
      componentToRender = (
        <SignatureSentToSign
          onButtonClick={handleNextStep}
          onClose={onClosePre}
        />
      );
      break;
    default:
      componentToRender = (
        <SignatureAddSignatory onButtonClick={handleNextStep} />
      );
      break;
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClosePre}
        maxWidth="sm"
        fullWidth
        sx={{ alignItems: "center" }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={onClosePre}
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {componentToRender}

        {/* <DialogActions>
          <Button onClick={onClosePre}>Close</Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default SignatureDialog;
