/* eslint-disable @typescript-eslint/no-explicit-any */
// UpdateBranch.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
  FormHelperText,
} from "@mui/material";
import { countries, getStatesByCountry } from "@/utils/CounteryState";
import { Country } from "country-state-city";
import toast from "react-hot-toast";
import {
  createBranch,
  getBranchByid,
  getUserListNameID,
  updateBranch,
} from "@/service/api/apiMethods";
import { Update } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useAuth } from "@/hooks/useAuth";

type FormValues = {
  branchName: string;
  branchId: string;
  address: string;
  pinCode: string;
  contact: string;
  manager: string;
  state: string;
  website: string;
  country: string;
  status: string;
  countryCode: string;
};

const DetailBranch = () => {
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
  const selectedCountry = watch("country");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [status, setStatus] = useState<any>("");
  const [state, setState] = useState<any>("");
  const [countery, setCountery] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<undefined>(undefined);
  const [userList, setUserList] = useState<Array<any>>([]);

  const countries = Country.getAllCountries().map((country) => ({
    code: country.isoCode,
    name: country.name,
    phoneCode: country.phonecode,
  }));

  React.useEffect(() => {
    setValue("state", "");
  }, [selectedCountry, setValue]);
  const countryCode = watch("countryCode");
  const contact = watch("contact");

  React.useEffect(() => {
    if (countryCode && contact) {
      setValue(
        "contact",
        `${countryCode} ${contact.replace(countryCode, "")}`.trim()
      );
    }
  }, [countryCode, contact, setValue]);

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
    if (user?._id) UserlistData();
  }, [user?._id]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getBranchByid(id);
      console.log(data);

      setList(data);
      setValue("branchName", data.branchName);
      setValue("address", data.address);
      setValue("branchId", data.branchId);
      setValue("contact", data.contact);
      setValue("contact", data.contact);
      setValue("country", data.country);
      setValue("manager", data.manager);
      setValue("pinCode", data.pinCode);
      setValue("status", data.status);
      setValue("website", data.website);
      setState(data.state);
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

  const handleCountryCodeChange = (e: any) => {
    const newCountryCode = e.target.value;

    setSelectedCountryCode(`${newCountryCode}`);
  };
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const payload = {
        branchName: data.branchName,
        branchId: data.branchId,
        address: data.address,
        pinCode: data.pinCode,
        contact: `+${selectedCountryCode}${data.contact}`.trim(),
        manager: data.manager,
        state: state,
        website: data.website,
        country: data.country,
        status: data.status,
        createdByName: user?.firstName,
      };
      const response = await updateBranch(id, payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/branchlist");
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
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
              Details Branch
            </Typography>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ mt: -2, mb: 2, fontSize: "14px" }}
            >
              <Link
                style={{ marginRight: "-7px" }}
                to="/dashboard/branchlist"
                className="link-no-underline"
              >
                Home
              </Link>
              <Typography
                sx={{ fontSize: "14px", ml: "-7px" }}
                color="text.primary"
              >
                Details Branch
              </Typography>
            </Breadcrumbs>
          </Box>
        </div>
      </Box>
      <Paper sx={{ padding: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Legal Name*</Typography>

            <Controller
              name="branchName"
              control={control}
              rules={{ required: "Mandatory field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Branch name"
                  fullWidth
                  error={!!errors.branchName}
                  helperText={errors.branchName?.message}
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Branch ID*</Typography>
            <Controller
              name="branchId"
              control={control}
              rules={{ required: "Mandatory field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Registration no."
                  fullWidth
                  error={!!errors.branchId}
                  helperText={errors.branchId?.message}
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Address*</Typography>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Mandatory field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Address"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          {/* Pin Code field */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Pin Code*</Typography>
            <Controller
              name="pinCode"
              control={control}
              rules={{ required: "Mandatory field is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Pin code"
                  fullWidth
                  error={!!errors.pinCode}
                  helperText={errors.pinCode?.message}
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Contact Number</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <Controller
                    name="countryCode"
                    control={control}
                    defaultValue={selectedCountryCode}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="country-code-label"
                        displayEmpty // Ensures that the placeholder is displayed when the value is empty
                        value={selectedCountryCode}
                        // onChange={(e) => {
                        // const newCountryCode = e.target.value;
                        // setSelectedCountryCode(newCountryCode);
                        // Prepend '+' to the country code when setting the contact field value
                        // setValue("contact", `+${newCountryCode}`);
                        // }}
                        onChange={handleCountryCodeChange}
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
                                Country code
                              </em>
                            );
                          }
                          // Display the selected value. You might need to format it or find the corresponding country name
                          return `+${value}`;
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em>Country Code</em>{" "}
                          {/* This is the placeholder item */}
                        </MenuItem>
                        {countries.map((country) => (
                          <MenuItem
                            key={country.code}
                            value={country.phoneCode} // Store just the phone code as the value
                          >
                            {`${country.name} (+${country.phoneCode})`}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={8}>
                <Controller
                  name="contact"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      InputProps={{}}
                      {...field}
                      placeholder="Contact number"
                      fullWidth
                      size="small"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
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
                  {/* Optional: add this line if you want a label */}
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
                          </em> // Placeholder text with custom color
                        );
                      }
                      // Find the selected manager by ID
                      const selectedManager = userList.find(
                        (user) => user._id === value
                      );
                      return selectedManager
                        ? `${selectedManager.firstName} ${selectedManager.lastName}`
                        : "";
                    }}
                  >
                    {userList?.map((user: any) => (
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
            <Typography variant="subtitle2">Country*</Typography>
            <FormControl fullWidth size="small" error={!!errors.country}>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Mandatory field is required" }}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="country-label"
                    placeholder="Country"
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
                            Select country
                          </em>
                        ); // Placeholder text
                      }
                      return field.value;
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.country ? errors.country.message : ""}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">State</Typography>
            <FormControl fullWidth variant="outlined" size="small">
              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    labelId="state-label"
                    placeholder="State"
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
                            Select state
                          </em>
                        ); // Placeholder text
                      }
                      return state;
                    }}
                  >
                    {selectedCountry &&
                      getStatesByCountry(selectedCountry).map((state) => (
                        <MenuItem key={state.stateCode} value={state.name}>
                          {state.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Website</Typography>
            <Controller
              name="website"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Website URL"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
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
                    {...field}
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
                    <MenuItem value="Archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default DetailBranch;
