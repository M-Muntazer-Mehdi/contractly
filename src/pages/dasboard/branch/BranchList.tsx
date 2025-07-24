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
// ** Third Party Imports

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
import DetailDialog from "@/pages/dasboard/branch/DetailDialog";
// import MenuButton from "@/components/MenuButton";

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

const BranchList = () => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [data, setData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const handleOpenDialog = (row: any) => {
    setSelectedData(row._id); // Set the data you want to display
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
      const { data } = await getBranchList(user?._id);
      const excludedIds = ["65ae573e0d864a2902d16e73"];
      const filteredData = data.filter(
        (item: any) => !excludedIds.includes(item._id)
      );
      setCategorylist(filteredData);
      console.log("branc", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const options: any[] = [
    {
      text: "Edit",
      // onClick: handleEditClick,
    },
    {
      text: "Delete",
      // onClick: handleDelete,
    },
  ];
  const ITEM_HEIGHT = 48;

  const handleDelete = async (id: any) => {
    try {
      if (
        window.confirm(
          "Deleting branch will delete all the data associated with it."
        )
      ) {
        setIsLoading(true);
        const res = await deleteBranch(id);
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
    let result = catategorylist;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item.branchName?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, catategorylist]);

  const handleApplyFilters = async (filters: CheckedState) => {
    console.log(filters, "filters");

    // const filteredData = await fetchDataWithFilters(filters);
    // setData(filteredData);
  };

  const columns: any[] = [
    {
      flex: 0.3,
      field: "branchName",
      minWidth: 220,
      headerName: "Branch Name",
      renderCell: ({ row }: any) => {
        const { branchName } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <Img src={checkImageFormat(row?.image?.path)} /> */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                // component={Link}
                // to={`/dashboard/branch-detail/${row._id}`}
                sx={{ color: "text.secondary", cursor: "pointer" }}
                onClick={() => handleOpenDialog(row)}
              >
                {branchName}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: "manager",
      headerName: "Admin Name ",
      renderCell: ({ row }: { row: any }) => {
        const { manager } = row;
        return (
          <Typography sx={{ color: "text.secondary" }}>{`${
            manager?.firstName || "-"
          }`}</Typography>
        );
      },
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
    {
      flex: 0.2,
      minWidth: 170,
      field: "state",
      headerName: "Region/State",

      renderCell: ({ row }: { row: any }) => {
        const { state } = row;
        return (
          <Typography sx={{ color: "text.secondary" }}>{state}</Typography>
        );
      },
    },

    {
      flex: 0.2,
      minWidth: 105,
      field: "Active Contracts",
      headerName: "Active Contracts",

      renderCell: ({ row }: { row: RowType }) => {
        return <Typography sx={{ color: "text.secondary" }}>{"10"}</Typography>;
      },
    },

    {
      flex: 0.2,
      minWidth: 125,
      field: "display_name",
      headerName: "Annual Value ",

      renderCell: ({ row }: { row: RowType }) => {
        const { display_name } = row;
        return (
          <Typography sx={{ color: "text.secondary" }}>{"NZD150"}</Typography>
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
            <Tooltip
              title={
                user?.role?.permissions?.edit_branches
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.edit_branches) {
                    handleClose();
                    navigate(`/dashboard/branch-edit/${menuState.row?._id}`); // Use menuState.row._id
                  }
                }}
              >
                Edit
              </MenuItem>
            </Tooltip>
            <Tooltip
              title={
                user?.role?.permissions?.archive_branches
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.archive_branches) {
                    handleClose();
                    handleArchive(menuState.row?._id); // Use menuState.row._id
                  }
                }}
              >
                Archive
              </MenuItem>
            </Tooltip>
            <Tooltip
              title={
                user?.role?.permissions?.delete_branches
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.delete_branches) {
                    handleDelete(menuState.row?._id);
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
          <CardHeader title="Branches" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/dashboard/branchlist" className="link-no-underline">
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
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
              </div>
              <div>
                <Tooltip
                  title={
                    user?.role?.permissions?.create_branches
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
                      to="/dashboard/create-branch"
                      disabled={!user?.role?.permissions?.create_branches}
                    >
                      <AddIcon /> Create Branch
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
                // checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[7, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={(rows: any) => setSelectedRows(rows)}
                getRowId={(row) => row._id}
                // disableColumnMenu
              />
            )}
          </Card>
        </Grid>
      </Grid>
      <DetailDialog
        open={openDialog}
        id={selectedData}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default BranchList;
