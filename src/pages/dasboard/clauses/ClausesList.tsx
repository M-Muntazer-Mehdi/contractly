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
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { format, utcToZonedTime } from "date-fns-tz";
import { deleteClauses, getList, updateStatus } from "@/service/api/clauses";
import DetailDialog from "@/pages/dasboard/clauses/DetailDialog";
import { useContract } from "@/hooks/useContract";

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
  //           row.status === "Active"
  //             ? "Active"
  //             : row.status === "Archived"
  //             ? "Archived"
  //             : "Inactive"
  //         }
  //         sx={{
  //           fontSize: "14px",
  //           // fontWeight: "bold",
  //           backgroundColor:
  //             row.status === "Active"
  //               ? "#D3FDE4"
  //               : row.status === "Archived"
  //               ? "#FFF7CB"
  //               : "#FFCBCB",
  //           color:
  //             row.status === "Active"
  //               ? "#3F9748"
  //               : row.status === "Archived"
  //               ? "#D32F2F"
  //               : "#red",
  //           borderColor:
  //             row.status === "Active"
  //               ? "#D3FDE4"
  //               : row.status === "Archived"
  //               ? "#FFF7CB"
  //               : "#FFCBCB", // Optional: to match border color with background
  //           "& .MuiChip-label": {
  //             // This targets the label inside the chip for more specific styling
  //             color:
  //               row.status === "Active"
  //                 ? "#3F9748"
  //                 : row.status === "Archived"
  //                 ? "#D36A2F"
  //                 : "#D32F2F",
  //           },
  //         }}
  //       />
  //     </>
  //   ),
  // },
];

const ClausesList = () => {
  const navigate = useNavigate();
  // ** State
  const { contractStatus } = useContract();
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [menuState, setMenuState] = useState<{
    anchorEl: null | HTMLElement;
    row: CellType | null;
  }>({
    anchorEl: null,
    row: null,
  });

  const handleOpenDialog = (row: any) => {
    setSelectedData(row); // Set the data you want to display
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
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
      console.log(contractStatus, "contractStatus");

      setIsLoading(true);
      const { data } = await getList();
      setCategorylist(data);
      console.log("teams", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  const handleDelete = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete this clause?")) {
        setIsLoading(true);
        const res = await deleteClauses(id);
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
    listData();
  }, []);

  console.log(search, "serch");

  const filteredList = useMemo(() => {
    let result = catategorylist;
    if (search?.trim()?.length) {
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, catategorylist]);

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      field: "name",
      minWidth: 230,
      headerName: "Clause Name",
      renderCell: ({ row }: any) => {
        const { name } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>{name}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.3,
      field: "content",
      minWidth: 230,
      headerName: "Clause Description",
      renderCell: ({ row }: any) => {
        const { content } = row;
        const displayContent =
          content?.length > 40 ? `${content.substring(0, 40)}...` : content;

        return (
          // <Tooltip title={content} arrow>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "text.secondary", cursor: "pointer" }}
                onClick={() => handleOpenDialog(row.content)}
              >
                {displayContent}
              </Typography>
            </Box>
          </Box>
          // </Tooltip>
        );
      },
    },

    {
      flex: 0.2,
      field: "createdAt",
      minWidth: 130,
      headerName: "Created Date",
      renderCell: ({ row }: any) => {
        const { createdAt } = row;

        // Specify the desired time zone, e.g., 'America/New_York'

        const timeZone = "America/New_York";
        // Convert UTC date to the specified time zone
        const zonedDate = utcToZonedTime(new Date(createdAt), timeZone);

        const formattedDate = format(zonedDate, "dd-MM-yyyy ", {
          timeZone,
        });

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>
                {formattedDate}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      field: "createdByName",
      minWidth: 180,
      headerName: "Created By",
      renderCell: ({ row }: any) => {
        const { createdByName } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>
                {createdByName || "-"}
              </Typography>
            </Box>
          </Box>
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
      renderCell: ({ row }: any) => (
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
                user?.role?.permissions?.edit_clauses
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.edit_clauses) {
                    handleClose();
                    navigate(`/dashboard/update-clauses/${menuState.row?._id}`); // Use menuState.row._id
                  }
                }}
              >
                Edit
              </MenuItem>
            </Tooltip>

            <Tooltip
              title={
                user?.role?.permissions?.delete_any_clauses
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.delete_any_clauses) {
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
          <CardHeader title="Clauses" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/dashboard/clauses-list" className="link-no-underline">
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
                    onChange={(e: any) => setSearch(e.target.value)}
                  />
                </Box>
              </div>
              <div>
                <Tooltip
                  title={
                    user?.role?.permissions?.create_clauses
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
                      disabled={!user?.role?.permissions?.create_clauses}
                      to="/dashboard/create-clauses"
                    >
                      <AddIcon /> Create Clause
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
      <DetailDialog
        open={openDialog}
        data={selectedData}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default ClausesList;
