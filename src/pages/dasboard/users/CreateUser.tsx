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
  FormControlLabel,
  Checkbox,
  CardHeader,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import {
  createUser,
  getBranchList,
  getTeamsList,
} from "@/service/api/apiMethods";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/send.png";
import userLogo from "@/assets/user.png";
import permission from "@/assets/permission.png";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import RoleTable from "@/pages/dasboard/users/RoleTable";
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
  inviteCheack: boolean;
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

const CreateUser = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const [status, setStatus] = useState<any>("");
  const [tabValue, setTabValue] = useState(0);
  const [image, setImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [branchData, setBranchData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleId, setRoleId] = useState("");
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
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

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: any) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (!validateEmail(emailValue)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };
  const handleValidation = () => {
    // Validation check for empty last name
    if (!firstName.trim()) {
      toast.error("Mandatory fields are required");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Mandatory fields are required");
      return;
    }
    if (!email.trim()) {
      toast.error("Mandatory fields are required");
      return;
    }
    if (!job.trim()) {
      toast.error("Mandatory fields are required");
      return;
    }

    // Assuming emailError is a boolean flag indicating email validation issues
    if (!firstName || !email || emailError) {
      toast.error("Please fill the required fields");
      return;
    } else {
      setTabValue(1);
    }
  };
  console.log("idddddrole", roleId);

  const onSubmit = async (data: FormValues) => {
    try {
      if (!roleId.trim()) {
        toast.error("Please select role");
        return;
      }
      setIsLoading(true);

      const payload: any = {
        id: user._id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        job: job,
        landline: data.landline,
        mobile: data.mobile,
        status: data.status,
        role: roleId,
        emailVerified: false,
        disabled: false,
        team: data.team ? data.team : null,
        branch: data.branch ? data.branch : null,
        createdByName: user?.firstName,
      };
      if (imageBase64) {
        payload.image = imageBase64;
      }
      const response = await createUser(payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/user-list");
      } else {
        const errorMessage = response.message || response.data;
        toast.error(errorMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardHeader title=" Create User" sx={{}} />
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "14px" }}
      >
        <Link
          style={{ marginRight: "-7px" }}
          to="/dashboard/user-list"
          className="link-no-underline"
        >
          Home
        </Link>
        <Typography sx={{ fontSize: "14px", ml: "-7px" }} color="text.primary">
          Create User
        </Typography>
      </Breadcrumbs>
      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", color: "gray" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="User" sx={{ fontWeight: "bold" }} />
            <Tab label="Roles & Permissions" sx={{ fontWeight: "bold" }} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <img
                  src={userLogo}
                  alt="send"
                  style={{ marginRight: 8, height: "20px" }}
                />
                <Typography variant="subtitle2">User Details</Typography>

                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>
              <Box sx={{ alignItems: "center" }}>
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

                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="contained-button-file"
                  style={{ marginLeft: "4rem" }}
                >
                  <Tooltip title="Upload Image" arrow>
                    <PhotoCameraIcon sx={{ color: "#9A9A9A" }} />
                  </Tooltip>
                </label>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">First Name*</Typography>

              <TextField
                placeholder="Add first name"
                fullWidth
                onChange={(e: any) => {
                  setFirstName(e.target.value);
                }}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Last Name*</Typography>
              <TextField
                placeholder="Add last name"
                fullWidth
                onChange={(e: any) => {
                  setLastName(e.target.value);
                }}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                size="small"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Email*</Typography>
              <TextField
                placeholder="Add email address"
                fullWidth
                error={!!emailError}
                onChange={handleEmailChange}
                helperText={emailError}
                size="small"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Job Title*</Typography>
              <TextField
                placeholder="Add job title"
                fullWidth
                onChange={(e: any) => {
                  setJob(e.target.value);
                }}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                size="small"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Team</Typography>

              <FormControl fullWidth size="small">
                <Controller
                  name="team"
                  control={control}
                  defaultValue=""
                  rules={{ required: " Team is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="team-label"
                      placeholder="Team"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em
                              style={{
                                color: "#C2C2C2",
                                fontStyle: "normal",
                                fontSize: "15.5px",
                              }}
                            >
                              Select team
                            </em> // Placeholder text with custom color
                          );
                        }

                        // Find the team with the matching ID in teamData and return its name
                        const selectedTeam = teamData.find(
                          (team) => team._id === value
                        );
                        return selectedTeam ? selectedTeam.name : "";
                      }}
                    >
                      {teamData?.map((team: any) => (
                        <MenuItem key={team._id} value={team._id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Branch</Typography>
              <FormControl fullWidth size="small">
                <Controller
                  name="branch"
                  control={control}
                  defaultValue=""
                  rules={{ required: " Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="branch-label"
                      placeholder="Branch"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em
                              style={{
                                color: "#C2C2C2",
                                fontStyle: "normal",
                                fontSize: "15.5px",
                              }}
                            >
                              Select branch
                            </em>
                          );
                        }
                        const selectedBranch = branchData.find(
                          (branch) => branch._id === value
                        );
                        return selectedBranch ? selectedBranch.branchName : "";
                      }}
                    >
                      {/* Display Main Entity dynamically based on the provided ID */}
                      <MenuItem value={"65ae573e0d864a2902d16e73"}>
                        {branchData.find(
                          (branch) => branch._id === "65ae573e0d864a2902d16e73"
                        )?.branchName || "Main Entity"}
                      </MenuItem>
                      <Divider />
                      {branchData?.map((branch: any) => (
                        <MenuItem key={branch?._id} value={branch?._id}>
                          {branch?.branchName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Mobile</Typography>
              <Controller
                name="mobile"
                control={control}
                defaultValue=""
                rules={{
                  // required: "Phone number is required",
                  pattern: {
                    value: /^\+?[0-9]+$/,
                    message: "Invalid phone number",
                  },
                }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      placeholder="Add mobile number"
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={Boolean(errors.mobile)}
                      helperText={errors.mobile?.message}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Landline</Typography>
              <Controller
                name="landline"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Add landline number"
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Box sx={{ width: "100%", textAlign: "right" }}>
              {" "}
              {/* Container with full width */}
              <Button
                sx={{ mt: 2, ml: 2, textTransform: "none" }}
                variant="contained"
                color="primary"
                onClick={handleValidation}
              >
                Next
              </Button>
            </Box>
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
              <Grid sx={{ mb: 1 }}>
                <RoleTable setRoleId={setRoleId} roleId={roleId} />
              </Grid>

              {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <img
                  src={logo}
                  alt="send"
                  style={{ marginRight: 8, height: "20px" }}
                />
                <Typography variant="subtitle2">Send Invitation</Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box> */}

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email*</Typography>
                  <TextField
                    placeholder="Email"
                    fullWidth
                    value={email}
                    error={!!emailError}
                    onChange={handleEmailChange}
                    helperText={emailError}
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{ ml: 2, textTransform: "none" }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                  >
                    Create User
                  </Button>
                </Grid>
              </Grid>

              <Grid>
                <FormControlLabel
                  control={
                    <Controller
                      name="inviteCheack"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox {...field} color="primary" />
                      )}
                    />
                  }
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Send an invitation to the email above to complete the
                      login process.
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </form>
  );
};

export default CreateUser;
