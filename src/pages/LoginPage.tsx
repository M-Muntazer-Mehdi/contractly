/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import logo from "../assets/logo.jpg";
import loginBanner from "@/assets/login_banner.png"; // Adjust the path to your background image
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login, loginUser } from "@/service/api/apiMethods";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { log } from "console";
type FormInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginPage: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const { loginContext } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        email: data.email,
        password: data.password,
      };

      console.log(payload)

      const response = await login(payload);

      if (response.ok === true) {
        if (response?.user?.twoFactorAuth === true) {
          toast.success(response?.message);
          navigate("/emailverification");
          navigate("/emailvarfication", {
            state: { email: data.email, condition: "twoFactorAuth" },
          });
        } else {
          toast.success("Logged in successfully!");
          navigate("/dashboard");
          loginContext(response?.user);
        }
      } else {
        toast.error(response?.message || "Something went wrong!");
      }
    } catch (error: any) {
      if (error.response?.data.shouldNavigate === true) {
        alert("elsee");
        navigate("/forgotpassword");
      }
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong!";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          opacity: isLoading ? "30%" : "100%",
        }}
      >
        <Grid
          container
          sx={{ height: "100%", opacity: isLoading ? "60%" : "100%" }}
        >
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
                <Typography
                  variant="h5"
                  component="h1"
                  color={"#155BE5"}
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Welcome Back!
                </Typography>
                <Typography
                  variant="subtitle2"
                  component="h1"
                  sx={{ mb: 2, textAlign: "center" }}
                >
                  Sign in to continue
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

                  {/* Password Label and Input */}
                  <Typography variant="subtitle2" sx={{ mt: 0, mb: -1 }}>
                    Password
                  </Typography>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={
                      {
                        /* your validation rules for password */
                      }
                    }
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
                  <Grid sx={{ display: "flex" }}>
                    <Grid>
                      <FormControlLabel
                        control={
                          <Controller
                            name="rememberMe"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <Checkbox {...field} color="primary" />
                            )}
                          />
                        }
                        label={
                          <Typography
                            sx={{ fontSize: "15px", whiteSpace: "nowrap" }}
                          >
                            Remember me
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
                      <Grid item>
                        <Link
                          underline="none"
                          href="/forgotpassword"
                          variant="subtitle2"
                        >
                          Forgotten password?
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>

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
                    Sign in
                  </Button>

                  {/* Sign Up Link */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 4, mt: 3 }}
                  >
                    Don't have an account yet?{" "}
                    <Link
                      href="/signup"
                      underline="none"
                      sx={{
                        color: "#155BE5",
                        "&:hover": { textDecoration: "none" },
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
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
    </>
  );
};

export default LoginPage;
