/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
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
  IconButton,
  Divider,
} from "@mui/material";
import { getList } from "@/service/api/clauses";
import ShareIcon from "@mui/icons-material/Share";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
const ShareComp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [List, setlist] = useState<any[]>([]);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [member, setMamber] = useState<Array<any>>([]);
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
    listData();
  }, []);
  const bubbleColors = ["#FEC85E", "#BC3D89", "#725FE7,#00A7B1"]; // Yellow, Green, Blue
  return (
    <div style={{ textAlign: "left", position: "relative" }}>
      <Typography variant="body1" color="primary">
        Share
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Share with internal or external stakeholders to review or edit the
        contract by adding their email addresses
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <Box sx={{ display: "table", mb: 2, mt: 2, alignItems: "center" }}>
        <Typography
          variant="body1"
          sx={{ minWidth: "75px", mb: 2, whiteSpace: "nowrap" }}
        >
          <ShareIcon /> Share Contract
        </Typography>
        <Controller
          name="noticePeriod"
          control={control}
          //   rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              //   type="date"
              placeholder="Add name"
              fullWidth
              size="small"
              variant="outlined"
            />
          )}
        />
      </Box>
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
                const selectedNames = selected.map((selectedId: any) => {
                  const user = userList.find((user) => user._id === selectedId);
                  return user ? `${user.firstName} ${user.lastName}` : "";
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
    </div>
  );
};

export default ShareComp;
