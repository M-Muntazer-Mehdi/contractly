/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
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
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signU } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
type FormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      const payload = {
        email: data.email,
        password: data.confirmPassword,
        role: "65a7d392b1df3e0517bb7055",
        emailVerified: true,
      };

      const response = await signU(payload);
      console.log(response);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/emailverification");
        navigate("/emailvarfication", {
          state: { email: data.email, id: response?.admin?._id },
        });
      } else {
        const errorMessage = response.data || response.message;
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Login failed";
      if (error.response) {
        errorMessage = error.response.data || error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);

      // Handle error
      console.error(errorMessage);
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
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            position: "absolute",
            margin: "auto",
            width: "100%",
          }}
        >
          <ProgressCircularCustomization />
        </Box>
      )}
      <Container
        maxWidth="xl"
        sx={{
          height: "100vh",
          padding: 1,
          opacity: isLoading ? "60%" : "100%",
        }}
      >
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
            <div></div>
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 4, fontSize: "16px" }}
                >
                  Sign up for a{" "}
                  <Link
                    // href="/signup"
                    underline="none"
                    sx={{
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "#155BE5",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "none",
                      },
                    }}
                  >
                    free 14 days trial
                  </Link>
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  {/* Email Label and Input */}
                  <Typography variant="subtitle2" sx={{ mt: 0, mb: -1 }}>
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
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,

                        message:
                          "Ensure your password includes at least one uppercase letter, one lowercase letter, one number, and one special character",
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
                    disabled={isLoading}
                    variant="contained"
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
                    Sign up
                  </Button>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{}}
                  >
                    Already have an account?
                    <Link
                      underline="none"
                      href="/"
                      sx={{
                        ml: 0.5,
                        color: "#155BE5",
                        "&:hover": { textDecoration: "none" },
                      }}
                    >
                      Login
                    </Link>
                  </Typography>
                </Box>
              </Paper>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 4, mt: 3, width: "50" }}
              >
                By signing up, you agree to ContractnSign’s
                <br />
                <Link
                  underline="none"
                  sx={{
                    m: 0.5,
                    color: "#155BE5",
                    "&:hover": { textDecoration: "none" },
                  }}
                >
                  Terms of Service
                </Link>
                and
                <Link
                  underline="none"
                  // href="/signup"
                  sx={{
                    m: 0.5,
                    color: "#155BE5",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Privacy Policy.
                </Link>
              </Typography>
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
    </>
  );
};

export default SignupPage;
