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
type Status = "Draft" | "Review" | "Signing" | "Signed";

// ** Styled components

const defaultColumns: GridColDef[] = [];

const ContractList = () => {
  const navigate = useNavigate();
  // ** State

  const {
    setContract,
    setLifecycleData,
    setSidebarExpanded,
    setDucomentName,
    setRecipients,
    setCollaborater,
    setFormState,
    setEditMode,
    setUplodTrackFile,
    setShowBlock,
    setIsTemplate,
  } = useContext(ContractContext);
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
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
      const { data } = await getList(user?._id);

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
        currency: `${row?.overview?.currency || ""} `,
        noticePeriodDate: `${row?.lifecycle?.formData?.dateFields?.noticePeriodDate}`,
        startDate: `${row?.lifecycle?.formData?.dateFields?.startDate}`,
        endDate: `${row?.lifecycle?.formData?.dateFields?.endDate}`,

        // members: row.members ? row.members.length : "",
      }));

      setContractlist(transformedData);
      console.log("contract", data);
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

  const handleArchive = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to archive this branch?")) {
        setIsLoading(true);
        const res = await archiveBranch(id, { status: "Archived" });
        console.log({ res });

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
      minWidth: 180,
      field: "status",
      headerName: "Status",
      renderCell: ({ row }: { row: any }) => (
        <>
          <Chip
            size="small"
            variant="outlined"
            label={row?.status}
            sx={{
              fontSize: "14px",
              backgroundColor: (theme) => {
                const statusColors = {
                  Draft: "#FFF7CB", // Light yellow for Draft
                  Review: "#FFCBCB", // Light red for Review
                  Signing: "#D3FDE4", // Light green for Signing, previously orange
                  Signed: "#D3FDE4", // Light green for Signed
                };
                return statusColors[row.status as Status] || "#FFF7CB"; // Default to light yellow
              },
              color: (theme) => {
                const textColors = {
                  Draft: "#D32F2F", // Red for Draft
                  Review: "#D32F2F", // Red for Review
                  Signing: "#3F9748", // Dark green for Signing, matching light green background
                  Signed: "#3F9748", // Green for Signed
                };
                return textColors[row.status as Status] || "#D32F2F"; // Default to red
              },
              borderColor: (theme) => {
                const borderColors = {
                  Draft: "#FFF7CB", // Border matches background for Draft
                  Review: "#FFCBCB", // Border matches background for Review
                  Signing: "#D3FDE4", // Light green border for Signing
                  Signed: "#D3FDE4", // Light green border for Signed
                };
                return borderColors[row.status as Status] || "#FFF7CB"; // Default to light yellow
              },
              "& .MuiChip-label": {
                color: (theme) => {
                  const labelColors = {
                    Draft: "#D32F2F", // Red label text for Draft
                    Review: "#D32F2F", // Red label text for Review
                    Signing: "#3F9748", // Dark green label text for Signing
                    Signed: "#3F9748", // Green label text for Signed
                  };
                  return labelColors[row.status as Status] || "#D32F2F"; // Default to red
                },
              },
            }}
          />
        </>
      ),
    },
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
                color: "#155BE5",
                cursor: "pointer",
              }}
              onClick={() => {
                handleClose();
                navigate(`/dashboard/editor-dahsbord/${row?._id}`);
                setSidebarExpanded(false);
                // setEditMode(true);
                setUplodTrackFile("");
                setShowBlock("");
                setDucomentName("");
                setRecipients([]),
                  setIsTemplate(false),
                  setCollaborater([]),
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
      headerName: "Contract with",

      renderCell: ({ row }: { row: any }) => {
        const { with_name } = row;
        return (
          <Typography sx={{ color: "text.secondary" }}>{with_name}</Typography>
        );
      },
    },

    {
      flex: 0.3,
      field: "startDate",
      minWidth: 180,
      headerName: "Start date",
      renderCell: ({ row }: any) => {
        // Extract the date from the row
        const startDate = row?.startDate;

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
      field: "endDate",
      minWidth: 180,
      headerName: "End date",
      renderCell: ({ row }: any) => {
        // Extract the date from the row
        const endDate = row?.endDate;

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
      field: "noticePeriodDate",
      minWidth: 180,
      headerName: "Notice period",
      renderCell: ({ row }: any) => {
        // Extract the date from the row
        const noticePeriodDate = row?.noticePeriodDate;

        // If the noticePeriodDate is empty or invalid, return a default value
        if (!noticePeriodDate || isNaN(new Date(noticePeriodDate).getTime())) {
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
        const zonedDate = utcToZonedTime(new Date(noticePeriodDate), timeZone);

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
      field: "currency",
      headerName: "Currency",

      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{`${
            row?.currency || "-"
          }`}</Typography>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 180,
      field: "anualValue",
      headerName: "Annual Value ",

      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.anualValue}
          </Typography>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 180,
      field: "category",
      headerName: "Categories",

      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{`${
            row?.category || "-"
          }`}</Typography>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 180,
      field: "subcategory",
      headerName: "SubCategories",

      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{`${
            row?.subcategory || "-"
          }`}</Typography>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 180,
      field: "tags",
      headerName: "Tags",

      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{`${
            row?.tags || "-"
          }`}</Typography>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 180,
      field: "team",
      headerName: "Team ",
      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{`${
            row?.overview?.teams?.name || "-"
          }`}</Typography>
        );
      },
    },
    {
      flex: 0.02,
      minWidth: 100,
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
            <MoreVertIcon />
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
            {/* <MenuItem
              onClick={() => {
                handleClose();
                navigate(`/dashboard/editor-dahsbord/${row?._id}`);
                setSidebarExpanded(false);
                setDucomentName("");
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
            </MenuItem> */}
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
              <CardHeader title="Documents" />
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
              >
                <Link to="/dashboard/branchlist" className="link-no-underline">
                  Home
                </Link>
                {/* <Typography color="text.primary">Categories</Typography> */}
              </Breadcrumbs>
            </Box>
            <Box>
              <Button
                // sx={{ }}
                // variant="contained"
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
                component={Link}
                to="/dashboard/create-contract"
                onClick={() => {
                  setContract(null), setSidebarExpanded(false);
                  setIsTemplate(false),
                    setRecipients([]),
                    setCollaborater([]),
                    setDucomentName(""),
                    setEditMode(false);
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
                <AddIcon /> Create Document
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              borderTop: "0.5px solid #174B8B", // Add a top border
              borderBottom: "0.5px solid #174B8B",
              pl: 3,
              p: 2,
              pr: 5,
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
                Set as a default
              </Button>

              <Button
                variant="text"
                sx={{
                  height: "4.5vh",
                }}
              >
                <svg
                  width="24"
                  height="32"
                  viewBox="0 0 24 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.87819 21.3747V17.3901H11.2227V14.7337L5.87819 14.7337V10.7491L3.7404 16.0619L5.87819 21.3747ZM2.67151 5.43632H1.60261V26.6875H2.67151V5.43632Z"
                    fill="#174B8B"
                  />
                  <path
                    d="M18.1209 10.6261V14.6107L12.7764 14.6107V17.2671L18.1209 17.2671V21.2517L20.2587 15.9389L18.1209 10.6261ZM22.3965 5.31327H21.3276L21.3276 26.5645H22.3965L22.3965 5.31327Z"
                    fill="#174B8B"
                  />
                </svg>
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: "none",

                  color: "#174B8B",
                  borderColor: "#174B8B", // Change this to your preferred color
                  "&:hover": {
                    borderColor: "#1171D1", // Optional: Change for hover state
                  },
                }}
              >
                <ExitToAppIcon sx={{ color: "#174B8B", mr: 1 }} /> Export
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

export default ContractList;
