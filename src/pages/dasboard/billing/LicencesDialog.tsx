/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

const LicencesDialog: React.FC<{
  isReduce: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose, isReduce }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md">
      <DialogTitle>
        {isReduce ? "Reduce user licences" : "Add user licences"}{" "}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
        {isReduce ? (
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your current subscription comprises 5 user licenses. If you have
            more than 5 active users, kindly switch their status from "Active"
            to "Inactive." If you currently have only 5 active users and wish to
            decrease the number of user licenses, please note that this won't
            affect the monthly subscription charges. ContractnSign provides a
            predefined number of user licenses known as the "user threshold"
            with each subscription.
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your existing subscription includes 5 user licenses. Our adaptable
            plans enable you to include extra users at a cost of USD 10/month
            per additional user. If you're an account admin and would like to
            add more users, simply navigate to the User Module.
          </Typography>
        )}

        <Divider />

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
            component={Link}
            to="/dashboard/user-list"
            sx={{ textTransform: "none" }}
          >
            Back to user module
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LicencesDialog;
