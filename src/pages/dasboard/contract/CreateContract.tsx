/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useState, useCallback, useEffect, useContext } from "react";

import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  MenuItem,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { create } from "@/service/api/clauses";

import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { getList } from "@/service/api/template";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import mammoth from "mammoth";
import { ContractContext } from "@/context/ContractContext";
import UplodTrackFileDilog from "@/pages/dasboard/contract/UplodTrackFileDilog";
import { getListTemlate } from "@/service/api/contract";

const CreateContract = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    setDucomentName,
    setShowBlock,
    setUplodTrackFile,
    setDocumentContent,
    setContract,
    setLifecycleData,
    setSidebarExpanded,
    setFormState,
    setEditMode,
    setIsTemplate,
    setPages,
    setBgColorSvg,
    setSelectedFont,
    setSelectedFontValue,
    setSelectedFontSize,
    setSelectedFontSizeValue,
    setPrevBgColor,
    setPrevFontColor,
  } = useContext(ContractContext);

  // const workerUrl =
  //   "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
  const [showPopup, setShowPopup] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectDocoment, setSelectDocoment] = useState("");
  const [selectionField, setSelectionField] = useState("");
  const [TemplateList, setTemplateList] = useState<Array<any>>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>("");
  const [inputFocused, setInputFocused] = useState(false);
  const triggerClick = async () => {
    navigate("/dashboard/editor-dahsbord", {
      state: { openFileChooser: true },
    });
    setShowBlock("uploadTrack");
    setDocumentContent("word");
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.type === "application/pdf") {
      const fileName = file.name;
      console.log("Uploaded file name:", fileName);
      setDucomentName(fileName);
      setShowBlock("uploadTrack");
      navigate("/dashboard/editor-dahsbord");
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Handle DOCX files with Mammoth
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const arrayBuffer = event.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setDocumentContent(result.value);
      };
      reader.readAsArrayBuffer(file);
      navigate("/dashboard/editor-dahsbord", {
        state: { openFileChooser: true },
      });
      setShowBlock("uploadTrack");
    } else if (file.type === "application/msword") {
      // Handle DOC files here (you may need a server-side conversion)
      toast.error("DOC file support is limited. Please convert to DOCX.");
    } else {
      toast.error("Only PDF, DOCX, and DOC files are allowed");
      setUplodTrackFile(null);
      setDocumentContent(null);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // accept: ["image/*", ".pdf", ".doc", ".docx", ".txt"] as Accept,
  }) as any;

  const listFeildData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getListTemlate(user?._id);
      setTemplateList(data);

      console.log("data", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listFeildData();
    setDocumentContent(null);
    setUplodTrackFile(null);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };
  // console.log(selectedTemplate?._id, "selectedTemplate");

  const handleCreateDocument = () => {
    setShowBlock("");
    setPages([{ content: "" }]);
    setBgColorSvg("#fefefe");
    setPrevBgColor("#fefefe");
    setSelectedFontSize("12px");
    setSelectedFontSizeValue("12px");
    setSelectedFontValue("arial");
    setSelectedFont("arial");
    setPrevFontColor("black");
    setDucomentName("");
  };

  return (
    <>
      {/* {isLoading && (
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
      )} */}

      <Box
        sx={{
          opacity: isLoading ? "30%" : "100%",
          pl: 2,
          pb: 1,
          pr: 2,
          pt: 1,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#F7F7F7",
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
              sx={{
                color: "#43464C",
                fontSize: "23px",
                paddingBottom: "4px",
                fontWeight: 500,
              }}
            >
              New Document
            </Typography>

            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                mt: -2,
                mb: 2,
                fontSize: "13px",
                color: "#43464C",
                position: "relative",
                top: "8px",
              }}
            >
              <Link
                style={{
                  marginRight: "-7px",
                  color: "#43464C",
                  fontSize: "13px",
                }}
                to="/dashboard/contract-list"
                className="link-no-underline"
              >
                Home
              </Link>
              {selectDocoment == "" ? (
                <Typography
                  sx={{ fontSize: "13px", ml: "-7px", color: "#43464C" }}
                  color="text.primary"
                >
                  Select
                </Typography>
              ) : (
                <Typography
                  sx={{ fontSize: "13px", ml: "-7px", color: "#43464C" }}
                  color="text.primary"
                >
                  {selectDocoment}
                </Typography>
              )}
            </Breadcrumbs>
          </Box>
        </div>
      </Box>

      {selectDocoment == "" ? (
        <>
          <Paper
            sx={{
              display: "table",
              width: "100%",
              background: "#FFF",
              pl: "-1rem",
              // borderTop: "0.5px solid #174B8B", // Add a top border
              // borderBottom: "0.5px solid #174B8B",

              marginBottom: "1rem",
            }}
          >
            <Box
              sx={{
                background: "#FFFFFF",
                p: 2,
                fontSize: "16px",
                color: "#43464C",
                height: "50px",
              }}
            >
              Select to Start
            </Box>
          </Paper>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ background: "#F7F7F7" }}
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: "42px" }}
              >
                <Button
                className="contract-boxes"

                  variant="outlined"
                  component={Link}
                  to="/dashboard/editor-dahsbord"
                  onClick={handleCreateDocument}
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    maxHeight: "140px",
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    width: "600px",
                    borderWidth: 1,
                    borderStyle: "solid",
                    border: "2px solid #EEE",
                    borderRadius: "5px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "45px", marginRight: "52px" }}>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          viewBox="0 0 80 80"
                          fill="none"
                        >
                          <path
                            d="M46.6666 6.66667H19.9999C18.2318 6.66667 16.5361 7.36905 15.2859 8.61929C14.0356 9.86954 13.3333 11.5652 13.3333 13.3333V66.6667C13.3333 68.4348 14.0356 70.1305 15.2859 71.3807C16.5361 72.631 18.2318 73.3333 19.9999 73.3333H59.9999C61.768 73.3333 63.4637 72.631 64.714 71.3807C65.9642 70.1305 66.6666 68.4348 66.6666 66.6667V26.6667L46.6666 6.66667Z"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M46.6667 6.66667V26.6667H66.6667"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M40 60V40"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M30 50H50"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "table",
                        position: "relative",
                        top: "15px",
                      }}
                    >
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              color: "#43464C",
                              fontSize: "18px",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Create new document
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#626469",
                              whiteSpace: "nowrap",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Draft, collaborate, negotiate, review, approve and
                            sign
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Button>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: "22px" }}
              >
                <Button
                className="contract-boxes"

                  variant="outlined"
                  // component={Link}
                  // to="/dashboard/editor-dahsbord"
                  onClick={() => {
                    setSelectDocoment("Upload Document"), setShowPopup(true);
                  }}
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    maxHeight: "140px",
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    width: "600px",
                    borderWidth: 1,
                    borderStyle: "solid",
                    border: "2px solid #EEE",
                    borderRadius: "5px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "45px", marginRight: "52px" }}>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          viewBox="0 0 80 80"
                          fill="none"
                        >
                          <path
                            d="M70 50V63.3333C70 65.1014 69.2976 66.7971 68.0474 68.0474C66.7971 69.2976 65.1014 70 63.3333 70H16.6667C14.8986 70 13.2029 69.2976 11.9526 68.0474C10.7024 66.7971 10 65.1014 10 63.3333V50"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M56.6666 26.6667L39.9999 10L23.3333 26.6667"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M40 10V50"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "table",
                        position: "relative",
                        top: "15px",
                      }}
                    >
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              color: "#43464C",
                              fontSize: "18px",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Upload signed document
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#626469",
                              whiteSpace: "nowrap",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Set lifecycle to manage existing signed documents
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Button>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: "22px" }}
              >
                <Button
                className="contract-boxes"
                  variant="outlined"
                  // component={Link}
                  // to="/dashboard/editor-dahsbord"
                  onClick={() => setSelectDocoment("Use Template")}
                  sx={{
                    display: "table-cell",
                    padding: "15px",
                    pt: 4,
                    maxHeight: "140px",
                    color: "gray",
                    justifyContent: "center",
                    textTransform: "none",
                    width: "600px",
                    borderWidth: 1,
                    borderStyle: "solid",
                    border: "2px solid #EEE",
                    borderRadius: "5px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "45px", marginRight: "52px" }}>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          viewBox="0 0 80 80"
                          fill="none"
                        >
                          <path
                            d="M46.6666 6.66666H19.9999C18.2318 6.66666 16.5361 7.36904 15.2859 8.61929C14.0356 9.86953 13.3333 11.5652 13.3333 13.3333V66.6667C13.3333 68.4348 14.0356 70.1305 15.2859 71.3807C16.5361 72.6309 18.2318 73.3333 19.9999 73.3333H59.9999C61.768 73.3333 63.4637 72.6309 64.714 71.3807C65.9642 70.1305 66.6666 68.4348 66.6666 66.6667V26.6667L46.6666 6.66666Z"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M46.6667 6.66666V26.6667H66.6668"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M53.3334 43.3333H26.6667"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M53.3334 56.6667H26.6667"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M33.3334 30H30.0001H26.6667"
                            stroke="#342BDC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "table",
                        position: "relative",
                        top: "15px",
                      }}
                    >
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              color: "#43464C",
                              fontSize: "18px",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Use template{" "}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#626469",
                              whiteSpace: "nowrap",
                              marginLeft: "-1.8rem",
                            }}
                          >
                            Use template to create a document and save time{" "}
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: "table-row" }}>
                        <div
                          style={{
                            display: "table-cell",
                            textAlign: "start",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Box
            sx={{
              background: "white",
              p: 2,
              borderTop: "0.5px solid #174B8B", // Add a top border
              borderBottom: "0.5px solid #174B8B",
            }}
          >
            {selectDocoment}
          </Box>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {selectDocoment == "Upload Document" ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 12, width: "50%" }}
                >
                  {/* <Grid item xs={12} sm={12}>
                    <div
                      style={{
                        border: "2px dashed #eeeeee",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <input
                        {...getInputProps()}
                        style={{ display: "none" }}
                        type="file"
                        accept=".pdf, .docx, .doc"
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "220px",
                          width: "100%",
                        }}
                      >
                        <img
                          src={logo}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "130px",
                            marginBottom: "10px", // Adds some space between the image and text
                          }}
                        />
                        <Typography variant="body1">
                          Drag and drop file
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                          Word or PDF files only
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Button
                            size="small"
                            // {...getRootProps()}
                            variant="contained"
                            style={{
                              textTransform: "none",
                            }}
                            onClick={() => setShowPopup(true)}
                          >
                            Browse Files
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleBack}
                            style={{
                              marginTop: "7rem",
                              textTransform: "none",
                              position: "absolute",
                              right: 0, // Positions the button at the right edge
                              marginRight: "2rem",
                              marginBottom: "2rem",
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Grid> */}
                </Box>
              ) : (
                <Box sx={{ mt: 12, width: "50%" }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={TemplateList}
                    value={selectedTemplate}
                    onChange={(event: any, newValue: any) => {
                      setSelectedTemplate(newValue);
                    }}
                    getOptionLabel={(option: any) =>
                      option ? option.overview?.name : ""
                    }
                    isOptionEqualToValue={(option: any, value: any) =>
                      option._id === value._id
                    }
                    renderOption={(props: any, option: any) => (
                      <MenuItem {...props} key={option._id} value={option._id}>
                        {option.overview?.name}
                      </MenuItem>
                    )}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        placeholder="Search Templates"
                        // Adjust label based on selection and focus
                        InputLabelProps={{
                          shrink: false, // Prevent the label from floating when focused or filled
                        }}
                        InputProps={{
                          ...params.InputProps, // Spread existing input properties
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        onFocus={() => setInputFocused(true)} // Set focus to true
                        onBlur={() => setInputFocused(false)} // Set focus to false
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              border: "1px dashed #174B8B ",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1171D1", // Change for hover state
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#174B8B", // Border color when the TextField is focused
                            },
                          },
                        }}
                      />
                    )}
                    renderTags={() => null} // Optionally, prevent tags from rendering if `multiple` is enabled
                  />
                  <div style={{ float: "right", marginTop: "2rem" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setSelectDocoment("")}
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>

                    <Tooltip
                      title="Use template to create a new document"
                      // placement="left"
                    >
                      <Button
                        component={Link}
                        to={`/dashboard/editor-dahsbord/${selectedTemplate._id}`}
                        onClick={() => {
                          setContract(null),
                            setIsTemplate(false),
                            setSidebarExpanded(false),
                            setFormState({
                              name: "",
                              with_name: undefined,
                              currency: undefined,
                              value: undefined,
                              tags: undefined,
                              // branch: "",
                              teams: undefined,
                              category: undefined,
                              subcategory: undefined,
                              additionalFields: [],
                            });
                          setDucomentName(""),
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
                        disabled={!selectedTemplate}
                        size="small"
                        sx={{
                          height: "4.5vh",
                          ml: 2,
                          mr: 2,
                          textTransform: "none",
                          backgroundColor: "#174B8B", // Set the button color to green
                          "&:hover": {
                            backgroundColor: "#2B6EC2", // Darker green on hover
                          },
                        }}
                        variant="contained"
                        type="submit"
                      >
                        Use Template
                      </Button>
                    </Tooltip>
                  </div>
                </Box>
              )}
            </Grid>
          </Grid>
        </>
      )}
      <UplodTrackFileDilog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        setDocumentPath={setUplodTrackFile}
        setSelectDocoment={setSelectDocoment}
        triggerClick={() => triggerClick()}
      />
    </>
  );
};

export default CreateContract;
