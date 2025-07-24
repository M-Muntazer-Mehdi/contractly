/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
  Box,
  FormControl,
  Select,
  MenuItem,
  Card,
  Tab,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { getList } from "@/service/api/clauses";
import ShareIcon from "@mui/icons-material/Share";
import { getUserListNameID } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { TextareaAutosize } from "@mui/material";
import { ContractContext } from "@/context/ContractContext";
import CollaburaterDilog from "@/pages/dasboard/contract/sdk/CollaburaterDilog";
import DocumentNameErrorDial from "@/pages/dasboard/contract/sdk/DocumentNameErrorDial";

const Discussion = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();

  const { user } = useAuth();
  const {
    activeSection,
    setActiveSection,
    // showButtons,
    // setShowButtons,
    collaborater,
    setCollaborater,
    comments,
    setComments,
    documentName,
  } = useContext(ContractContext);

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [isInternal, setIsInternal] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [openErrorNameDilog, setOpenErrorNameDilog] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [ClickData, setClickData] = useState("");
  const [message, setMessage] = useState(""); // State for the message input
  // State to track if the comment is internal or external

  const handleSendMessage = () => {
    // Create a new comment object
    console.log(user.firstName);

    const newComment = {
      message,
      isInternal,
      name: user?.firstName,
      userId: user?._id,
      date: new Date().toLocaleString(),
    };

    // Update the comments state to include the new comment
    setComments([...comments, newComment]);

    // Clear the input field
    setMessage("");
  };
  function formatTimeAgo(date: Date | string) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    let interval = seconds / 31536000; // 365 * 24 * 60 * 60

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000; // 30 * 24 * 60 * 60
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400; // 24 * 60 * 60
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600; // 60 * 60
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return "Just now";
  }
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  // Adjust handleAddSignatory to also update the selectedValue
  const handleAddSignatory = (newSignatory: any) => {
    // Check if the email already exists in the collaborater array
    const emailExists = collaborater.some(
      (collaborator: any) => collaborator.email === newSignatory.email
    );
    if (!emailExists) {
      setCollaborater((prev: any) => [
        ...prev,
        newSignatory.email
          ? {
              email: newSignatory.email,
              label: newSignatory.label,
              isInternal: true,
            }
          : { email: newSignatory, isInternal: false },
      ]);
      reset(); // Resetting form
      setInputValue(""); // Clearing the input value for Autocomplete
      setSelectedValue(null);
    }
    // if (newSignatoryEmail && !emailExists) {

    //   setCollaborater((prev: any) => [...prev, { email: newSignatoryEmail }]);
    //   reset(); // Resetting form
    //   setInputValue(""); // Clearing the input value for Autocomplete
    //   setSelectedValue(null); // Resetting selected value
    // }
  };

  // Function to remove a signatory from the list
  const handleRemoveSignatory = (signatoryToRemove: any) => {
    setCollaborater(
      collaborater.filter(
        (signatory: any) => signatory.email !== signatoryToRemove
      )
    );
  };

  const handleShareDilog = (signatory: any) => {
    if (!documentName) {
      setOpenErrorNameDilog(true);
      return;
    }
    setOpenDialog(true);
    const user = userList.find((user) => user.email === signatory?.email);
    if (user) {
      setClickData(user);
    } else {
      setClickData(signatory);
    }
  };

  // Handle input change to track current value
  const handleInputChange = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
  };

  // Handle "Enter" key press in the input
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddSignatory(inputValue);
    }
  };
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
  const handleRemove = (emailToRemove: any) => {
    // Update collaboraters by removing the 'permission' property from the specified collaborator
    const updatedCollaboraters = collaborater.map((colb: any) => {
      if (colb.email === emailToRemove) {
        // Destructure to separate 'permission' and the rest of the properties
        const { permission, ...rest } = colb;
        // Return the rest, effectively omitting 'permission'
        return rest;
      }
      // Return unchanged if not the one being removed
      return colb;
    });

    // Update your state here with updatedCollaboraters
    // Assuming you're managing the collaborater array in a state
    setCollaborater(updatedCollaboraters);
  };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  return (
    <>
      <div>
        <Typography
          variant="subtitle1"
          color="black"
          sx={{ whiteSpace: "nowrap" }}
        >
          Share Document
        </Typography>
        <Divider sx={{ mt: 0.1, mb: 0.7, pl: -1, background: "#174B8B" }} />
        <Box
          sx={{
            display: "flex",
            mb: 2,
            // borderBottom: 1,
            // borderColor: "divider",
          }}
        >
          <Button
            style={{}}
            sx={{
              width: "100%",
              fontSize: "14px",
              whiteSpace: "nowrap",

              textTransform: "none !important",
              // borderBottom: activeSection === "collaborate" ? 2 : 0,
              borderColor:
                activeSection === "collaborate" ? "#174B8B" : "transparent",
              borderRadius: 0, // Remove border radius to mimic tab appearance
              color: activeSection === "collaborate" ? "#155BE5" : "black",
              fontWeight: activeSection === "collaborate" ? "bold" : "normal",
              "&:hover": {
                borderBottom: 2,
                borderColor: "#174B8B",
                backgroundColor: "transparent",
              },
            }}
            onClick={() => {
              setActiveSection("collaborate"), setShowButtons(true);
              setSelectedValue(null), setInputValue("");
            }}
          >
            + Add Collaborator
          </Button>

          <Button
            fullWidth
            sx={{
              width: "90%",
              whiteSpace: "nowrap",
              fontSize: "14px",
              textTransform: "none",
              ml: 2,

              // borderBottom: activeSection === "message" ? 2 : 0,
              borderColor:
                activeSection === "message" ? "#174B8B" : "transparent",
              borderRadius: 0,
              color: activeSection === "message" ? "#155BE5" : "black",
              fontWeight: activeSection === "message" ? "bold" : "normal",
              "&:hover": {
                borderBottom: 2,
                borderColor: "#174B8B",
                backgroundColor: "transparent",
              },
            }}
            onClick={() => {
              setActiveSection("message"),
                setIsInternal(""),
                setShowButtons(true);
            }}
          >
            + Add Message
          </Button>
        </Box>

        {activeSection === "collaborate" && (
          <>
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
                    if (value) {
                      setSelectedValue(value); // Only update selectedValue when a new value is selected
                    } else {
                      setSelectedValue(null); // Reset if no value is selected
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search by name or add email" // Use placeholder
                      margin="normal"
                      size="small"
                      onKeyPress={handleKeyPress}
                      InputLabelProps={{
                        shrink: false,
                        style: { display: "none" }, // Hide label by default
                      }}
                      variant="standard"
                      sx={{
                        ".MuiOutlinedInput-root": {
                          fontSize: "14px",
                          "& fieldset": {
                            borderBottom: "1px solid #174B8B", // Make bottom border thicker
                          },
                          "&:hover fieldset": {
                            borderBottom: "1px solid #174B8B", // Make bottom border thicker
                          },
                          "&.Mui-focused fieldset": {
                            borderBottom: "1px solid #174B8B", // Make bottom border thicker
                          },
                        },
                      }}
                    />
                  )}
                />

                <div style={{ flex: 1, textAlign: "right", marginTop: "10px" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      mr: "20px",
                      textTransform: "none",

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
                    variant="outlined"
                    color="success"
                    disabled={!selectedValue && !inputValue.trim()}
                    sx={{
                      textTransform: "none",

                      padding: "2px 5px !important",
                      height: "25px !important",
                      fontSize: "0.675rem",
                    }}
                    onClick={() => {
                      if (selectedValue || inputValue.trim() !== "") {
                        handleAddSignatory(
                          selectedValue ? selectedValue : inputValue
                        );
                      }
                      setShowButtons(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}

            {collaborater?.map((colb: any, index: any) => {
              return (
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
                      <Typography sx={{ fontSize: "10px" }}>
                        {colb?.isInternal ? (
                          <>
                            {colb.label
                              .split(" ")
                              .filter(Boolean)
                              .map((name: any) => name[0].toUpperCase())
                              .join("")}
                          </>
                        ) : (
                          <> {colb?.email?.charAt(0).toUpperCase()} </>
                        )}
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
                      {colb?.email}
                    </Typography>
                  </div>
                  <Box sx={{ display: "flex", mt: 1 }}>
                    <Button
                      variant="text"
                      color="inherit"
                      sx={{
                        textTransform: "none",
                        // backgroundColor: "#DCDCDC",
                        // "&:hover": {
                        //   backgroundColor: "#757575",
                        // },
                        "&:first-of-type": {
                          // Only applies margin-left to the first button
                        },
                        color: "black",
                        padding: "0px 5px !important",
                        height: "25px !important",
                        fontSize: "0.675rem",
                        ml: 2.6,
                      }}
                    >
                      {colb?.isInternal ? " Internal" : "External"}
                    </Button>

                    <IconButton
                      aria-label="delete" // Providing an accessible label is important for assistive technologies
                      color="error"
                      // size="small" // Makes the button smaller; options are "small", "medium" (default), and "large"
                      onClick={() => handleRemoveSignatory(colb?.email)}
                      sx={{
                        mt: -1,
                        ml: 1,
                      }}
                    >
                      <DeleteIcon /> {/* Adjust the icon size if needed */}
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", mt: -0.5 }}>
                    <Button
                      variant="text"
                      sx={{
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        color: "#155BE5",
                        fontSize: "14px",
                      }}
                      onClick={() => handleShareDilog(colb)}
                    >
                      {colb.permission ? "Document Shared" : "Share Document"}
                    </Button>
                    {colb.permission && (
                      <Button
                        variant="text"
                        color="error"
                        sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                        onClick={() => handleRemove(colb?.email)}
                      >
                        Remove Access
                        {/* {colb.permission ? "Document Shared" : "Share Document"} */}
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })}

            <div />
          </>
        )}

        {activeSection === "message" && (
          <Box>
            {showButtons && (
              <>
                <div
                  style={{
                    width: "100%",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        whiteSpace: "nowrap",
                        "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                        // Apply any additional styling you need for the FormControlLabel here
                      }}
                      control={
                        <Checkbox
                          checked={isInternal === false}
                          onChange={() => setIsInternal(false)}
                          sx={{
                            padding: "5px", // Adjusts padding around the checkbox
                            "& .MuiSvgIcon-root": {
                              // Targets the SVG icon representing the checkbox
                              fontSize: "18px", // Adjust this value to scale the icon size
                            },
                          }}
                        />
                      }
                      label="Visible to everyone on the document"
                    />
                    <FormControlLabel
                      sx={{
                        whiteSpace: "nowrap",
                        "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                        // Apply any additional styling you need for the FormControlLabel here
                      }}
                      control={
                        <Checkbox
                          checked={isInternal === true}
                          onChange={() => setIsInternal(true)}
                          sx={{
                            padding: "5px", // Adjusts padding around the checkbox
                            "& .MuiSvgIcon-root": {
                              // Targets the SVG icon representing the checkbox
                              fontSize: "18px", // Adjust this value to scale the icon size
                            },
                          }}
                        />
                      }
                      label="Internal"
                    />
                  </div>
                </div>
                <Box sx={{ mb: 2, mt: 2, alignItems: "center" }}>
                  <textarea
                    disabled={isInternal === ""}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add your message..."
                    maxLength={100}
                    rows={1}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      fontSize: "13px",
                      lineHeight: "20px", // Adjust line-height for better vertical alignment
                      padding: "10px 10px", // Adjust vertical padding to help center the text
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      resize: "block",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        mr: "20px",
                        textTransform: "none",
                        padding: "2px 5px !important",
                        height: "25px !important",
                        fontSize: "0.675rem",
                      }}
                      onClick={() => {
                        setMessage("");
                        setIsInternal("");
                        setShowButtons(false);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      color="success"
                      disabled={!message}
                      sx={{
                        textTransform: "none",

                        padding: "2px 5px !important",
                        height: "25px !important",
                        fontSize: "0.675rem",
                      }}
                      onClick={() => {
                        handleSendMessage(), setShowButtons(false);
                      }}
                    >
                      Post
                    </Button>
                  </div>
                </Box>
              </>
            )}

            <div>
              {comments.map((comment: any, index: any) => {
                // Render all comments if user.email exists, otherwise render only external comments
                if (user.email || (!user.email && !comment.isInternal)) {
                  return (
                    <Box key={index} sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {comment.name}
                      </Typography>

                      <Box sx={{ display: "flex", mt: 0.5, mb: 1 }}>
                        <Button
                          variant="text"
                          color="inherit"
                          sx={{
                            textTransform: "none",

                            color: "black",
                            padding: "2px 5px !important",
                            height: "20px !important",
                            fontSize: "0.675rem",
                            ml: -1,
                          }}
                        >
                          {comment.isInternal ? "Internal" : "External"}
                        </Button>

                        <div
                          style={{
                            color: "#BDBDBD",
                            fontSize: "11px",
                            marginLeft: "1rem",
                            marginTop: "0.2rem",
                          }}
                        >
                          {formatTimeAgo(comment.date)}
                        </div>
                      </Box>

                      <Card
                        sx={{
                          color: "#BDBDBD",
                          padding: 1,
                          fontSize: "12px",
                        }}
                      >
                        {comment.message}
                      </Card>
                    </Box>
                  );
                }
                return null;
              })}
            </div>
          </Box>
        )}
      </div>
      <CollaburaterDilog
        open={openDialog}
        onClose={handleCloseDialog}
        ClickData={ClickData}
      />
      <DocumentNameErrorDial
        open={openErrorNameDilog}
        onClose={() => setOpenErrorNameDilog(false)}
        ClickData={ClickData}
      />
      {/* <CollaburaterDilog
        // onButtonClick={handleNextStep}
        onClose={handleCloseDialog}
        handleCloseDialog={handleCloseDialog}
      /> */}
    </>
  );
};

export default Discussion;
