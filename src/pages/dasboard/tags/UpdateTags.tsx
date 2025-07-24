/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { create, getTagsById, updateTags } from "@/service/api/tags";
type FormValues = {
  name: string;
  manager: string;
  status: string;
  members: [];
};

const UpdateTags = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [member, setMamber] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getTagsById(id);

      setValue("name", data?.name);
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
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        id: user._id,
        name: data.name,
        createdByName: user?.firstName,
      };

      const response = await updateTags(id, payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/tags-list");
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
                Update Tag
              </Typography>

              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ mt: -2, mb: 2, fontSize: "14px" }}
              >
                <Link to="/dashboard/tags-list" className="link-no-underline">
                  Home
                </Link>
                <Typography sx={{ fontSize: "14px" }} color="text.primary">
                  Update Tag
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
              <Typography variant="subtitle2">Tag Name*</Typography>

              <Controller
                name="name"
                control={control}
                rules={{ required: "Tag Name is required" }}
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
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default UpdateTags;
