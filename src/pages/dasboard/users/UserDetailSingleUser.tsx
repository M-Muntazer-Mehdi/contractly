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
  CardHeader,
  Breadcrumbs,
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

const UserDetailSingleUser = () => {
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

  const listData = async () => {
    try {
      setIsLoading(true);
      const { user } = await getUserId(id);
      console.log(user);
      setImage(user?.image);
      if (user.status === "active") {
        setIsAccessDisabled(true);
      } else {
        setIsAccessDisabled(false);
      }

      setList(user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const getBrandsData = async () => {
    try {
      const { data } = await getTeamsList(user?._id);
      setTeamData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getBranchData = async () => {
    try {
      const { data } = await getBranchList(user?._id);

      setBranchData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBranchData();
    getBrandsData();
  }, []);

  useEffect(() => {
    if (isAccessDisabled === true || isAccessDisabled === false)
      updateStatusf();
  }, [isAccessDisabled]);

  const updateStatusf = async () => {
    try {
      setIsLoading(true);
      console.log(isAccessDisabled, "isAccessDisabled");

      const status = isAccessDisabled
        ? { status: "active" }
        : { status: "inactive" };

      const res = await updateStatus(id, status);

      console.log({ res });
      if (res.ok === true) {
        listData();
      } else {
        toast.error(res?.message || "");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(imageBase64, "image");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String); // Keep the MIME type prefix
        setImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <CardHeader
        title={`${list?.firstName} ${list?.lastName}`}
        sx={{ ml: -2 }}
      />
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ pl: 0.5, mt: -2, mb: 2, fontSize: "13px" }}
      >
        <Link to="/dashboard/user-list" className="link-no-underline">
          Home
        </Link>
        {/* <Typography color="text.primary">Categories</Typography> */}
      </Breadcrumbs>
      <Paper sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",

            display: "flex",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Profile" sx={{ fontWeight: "bold" }} />
            <Tab label="Login History" sx={{ fontWeight: "bold" }} />
          </Tabs>
          {/* <Button
            sx={{
              ml: "auto",
              textTransform: "none",
              mr: 5,
              maxHeight: 35,
              mt: 1,
            }}
            variant="contained"
            color="primary"
            component={Link}
            to={`/dashboard/user-update-user/${id}`}
          >
            Edit
          </Button> */}
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2} sx={{ mb: { xs: 2, md: 4 } }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography variant="subtitle1">Summary</Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>

              <Box sx={{ alignItems: "center", display: "flex" }}>
                <Tooltip title="Upload Image" arrow>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 0,
                      mr: 1,
                      bgcolor: "#9A9A9A", // Set background color to gray
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    src={image}
                  >
                    <PersonIcon
                      sx={{ width: "100%", height: "100%", color: "#FFFFFF" }}
                    />
                  </Avatar>
                </Tooltip>
                <Box sx={{ ml: 6 }}>
                  <Typography
                    variant="subtitle1"
                    // sx={{ color: "text.secondary" }}
                  >{`${list?.firstName} ${list.lastName}`}</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary" }}
                  >{`${list?.job} `}</Typography>

                  <Chip
                    size="small"
                    variant="outlined"
                    label={
                      list?.status === "active"
                        ? "Active"
                        : list?.status === "archived"
                        ? "Archived"
                        : "Inactive"
                    }
                    sx={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      backgroundColor:
                        list?.status === "active"
                          ? "#D3FDE4"
                          : list?.status === "archived"
                          ? "#FFF7CB"
                          : "#FFCBCB",
                      color:
                        list?.status === "active"
                          ? "#3F9748"
                          : list?.status === "archived"
                          ? "#D32F2F"
                          : "#red",
                      borderColor:
                        list?.status === "active"
                          ? "#D3FDE4"
                          : list?.status === "archived"
                          ? "#FFF7CB"
                          : "#FFCBCB", // Optional: to match border color with background
                      "& .MuiChip-label": {
                        // This targets the label inside the chip for more specific styling
                        color:
                          list?.status === "active"
                            ? "#3F9748"
                            : list?.status === "archived"
                            ? "#D36A2F"
                            : "#D32F2F",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4.5} lg={4.5} sx={{ alignItems: "left" }}>
              <CardContent sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  User Details
                </Typography>

                <Box sx={{ pt: 2, pb: 1 }}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set a fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Name
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${list?.firstName} ${list.lastName}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set the same fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Job Title
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {list?.job}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set the same fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Branch
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {list?.branch}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set the same fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Team
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {list?.team}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set the same fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Email
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {list?.email}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Grid>
            {/* <Grid item xs={12} md={1} lg={1} sx={{ alignItems: "left" }}>
              <Divider
                orientation="vertical" // Set the orientation to vertical
                sx={{ mt: (theme: any) => `${theme.spacing(1)} !important` }}
              />
            </Grid> */}
            <Grid item xs={12} md={5} lg={5}>
              <CardContent sx={{ p: 3, mt: 2, mb: 2, ml: 2 }}>
                <Box sx={{ pt: 5.4, pb: 1 }}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set the same fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Mobile
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {list?.mobile}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set the same fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Landline
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {list?.landline}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 80, // Set the same fixed minWidth for the label
                        mr: 2,

                        color: "text.secondary",
                      }}
                    >
                      Role
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {list?.role?.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mr: 2,

                        color: "text.secondary",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Disable Access to ContractnSign
                    </Typography>
                    <Switch
                      checked={isAccessDisabled}
                      onChange={(e: any) =>
                        setIsAccessDisabled(e.target.checked)
                      }
                      color={isAccessDisabled ? "success" : "primary"} // Change color to 'success' when enabled
                    />
                  </Box>
                  {/* <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 120, // Set a fixed minWidth for the label
                        mr: 2,

                        whiteSpace: "nowrap",
                        color: "text.secondary",
                      }}
                    >
                      Access Control
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {`Standard User`}
                    </Typography>
                  </Box> */}

                  {/* <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 120, // Set the same fixed width for the label
                        mr: 2,

                        color: "text.secondary",
                        whiteSpace: "nowrap",
                      }}
                    >
                      User Access:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {
                        "Executive dashboard, Branches, Contracts, Reports, Folders, Workflows, design user, design Signatory"
                      }
                    </Typography>
                  </Box> */}
                  {/* <Box sx={{ display: "flex", mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        minWidth: 120, // Set the same fixed width for the label
                        mr: 2,

                        color: "text.secondary",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Additional Access:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      -
                    </Typography>
                  </Box> */}
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Permissions & Role */}
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
                <LoginHistory />
              </Grid>

              {/* <Box sx={{ width: "100%", textAlign: "right" }}>
                {" "}
                <Button
                  sx={{ mt: 2, ml: 2, textTransform: "none" }}
                  variant="outlined"
                  onClick={() => console.log("Cancel")}
                >
                  export
                </Button>
              </Box> */}
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </>
  );
};

export default UserDetailSingleUser;
