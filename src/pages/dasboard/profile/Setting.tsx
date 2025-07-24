/* eslint-disable @typescript-eslint/no-explicit-any */
// BranchForm.tsx
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Tooltip,
  Chip,
  CardContent,
  Switch,
} from "@mui/material";

import toast from "react-hot-toast";
import {
  getBranchList,
  getTeamsList,
  getUserId,
  updateStatus,
  updateUser,
} from "@/service/api/apiMethods";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "@/assets/send.png";
import user from "@/assets/user.png";
import permission from "@/assets/permission.png";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import RoleTable from "@/pages/dasboard/users/RoleTable";
import { log } from "console";
import LoginHistory from "@/pages/dasboard/users/LoginHistory";
import { useAuth } from "@/hooks/useAuth";
import Account from "@/pages/dasboard/profile/Account";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  job: string;
  mobile: string;
  landline: string;
  team: string;
  branch: string;
  status: string;
  image: string;
};

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

const Setting = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [status, setStatus] = useState<any>("");
  const [tabValue, setTabValue] = useState(0);
  const [image, setImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<any>("");
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [branchData, setBranchData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<any>("");
  const [isAccessDisabled, setIsAccessDisabled] = useState<boolean>();
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",

          display: "flex",
          pl: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Notification" sx={{ fontWeight: "bold" }} />
          <Tab label="Security" sx={{ fontWeight: "bold" }} />
        </Tabs>

        {/* <Box
          sx={{
            ml: "auto",
          }}
        >
          <Button
            sx={{
              textTransform: "none",
              mr: 5,
              maxHeight: 35,
              mt: 1,
            }}
            component={Link}
            to={`/dashboard/user-update-user/${id}`}
          >
            Edit
          </Button>
        </Box> */}
      </Box>

      <TabPanel value={tabValue} index={0}>
        <h1>Notification comming soon ...</h1>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={10}
            md={10}
            lg={10}
            xl={10}
            sx={{ width: "100%" }}
          >
            <Grid sx={{ mb: 3 }}>
              <Account />
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default Setting;
