/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useEffect } from "react";

import DialogActions from "@mui/material/DialogActions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Select,
  Autocomplete,
  Divider,
  TextField,
  FormControl,
  FormHelperText,
  Checkbox,
  IconButton,
  FormControlLabel,
  Grid,
  Tab,
  Tabs,
  Card,
  MenuItem,
} from "@mui/material";
import {
  getBranchByid,
  getUserId,
  getUserListNameID,
} from "@/service/api/apiMethods";
import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/logo.jpg";
import SharedDilog from "@/pages/dasboard/contract/sdk/SharedDilog ";
import { ContractContext } from "@/context/ContractContext";
import { useAuth } from "@/hooks/useAuth";
import SignatureSendReq from "@/pages/dasboard/contract/sdk/SignatureSendReq";
import SignatureSendReqComponent from "@/pages/dasboard/contract/sdk/SignatureSendReqComponent";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
interface DetailDialogProps {
  open: boolean;
  ClickData: any;
  onClose: () => void;
}

const SignatureMultiSendReq: React.FC<DetailDialogProps> = ({
  open,
  ClickData,
  onClose,
}) => {
  const { user } = useAuth();
  const { recipients, setRecipients } = useContext(ContractContext);
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const [userList, setUserList] = useState<Array<any>>([]);

  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const moveToNextTab = () => {
    if (tabValue < recipients.length - 1) {
      setTabValue((prevTabValue) => prevTabValue + 1);
    }
  };

  // New function to update the collaborator's permission, called on button click

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
  useEffect(() => {
    setTabValue(0);
  }, [open]);
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Dialog
            border: "1.5px dashed #174B8B", // Customizing the border to dashed
            borderRadius: "16px",
          },
          alignItems: "center",
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
          >
            {user?.firstName} has shared Residential Rental Agreement to sign.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ height: "41vh", mt: -1 }}>
          <Box
            sx={{
              mb: 2,
              mt: 0.3,
              boxShadow: "4px 4px 8px 4px rgba(220, 220, 220, 1)", // Corrected the color format to RGBA
              borderRadius: "4px",
            }}
          >
            <Tabs
              value={tabValue}
              // onChange={handleTabChange}
              variant="standard"
              scrollButtons="auto"
              aria-label="recipient tabs"
            >
              {recipients.map((recipient: any, index: any) => {
                const user = userList.find(
                  (user) => user.email === recipient?.email
                );
                return (
                  <Tab
                    key={index} // It's better to use a unique identifier if available
                    label={user?.firstName || recipient?.email}
                    sx={{ fontWeight: "bold", textTransform: "none" }}
                  />
                );
              })}
            </Tabs>
          </Box>
          {recipients.map((recipient: any, index: any) => {
            const user = userList.find(
              (user) => user.email === recipient?.email
            );
            const isSelected = index === tabValue;
            return (
              <Box
                key={index} // Again, use a unique identifier if possible
                role="tabpanel"
                hidden={!isSelected}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
              >
                {isSelected && (
                  <SignatureSendReqComponent
                    moveToNextTab={moveToNextTab}
                    ClickData={user}
                    tabValue={tabValue}
                    onclose={onClose}
                  />
                )}
              </Box>
            );
          })}
          {/* 
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              float: "right",
              marginTop: "16px",
            }}
          >
            <Button
              variant="outlined"
              sx={{ textTransform: "none", mt: "4", mr: 2 }}
              onClick={onClose}
              // onClick={() => setOpenDialog(true)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", mt: "4" }}
              onClick={moveToNextTab}
              // onClick={() => {
              //   handleClick();
              //   updateDocment(); // Call the new function here
              // }}
            >
              Share document
            </Button>
          </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignatureMultiSendReq;
