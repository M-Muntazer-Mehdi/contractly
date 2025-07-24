import React, { useState } from "react";

import DialogActions from "@mui/material/DialogActions";

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
import { getBranchByid, getUserId } from "@/service/api/apiMethods";
import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/logo.jpg";

interface DetailDialogProps {
  open: boolean;

  onClose: () => void;
}

const CollaburaterDilog: React.FC<DetailDialogProps> = ({
  open,
  // id,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
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
        }}
      >
        <IconButton
          onClick={onClose}
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
            // onClick={() => onButtonClick()}
          >
            Open the document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaburaterDilog;
