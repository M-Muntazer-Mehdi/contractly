/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import logo from "../assets/logo.jpg"; // Ensure this path is correct
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CreateCompony } from "@/service/api/apiMethods";
import moment from "moment-timezone";
type FormInputs = {
  companyName: string;
  companySize: string;
  country: string;
  timeZone: string;
  email: string;
  phoneNumber: string;
  industry: string;
  websiteUrl: string;
  id: string;
};

const CompanyDetails: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const [timeZoneList, setTimeZoneList] = useState<Array<any>>([]);

  const getTimeZoneList = () => {
    const timeZones = moment.tz.names();
    setTimeZoneList(timeZones);
  };
  React.useEffect(() => {
    getTimeZoneList();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(id, "idddddd");

  const onSubmit = async (data: FormInputs) => {
    try {
      data.id = id;
      const response = await CreateCompony(data);
      console.log(response.message);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/");
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

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", padding: 1 }}>
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
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "320px", marginTop: "16px" }}
          />
          <Box sx={{ width: "100%", maxWidth: 800, m: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography
                variant="h5"
                component="h1"
                color={"#155BE5"}
                sx={{ fontWeight: "bold", textAlign: "left" }}
              >
                Company Details
              </Typography>
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{ mb: 4, textAlign: "left" }}
              >
                Please fill all the details to proceed
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
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
                          helperText={
                            errors.country ? errors.country.message : ""
                          }
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
                            renderValue={(value: any) => {
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
                </Grid>

                <Box
                  sx={{
                    display: "flex", // Enable Flexbox for this container
                    justifyContent: "center", // Center content horizontally
                    mt: 2, // Top margin
                    mb: 2, // Bottom margin
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontSize: "16px",
                      backgroundColor: "#155BE5",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#134DAB", // Slightly darker shade for hover effect, change as needed
                      },
                    }}
                    size="small"
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyDetails;
