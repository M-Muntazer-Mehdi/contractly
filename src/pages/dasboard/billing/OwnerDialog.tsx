/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  Typography,
  Button,
  Divider,
  Autocomplete,
  TextField,
  FormControl,
  FormHelperText,
  Checkbox,
} from "@mui/material";
import { createTeam, getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { CheckBox } from "@mui/icons-material";
import { FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";

type FormValues = {
  name: string;
  checkboxName: any;
};
const OwnerDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);
      console.log({ data });

      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        user: data.name,
      };
      console.log(payload);
      return;
      const response = await createTeam(payload);
      if (response.ok === true) {
        toast.success(response.message);
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
    <Dialog open={isOpen} onClose={onClose} maxWidth="md">
      <DialogTitle>Change billing owner</DialogTitle>
      <Divider />
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
        <Typography variant="body1" sx={{ mb: 3 }}>
          The billing owner and admin have the authority to oversee billing
          information and invoices. All communications pertaining to billing
          matters are exclusively directed to the billing owner.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Mandatory field is required" }}
            render={({ field, fieldState: { error } }: any) => (
              <FormControl fullWidth size="small" error={!!error}>
                <Autocomplete
                  {...field}
                  freeSolo
                  options={userList.map(
                    (user) => `${user.firstName} ${user.lastName}`
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select user or enter email"
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                  onInputChange={(event, value) => {
                    // Update the form state
                    field.onChange(value);
                  }}
                  onChange={(event, value) => {
                    // Handle selection from the dropdown
                    if (typeof value === "string") {
                      field.onChange(value);
                    } else {
                      const selectedUser = userList.find(
                        (user) => `${user.firstName} ${user.lastName}` === value
                      );
                      if (selectedUser) {
                        field.onChange(
                          `${selectedUser.firstName} ${selectedUser.lastName}`
                        );
                      }
                    }
                  }}
                />
              </FormControl>
            )}
          />
          <Controller
            name="checkboxName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} color="primary" />}
                label="By designating someone else as the billing owner, I acknowledge that the current billing owner will cease to receive emails related to billing for my organization."
                style={{
                  alignItems: "center",
                  marginTop: "10px",
                }}
              />
            )}
          />
          {errors.checkboxName && (
            <FormHelperText error>
              {errors.checkboxName.message as string}
            </FormHelperText>
          )}

          <Divider />

          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button
              sx={{ textTransform: "none" }}
              onClick={onClose}
              variant="outlined"
              color="secondary"
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ textTransform: "none" }}
            >
              Change billing owner
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerDialog;
