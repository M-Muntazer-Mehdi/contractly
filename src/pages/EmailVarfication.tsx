/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../assets/logo.jpg";
import logoVerification from "../assets/email_verification.png";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyForgotPass, verifyOtp } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";

const SignupPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  const id = location.state?.id;
  const condition = location.state?.condition;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { loginContext } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  console.log(id, "id");
  const onSubmit = async () => {
    // Assuming OTP is of length 5
    if (otp.length === 5) {
      try {
        setIsLoading(true);
        let payload;

        if (condition === "twoFactorAuth") {
          console.log(condition, "cond");
          payload = {
            email: email,
            otp: otp,
            twoFactorloginAuth: true,
          };
        } else {
          payload = {
            email: email,
            otp: otp,
          };
        }
        const response = await verifyOtp(payload);

        if (response.ok === true) {
          toast.success(response.message);
          if (condition === "twoFactorAuth") {
            navigate("/dashboard");
            loginContext(response.user);
          } else if (condition === "true") {
            navigate("/resetpassword", {
              state: { email: email },
            });
          } else {
            navigate("/componydetails");
            navigate("/componydetails", {
              state: { id: id },
            });
          }
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        // If the error is from an HTTP response, it should have a `response` property
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred during verification.";
        toast.error(errorMessage);
        console.error("Verification error:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please enter 5 digit verification code");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", padding: 1 }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left side - Form */}
        <Grid
          item
          xs={12}
          md={12}
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

          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              m: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography
                variant="h5"
                component="h1"
                color={"#155BE5"}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Email Verification
              </Typography>
              <Typography
                variant="subtitle2"
                component="h1"
                sx={{ mb: 4, textAlign: "center" }}
              >
                We've sent a code to {email}
              </Typography>
              <img
                src={logoVerification}
                alt="logoVerification"
                style={{
                  maxWidth: isMobile ? "100px" : "150px",
                  marginTop: "16px",
                  display: "block", // Add this line
                  margin: "auto", // Add this line
                }}
              />
              <Box
                sx={{ mt: 2 }}
                component="form"
                onSubmit={(e: any) => {
                  e.preventDefault();
                  onSubmit(); // Call the onSubmit function when the form is submitted
                }}
                noValidate
              >
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={5}
                  inputStyle={{
                    width: "3rem", // Adjust width as needed
                    height: "3rem", // Adjust height as needed
                    margin: "0.5rem",
                    fontSize: "2rem", // Adjust font size as needed
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.3)",
                  }}
                  renderInput={(props, i) => (
                    <div key={i} style={{ display: "inline-block" }}>
                      <input {...props} />
                    </div>
                  )}
                />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 1, mt: 2 }}
                >
                  Didn’t get the code?{" "}
                  <Link
                    href="/signup"
                    sx={{
                      mt: 2,
                      mb: 2,
                      color: "##9A9A9A",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Request again
                  </Link>
                </Typography>
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
      </Grid>
    </Container>
  );
};

export default SignupPage;
