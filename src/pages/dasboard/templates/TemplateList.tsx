/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import { useContext, useEffect, useMemo, useState } from "react";

// ** Next Import
// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

// ** Third Party Imports
import { useContract } from "@/hooks/useContract";
import toast from "react-hot-toast";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  archiveBranch,
  deleteBranch,
  getBranchList,
} from "@/service/api/apiMethods";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PDFUploaderViewer from "@/pages/dasboard/contract/PDFUploaderViewer";
import { ContractContext } from "@/context/ContractContext";
import {
  deletecontract,
  getList,
  getListTemlate,
  getcontractById,
} from "@/service/api/contract";
// import MenuButton from "@/components/MenuButton";
import { format, utcToZonedTime } from "date-fns-tz";

interface CellType {
  row: any;
  _id: any;
}
interface CheckedState {
  name: boolean;
  manager: boolean;
  status: boolean;
  activeContract: boolean;
  annualValue: boolean;
}
const Img = styled("img")(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  marginRight: theme.spacing(3),
}));
interface RowType {
  category: string;
  status: boolean;
  type: string;
  display_name: string;
  description: string;
}

// ** Styled components

const defaultColumns: GridColDef[] = [];

const TemplateList = () => {
  const navigate = useNavigate();
  // ** State
  const { contractStatus, setContractStatus } = useContract();
  const {
    setContract,
    setLifecycleData,
    setSidebarExpanded,
    setDucomentName,
    setFormState,
    setEditMode,
    setIsTemplate,
    setTemlatePoupup,
  } = useContext(ContractContext);
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cntractlist, setContractlist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [data, setData] = useState([]);

  const [menuState, setMenuState] = useState<{
    anchorEl: null | HTMLElement;
    row: CellType | null;
  }>({
    anchorEl: null,
    row: null,
  });

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: CellType
  ) => {
    setMenuState({ anchorEl: event.currentTarget, row: row });
  };

  const handleClose = () => {
    setMenuState({ anchorEl: null, row: null });
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getListTemlate(user?._id);
      console.log("contract", data);
      const transformedData = data.map((row: any, index: number) => ({
        ...row,
        id: index,
        name: `${row?.overview?.name || ""}`,
        with_name: `${row?.overview?.with_name || ""} `,
        team: `${row?.overview?.teams?.name || ""} `,
        tags: `${row?.overview?.tags?.name || ""} `,
        category: `${row?.overview?.category?.name || ""} `,
        subcategory: `${row?.overview?.subcategory || ""} `,
        anualValue: `${row?.overview?.value || ""} `,
        disription: `${row?.overview?.disription || ""} `,
        noticePeriodDate: `${row?.lifecycle?.formData?.dateFields?.noticePeriodDate}`,
        startDate: `${row?.lifecycle?.formData?.dateFields?.startDate}`,
        endDate: `${row?.lifecycle?.formData?.dateFields?.endDate}`,

        // members: row.members ? row.members.length : "",
      }));

      setContractlist(transformedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  const handleDelete = async (id: any) => {
    try {
      if (
        window.confirm(
          "Deleting contract will delete all the data associated with it."
        )
      ) {
        console.log(id, "id");

        setIsLoading(true);
        const res = await deletecontract(id);
        if (res.ok === true) {
          toast.success(res.message);
          listData();
        } else {
          toast.error(res?.message || "");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) listData();
  }, [user?._id]);

  const filteredList = useMemo(() => {
    let result = cntractlist;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item?.overview?.name
          ?.toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, cntractlist]);

  const handleApplyFilters = async (filters: CheckedState) => {
    console.log(filters, "filters");

    // const filteredData = await fetchDataWithFilters(filters);
    // setData(filteredData);
  };

  const columns: any[] = [
    {
      flex: 0.3,
      field: "name",
      minWidth: 220,
      headerName: "Document name",
      renderCell: ({ row }: any) => {
        const { name } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <Img src={checkImageFormat(row?.image?.path)} /> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // color: "#155BE5",
                // cursor: "pointer",
              }}
              // onClick={() => {
              //   handleClose();
              //   navigate(`/dashboard/editor-dahsbord/${row?._id}`);
              //   setSidebarExpanded(false);
              //   setDucomentName("");
              //   setFormState({
              //     name: "",
              //     with_name: undefined,
              //     currency: undefined,
              //     value: undefined,
              //     tags: undefined,
              //     // branch: "",
              //     teams: undefined,
              //     category: undefined,
              //     subcategory: undefined,
              //     additionalFields: [],
              //   });
              //   setLifecycleData({
              //     activeSection: "",
              //     showButtons: false,
              //     recipients: [],
              //     formData: {
              //       checkboxStates: {
              //         isEvergreen: false,
              //         isRenewalsActive: false,
              //         isNotificationEmailEnabled: false,
              //         isRemindersEnabled: false,
              //       },
              //       dateFields: {
              //         signedOn: "",
              //         startDate: "",
              //         endDate: "",
              //         noticePeriodDate: "",
              //       },
              //       renewalDetails: {
              //         renewalType: "days",
              //         renewalPeriod: 0,
              //       },
              //       notificationDetails: {
              //         notifyOwner: false,
              //         additionalRecipients: [],
              //       },
              //       reminderSettings: {
              //         firstReminder: 0,
              //         daysBetweenReminders: 0,
              //         daysBeforeFinalExpiration: 0,
              //       },
              //     },
              //   });
              // }}
            >
              <Typography sx={{ color: "text.secondary" }}>{name}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 220,
      field: "with_name",
      headerName: "Description",

      renderCell: ({ row }: { row: any }) => {
        const { disription } = row;
        return (
          <Typography sx={{ color: "text.secondary" }}>{disription}</Typography>
        );
      },
    },

    {
      flex: 0.3,
      field: "createdAt",
      minWidth: 180,
      headerName: "Created date",
      renderCell: ({ row }: any) => {
        // Extract the date from the row
        const startDate = row?.createdAt;

        // If the startDate is empty or invalid, return a default value
        if (!startDate || isNaN(new Date(startDate).getTime())) {
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>-</Typography>
              </Box>
            </Box>
          );
        }

        // Specify the desired time zone, e.g., 'America/New_York'
        const timeZone = "America/New_York";

        // Convert UTC date to the specified time zone
        const zonedDate = utcToZonedTime(new Date(startDate), timeZone);

        // Format the zoned date to the desired output format
        try {
          const formattedDate = format(zonedDate, "dd-MM-yyyy", { timeZone });
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
          );
        } catch (error) {
          console.error("Error formatting date:", error);
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>
                  Invalid date
                </Typography>
              </Box>
            </Box>
          );
        }
      },
    },

    {
      flex: 0.3,
      field: "updatedAt",
      minWidth: 180,
      headerName: "Last Change",
      renderCell: ({ row }: any) => {
        // Extract the date from the row
        const endDate = row?.updatedAt;

        // If the endDate is empty or invalid, return a default value
        if (!endDate || isNaN(new Date(endDate).getTime())) {
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>-</Typography>
              </Box>
            </Box>
          );
        }

        // Specify the desired time zone, e.g., 'America/New_York'
        const timeZone = "America/New_York";

        // Convert UTC date to the specified time zone
        const zonedDate = utcToZonedTime(new Date(endDate), timeZone);

        // Format the zoned date to the desired output format
        try {
          const formattedDate = format(zonedDate, "dd-MM-yyyy", { timeZone });
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
          );
        } catch (error) {
          console.error("Error formatting date:", error);
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: "text.secondary" }}>
                  Invalid date
                </Typography>
              </Box>
            </Box>
          );
        }
      },
    },

    {
      flex: 0.3,
      minWidth: 180,
      field: "createdBy",
      headerName: "Created by",
      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{`${
            row?.createdBy || "-"
          }`}</Typography>
        );
      },
    },

    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      renderCell: ({ row }: CellType) => (
        <div>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(e) => handleClick(e, row)} // Pass the current row here
          >
            <Button
              // sx={{ }}
              // variant="contained"
              size="small"
              sx={{
                height: "4.5vh",

                textTransform: "none",
                backgroundColor: "#174B8B", // Set the button color to green
                "&:hover": {
                  backgroundColor: "#2B6EC2", // Darker green on hover
                },
              }}
              variant="contained"
              component={Link}
              to={`/dashboard/editor-dahsbord/${row?._id}`}
              onClick={() => {
                setDocumentType("Contract");
                setEditMode(false);
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
            >
              use
            </Button>
            <MoreVertIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={menuState.anchorEl}
            open={Boolean(menuState.anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate(`/dashboard/editor-dahsbord/${row?._id}`);
                setSidebarExpanded(false);
                setEditMode(false);
                setDucomentName("");
                setIsTemplate(true),
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
              Edit
            </MenuItem>
            <MenuItem
            // onClick={() => {
            //   handleDelete(row?._id); // Use menuState.row._id
            //   handleClose();
            // }}
            >
              Move
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDelete(row?._id); // Use menuState.row._id
                handleClose();
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
            // onClick={() => {
            //   handleDelete(row?._id); // Use menuState.row._id
            //   handleClose();
            // }}
            >
              Share to folder
            </MenuItem>
            <MenuItem
            // onClick={() => {
            //   handleDelete(row?._id); // Use menuState.row._id
            //   handleClose();
            // }}
            >
              Share with users
            </MenuItem>
            <MenuItem
            // onClick={() => {
            //   handleDelete(row?._id); // Use menuState.row._id
            //   handleClose();
            // }}
            >
              Download
            </MenuItem>
            <MenuItem
            // onClick={() => {
            //   handleDelete(row?._id); // Use menuState.row._id
            //   handleClose();
            // }}
            >
              Transfer ownership
            </MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box
            sx={{
              pr: 3,
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <CardHeader title="Templates" />
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
              >
                <Link
                  to="/dashboard/template-list"
                  className="link-no-underline"
                >
                  Home
                </Link>
                {/* <Typography color="text.primary">Categories</Typography> */}
              </Breadcrumbs>
            </Box>
          </Box>

          <Box
            sx={{
              borderTop: "0.5px solid #174B8B", // Add a top border
              borderBottom: "0.5px solid #174B8B",
              pl: 3,
              p: 2,
              pr: 4,
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              background: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                width: "50%",
              }}
            >
              <TextField
                size="small"
                fullWidth
                value={search}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "60%", // Adjusted width here
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#174B8B !important", // Your desired color for normal state
                      borderWidth: "1px !important", // Set border thickness to 0.5px
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
            </Box>

            <div style={{ display: "flex" }}>
              <Button
                size="small"
                onClick={() => {
                  navigate(`/dashboard/editor-dahsbord`);
                  setTemlatePoupup(true);
                  setContract(null),
                    setSidebarExpanded(false),
                    setDucomentName(""),
                    setIsTemplate(true),
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
                sx={{
                  height: "4.5vh",
                  mr: 1,
                  textTransform: "none",
                  backgroundColor: "#3F9748", // Set the button color to green
                  "&:hover": {
                    backgroundColor: "darkgreen", // Darker green on hover
                  },
                }}
                variant="contained"
              >
                Upload Template
              </Button>

              <Button
                // sx={{ }}
                // variant="contained"
                size="small"
                sx={{
                  height: "4.5vh",
                  ml: 2,

                  textTransform: "none",
                  backgroundColor: "#174B8B", // Set the button color to green
                  "&:hover": {
                    backgroundColor: "#2B6EC2", // Darker green on hover
                  },
                }}
                variant="contained"
                component={Link}
                to="/dashboard/editor-dahsbord"
                onClick={() => {
                  setContract(null), setEditMode(false);
                  setSidebarExpanded(false),
                    setDucomentName(""),
                    setIsTemplate(true),
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
                <AddIcon /> Create Template
              </Button>

              {/* <MenuButton /> */}
            </div>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            ></Box>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                }}
              >
                {" "}
                <ProgressCircularCustomization />
              </Box>
            ) : (
              <DataGrid
                sx={{
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#F8FAFD", // Set your desired hover color
                  },
                  "& .MuiDataGrid-cell": {
                    borderColor: "#D3DFFD", // Grid line color for normal cells
                  },
                  "& .MuiDataGrid-columnSeparator": {
                    visibility: "visible",
                    borderColor: "#D3DFFD", // Column separator color
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    borderColor: "transparent", // Transparent border around the grid
                  },
                  "& .MuiDataGrid-root": {
                    border: "1px solid white", // Change this to 'transparent' if no border is desired
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    borderColor: "#D3DFFD", // Border color for header
                    "& .MuiDataGrid-columnHeaderTitle": {
                      // You can customize header text color here
                    },
                  },
                  "& .MuiDataGrid-columnHeader": {
                    borderColor: "#D3DFFD", // Ensure headers' border color matches
                  },
                }}
                style={{ maxHeight: 500 }}
                pagination
                rows={filteredList || []}
                columns={columns}
                pageSizeOptions={[7, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
                getRowId={(row) => row._id}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default TemplateList;
