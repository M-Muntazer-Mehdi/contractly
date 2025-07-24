/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Divider,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import logo from "@/assets/contract-logo.png"; // Ensure this path is correct
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CreateCompony } from "@/service/api/apiMethods";
import { getcompaniesById, updatecompanies } from "@/service/api/compony";
import moment from "moment-timezone";
import { useAuth } from "@/hooks/useAuth";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";

type FormInputs = {
  companyName: string;
  companySize: string;
  country: string;
  timeZone: string;
  email: string;
  phoneNumber: string;
  industry: string;
  websiteUrl: string;
  image: string;
  billing_email: string;
};

const UpdateCompony = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [timeZoneList, setTimeZoneList] = useState<Array<any>>([]);
  const [image, setImage] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<any>("");

  const getTimeZoneList = () => {
    const timeZones = moment.tz.names();
    setTimeZoneList(timeZones);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getcompaniesById(user?._id);
      console.log(data);
      setValue("companyName", data?.companyName);
      setValue("companySize", data?.companySize);
      setValue("country", data?.country);
      setValue("timeZone", data?.timeZone);
      setValue("email", data?.email);
      setValue("country", data?.country);
      setValue("phoneNumber", data?.phoneNumber);
      setValue("industry", data?.industry);
      setValue("websiteUrl", data?.websiteUrl);
      setValue("billing_email", data?.billing_email);
      setImage(data?.image);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    getTimeZoneList();
    if (user?._id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);
  const onSubmit = async (data: FormInputs) => {
    try {
      if (imageBase64) {
        data.image = imageBase64;
      }
      const response = await updatecompanies(user?._id, data);
      console.log(response.message);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard");
      } else {
        const errorMessage = response.data || response.message;
        toast.error(errorMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);

      let errorMessage = "failed";
      if (error.response) {
        errorMessage = error.response.data || error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);

      // Handle error
      console.error(errorMessage);
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
    <Container maxWidth="xl" sx={{ padding: 1 }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={2} sx={{ mb: { xs: 2, md: 4 }, mt: -1 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography variant="subtitle1">Company Details</Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>

              <Box sx={{ alignItems: "center", display: "flex" }}>
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

                <Box sx={{ ml: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "text.secondary", fontWeight: "600" }}
                  >{`Contracting`}</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#92929D" }}
                  >{`Administrator `}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              {/* Company Name Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Company Name
                </Typography>
                <Controller
                  name="companyName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Company Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      placeholder="Enter your company name"
                      error={Boolean(errors.companyName)}
                      helperText={
                        errors.companyName ? errors.companyName.message : ""
                      }
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Company Size Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Company Size
                </Typography>
                <Controller
                  name="companySize"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Company Size is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      placeholder="Enter your company size"
                      error={Boolean(errors.companySize)}
                      helperText={
                        errors.companySize ? errors.companySize.message : ""
                      }
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Country Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Country
                </Typography>
                <Controller
                  name="country"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      placeholder="Enter your country"
                      error={Boolean(errors.country)}
                      helperText={errors.country ? errors.country.message : ""}
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Time Zone Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -1,
                  }}
                >
                  Time Zone
                </Typography>
                <Controller
                  name="timeZone"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Time Zone is required" }}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      error={Boolean(errors.timeZone)}
                      fullWidth
                    >
                      <Select
                        {...field}
                        labelId="timeZone-select"
                        displayEmpty
                        renderValue={(value) => {
                          if (value === "") {
                            return (
                              <em style={{ color: "#9A9A9A" }}>
                                Select Time Zone
                              </em>
                            );
                          }
                          return value;
                        }}
                      >
                        {timeZoneList?.map((timeZone: any) => (
                          <MenuItem key={timeZone} value={timeZone}>
                            {timeZone}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {errors.timeZone ? errors.timeZone.message : ""}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Email
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      type="email"
                      autoComplete="email"
                      placeholder="Enter email"
                      error={Boolean(errors.email)}
                      helperText={errors.email ? errors.email.message : ""}
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Phone Number Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Phone Number
                </Typography>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Phone Number is required",
                    pattern: {
                      value: /^[+]*(?:\(\d{1,4}\))?[-\s./0-9]*$/,
                      message: "Invalid phone number",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                    maxLength: {
                      value: 15,
                      message:
                        "Phone number must not be greater than 15 digits",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      type="tel"
                      placeholder="Enter phone number"
                      error={Boolean(errors.phoneNumber)}
                      helperText={
                        errors.phoneNumber ? errors.phoneNumber.message : ""
                      }
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Industry Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Industry
                </Typography>
                <Controller
                  name="industry"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Industry is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      placeholder="Enter your industry"
                      error={Boolean(errors.industry)}
                      helperText={
                        errors.industry ? errors.industry.message : ""
                      }
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Website URL Field */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Website URL
                </Typography>
                <Controller
                  name="websiteUrl"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Website URL is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      placeholder="Enter your website URL"
                      error={Boolean(errors.websiteUrl)}
                      helperText={
                        errors.websiteUrl ? errors.websiteUrl.message : ""
                      }
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: -2,
                    mb: -1,
                  }}
                >
                  Email
                </Typography>
                <Controller
                  name="billing_email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Billing email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      type="email"
                      autoComplete="email"
                      placeholder="Enter billing email"
                      error={Boolean(errors.email)}
                      helperText={errors.email ? errors.email.message : ""}
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex", // Enable Flexbox for this container
                    justifyContent: "center", // Center content horizontally
                    mt: 2.8, // Top margin
                  }}
                >
                  <div>
                    <Button
                      variant="outlined"
                      sx={{ textTransform: "none" }}
                      component={Link}
                      to="/dashboard"
                    >
                      Cancel
                    </Button>

                    <Button
                      sx={{ ml: 2, textTransform: "none" }}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateCompony;
