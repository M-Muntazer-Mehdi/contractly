/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { getUserListNameID } from "@/service/api/apiMethods";
import {
  create,
  getapprovalsById,
  updateapprovals,
} from "@/service/api/approval";

type FormValues = {
  name: string;
  description: string;
  approver: string;
};

const UpdateApproval = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [approver, setApprover] = useState<Array<any>>([]);
  const [userList, setUserList] = useState<Array<any>>([]);

  const listUserData = async () => {
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
    listUserData();
  }, []);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getapprovalsById(id);

      setValue("name", data.name);
      setValue("description", data.description);
      setApprover(data?.approver);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      listData();
      listUserData();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const handleCharCount = (event: any) => {
    setCharCount(event.target.value.length);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        id: user._id,
        name: data.name,
        approver: approver,
        description: data?.description,
        type: "Compony Approval",
      };

      const response = await updateapprovals(id, payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/approval-list");
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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
            height: "70vh",
            position: "absolute",
            margin: "auto",
            width: "70%",
          }}
        >
          <ProgressCircularCustomization />
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            opacity: isLoading ? "30%" : "100%",
            pl: 3,
            p: 2,
            pr: 3,
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <Box
              sx={{
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Update Approval
              </Typography>

              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ mt: -2, mb: 2, fontSize: "14px" }}
              >
                <Link
                  style={{ marginRight: "-7px" }}
                  to="/dashboard/approval-list"
                  className="link-no-underline"
                >
                  Home
                </Link>
                <Typography
                  style={{ marginRight: "-7px", fontSize: "14px" }}
                  color="text.primary"
                >
                  Update Approval
                </Typography>
              </Breadcrumbs>
            </Box>
          </div>

          <div>
            <Button
              variant="outlined"
              onClick={handleBack}
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
          </div>
        </Box>
        <Paper sx={{ padding: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Typography variant="subtitle2">Approval Name*</Typography>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Mandatory field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Add approval"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "16px", color: "#9A9A9A" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography variant="subtitle2">Description</Typography>
              <Controller
                name="description"
                control={control}
                // rules={{ required: "Tag Name is required", maxLength: 50 }}
                render={({ field }) => (
                  <>
                    <TextareaAutosize
                      {...field}
                      placeholder="50 characters"
                      minRows={4}
                      maxLength={50}
                      onChange={(event) => {
                        field.onChange(event); // react-hook-form Controller handle onChange
                        handleCharCount(event); // Handle character count
                      }}
                      style={{
                        width: "100%",
                        fontSize: "16px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    />
                    <p style={{ fontSize: "14px", marginTop: "5px" }}>
                      {charCount}/50 characters
                    </p>
                  </>
                )}
              />
            </Grid>
            <Grid item xs={7}>
              <Typography variant="subtitle2">Approver Name</Typography>
              <Controller
                name="approver"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormControl fullWidth size="small">
                    <Select
                      multiple
                      {...field}
                      labelId="status-label"
                      displayEmpty
                      value={approver || []} // Ensure the value is an array
                      onChange={(e: any) => {
                        setApprover(e.target.value); // Update your local state
                        onChange(e.target.value); // Inform React Hook Form of the change
                      }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return (
                            <em
                              style={{
                                color: "#C2C2C2",
                                fontStyle: "normal",
                                fontSize: "15.5px",
                              }}
                            >
                              Select approver name
                            </em>
                          );
                        }
                        // Map selected IDs to names
                        const selectedNames = selected.map((selectedId) => {
                          const user = userList.find(
                            (user) => user._id === selectedId
                          );
                          return user
                            ? `${user.firstName} ${user.lastName}`
                            : "";
                        });
                        return selectedNames.join(", "); // This will show the selected approver' names separated by commas
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 224, // You can adjust this for controlling the menu height
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choose approver
                      </MenuItem>{" "}
                      {userList?.map((user: any) => (
                        <MenuItem key={user?._id} value={user?._id}>
                          {user?.firstName} {user?.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default UpdateApproval;
