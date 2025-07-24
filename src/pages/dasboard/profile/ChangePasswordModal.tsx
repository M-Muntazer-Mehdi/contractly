/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormGroup,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { ChangeUserPassword } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const newPassword = watch("newPassword");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: any = async (data: any) => {
    try {
      setIsLoading(true);
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.confirmPassword,
      };
      console.log(payload, "payload");

      const response = await ChangeUserPassword(user?._id, payload);
      console.log(response.message);
      if (response.ok === true) {
        toast.success(response.message);
        onClose();
        navigate("/");
        logout();
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="change-password-modal"
      aria-describedby="change-password-form"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          padding: 3,
          borderRadius: 1,
          boxShadow: 24,
          outline: "none",
          maxWidth: 500,
          width: "100%",
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Typography variant="subtitle2" sx={{ mb: -1 }}>
              Current Password
            </Typography>
            <Controller
              name="currentPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter Current password"
                  //   type="password"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={Boolean(errors.currentPassword)}
                  helperText={
                    errors.currentPassword ? errors.currentPassword.message : ""
                  }
                />
              )}
            />
            <Typography variant="subtitle2" sx={{ mb: -1 }}>
              New password
            </Typography>
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Create a password that consists of a minimum of 8 characters, including a mix of upper and lower case letters, at least one special character, and one number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter new password"
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={Boolean(errors.newPassword)}
                  helperText={
                    errors.newPassword ? errors.newPassword.message : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Typography variant="subtitle2" sx={{ mb: -1 }}>
              Confirm New Password
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "The passwords do not match",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword ? errors.confirmPassword.message : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                textTransform: "none",
              }}
            >
              Update Password
            </Button>
          </FormGroup>
        </form>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
