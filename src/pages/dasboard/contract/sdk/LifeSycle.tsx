/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Typography,
  Button,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
  FormControl,
  Autocomplete,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ContractContext } from "@/context/ContractContext";
import { useAuth } from "@/hooks/useAuth";
import { getUserListNameID } from "@/service/api/apiMethods";

const LifeCycle = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();
  const { user } = useAuth();
  const {
    activeSection,
    showButtons,
    setShowButtons,
    recipients,
    setRecipients,
    lifecycleData,
    setLifecycleData,
  } = useContext(ContractContext);

  const handleFieldChange = (path: any, value: any) => {
    console.log(path, value);

    setLifecycleData((prev: any) => {
      const keys = path.split(".");
      const lastKey = keys.pop();
      const lastObj = keys.reduce(
        (obj: any, key: any) => {
          if (!obj[key]) obj[key] = {};
          return obj[key];
        },
        { ...prev }
      );
      lastObj[lastKey] = value;
      return { ...prev };
    });
  };

  const [checkboxStates, setCheckboxStates] = useState({
    isEvergreen: false,
    isRenewalsActive: false,
    isNotificationEmailEnabled: false,
    isRemindersEnabled: false,
  });
  console.log(lifecycleData, "lifeSycle");

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [userList, setUserList] = useState<Array<any>>([]);

  const [checkedStatesEamil, setCheckedStatesEmail] = useState(
    recipients.reduce(
      (acc: any, colb: any) => ({ ...acc, [colb.id]: true }),
      {}
    )
  );
  // Handle checkbox change
  const [checkedRecipients, setCheckedRecipients] = useState(new Set());

  const handleCheckboxChangeEmail = (colb: any) => (event: any) => {
    const newChecked = new Set(checkedRecipients);
    if (event.target.checked) {
      newChecked.add(colb.email);
    } else {
      newChecked.delete(colb.email);
    }
    setCheckedRecipients(newChecked);
  };

  // Handler to remove a recipient
  const handleRemoveSignatory = (colb: any) => {
    setLifecycleData((prev: any) => ({
      ...prev,
      recipients: prev.recipients.filter(
        (recipient: any) => recipient.email !== colb.email
      ),
    }));
  };
  const endDate = watch("endDate");
  console.log(endDate, "endDate");

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    // Update the nested checkbox state
    setLifecycleData((prev: any) => ({
      ...prev,
      formData: {
        ...prev.formData,
        checkboxStates: {
          ...prev.formData.checkboxStates,
          [name]: checked,
        },
      },
    }));
  };

  const handleInputChange = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddSignatory(inputValue);
    }
  };

  const listData = async () => {
    try {
      const { data } = await getUserListNameID(user?._id);
      console.log({ data });

      setUserList(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const handleAddSignatory = (newSignatoryEmail: any) => {
    const emailExists = lifecycleData.recipients.some(
      (collaborator: any) => collaborator.email === newSignatoryEmail
    );
    if (newSignatoryEmail && !emailExists) {
      setLifecycleData((prev: any) => ({
        ...prev,
        recipients: [...prev.recipients, { email: newSignatoryEmail }],
      }));
    }

    setInputValue(""); // Clearing the input value
    setSelectedValue(null); // Resetting selected value
  };

  // Function to remove a signatory from the list

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("https://api.example.com/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log("Form submitted successfully:", responseData);
      } else {
        console.error("Failed to submit form:", responseData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="subtitle1" color="black">
        Lifecycle
      </Typography>
      <Divider sx={{ mt: 0.1, mb: 1, pl: -1, background: "#174B8B" }} />
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            mt: 0.8,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Signed on
        </Typography>
        <Controller
          name="signedOn"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              name="signedOn"
              value={lifecycleData.formData.dateFields.signedOn}
              onChange={(e) =>
                handleFieldChange(
                  "formData.dateFields.signedOn",
                  e.target.value
                )
              }
              placeholder="Signed on"
              fullWidth
              size="small"
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      // Shows the underline when the input is focused
                      borderBottom: "2px solid", // Adjust color as needed
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>
      {/* Start Date Field */}
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            mt: 0.8,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Start date*
        </Typography>
        <Controller
          name="startDate"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              name="startDate"
              type="date"
              value={lifecycleData.formData.dateFields.startDate}
              onChange={(e) =>
                handleFieldChange(
                  "formData.dateFields.startDate",
                  e.target.value
                )
              }
              size="small"
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      // Shows the underline when the input is focused
                      borderBottom: "2px solid", // Adjust color as needed
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>
      {/* End Date Field */}
      {!lifecycleData.formData.checkboxStates.isEvergreen && (
        <Box sx={{ mb: 0 }}>
          <Typography
            variant="body2"
            sx={{
              minWidth: "75px",
              mr: 2,
              mb: 0.8,
              mt: 0.8,
              whiteSpace: "nowrap",
              color: "#155BE5",
            }}
          >
            End date
          </Typography>
          <Controller
            name="endDate"
            control={control}
            // rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                name="endDate"
                type="date"
                value={lifecycleData.formData.dateFields.endDate}
                onChange={(e) =>
                  handleFieldChange(
                    "formData.dateFields.endDate",
                    e.target.value
                  )
                }
                size="small"
                variant="standard"
                InputProps={{
                  disableUnderline: true, // Disables the underline by default
                  sx: {
                    "::after": {
                      borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                    },
                    "::before": {
                      borderBottom: "none !important", // Hides the underline
                    },
                    ":hover:not(.Mui-disabled)::before": {
                      borderBottom: "none !important", // Ensures underline stays hidden on hover
                    },
                    "input:focus + fieldset": {
                      border: "none", // Optional: for outlined variant if ever used
                    },
                    "::placeholder": {
                      fontSize: "0.55rem",
                    },
                    input: {
                      fontSize: "0.875rem",
                      "&:focus": {
                        // Shows the underline when the input is focused
                        borderBottom: "2px solid", // Adjust color as needed
                      },
                    },
                  },
                }}
              />
            )}
          />
        </Box>
      )}
      {!lifecycleData.formData.dateFields.endDate && (
        <>
          <div style={{ display: "flex" }}>
            <FormControlLabel
              sx={{
                mt: 0.5,
                ml: "-.4rem",
                "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                // Apply any additional styling you need for the FormControlLabel here
              }}
              control={
                <Checkbox
                  disabled={!!lifecycleData.formData.dateFields.endDate} // Disabled if endDate is set
                  checked={lifecycleData.formData.checkboxStates.isEvergreen}
                  onChange={handleCheckboxChange}
                  name="isEvergreen"
                  sx={{
                    padding: "5px", // Adjusts padding around the checkbox
                    "& .MuiSvgIcon-root": {
                      // Targets the SVG icon representing the checkbox
                      fontSize: "18px", // Adjust this value to scale the icon size
                    },
                  }}
                />
              }
              label="Evergreen"
            />
            <Tooltip
              title={
                "This agreement automatically renews indefinitely until terminated."
              }
            >
              <div style={{ marginTop: "14px" }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.4 9.6H6.6V8.4H5.4V9.6ZM6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM6 2.4C5.36348 2.4 4.75303 2.65286 4.30294 3.10294C3.85286 3.55303 3.6 4.16348 3.6 4.8H4.8C4.8 4.48174 4.92643 4.17652 5.15147 3.95147C5.37652 3.72643 5.68174 3.6 6 3.6C6.31826 3.6 6.62348 3.72643 6.84853 3.95147C7.07357 4.17652 7.2 4.48174 7.2 4.8C7.2 6 5.4 5.85 5.4 7.8H6.6C6.6 6.45 8.4 6.3 8.4 4.8C8.4 4.16348 8.14714 3.55303 7.69706 3.10294C7.24697 2.65286 6.63652 2.4 6 2.4Z"
                    fill="#949494"
                  />
                </svg>
              </div>
            </Tooltip>
          </div>
          <Box sx={{ mb: 0 }}>
            <div style={{ display: "flex" }}>
              <Typography
                variant="body2"
                sx={{
                  minWidth: "75px",
                  mr: 2,
                  mb: 0.8,
                  mt: 0.8,
                  whiteSpace: "nowrap",
                  color: endDate ? "#949494" : "#155BE5",
                }}
              >
                Rolling days notice
              </Typography>
              <Tooltip
                title={"Notice required to terminate this evergreen agreement."}
              >
                <div style={{ marginTop: "7px" }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.4 9.6H6.6V8.4H5.4V9.6ZM6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM6 2.4C5.36348 2.4 4.75303 2.65286 4.30294 3.10294C3.85286 3.55303 3.6 4.16348 3.6 4.8H4.8C4.8 4.48174 4.92643 4.17652 5.15147 3.95147C5.37652 3.72643 5.68174 3.6 6 3.6C6.31826 3.6 6.62348 3.72643 6.84853 3.95147C7.07357 4.17652 7.2 4.48174 7.2 4.8C7.2 6 5.4 5.85 5.4 7.8H6.6C6.6 6.45 8.4 6.3 8.4 4.8C8.4 4.16348 8.14714 3.55303 7.69706 3.10294C7.24697 2.65286 6.63652 2.4 6 2.4Z"
                      fill="#949494"
                    />
                  </svg>
                </div>
              </Tooltip>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Controller
                name="rollingDaysNotice"
                control={control}
                render={({ field }) => (
                  <TextField
                    disabled={!!lifecycleData.formData.dateFields.endDate}
                    {...field}
                    placeholder="Rolling days notice"
                    fullWidth
                    type="number"
                    size="small"
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        backgroundColor: "#f0f0f0", // Adjust this value to change the background color
                        "::after": {
                          borderBottom: "2px solid",
                        },
                        "::before": {
                          borderBottom: "none !important",
                        },
                        ":hover:not(.Mui-disabled)::before": {
                          borderBottom: "none !important",
                        },
                        "input:focus + fieldset": {
                          border: "none",
                        },
                        "::placeholder": {
                          fontSize: "0.55rem",
                        },
                        input: {
                          fontSize: "0.875rem",
                          "&:focus": {
                            borderBottom: "2px solid",
                          },
                        },
                      },
                    }}
                  />
                )}
              />

              <Button
                variant="text"
                sx={{
                  backgroundColor: "#f0f0f0", // Ensures there is no background color
                  color: "black", // Text color
                  width: "60%", // Full width of the FormControl
                  textTransform: "none",
                  height: "25px",
                  ml: 2, // Prevents uppercase transformation
                }}
              >
                Day(s)
              </Button>
            </div>
          </Box>
        </>
      )}
      {/* Conditional Evergreen Duration Field */}
      {!lifecycleData.formData.checkboxStates.isEvergreen && (
        <>
          <Box sx={{ mb: 0 }}>
            <Typography
              variant="body2"
              sx={{
                minWidth: "75px",
                mr: 2,
                mb: 0.8,
                mt: 0.8,
                whiteSpace: "nowrap",
                color: "#155BE5",
              }}
            >
              Notice period date
            </Typography>
            <Controller
              name="noticePeriod"
              control={control}
              // rules={{ required: "This field is required" }}
              render={({ field }) => (
                <TextField
                  name="noticePeriodDate"
                  type="date"
                  value={lifecycleData.formData.dateFields.noticePeriodDate}
                  onChange={(e) =>
                    handleFieldChange(
                      "formData.dateFields.noticePeriodDate",
                      e.target.value
                    )
                  }
                  size="small"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true, // Disables the underline by default
                    sx: {
                      "::after": {
                        borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                      },
                      "::before": {
                        borderBottom: "none !important", // Hides the underline
                      },
                      ":hover:not(.Mui-disabled)::before": {
                        borderBottom: "none !important", // Ensures underline stays hidden on hover
                      },
                      "input:focus + fieldset": {
                        border: "none", // Optional: for outlined variant if ever used
                      },
                      "::placeholder": {
                        fontSize: "0.55rem",
                      },
                      input: {
                        fontSize: "0.875rem",
                        "&:focus": {
                          // Shows the underline when the input is focused
                          borderBottom: "2px solid", // Adjust color as needed
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
            Renewals
          </Typography>
          <Divider style={{ margin: "2px 0" }} />
          <FormControlLabel
            sx={{
              mt: 0.5,
              ml: "-.4rem",
              "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
              // Apply any additional styling you need for the FormControlLabel here
            }}
            control={
              <Checkbox
                checked={lifecycleData.formData.checkboxStates.isRenewalsActive}
                onChange={handleCheckboxChange}
                name="isRenewalsActive"
                sx={{
                  padding: "5px", // Adjusts padding around the checkbox
                  "& .MuiSvgIcon-root": {
                    // Targets the SVG icon representing the checkbox
                    fontSize: "18px", // Adjust this value to scale the icon size
                  },
                }}
              />
            }
            label="Not set"
          />
          {!lifecycleData.formData.checkboxStates.isRenewalsActive && (
            <Box sx={{ mb: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  minWidth: "75px",
                  mr: 2,
                  mb: 0.8,
                  mt: 0.8,
                  whiteSpace: "nowrap",
                  color: "#155BE5",
                }}
              >
                Renewal Date
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Controller
                  name="evergreenDuration"
                  control={control}
                  // rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <TextField
                      name="renewalPeriod"
                      value={
                        lifecycleData.formData.renewalDetails.renewalPeriod
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          "formData.renewalDetails.renewalPeriod",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="Renewal Date"
                      size="small"
                      variant="standard"
                      InputProps={{
                        disableUnderline: true, // Disables the underline by default
                        sx: {
                          backgroundColor: "#f0f0f0",
                          "::after": {
                            borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
                          },
                          "::before": {
                            borderBottom: "none !important", // Hides the underline
                          },
                          ":hover:not(.Mui-disabled)::before": {
                            borderBottom: "none !important", // Ensures underline stays hidden on hover
                          },
                          "input:focus + fieldset": {
                            border: "none", // Optional: for outlined variant if ever used
                          },
                          "::placeholder": {
                            fontSize: "0.55rem",
                          },
                          input: {
                            fontSize: "0.875rem",
                            "&:focus": {
                              // Shows the underline when the input is focused
                              borderBottom: "2px solid", // Adjust color as needed
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="renewalType"
                  control={control}
                  rules={{ required: "This field is required" }}
                  defaultValue="days" // Setting default value directly
                  render={({ field }) => (
                    <FormControl
                      size="small"
                      variant="standard"
                      sx={{ ml: 2, width: "60%" }}
                    >
                      <Select
                        name="renewalType"
                        value={
                          lifecycleData.formData.renewalDetails.renewalType
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            "formData.renewalDetails.renewalType",
                            e.target.value
                          )
                        }
                        labelId="renewal-type-label"
                        label="Type"
                        displayEmpty
                        inputProps={{
                          "aria-label": "Without label",
                          sx: {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                      >
                        <MenuItem value="days">Day(s)</MenuItem>
                        <MenuItem value="months">Month(s)</MenuItem>
                        <MenuItem value="years">Year(s)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
              <Typography
                variant="body2"
                sx={{
                  minWidth: "75px",
                  mr: 2,

                  whiteSpace: "nowrap",
                }}
              >
                from document completion date
              </Typography>
            </Box>
          )}

          <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
            Notification email
          </Typography>
          <Divider style={{ margin: "2px 0" }} />
          <FormControlLabel
            sx={{
              mt: 0.5,
              ml: "-.4rem",
              "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
              // Apply any additional styling you need for the FormControlLabel here
            }}
            control={
              <Checkbox
                checked={
                  lifecycleData.formData.checkboxStates
                    .isNotificationEmailEnabled
                }
                onChange={handleCheckboxChange}
                name="isNotificationEmailEnabled"
                sx={{
                  padding: "5px", // Adjusts padding around the checkbox
                  "& .MuiSvgIcon-root": {
                    // Targets the SVG icon representing the checkbox
                    fontSize: "18px", // Adjust this value to scale the icon size
                  },
                }}
              />
            }
            label="Notify document owner"
          />
          {lifecycleData.recipients.map((colb: any) => (
            <div
              key={colb.email} // Use email as the key if it's unique
              style={{ display: "flex", alignItems: "center" }}
            >
              <FormControlLabel
                sx={{
                  mt: 0.5,
                  ml: "-.4rem",
                  "& .MuiFormControlLabel-label": { fontSize: "12px" },
                }}
                control={
                  <Checkbox
                    checked={checkedRecipients.has(colb.email)}
                    onChange={handleCheckboxChangeEmail(colb)}
                    name="user"
                    sx={{
                      padding: "5px",
                      "& .MuiSvgIcon-root": {
                        fontSize: "18px",
                      },
                    }}
                  />
                }
                label={colb.email}
              />
              <IconButton
                onClick={() => handleRemoveSignatory(colb)}
                size="small"
                sx={{ marginLeft: "auto" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          ))}

          {lifecycleData.formData.checkboxStates.isNotificationEmailEnabled && (
            <>
              <Box sx={{ mb: 0 }}>
                <Button
                  sx={{
                    fontSize: "12px",
                    textTransform: "none !important",
                    borderRadius: 0,
                    color:
                      activeSection === "collaborate"
                        ? "primary.main"
                        : "black",
                    // fontWeight: "bold",

                    borderColor:
                      activeSection === "collaborate"
                        ? "primary.main"
                        : "transparent",
                  }}
                  onClick={() => {
                    // setActiveSection("");
                    setShowButtons((prevShowButtons: any) => !prevShowButtons);
                    setSelectedValue(null);
                    setInputValue("");
                  }}
                >
                  <span
                    style={{
                      color: "blue",
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginRight: "5px",
                      marginLeft: "-5px",
                    }}
                  >
                    +
                  </span>{" "}
                  Add another recipient
                </Button>
                {showButtons && (
                  <>
                    <Autocomplete
                      freeSolo
                      options={userList.map((user) => ({
                        label: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                      }))}
                      getOptionLabel={(option: any) => option.label || ""}
                      onInputChange={handleInputChange}
                      inputValue={inputValue}
                      value={selectedValue}
                      onChange={(_, value: any) => {
                        setSelectedValue(value); // Only update selectedValue here
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search by name or add email"
                          margin="normal"
                          variant="outlined"
                          size="small"
                          onKeyPress={handleKeyPress}
                          sx={{
                            ".MuiInputLabel-root": { fontSize: "14px" },
                            ".MuiOutlinedInput-root": { fontSize: "14px" },
                          }}
                        />
                      )}
                    />
                    <div
                      style={{ flex: 1, textAlign: "right", marginTop: "0px" }}
                    >
                      <Button
                        variant="contained"
                        color="inherit"
                        sx={{
                          mr: "20px",
                          textTransform: "none",
                          backgroundColor: "#DCDCDC",
                          "&:hover": {
                            backgroundColor: "#757575",
                          },
                          color: "white",
                          padding: "2px 5px !important",
                          height: "25px !important",
                          fontSize: "0.675rem",
                        }}
                        onClick={() => {
                          setSelectedValue(null);
                          setInputValue("");
                          setShowButtons(false);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        color="inherit"
                        disabled={!selectedValue && !inputValue.trim()}
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#62BD6B",
                          "&:hover": {
                            backgroundColor: "#62BD6d",
                          },
                          color: "white",
                          padding: "2px 5px !important",
                          height: "25px !important",
                          fontSize: "0.675rem",
                        }}
                        onClick={() => {
                          if (selectedValue) {
                            handleAddSignatory(selectedValue.email);
                          } else if (inputValue.trim() !== "") {
                            handleAddSignatory(inputValue.trim());
                          }
                          setShowButtons(false);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </>
                )}
              </Box>
            </>
          )}
          <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
            Reminders
          </Typography>
          <Divider style={{ margin: "2px 0" }} />
          <FormControlLabel
            sx={{
              mt: 0.5,
              ml: "-.4rem",
              "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
              // Apply any additional styling you need for the FormControlLabel here
            }}
            control={
              <Checkbox
                checked={
                  lifecycleData.formData.checkboxStates.isRemindersEnabled
                }
                onChange={handleCheckboxChange}
                name="isRemindersEnabled"
                sx={{
                  padding: "5px", // Adjusts padding around the checkbox
                  "& .MuiSvgIcon-root": {
                    // Targets the SVG icon representing the checkbox
                    fontSize: "18px", // Adjust this value to scale the icon size
                  },
                }}
              />
            }
            label="Send automatic reminders"
          />
          {lifecycleData.formData.checkboxStates.isRemindersEnabled && (
            <>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                {" "}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  First reminder
                </Typography>
                <Controller
                  name="firstRennnminder"
                  control={control}
                  // rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <TextField
                      name="firstReminder"
                      value={
                        lifecycleData.formData.reminderSettings.firstReminder
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          "formData.reminderSettings.firstReminder",
                          e.target.value
                        )
                      }
                      type="number"
                      size="small"
                      InputProps={{
                        disableUnderline: true, // Disables the underline by default
                        sx: {
                          height: "30px",
                          width: "60px",
                          background: "#FFFFFF",
                          marginRight: "3px",
                          marginLeft: "3px",
                        },
                      }}
                      placeholder="0"
                    />
                  )}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  days before
                </Typography>
              </div>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "14px",
                }}
              >
                renewal date.
              </Typography>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                {" "}
                <Controller
                  name="dayBtweenReminder"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <TextField
                      name="daysBetweenReminders"
                      value={
                        lifecycleData.formData.reminderSettings
                          .daysBetweenReminders
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          "formData.reminderSettings.daysBetweenReminders",
                          e.target.value
                        )
                      }
                      type="number"
                      size="small"
                      InputProps={{
                        disableUnderline: true, // Disables the underline by default
                        sx: {
                          height: "30px",
                          width: "60px",
                          background: "#FFFFFF",
                          marginRight: "5px",
                        },
                      }}
                      placeholder="0"
                    />
                  )}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  days between reminders.
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {" "}
                <Controller
                  name="daysBefore"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <TextField
                      name="daysBeforeFinalExpiration"
                      value={
                        lifecycleData.formData.reminderSettings
                          .daysBeforeFinalExpiration
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          "formData.reminderSettings.daysBeforeFinalExpiration",
                          e.target.value
                        )
                      }
                      type="number"
                      size="small"
                      InputProps={{
                        disableUnderline: true, // Disables the underline by default
                        sx: {
                          height: "30px",
                          width: "60px",
                          background: "#FFFFFF",
                          marginRight: "5px",
                        },
                      }}
                      placeholder="0"
                    />
                  )}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  days before final expiration
                </Typography>
              </div>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "14px",
                }}
              >
                date of the document.
              </Typography>
            </>
          )}
        </>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          marginBottom: "0.5rem",
          marginTop: "1rem",
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          sx={{
            mr: "20px",
            textTransform: "none",
            backgroundColor: "#DCDCDC",
            "&:hover": {
              backgroundColor: "#757575",
            },
            color: "white",
            padding: "2px 5px !important",
            height: "25px !important",
            fontSize: "0.675rem",
          }}
          onClick={() => {
            setLifecycleData({
              activeSection: "",
              showButtons: false,
              recipients: [],
              formData: {
                checkboxStates: {
                  isEvergreen: false,
                  isRenewalsActive: false,
                  isNotificationEmailEnabled: false,
                  isRemindersEnabled: false,
                },
                dateFields: {
                  signedOn: "",
                  startDate: "",
                  endDate: "",
                  noticePeriodDate: "",
                },
                renewalDetails: {
                  renewalType: "days",
                  renewalPeriod: 0,
                },
                notificationDetails: {
                  notifyOwner: false,
                  additionalRecipients: [],
                },
                reminderSettings: {
                  firstReminder: 0,
                  daysBetweenReminders: 0,
                  daysBeforeFinalExpiration: 0,
                },
              },
            });
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="inherit"
          sx={{
            textTransform: "none",
            backgroundColor: "#62BD6B",
            "&:hover": {
              backgroundColor: "#62BD6d",
            },
            color: "white",
            padding: "2px 5px !important",
            height: "25px !important",
            fontSize: "0.675rem",
          }}
          type="submit"
        >
          Apply
        </Button>
      </div>
    </form>
  );
};

export default LifeCycle;
