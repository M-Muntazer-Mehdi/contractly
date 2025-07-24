import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const CancelSubscriptionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md">
      <DialogContent>
        <Typography
          variant="h5"
          style={{
            textAlign: "center",

            fontWeight: "bold",
          }}
        >
          We’re sorry to see you go
        </Typography>
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Would you tell us why?
        </Typography>
        <Divider style={{ marginBottom: "5px", textAlign: "center" }} />
        <div
          style={{
            overflowX: "auto", // Enable horizontal scrolling
          }}
        >
          {[
            "We intend to use a different tool",
            "We were unable to adopt ContractnSign",
            "ContractnSign is too expensive",
            "We need features ContractnSign doesn’t have",
            "We do not have business need for contract management",
            "We were unable to get expected support from ContractnSign",
            "Others",
          ].map((label, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "5px",
                borderRadius: "4px",
                backgroundColor: "#e0f2f1", // Set a card-like color
                minWidth: "200px", // Ensure a minimum width for each card
              }}
            >
              <FormControlLabel
                control={<Checkbox />}
                label={label}
                style={{ marginRight: "10px" }}
              />
            </div>
          ))}
        </div>

        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <Button
            sx={{ textTransform: "none" }}
            onClick={onClose}
            variant="outlined"
            color="secondary"
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
