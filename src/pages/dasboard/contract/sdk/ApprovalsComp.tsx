/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Divider,
  Button,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Box,
  Switch,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  TextField,
  Input,
  IconButton,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getList as getApprovalList } from "@/service/api/approval";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { getfeildList } from "@/service/api/customFeild";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ApprovalReasionDialog from "@/pages/dasboard/contract/sdk/ApprovalReasionDialog";
import warnig from "@/assets/Messages_Bubble_Warning.png";
import send from "@/assets/Email_Sending.png";
import DeleteIcon from "@mui/icons-material/Delete";
import ApprovalAlertDialog from "@/pages/dasboard/contract/sdk/ApprovalAlertDialog";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ContractContext } from "@/context/ContractContext";
type FormValues = {
  name: string;
  userSelections: Array<{
    user: string | { email: string; firstName: string; lastName: string };
  }>;
};
const initialCondition = {
  comparisonOperator: "",
  value: "",
  userSelection: "",
  userDisplayName: "",
};
const ApprovalsComp = () => {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [approvalList, setApprovallist] = useState<any[]>([]);
  const [signatories, setSignatories] = useState<any[]>([]);
  const {
    showConditionalSelect,
    setShowConditionalSelect,
    showCompanySelect,
    setShowCompanySelect,
    showSignatories,
    setShowSignatories,
    selectedApproval,
    setSelectedApproval,
    approvers,
    setApprovers,
    selectedUserApproval,
    setSelectedUserApproval,
    userApproval,
    setUserApproval,
    conditions,
    setConditions,
    setUserConditionalApproval,
    userConditionalApproval,
    selectedFeild,
    setSeletedFeild,
    type,
    setType,
    viewUser,
    setViewUser,
    setSelectedConditionalApproval,
    selectedConditionalApproval,
  } = useContext(ContractContext);
  const [selectedApprovalId, setSelectedApprovalId] = useState("");
  const [userList, setUserList] = useState<Array<any>>([]);
  const [feildList, setFeildList] = useState<Array<any>>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);

  const [notifyApprovers, setNotifyApprovers] = useState(false);

  const handleCheckboxChange = (event: any) => {
    setNotifyApprovers(event.target.checked);
  };

  const addCondition = () => {
    const newCondition = {
      comparisonOperator: "",
      value: "",
      userSelection: "",
      userDisplayName: "",
    };
    setConditions([...conditions, newCondition]);
  };

  const handleUserSelectionChange = (index: any, newValue: any) => {
    const updatedConditions = conditions.map((condition: any, i: any) =>
      i === index
        ? {
            ...condition,
            userSelection: newValue?.email ?? "",
            userDisplayName: newValue
              ? `${newValue.firstName} ${newValue.lastName}`
              : "",
          }
        : condition
    );
    setConditions(updatedConditions);
  };

  const handleComparisonOperatorChange = (index: any, event: any) => {
    const updatedConditions = conditions.map((condition: any, i: any) =>
      i === index
        ? { ...condition, comparisonOperator: event.target.value }
        : condition
    );
    setConditions(updatedConditions);
  };

  const handleValueChange = (index: any, event: any) => {
    const updatedConditions = conditions.map((condition: any, i: any) =>
      i === index ? { ...condition, value: event.target.value } : condition
    );
    setConditions(updatedConditions);
  };
  const removeCondition = (index: any) => {
    setConditions(conditions.filter((_: any, i: any) => i !== index));
  };
  const onSubmit = (data: any) => {};

  console.log(conditions, "condtion");
  const handleOpenDialog = (approver: any) => {
    setDialogData(approver);
    setOpenDialog(true);
  };

  const handleDialogSubmit = (
    status: string,
    reason: string,
    approver: any,
    Resolved: string
  ) => {
    if (approver) {
      setDialogData(approver);
    }
    setApprovers((prevApprovers: any) =>
      prevApprovers.map((currentApprover: any) =>
        currentApprover?._id === dialogData?._id
          ? {
              ...currentApprover,
              status: status === "" ? "" : status,
              reason: Resolved === "resolved" ? "" : reason.trim(), // Set reason to empty if resolved, otherwise use the trimmed reason
            }
          : currentApprover
      )
    );
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAlertOpenDialog = () => {
    setOpenAlertDialog(true);
  };

  const handleAlertCloseDialog = () => {
    setOpenAlertDialog(false);
  };
  const handleAddSignatory = (data: string[]) => {
    console.log(data, "names");
    setApprovers(data);
    // setApprovers(() => {
    //   // Instead of creating a set from prev, create an empty set for a fresh list
    //   const newSignatories = new Set(names); // Directly add new names, ensuring they're unique within this selection
    //   return Array.from(newSignatories);
    // });
  };
  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setApprovers(
      approvers.filter((signatory: any) => signatory !== signatoryToRemove)
    );
  };

  const handleUserApproval = (newSignatoryEmail: string) => {
    if (newSignatoryEmail && !signatories.includes(newSignatoryEmail)) {
      setUserApproval((prev: any) => [...prev, newSignatoryEmail]);
      // Assuming you manage the input value for Autocomplete
    }
  };
  const handleUserConditionalApproval = (newSignatoryEmail: string) => {
    if (newSignatoryEmail && !signatories.includes(newSignatoryEmail)) {
      setUserConditionalApproval((prev: any) => [...prev, newSignatoryEmail]);
      // Assuming you manage the input value for Autocomplete
    }
  };
  const handleremoveUserApproval = (signatoryToRemove: any) => {
    setUserApproval(
      signatories.filter((signatory: any) => signatory !== signatoryToRemove)
    );
  };
  const handleChange = (event: any) => {
    if (
      (userApproval.length > 0 && showSignatories === "topbar") ||
      conditions.some((condition: any) => condition.userSelection?.length > 0)
    ) {
      handleAlertOpenDialog();
    } else {
      const newValue = event.target.value;
      setSelectedApproval(newValue); // Update the selected approval state
      // Call the custom function with the new value
    }
  };
  const handleCompanyApprovalClick = () => {
    if (
      (userApproval.length > 0 && showSignatories === "topbar") ||
      conditions.some((condition: any) => condition.userSelection?.length > 0)
    ) {
      handleAlertOpenDialog();
    } else {
      setShowCompanySelect(true);
      setShowConditionalSelect(false);
    }
  };

  const handleConditionalApprovalClick = () => {
    if (
      (approvers.length > 0 && showSignatories === "topbar") ||
      conditions.some((condition: any) => condition.userSelection?.length > 0)
    ) {
      handleAlertOpenDialog();
    } else {
      setShowCompanySelect(false);
      setShowConditionalSelect(true);
    }
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);

      setUserList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const listApprovalData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getApprovalList();
      console.log({ data });

      setApprovallist(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const listFeildData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getfeildList();

      setFeildList(data);

      console.log("data", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      listData();
      listFeildData();
      listApprovalData();
    }
  }, [user?._id]);

  const handleRejectApproverByEmail = (app: any) => {
    const reason = prompt("Please enter the reason for rejection:");
    // This confirms the passed email argument is as expected.

    if (reason) {
      setApprovers((prevApprovers: any) =>
        prevApprovers.map((approver: any) => {
          console.log(approver, "shah");
          return approver._id === app._id
            ? { ...approver, reason: reason }
            : approver;
        })
      );
    }
  };
  console.log(approvers, "ok");

  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  return (
    <div>
      <Typography variant="subtitle1" color="black">
        Approvals
      </Typography>
      <Divider sx={{ mt: 0.1, mb: 1, pl: -1, background: "#174B8B" }} />
      {/* <Typography variant="body1" color="primary">
        Approvals
      </Typography>
      <Typography
        variant="body2"
        color="#8A8A8A"
        sx={{ fontSize: "11px", mt: 1 }}
      >
        Add a pre-approved approval workflow or create a custom or conditional
        workflow to get the contract approved before signing
      </Typography>
      <Divider style={{ margin: "20px 0" }} /> */}

      <div style={{ textAlign: "left" }}>
        <Button
          variant="text"
          color={showCompanySelect ? "primary" : "inherit"} // Changed "default" to "inherit"
          sx={{ textTransform: "none" }}
          onClick={handleCompanyApprovalClick}
        >
          + Set company approvals
        </Button>

        {showCompanySelect && (
          <>
            {(showSignatories === "topbar" ||
              showSignatories === "view" ||
              showSignatories === "edit") && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  variant="text"
                  sx={{ textTransform: "none" }}
                  onClick={() =>
                    setShowSignatories((prev: any) =>
                      prev === "view" ? "topbar" : "view"
                    )
                  }
                >
                  View
                </Button>
                <div style={{ textAlign: "right" }}>
                  <Button
                    variant="text"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      // setSignatories([]),
                      // setSelectedApprovalId(""),
                      setShowSignatories("edit");
                    }}
                  >
                    Edit
                  </Button>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Button
                    variant="text"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setSignatories([]),
                        setSelectedApprovalId(""),
                        setShowSignatories(""),
                        setApprovers([]);
                      setShowCompanySelect(false);
                      setShowConditionalSelect(false);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
            {selectedApproval !== "" &&
            (showSignatories === "topbar" || showSignatories === "view") ? (
              <Typography variant="body1" sx={{ fontSize: "14px" }}>
                {selectedApproval}
              </Typography>
            ) : (
              <Autocomplete
                style={{ marginTop: "1rem" }}
                value={
                  approvalList.find(
                    (approval) => approval._id === selectedApprovalId
                  ) || null
                }
                onChange={(event, newValue) => {
                  const value = newValue ? newValue._id : "";
                  setSelectedApprovalId(value);

                  if (newValue) {
                    setSelectedApproval(newValue.name); // Assuming you have a function to set this state
                    handleAddSignatory(newValue.approver);
                  } else {
                    setSelectedApproval(""); // Clear the selected approval name if no selection
                  }
                }}
                options={approvalList}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: true,
                      style: { fontSize: "14px" }, // Apply font size directly to the input element
                    }}
                    variant="outlined"
                    label="Select Approval"
                    sx={{
                      ".MuiInputLabel-root": { fontSize: "14px" }, // Adjusts the label font size
                      ".MuiOutlinedInput-root": { fontSize: "14px" }, // This targets the root but might be redundant with the direct style approach
                      // Add additional style adjustments here as needed
                    }}
                  />
                )}
                disabled={
                  showSignatories === "topbar" || showSignatories === "view"
                }
                clearOnEscape
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                clearText="Remove"
                noOptionsText="No Approvals"
              />
            )}

            {approvers.length > 0 &&
              (showSignatories === "" || showSignatories === "edit") && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginBottom: "0.5rem",
                  }}
                >
                  {showSignatories !== "edit" && (
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
                        setSignatories([]),
                          setSelectedApprovalId(""),
                          setShowSignatories(""),
                          setApprovers([]);
                        setShowCompanySelect(false);
                        setShowConditionalSelect(false);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
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
                    onClick={() => setShowSignatories("topbar")}
                  >
                    Save
                  </Button>
                </div>
              )}
            {showSignatories === "view" &&
              approvers.map((companyApproval: any, index: any) => (
                <>
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      mt: 2,
                    }}
                  >
                    {" "}
                    {index + 1} &nbsp;
                    <Box
                      sx={{
                        width: "25px !important",
                        height: "25px !important",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor:
                          bubbleColors[index % bubbleColors.length],
                        color: "#FFFFFF",
                        marginRight: -1,

                        mr: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px" }}>
                        {companyApproval?.email?.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        // fontWeight: "bold",
                        width: "120px",
                        textOverflow: "ellipsis",
                        fontSize: "16px",
                      }}
                    >
                      {companyApproval?.email}
                    </Typography>
                  </Box>
                  <div style={{ display: "flex" }}>
                    {companyApproval?.status ? (
                      <Typography
                        variant="body1"
                        sx={{
                          ml: 4,
                          display: "flex",
                          // fontWeight: "bold",
                          color:
                            companyApproval?.status === "Rejected"
                              ? "red"
                              : companyApproval?.status === "Approved"
                              ? "green"
                              : "inherit", // Default text color
                        }}
                      >
                        {companyApproval?.status === "Rejected" && (
                          <Tooltip title={companyApproval?.reason}>
                            <img
                              onClick={() =>
                                handleDialogSubmit("", "", companyApproval, "")
                              }
                              src={send}
                              alt="Logo"
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "1rem",
                              }}
                            />
                          </Tooltip>
                        )}{" "}
                        {companyApproval?.status}
                      </Typography>
                    ) : (
                      <>
                        <Tooltip title="Approve">
                          <Button
                            variant="text"
                            sx={{
                              textTransform: "none",
                              fontSize: "16px",
                              color: "#31C65B",
                              fontWeight: "bold",
                              padding: "0 8px", // Reduce padding here
                              minWidth: "auto",
                              ml: 5.5, // Ensures the button width is only as wide as its content
                            }}
                            onClick={() =>
                              handleDialogSubmit(
                                "Approved",
                                "",
                                companyApproval,
                                ""
                              )
                            }
                          >
                            <CheckCircleOutlineIcon fontSize="medium" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <Button
                            variant="text"
                            sx={{
                              textTransform: "none",
                              fontSize: "16px",
                              color: "#BEBEBE",
                              fontWeight: "bold",
                              padding: "0 8px", // Style adjustments as needed
                              minWidth: "auto", // Ensures button width is only as wide as its content
                            }}
                            onClick={() => handleOpenDialog(companyApproval)}
                          >
                            <HighlightOffIcon />{" "}
                          </Button>
                        </Tooltip>
                        <Tooltip title="Send">
                          <img
                            onClick={() =>
                              handleDialogSubmit("", "", companyApproval, "")
                            }
                            src={send}
                            alt="Logo"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginLeft: "0.6rem",
                              marginTop: "0.2rem",
                            }}
                          />
                        </Tooltip>
                      </>
                    )}
                    {companyApproval?.reason && (
                      <Tooltip title={companyApproval?.reason}>
                        <img
                          onClick={() => handleOpenDialog(companyApproval)}
                          src={warnig}
                          alt="Logo"
                          style={{
                            width: "20px",
                            height: "20px",
                            marginTop: "-0.4rem",
                            marginLeft: "1rem",
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                  {/* <ApprovalReasionDialog
                    open={openDialog}
                    onClose={handleCloseDialog}

                  /> */}
                </>
              ))}
          </>
        )}

        <Button
          variant="text"
          color={showConditionalSelect ? "primary" : "inherit"} // Changed "default" to "inherit"
          sx={{ textTransform: "none", mt: 1 }}
          onClick={handleConditionalApprovalClick}
        >
          + Create conditional approvals
        </Button>

        {showConditionalSelect && (
          <React.Fragment>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="approval-type"
                name="approvalType"
                sx={{ fontSize: "5px" }}
                value={selectedApproval}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="mandatory"
                  control={<Radio />}
                  label="User approval (Mandatory)"
                  componentsProps={{ typography: { sx: { fontSize: "12px" } } }}
                />
                <FormControlLabel
                  sx={{ fontSize: "5px" }}
                  value="conditional"
                  control={<Radio />}
                  label="Conditional approval (depending on custom fields)"
                  componentsProps={{ typography: { sx: { fontSize: "12px" } } }}
                />
              </RadioGroup>
            </FormControl>

            {selectedApproval === "mandatory" && (
              <>
                {userApproval.length === 0 && (
                  <Button
                    variant="text"
                    sx={{ textTransform: "none", mt: 1 }}
                    // onClick={handleCompanyApprovalClick}
                  >
                    + Get approval from
                  </Button>
                )}
                {userApproval.length > 0 &&
                  (showSignatories === "topbar" ||
                    showSignatories === "view" ||
                    showSignatories === "edit") && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginTop: "1rem",
                        marginBottom: "-1rem",
                      }}
                    >
                      <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={() =>
                          setShowSignatories((prev: any) =>
                            prev === "view" ? "topbar" : "view"
                          )
                        }
                      >
                        View
                      </Button>
                      <div style={{ textAlign: "right" }}>
                        <Button
                          variant="text"
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            // setSignatories([]),
                            // setSelectedApprovalId(""),
                            setShowSignatories("edit");
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Button
                          variant="text"
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            setSignatories([]),
                              setSelectedApprovalId(""),
                              setShowSignatories(""),
                              setUserApproval("");
                            setSelectedUserApproval("");
                            setSelectedApproval("");
                            setShowCompanySelect(false);
                            setShowConditionalSelect(false);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                {selectedUserApproval !== "" &&
                (showSignatories === "topbar" || showSignatories === "view") ? (
                  <Typography variant="body1" sx={{ mt: 3, fontSize: "14px" }}>
                    {selectedUserApproval}
                  </Typography>
                ) : (
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth size="small">
                        <Autocomplete
                          sx={{ mt: 3 }}
                          {...field}
                          freeSolo
                          options={userList}
                          getOptionLabel={(option) =>
                            typeof option === "string"
                              ? option
                              : `${option.firstName} ${option.lastName}`
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Search user"
                              variant="outlined"
                              size="small"
                              sx={{
                                ".MuiInputLabel-root": { fontSize: "14px" }, // Adjusts the label font size
                                ".MuiOutlinedInput-root": { fontSize: "14px" },
                              }}
                            />
                          )}
                          onInputChange={(event, value) => {
                            // Handle free solo input change if necessary
                          }}
                          onChange={(event, value) => {
                            if (typeof value === "string") {
                              // For free solo input, update directly with the value
                              setSelectedUserApproval(value);
                              setSelectedUserApproval(""); // Clear or handle as needed for free solo value
                              field.onChange(value); // Ensure the field value is updated
                            } else if (value && "email" in value) {
                              // For selected object, update with formatted name and call handleUserApproval
                              const formattedName = `${value.firstName} ${value.lastName}`;
                              setSelectedUserApproval(formattedName);
                              handleUserApproval(value.email);
                              field.onChange(formattedName); // Update field value with formatted name
                            }
                          }}
                        />
                      </FormControl>
                    )}
                  />
                )}
                {userApproval.length > 0 &&
                  (showSignatories === "" || showSignatories === "edit") && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: "0.5rem",
                        marginTop: "1rem",
                      }}
                    >
                      {showSignatories !== "edit" && (
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
                            padding: "2px 5px !important", // Force padding
                            height: "25px !important", // Reduce minimum height
                            fontSize: "0.675rem", // Adjust font size if necessary
                          }}
                          onClick={() => {
                            setSignatories([]),
                              setSelectedApprovalId(""),
                              setShowSignatories(""),
                              setApprovers([]);
                            setShowCompanySelect(false);
                            setShowConditionalSelect(false);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
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
                        onClick={() => setShowSignatories("topbar")} // Toggle visibility
                      >
                        Save
                      </Button>
                    </div>
                  )}

                {showSignatories === "view" &&
                  userApproval.map((signatory: any, index: any) => (
                    <Box
                      key={index}
                      sx={{
                        // display: "flex",
                        alignItems: "center",
                        mb: 1,
                        mt: 1,
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        {index + 1} &nbsp;
                        <Box
                          sx={{
                            width: 25,
                            height: 25,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            backgroundColor:
                              bubbleColors[index % bubbleColors.length],
                            color: "#FFFFFF",
                            marginRight: -1,

                            mr: 1,
                          }}
                        >
                          <Typography sx={{ fontSize: "14px" }}>
                            {signatory?.charAt(0).toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            // fontWeight: "bold",
                            width: "130px",
                            textOverflow: "ellipsis",
                            fontSize: "16px",
                          }}
                        >
                          {signatory}
                        </Typography>
                      </div>
                      <div style={{ display: "flex" }}>
                        {signatory?.status ? (
                          <Typography
                            variant="body1"
                            sx={{
                              ml: 4,
                              display: "flex",
                              // fontWeight: "bold",
                              color:
                                signatory?.status === "Rejected"
                                  ? "red"
                                  : signatory?.status === "Approved"
                                  ? "green"
                                  : "inherit", // Default text color
                            }}
                          >
                            {signatory?.status === "Rejected" && (
                              <Tooltip title={signatory?.reason}>
                                <img
                                  onClick={() =>
                                    handleDialogSubmit("", "", signatory, "")
                                  }
                                  src={send}
                                  alt="Logo"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "1rem",
                                  }}
                                />
                              </Tooltip>
                            )}{" "}
                            {signatory?.status}
                          </Typography>
                        ) : (
                          <>
                            <Tooltip title="Approve">
                              <Button
                                variant="text"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "16px",
                                  color: "#31C65B",
                                  fontWeight: "bold",
                                  padding: "0 8px", // Reduce padding here
                                  minWidth: "auto",
                                  ml: 5.5, // Ensures the button width is only as wide as its content
                                }}
                                onClick={() =>
                                  handleDialogSubmit(
                                    "Approved",
                                    "",
                                    signatory,
                                    ""
                                  )
                                }
                              >
                                <CheckCircleOutlineIcon fontSize="medium" />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <Button
                                variant="text"
                                sx={{
                                  textTransform: "none",
                                  fontSize: "16px",
                                  color: "#BEBEBE",
                                  fontWeight: "bold",
                                  padding: "0 8px", // Style adjustments as needed
                                  minWidth: "auto", // Ensures button width is only as wide as its content
                                }}
                                onClick={() => handleOpenDialog(signatory)}
                              >
                                <HighlightOffIcon />{" "}
                              </Button>
                            </Tooltip>
                            <Tooltip title="Send">
                              <img
                                onClick={() =>
                                  handleDialogSubmit("", "", signatory, "")
                                }
                                src={send}
                                alt="Logo"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginLeft: "0.6rem",
                                  marginTop: "0.2rem",
                                }}
                              />
                            </Tooltip>
                          </>
                        )}
                        {signatory?.reason && (
                          <Tooltip title={signatory?.reason}>
                            <img
                              onClick={() => handleOpenDialog(signatory)}
                              src={warnig}
                              alt="Logo"
                              style={{
                                width: "20px",
                                height: "20px",
                                marginTop: "-0.4rem",
                                marginLeft: "1rem",
                              }}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </Box>
                  ))}
              </>
            )}

            {selectedApproval === "conditional" && (
              <>
                {(showSignatories === "topbar" ||
                  showSignatories === "view" ||
                  userConditionalApproval.length ||
                  showSignatories === "edit") && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="text"
                      sx={{ textTransform: "none" }}
                      onClick={() =>
                        setShowSignatories((prev: any) =>
                          prev === "view" ? "view" : "view"
                        )
                      }
                    >
                      View
                    </Button>
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          // setSignatories([]),
                          // setSelectedApprovalId(""),
                          setShowSignatories("edit");
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          setSignatories([]), setSelectedApproval("");
                          setSeletedFeild(""),
                            setShowSignatories(""),
                            setConditions([]);
                          setShowCompanySelect(false);
                          setShowConditionalSelect(false);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}

                {!(
                  (conditions.some(
                    (condition: any) => condition.userSelection?.length > 0
                  ) &&
                    showSignatories === "topbar") ||
                  showSignatories === "view"
                ) && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <Box
                        sx={{
                          border: "1px solid #C2C2C2",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          marginRight: "8px",
                          color:
                            showSignatories === "view" ? "gray" : "#155BE5",
                          marginBottom: "0.5rem",
                          borderRadius: "4px",
                          fontSize: "12.5px",
                        }}
                      >
                        If
                      </Box>
                      <FormControl fullWidth size="small" sx={{ mt: 0, mb: 1 }}>
                        <Select
                          disabled={showSignatories === "view"}
                          style={{ fontSize: "12.5px" }}
                          value={selectedFeild}
                          onChange={(event: any) =>
                            setSeletedFeild(event.target.value)
                          }
                          displayEmpty
                          renderValue={(selectedValue) => {
                            return selectedValue === "" ? (
                              <em
                                style={{
                                  color: "#C2C2C2",
                                  fontStyle: "normal",
                                  fontSize: "12.5px",
                                }}
                              >
                                Select custom field
                              </em>
                            ) : (
                              (() => {
                                const foundTeam = feildList.find(
                                  (team) => team._id === selectedValue
                                );
                                if (foundTeam) {
                                  // Set the type in state
                                  setType(foundTeam.type);
                                  return `${foundTeam.name}`;
                                } else {
                                  return (
                                    <div
                                      style={{
                                        color: "#C2C2C2",
                                        fontStyle: "normal",
                                        fontSize: "12.5px",
                                      }}
                                    >
                                      Not found
                                    </div>
                                  );
                                }
                              })()
                            );
                          }}
                        >
                          {feildList.map((approval) => (
                            <MenuItem key={approval._id} value={approval._id}>
                              {approval.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    {conditions.map((condition: any, index: any) => (
                      <div key={index} className="condition-item">
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => removeCondition(index)}
                            size="small"
                            className="remove-btn" // Apply the CSS class
                          >
                            <CloseIcon
                              sx={{ fontSize: "small", color: "red" }}
                            />
                          </IconButton>
                        </Tooltip>

                        {type && (
                          <>
                            <Box
                              sx={{
                                gap: "10px",
                                alignItems: "center",
                                display: "flex",
                                mt: 1,
                              }}
                            >
                              {type === "number" ? (
                                <FormControl
                                  size="small"
                                  sx={{ width: "100%" }}
                                >
                                  <Select
                                    disabled={showSignatories === "view"}
                                    style={{ fontSize: "11.5px" }}
                                    value={condition.comparisonOperator}
                                    onChange={(event) =>
                                      handleComparisonOperatorChange(
                                        index,
                                        event
                                      )
                                    }
                                    displayEmpty
                                    renderValue={(selectedValue) =>
                                      selectedValue === "" ? (
                                        <em
                                          style={{
                                            color: "#C2C2C2",
                                            fontStyle: "normal",
                                            fontSize: "10.5px",
                                          }}
                                        >
                                          Select condition
                                        </em>
                                      ) : (
                                        selectedValue
                                      )
                                    }
                                  >
                                    <MenuItem value="greater or equal to">
                                      greater or equal to
                                    </MenuItem>
                                    <MenuItem value="equals">equals</MenuItem>
                                    <MenuItem value="does not equal">
                                      does not equal
                                    </MenuItem>
                                    <MenuItem value="less than">
                                      less than
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              ) : (
                                <FormControl
                                  size="small"
                                  sx={{ width: "100%" }}
                                >
                                  <Select
                                    disabled={showSignatories === "view"}
                                    style={{ fontSize: "11.5px" }}
                                    value={condition.comparisonOperator}
                                    onChange={(event) =>
                                      handleComparisonOperatorChange(
                                        index,
                                        event
                                      )
                                    }
                                    displayEmpty
                                    renderValue={(selectedValue) =>
                                      selectedValue === "" ? (
                                        <em
                                          style={{
                                            color: "#C2C2C2",
                                            fontStyle: "normal",
                                            fontSize: "10.5px",
                                          }}
                                        >
                                          Select condition
                                        </em>
                                      ) : (
                                        selectedValue
                                      )
                                    }
                                  >
                                    <MenuItem value="Contains">
                                      Contains
                                    </MenuItem>
                                    <MenuItem value="equal">equal</MenuItem>
                                    <MenuItem value="does not equal">
                                      does not equal
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              )}

                              <TextField
                                disabled={showSignatories === "view"}
                                placeholder="Value"
                                value={condition.value}
                                size="small"
                                onChange={(event) =>
                                  handleValueChange(index, event)
                                }
                                style={{
                                  flexGrow: 1,
                                  width: "50%",
                                }}
                                InputProps={{
                                  style: { fontSize: "11px" }, // Directly sets the input text font size
                                }}
                              />
                            </Box>
                            {!viewUser && (
                              <Box
                                sx={{
                                  display: "flex",
                                  mt: 1,
                                  mb: 1,
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Button
                                  variant="text"
                                  sx={{ textTransform: "none", mt: 1 }}
                                  // onClick={handleCompanyApprovalClick}
                                >
                                  Get approval from
                                </Button>

                                <Button
                                  variant="outlined"
                                  color="primary"
                                  disabled={
                                    !condition.value ||
                                    !condition.comparisonOperator
                                  }
                                  sx={{
                                    textTransform: "none",
                                    mt: 1,
                                    padding: "2px 5px !important",
                                    height: "34px !important",
                                    fontSize: "0.85rem",
                                    width: "32%",
                                  }}
                                  onClick={() =>
                                    setViewUser((prevState: any) => !prevState)
                                  }
                                >
                                  &nbsp;
                                  <PersonAddIcon />
                                  &nbsp;
                                </Button>
                              </Box>
                            )}
                          </>
                        )}
                        {viewUser && (
                          <>
                            <Autocomplete
                              disabled={showSignatories === "view"}
                              size="small"
                              options={userList}
                              getOptionLabel={(option) =>
                                `${option.firstName} ${option.lastName}`
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Search user"
                                  variant="outlined"
                                  size="small"
                                  sx={{ mt: 2 }}
                                  InputProps={{
                                    ...params.InputProps,
                                    style: { fontSize: 12 }, // Adjust input text font size
                                  }}
                                  InputLabelProps={{
                                    style: { fontSize: 12, color: "gray" }, // Adjust label font size here
                                  }}
                                />
                              )}
                              onChange={(event, newValue) => {
                                handleUserSelectionChange(index, newValue);
                              }}
                              value={
                                condition.userDisplayName
                                  ? {
                                      firstName:
                                        condition.userDisplayName.split(" ")[0],
                                      lastName:
                                        condition.userDisplayName.split(" ")[1],
                                      email: condition.userSelection,
                                    }
                                  : null
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.email === value.email
                              }
                            />
                          </>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="text"
                      color="primary"
                      sx={{ textTransform: "none" }}
                      onClick={addCondition}
                      disabled={showSignatories === "view"}
                    >
                      + Add Condition
                    </Button>
                  </>
                )}
                {conditions.some(
                  (condition: any) => condition.userSelection?.length > 0
                ) &&
                  showSignatories === "view" && (
                    <div
                      style={{ justifyContent: "center", marginLeft: "10px" }}
                    >
                      <Typography
                        variant="body2"
                        color="#8A8A8A"
                        sx={{ fontSize: "14px", mt: 1 }}
                      >
                        {
                          feildList?.find((val) => val._id === selectedFeild)
                            ?.name
                        }
                      </Typography>
                      {conditions.map((val: any, index: number) => (
                        <>
                          <Typography
                            variant="body2"
                            color="#8A8A8A"
                            sx={{ fontSize: "11px", mt: 1 }}
                          >
                            {val?.comparisonOperator} {val?.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#8A8A8A"
                            sx={{ fontSize: "11px", mt: 1, display: "flex" }}
                          >
                            get approval from
                            <Tooltip title={val?.userDisplayName}>
                              <Box
                                sx={{
                                  width: 25,
                                  height: 25,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  backgroundColor: "#DCDCDC",
                                  // bubbleColors[index % bubbleColors.length],
                                  color: "#FFFFFF",
                                  marginLeft: 1,
                                  marginTop: -0.5,
                                }}
                              >
                                <Typography sx={{ fontSize: "14px" }}>
                                  {val?.userDisplayName
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Typography>
                        </>
                      ))}
                    </div>
                  )}
                {conditions.some(
                  (condition: any) => condition.userSelection?.length > 0
                ) && (
                  <>
                    <div>
                      {showSignatories === "topbar" &&
                        conditions?.map((conditions: any, index: any) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              mb: 1,
                              mt: 1,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {index + 1} &nbsp;
                              <Box
                                sx={{
                                  width: 25,
                                  height: 25,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    bubbleColors[index % bubbleColors.length],
                                  color: "#FFFFFF",
                                  marginRight: 1,
                                }}
                              >
                                <Typography sx={{ fontSize: "14px" }}>
                                  {conditions?.userSelection
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  width: "160px",
                                  // overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "15px",
                                }}
                              >
                                {conditions?.userSelection}
                              </Typography>
                            </div>
                            {/* <Box sx={{ display: "flex", mt: 1 }}>
                              <Tooltip title="Approve">
                                <Button
                                  variant="text"
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "16px",
                                    color: "#31C65B",
                                    fontWeight: "bold",
                                    padding: "0 8px",
                                    minWidth: "auto",
                                    "&:first-of-type": {
                                      ml: 2.5, // Only applies margin-left to the first button
                                    },
                                  }}
                                  onClick={() =>
                                    handleRemoveSignatory(
                                      conditions?.userSelection
                                    )
                                  } // Assuming true signifies approval
                                >
                                  <CheckCircleOutlineIcon />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <Button
                                  variant="text"
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "16px",
                                    color: "#BEBEBE",
                                    fontWeight: "bold",
                                    padding: "0 8px",
                                    minWidth: "auto",
                                  }}
                                  onClick={() =>
                                    handleRemoveSignatory(
                                      conditions?.userSelection
                                    )
                                  } // Assuming false signifies removal
                                >
                                  <HighlightOffIcon />
                                </Button>
                              </Tooltip>
                            </Box> */}
                            <div style={{ display: "flex" }}>
                              {conditions?.status ? (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    ml: 4,
                                    display: "flex",
                                    // fontWeight: "bold",
                                    color:
                                      conditions?.status === "Rejected"
                                        ? "red"
                                        : conditions?.status === "Approved"
                                        ? "green"
                                        : "inherit", // Default text color
                                  }}
                                >
                                  {conditions?.status === "Rejected" && (
                                    <Tooltip title={conditions?.reason}>
                                      <img
                                        onClick={() =>
                                          handleDialogSubmit(
                                            "",
                                            "",
                                            conditions,
                                            ""
                                          )
                                        }
                                        src={send}
                                        alt="Logo"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          marginRight: "1rem",
                                        }}
                                      />
                                    </Tooltip>
                                  )}{" "}
                                  {conditions?.status}
                                </Typography>
                              ) : (
                                <>
                                  <Tooltip title="Approve">
                                    <Button
                                      variant="text"
                                      sx={{
                                        textTransform: "none",
                                        fontSize: "16px",
                                        color: "#31C65B",
                                        fontWeight: "bold",
                                        padding: "0 8px", // Reduce padding here
                                        minWidth: "auto",
                                        ml: 5.5, // Ensures the button width is only as wide as its content
                                      }}
                                      onClick={() =>
                                        handleDialogSubmit(
                                          "Approved",
                                          "",
                                          conditions,
                                          ""
                                        )
                                      }
                                    >
                                      <CheckCircleOutlineIcon fontSize="medium" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <Button
                                      variant="text"
                                      sx={{
                                        textTransform: "none",
                                        fontSize: "16px",
                                        color: "#BEBEBE",
                                        fontWeight: "bold",
                                        padding: "0 8px", // Style adjustments as needed
                                        minWidth: "auto", // Ensures button width is only as wide as its content
                                      }}
                                      onClick={() =>
                                        handleOpenDialog(conditions)
                                      }
                                    >
                                      <HighlightOffIcon />{" "}
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title="Send">
                                    <img
                                      onClick={() =>
                                        handleDialogSubmit(
                                          "",
                                          "",
                                          conditions,
                                          ""
                                        )
                                      }
                                      src={send}
                                      alt="Logo"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginLeft: "0.6rem",
                                        marginTop: "0.2rem",
                                      }}
                                    />
                                  </Tooltip>
                                </>
                              )}
                              {conditions?.reason && (
                                <Tooltip title={conditions?.reason}>
                                  <img
                                    onClick={() => handleOpenDialog(conditions)}
                                    src={warnig}
                                    alt="Logo"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      marginTop: "-0.4rem",
                                      marginLeft: "1rem",
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </div>
                          </Box>
                        ))}
                    </div>
                  </>
                )}

                {conditions.some(
                  (condition: any) => condition.userSelection?.length > 0
                ) &&
                  (showSignatories === "" || showSignatories === "edit") && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {showSignatories !== "edit" && (
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
                            setSignatories([]),
                              setShowSignatories(""),
                              setSeletedFeild(""),
                              setConditions([]),
                              setShowCompanySelect(false);
                            setShowConditionalSelect(false);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        type="submit"
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
                        onClick={() => setShowSignatories("topbar")} // Toggle visibility
                      >
                        Save
                      </Button>
                    </div>
                  )}
              </>
            )}
          </React.Fragment>
        )}
        <FormControlLabel
          sx={{
            mt: "3rem",
            "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
            // Apply any additional styling you need for the FormControlLabel here
          }}
          control={
            <Checkbox
              checked={notifyApprovers}
              onChange={handleCheckboxChange}
              name="notifyApprovers"
              color="primary"
              sx={{
                padding: "5px", // Adjusts padding around the checkbox
                "& .MuiSvgIcon-root": {
                  // Targets the SVG icon representing the checkbox
                  fontSize: "18px", // Adjust this value to scale the icon size
                },
              }}
            />
          }
          label="Automatically notify next approvers when a step is complete."
        />
      </div>
      <ApprovalReasionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        dialogData={dialogData}
      />
      <ApprovalAlertDialog
        open={openAlertDialog}
        onClose={handleAlertCloseDialog}
        // onSubmit={handleDialogSubmit}
        // dialogData={dialogData}
      />
    </div>
  );
};

export default ApprovalsComp;
