/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
  FormHelperText,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import {
  getTeamByid,
  getUserListNameID,
  updateTeam,
} from "@/service/api/apiMethods";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
type FormValues = {
  name: string;
  manager: string;
  status: string;
  members: [];
};

const UpdateTeam = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMamber] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<undefined>(undefined);
  const [userList, setUserList] = useState<Array<any>>([]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getTeamByid(id);
      console.log(data);

      setList(data);
      setValue("name", data?.name);
      setValue("manager", data.manager);
      setValue("status", data?.status);
      setMamber(data?.members);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const UserlistData = async () => {
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

  React.useEffect(() => {
    UserlistData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const payload = {
        name: data.name,
        manager: data.manager, // Convert the string to an object
        status: data.status,
        members: member,
      };

      const response = await updateTeam(id, payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/teamlist");
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
    {
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
              <Typography
                variant="h5"
                sx={{ textAlign: "left", marginBottom: 2 }}
              >
                Update Team
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ mt: -2, mb: 2, fontSize: "14px" }}
              >
                <Link
                  style={{ marginRight: "-7px" }}
                  to="/dashboard/teamlist"
                  className="link-no-underline"
                >
                  Home
                </Link>
                <Typography
                  sx={{ fontSize: "14px", ml: "-7px" }}
                  color="text.primary"
                >
                  Update Team
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
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Team Name*</Typography>

              <Controller
                name="name"
                control={control}
                rules={{ required: "Branch Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Add Name"
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

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Admin Name*</Typography>
              <Controller
                name="manager"
                control={control}
                rules={{ required: "Mandatory field is required" }}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.manager}>
                    <Select
                      {...field}
                      labelId="manager-label"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em
                              style={{
                                color: "#C2C2C2",
                                fontStyle: "normal",
                                fontSize: "15.5px",
                              }}
                            >
                              Select user
                            </em>
                          );
                        }
                        const selectedManager = userList.find(
                          (user) => user._id === value
                        );
                        return selectedManager
                          ? `${selectedManager.firstName} ${selectedManager.lastName}`
                          : "";
                      }}
                    >
                      {userList?.map((user) => (
                        <MenuItem key={user?._id} value={user?._id}>
                          {user?.firstName} {user?.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.manager ? errors.manager.message : ""}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Status</Typography>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    {/* Optional: add this line if you want a label */}
                    <Select
                      {...field} // Spread the field props
                      labelId="status-label"
                      displayEmpty
                      renderValue={(value) => {
                        if (value === "") {
                          return (
                            <em
                              style={{
                                color: "#C2C2C2",
                                fontStyle: "normal",
                                fontSize: "15.5px",
                              }}
                            >
                              {" "}
                              Choose a status
                            </em> // Placeholder text with custom color
                          );
                        }
                        return field.value;
                      }}
                    >
                      {/* Placeholder */}
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Team Members</Typography>
              <Controller
                name="members"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormControl fullWidth size="small">
                    <Select
                      multiple
                      {...field}
                      labelId="status-label"
                      displayEmpty
                      value={member || []} // Ensure the value is an array
                      onChange={(e: any) => {
                        setMamber(e.target.value); // Update your local state
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
                              Select members
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
                        return selectedNames.join(", "); // This will show the selected members' names separated by commas
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
                        Choose Members
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

export default UpdateTeam;
