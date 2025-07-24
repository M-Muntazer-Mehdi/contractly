import React, { useEffect, useState } from "react";
import { Typography, Divider, Button, Box } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import ChangePasswordVerification from "@/pages/dasboard/profile/ChangePasswordVerification";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { changepasReq, getUserId } from "@/service/api/apiMethods";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import Tooltip from "@mui/material/Tooltip";
const Account: React.FC = () => {
  const { user, setVerification, twoFA, setTwoFA } = useAuth();

  const [isModalOpenVerifi, setIsModalOpenVerifi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getUserId(user?._id);
      console.log(data?.user.twoFactorAuth);
      setTwoFA(data?.user?.twoFactorAuth);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?._id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleOpenModalchangePass = async () => {
    try {
      setIsLoading(true);
      const payload = {
        email: user?.email,
      };
      const response = await changepasReq(payload);
      console.log(response);
      if (response.ok === true) {
        setVerification(false);
        toast.success(response.message);
        setIsModalOpenVerifi(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModalVerifiPass = () => setIsModalOpenVerifi(false);

  const handleEnable2FA = async () => {
    try {
      setIsLoading(true);
      const payload = {
        email: user?.email,
        is2FA: true,
      };
      const response = await changepasReq(payload);
      console.log(response);
      if (response.ok === true) {
        toast.success(response.message);
        setVerification(true);
        setIsModalOpenVerifi(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {" "}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
            position: "absolute",
            margin: "auto",
            width: "70%",
          }}
        >
          <ProgressCircularCustomization />
        </Box>
      )}
      <Box sx={{ padding: 1.3, opacity: isLoading ? "30%" : "100%" }}>
        <Typography variant="subtitle1" gutterBottom>
          Organisation
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: "text.secondary" }}
        >
          Company Name
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle1" component="div">
              Password
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Change the password for your account
            </Typography>
          </Box>
          <Tooltip
            title={
              user?.role?.permissions?.reset_password
                ? ""
                : "You have no permission"
            }
            arrow
          >
            <span>
              <Button
                disabled={!user?.role?.permissions?.reset_password}
                sx={{ color: "primary.main", textTransform: "none" }}
                endIcon={<ArrowForward />}
                //   onClick={handleOpenModalResetPass}
                onClick={handleOpenModalchangePass}
              >
                Change password
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle1" component="div">
              Two-Factor Authentication
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Requires an authentication code when you log in with an email and
              password
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {" "}
            <Tooltip
              title={
                user?.role?.permissions?.enable_2fa
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <span>
                <Button
                  disabled={!user?.role?.permissions?.enable_2fa}
                  sx={{ color: "primary.main", textTransform: "none", mr: 2 }}
                  endIcon={<ArrowForward />}
                >
                  {twoFA === true ? " Enabled" : "Disabled"}
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                user?.role?.permissions?.enable_2fa
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <span>
                <Button
                  disabled={!user?.role?.permissions?.enable_2fa}
                  sx={{ textTransform: "none" }}
                  onClick={handleEnable2FA}
                  variant="contained"
                  color="primary"
                >
                  {twoFA === true ? "Disable" : "Enable"}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <ChangePasswordVerification
          listData={listData}
          open={isModalOpenVerifi}
          onClose={handleCloseModalVerifiPass}
        />
      </Box>
    </>
  );
};

export default Account;
