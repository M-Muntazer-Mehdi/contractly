/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { ChangeUserPassword } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { create, updatecustomFields } from "@/service/api/customFeild";

interface CreateFieldProps {
  open: boolean;
  onClose: () => void;
  listData: () => void;
  itemName: any;
  setItemName: any;
}

interface IFormInput {
  name: string;
  type: string;
}

const CreateField: React.FC<CreateFieldProps> = ({
  open,
  onClose,
  itemName,
  listData,
  setItemName,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  console.log(itemName, "itemName");

  useEffect(() => {
    setValue("name", itemName?.name);
    setValue("type", itemName?.type);
  }, [itemName]);

  const onSubmit: any = async (data: any) => {
    try {
      setIsLoading(true);
      const payload = {
        id: user?._id,
        name: data.name,
        uploaded_by: user?.firstName,
        type: data.type,
      };
      let response;
      if (itemName?.id) {
        response = await updatecustomFields(itemName?.id, payload);
      } else {
        response = await create(payload);
      }
      console.log(response.message);
      if (response.ok === true) {
        toast.success(response.message);
        onClose();
        listData();
        setItemName({ id: "", name: "" });
      } else {
        const errorMessage = response.message || "An error occurred";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Failed to create clause.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data ||
          "An error occurred";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Field Name
            </Typography>
            <Controller
              name="name"
              control={control}
              rules={{ required: "field Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Add field name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "16px", color: "#9A9A9A" }}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              defaultValue=""
              rules={{ required: " Type is required" }}
              render={({ field }) => (
                <Select
                  size="small"
                  {...field}
                  placeholder="type"
                  displayEmpty
                  renderValue={(selectedValue: any) =>
                    selectedValue === "" ? (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "15.5px",
                        }}
                      >
                        Select condition
                      </em>
                    ) : (
                      selectedValue
                    )
                  }
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="number">number</MenuItem>
                  <MenuItem value="text">text</MenuItem>
                </Select>
              )}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{ textTransform: "none" }}
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
              </Box>
            </Box>
          </FormGroup>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateField;
