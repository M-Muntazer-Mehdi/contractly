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
import Breadcrumbs from "@mui/material/Breadcrumbs";
// ** Third Party Imports
import logo from "@/assets/team_icon.svg";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  archiveTeam,
  deleteTeam,
  getTeamsList,
  resetPaasword,
} from "@/service/api/apiMethods";
import AddIcon from "@mui/icons-material/Add";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
interface CellType {
  row: any;
  _id: any;
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

const defaultColumns: any[] = [
  {
    flex: 0.3,
    field: "name",
    minWidth: 230,
    headerName: "Team Name",
    renderCell: ({ row }: any) => {
      const { name } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Img src={logo} /> */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: "text.secondary" }}>{name}</Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.3,
    minWidth: 230,
    field: "managerFirstName",
    headerName: "Admin Name ",
    sortable: true,
    renderCell: (params: any) => (
      <Typography sx={{ color: "text.secondary" }}>
        {params.row.manager ? params.row.manager.firstName : "-"}
      </Typography>
    ),
  },

  {
    flex: 0.2,
    minWidth: 125,
    field: "status",
    headerName: "Status",
    renderCell: ({ row }: { row: any }) => (
      <>
        <Chip
          size="small"
          variant="outlined"
          label={
            row.status === "Active"
              ? "Active"
              : row.status === "Archived"
              ? "Archived"
              : "Inactive"
          }
          sx={{
            fontSize: "14px",
            // fontWeight: "bold",
            backgroundColor:
              row.status === "Active"
                ? "#D3FDE4"
                : row.status === "Archived"
                ? "#FFF7CB"
                : "#FFCBCB",
            color:
              row.status === "Active"
                ? "#3F9748"
                : row.status === "Archived"
                ? "#D32F2F"
                : "#red",
            borderColor:
              row.status === "Active"
                ? "#D3FDE4"
                : row.status === "Archived"
                ? "#FFF7CB"
                : "#FFCBCB", // Optional: to match border color with background
            "& .MuiChip-label": {
              // This targets the label inside the chip for more specific styling
              color:
                row.status === "Active"
                  ? "#3F9748"
                  : row.status === "Archived"
                  ? "#D36A2F"
                  : "#D32F2F",
            },
          }}
        />
      </>
    ),
  },
  // {
  //   flex: 0.2,
  //   minWidth: 125,
  //   field: "status",
  //   headerName: "Status",
  //   renderCell: ({ row }: { row: any }) => (
  //     <>
  //       <Chip
  //         size="small"
  //         variant="outlined"
  //         label={
  //           row.status === "active"
  //             ? "Active"
  //             : row.status === "archived"
  //             ? "Archived"
  //             : "Inactive"
  //         }
  //         sx={{
  //           backgroundColor:
  //             row.status === "active"
  //               ? "#D3FDE4"
  //               : row.status === "archived"
  //               ? "#FFF7CB"
  //               : "#D32F2F",
  //           color:
  //             row.status === "active"
  //               ? "#3F9748"
  //               : row.status === "archived"
  //               ? "#D36A2F"
  //               : "#FFCBCB",
  //           borderColor:
  //             row.status === "active"
  //               ? "#D3FDE4"
  //               : row.status === "archived"
  //               ? "#FFF7CB"
  //               : "#D32F2F", // Optional: to match border color with background
  //           "& .MuiChip-label": {
  //             // This targets the label inside the chip for more specific styling
  //             color:
  //               row.status === true
  //                 ? "#3F9748"
  //                 : row.status === "archived"
  //                 ? "#D36A2F"
  //                 : "#FFCBCB",
  //           },
  //         }}
  //       />
  //     </>
  //   ),
  // },
  {
    flex: 0.2,
    minWidth: 125,
    field: "members",
    headerName: "No. of Users ",
    renderCell: ({ row }: { row: any }) => {
      const { members } = row;
      return (
        <Typography sx={{ color: "text.secondary" }}>{members}</Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: "ctive Contracts ",
    headerName: "Active Contracts",

    renderCell: ({ row }: { row: RowType }) => {
      return <Typography sx={{ color: "text.secondary" }}>{"10"}</Typography>;
    },
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: "Annual value",
    headerName: "Annual Value",
    // headerAlign: "center",
    renderCell: ({ row }: { row: RowType }) => {
      return (
        <Typography sx={{ color: "text.secondary" }}>{"NZD150"}</Typography>
      );
    },
  },
];

const BranchList = () => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

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

  // ** Hooks

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getTeamsList(user?._id);
      const transformedData = data.map((row: any) => ({
        ...row,
        managerFirstName: row.manager ? row.manager.firstName : "",
        members: row.members ? row.members.length : "",
      }));
      setCategorylist(transformedData);

      console.log("teams", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  // const handleEditClick = (row: any) => {
  //   router.push(`edit/${row.id}`)
  // }

  const handleArchive = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to archive this team?")) {
        setIsLoading(true);
        const res = await archiveTeam(id, { status: "Archived" });
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
  const handleActive = async (id: any) => {
    try {
      if (
        window.confirm("Are you sure you want to change the status this team?")
      ) {
        setIsLoading(true);
        const res = await archiveTeam(id, { status: "Active" });
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
  const handleInactive = async (id: any) => {
    try {
      if (
        window.confirm("Are you sure you want to change the status this team?")
      ) {
        setIsLoading(true);
        const res = await archiveTeam(id, { status: "Inactive" });
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
  const handleDelete = async (id: any) => {
    try {
      if (
        window.confirm(
          "Deleting Team will delete all the data associated with it."
        )
      ) {
        setIsLoading(true);
        const res = await deleteTeam(id);
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

  console.log(search, "serch");

  const filteredList = useMemo(() => {
    let result = catategorylist;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, catategorylist]);

  const columns: GridColDef[] = [
    ...defaultColumns,
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
            onClick={(e: any) => handleClick(e, row)} // Pass the current row here
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
            <Tooltip
              title={
                user?.role?.permissions?.edit_teams
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.edit_teams) {
                    handleClose();
                    navigate(`/dashboard/Team-edit/${menuState.row?._id}`); // Use menuState.row._id
                  }
                }}
              >
                Edit
              </MenuItem>
            </Tooltip>

            <Tooltip
              title={
                user?.role?.permissions?.archive_teams
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.archive_teams) {
                    handleClose();
                    handleArchive(menuState.row?._id); // Use menuState.row._id
                  }
                }}
              >
                Archive
              </MenuItem>
            </Tooltip>
            <MenuItem
              onClick={() => {
                handleClose();
                handleActive(menuState.row?._id); // Use menuState.row._id
              }}
            >
              Active
            </MenuItem>
            <MenuItem
              title={
                user?.role?.permissions?.delete_users
                  ? "" // Empty string for no tooltip message when permission is present
                  : "You have no permission"
              }
              onClick={() => {
                handleClose();
                handleInactive(menuState.row?._id); // Use menuState.row._id
              }}
            >
              Inactive
            </MenuItem>
            <Tooltip
              title={
                user?.role?.permissions?.delete_teams
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.delete_teams) {
                    handleDelete(menuState.row?._id); // Use menuState.row._id
                    handleClose();
                  }
                }}
              >
                Delete
              </MenuItem>
            </Tooltip>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CardHeader title="Teams" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/dashboard/teamlist" className="link-no-underline">
              Home
            </Link>
            {/* <Typography color="text.primary">Categories</Typography> */}
          </Breadcrumbs>
          <Card>
            <Box
              sx={{
                pl: 3,
                p: 2,
                pr: 3,
                width: "100%",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Responsive flex direction
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: { xs: 2, sm: 0 }, // Margin bottom on xs screens
                  width: { xs: "100%", sm: "auto" }, // Full width on xs screens
                }}
              >
                <TextField
                  size="small"
                  value={search}
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ minWidth: "150px", flexGrow: { xs: 1, sm: 0 } }} // TextField takes available space on xs screens
                />
              </Box>
              <div>
                <Tooltip
                  title={
                    user?.role?.permissions?.create_teams
                      ? ""
                      : "You have no permission"
                  }
                  arrow
                >
                  <span>
                    <Button
                      sx={{ ml: 2, textTransform: "none" }}
                      variant="contained"
                      component={Link}
                      // to={hasAddUsersPermission ? "/dashboard/create-user" : ""}
                      to="/dashboard/create-team"
                      disabled={!user?.role?.permissions?.create_teams}
                    >
                      <AddIcon /> Create Team
                    </Button>
                  </span>
                </Tooltip>
              </div>
            </Box>
          </Card>
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

export default BranchList;
