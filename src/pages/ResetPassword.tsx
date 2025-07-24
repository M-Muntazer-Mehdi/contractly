import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import logo from "../assets/logo.jpg"; // Adjust the path to your logo image
import loginBanner from "@/assets/login_banner.png"; // Adjust the path to your background image
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CreateUserPaasword, resetPaasword } from "@/service/api/apiMethods";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
type FormInputs = {
  password: string;
  confirmPassword: string;
};

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email;
  const { token } = useParams();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormInputs>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setIsLoading(true);
      if (token) {
        const payload = {
          password: data.confirmPassword, // Assuming you want to send confirmPassword here
        };
        const response = await CreateUserPaasword(token, payload);

        if (response.ok === true) {
          toast.success("Update successful!");
          navigate("/");
          navigate("/", {
            state: { user: true },
          });
        } else {
          console.log(response, "rrsp");
          const errorMessage = response.data || response.message;
          toast.error(errorMessage);
        }
      } else {
        console.log("else");
        const payload = {
          email: email, // Assuming email is defined somewhere
          newPassword: data.confirmPassword, // Assuming you want to send confirmPassword here
        };
        const response = await resetPaasword(payload);
        if (response.ok === true) {
          toast.success("Update successful!");
          navigate("/");
        } else {
          console.log(response, "rrsp");
          const errorMessage = response.data || response.message;
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.log(error, "ersasar");

      const errorMessage = "Failed";
      toast.error(errorMessage);

      // Handle error
      console.error(errorMessage, error);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }, [password, confirmPassword, setError, clearErrors]);

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", padding: 1 }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left side - Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...(isMobile && { paddingBottom: 2 }),
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: isMobile ? "150px" : "320px",
              marginTop: "16px",
            }}
          />

          <Box sx={{ width: "100%", maxWidth: 400, m: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              {token ? (
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  Create your password to use from next login
                </Typography>
              ) : (
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  Reset passwohhrd!
                </Typography>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Typography variant="subtitle2" sx={{ mt: 0, mb: -1 }}>
                  Password
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 10,
                      message: "Password must have at least 8 characters",
                    },
                    pattern: {
                      // This is a simple regex for at least one uppercase, one lowercase, one number, and one special character
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must be at least 8  characters long  include 1 number, and special characters , 1 uppercase letter and 1 lower caseletter",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type={showPassword ? "text" : "password"}
                      margin="normal"
                      fullWidth
                      autoComplete="current-password"
                      placeholder="Enter password"
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password ? errors.password.message : ""
                      }
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                {/* Confirm Password Field */}
                <Typography variant="subtitle2" sx={{ mt: 0, mb: -1 }}>
                  Confirm Password
                </Typography>
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      margin="normal"
                      fullWidth
                      placeholder="Confirm password"
                      error={Boolean(errors.confirmPassword)}
                      helperText={
                        errors.confirmPassword
                          ? errors.confirmPassword.message
                          : ""
                      }
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={toggleConfirmPasswordVisibility}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
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
            </Paper>
          </Box>
        </Grid>

        {/* Right side - Image */}
        <Grid
          item
          xs={12}
          md={6}
          style={{
            backgroundImage: `url(${loginBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: isMobile ? "none" : "block",
          }}
        >
          {/* Any content you want on the image side */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResetPassword;
