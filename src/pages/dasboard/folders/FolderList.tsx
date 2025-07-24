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
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import toast from "react-hot-toast";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { formatDistanceToNow } from "date-fns";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { format, utcToZonedTime } from "date-fns-tz";
import { useAuth } from "@/hooks/useAuth";
import {
  deleteCategoey,
  deleteSubCategory,
  getCategoryList,
  updateStatus,
} from "@/service/api/category";
import { deleteFile, deleteFolder, getFolderList } from "@/service/api/folder";
import { json } from "stream/consumers";
import CreateFolder from "@/pages/dasboard/folders/CreateFolder";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

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

const FolderLIst = () => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });

  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [categoryMenuState, setCategoryMenuState] = useState<any>({});
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleCloseModalResetPass = () => setIsOpenCreate(false);
  const [itemName, setItemName] = useState({ id: "", name: "" });

  const [menuState, setMenuState] = useState<{
    anchorEl: null | HTMLElement;
    row: any | null;
  }>({
    anchorEl: null,
    row: null,
  });

  const handleCategoryMenuOpen = (rowId: any) => (event: any) => {
    setCategoryMenuState({
      ...categoryMenuState,
      [rowId]: event.currentTarget,
    });
  };

  // Function to close a specific category menu for a row
  const handleCategoryMenuClose = (rowId: any) => () => {
    setCategoryMenuState({ ...categoryMenuState, [rowId]: null });
  };

  const handleDeleteSubcategory = async (id: any, subcategoryId: any) => {
    try {
      if (window.confirm("Are you sure you want to delete this document?")) {
        setIsLoading(true);
        setCategoryMenuState({ ...categoryMenuState, [id]: null });
        const res = await deleteFile(id, subcategoryId);
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
      const { data } = await getFolderList(user?._id);
      const transformedData = data.map((row: any, index: number) => ({
        ...row,
        id: index, // Add a unique identifier for each row
        fileslength: row.files ? row.files.length : "",
      }));
      setCategorylist(transformedData);

      console.log("branch", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  const handleDelete = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete this folder?")) {
        setIsLoading(true);
        const res = await deleteFolder(id);
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
        window.confirm(
          "Are you sure you want to change the status this folder?"
        )
      ) {
        setIsLoading(true);
        const res = await updateStatus(id, { status: "Active" });
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
        window.confirm(
          "Are you sure you want to change the status this folder?"
        )
      ) {
        setIsLoading(true);
        const res = await updateStatus(id, { status: "Inactive" });
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
        item.name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, catategorylist]);

  const handleFileClick = (fileUrl: any) => {
    window.open(fileUrl, "_blank");
  };

  const columns: any[] = [
    {
      flex: 0.4,
      field: "name",
      minWidth: 180,
      maxWidth: 200,
      headerName: "Folder Name",
      renderCell: ({ row }: { row: any }) => {
        console.log(row.files, "file");

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FolderOpenIcon sx={{ color: "gray", mr: 1 }} />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>
                {row?.name}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 18,
      renderCell: ({ row }: { row: any }) => {
        console.log(row.files, "file");
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ color: "text.secondary" }}>
                <Button
                  endIcon={
                    <ArrowDropDownCircleOutlinedIcon
                      sx={{
                        transform: categoryMenuState[row._id]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s",
                      }}
                    />
                  }
                  onClick={handleCategoryMenuOpen(row._id)}
                ></Button>
                <Menu
                  anchorEl={categoryMenuState[row._id]}
                  open={Boolean(categoryMenuState[row._id])}
                  onClose={handleCategoryMenuClose(row._id)}
                  PaperProps={{
                    style: {
                      maxHeight:
                        Array.isArray(row?.files) && row.files.length > 5
                          ? 200
                          : "auto",
                      overflow: "auto",
                    },
                  }}
                >
                  {Array.isArray(row?.files) && row.files.length ? (
                    row.files.map((file: any) => (
                      <MenuItem
                        key={file?._id}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Tooltip title={file?.desc}>
                              <Typography noWrap>
                                {file?.desc} {/* Description */}
                              </Typography>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={4} sx={{ mt: -1 }}>
                            <IconButton
                              onClick={() => handleFileClick(file?.fileUrl)}
                              sx={{
                                color: "#1976d2",
                                fontSize: "15px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {file?.name} {/* File Name */}
                            </IconButton>
                          </Grid>
                          <Grid item xs={2} sx={{ mt: -1 }}>
                            <Button
                              onClick={() =>
                                handleDeleteSubcategory(row._id, file._id)
                              }
                              sx={{ color: "red", ml: 1 }}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    ))
                  ) : (
                    <Typography sx={{ padding: 2 }}>
                      Nothing to display
                    </Typography>
                  )}
                </Menu>
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 125,
      field: "fileslength", // Change the field to "fileslength"
      headerName: "Documents",
      sortable: true, // Enable sorting
      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.fileslength}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      field: "createdByName",
      minWidth: 230,
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

        const formattedDate = format(zonedDate, "dd-MM-yyyy HH:mm", {
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
    // {
    //   flex: 0.2,
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
    //           fontSize: "15px",
    //           fontWeight: "bold",
    //           backgroundColor:
    //             row.status === "active"
    //               ? "#D3FDE4"
    //               : row.status === "archived"
    //               ? "#FFF7CB"
    //               : "#FFCBCB",
    //           color:
    //             row.status === "active"
    //               ? "#3F9748"
    //               : row.status === "archived"
    //               ? "#D32F2F"
    //               : "#red",
    //           borderColor:
    //             row.status === "active"
    //               ? "#D3FDE4"
    //               : row.status === "archived"
    //               ? "#FFF7CB"
    //               : "#FFCBCB", // Optional: to match border color with background
    //           "& .MuiChip-label": {
    //             // This targets the label inside the chip for more specific styling
    //             color:
    //               row.status === "active"
    //                 ? "#3F9748"
    //                 : row.status === "archived"
    //                 ? "#D36A2F"
    //                 : "#D32F2F",
    //           },
    //         }}
    //       />
    //     </>
    //   ),
    // },

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
                user?.role?.permissions?.create_docs
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.create_docs) {
                    handleClose();
                    const folderId = menuState.row?._id;
                    const folderName = encodeURIComponent(
                      menuState.row?.name || ""
                    );
                    navigate(
                      `/dashboard/Upload-folder/${folderId}?name=${folderName}`
                    );
                  }
                }}
              >
                Add Document
              </MenuItem>
            </Tooltip>
            <Tooltip
              title={
                user?.role?.permissions?.edit_folder
                  ? ""
                  : "You have no permission"
              }
              arrow
            >
              <MenuItem
                onClick={() => {
                  if (user?.role?.permissions?.edit_folder) {
                    handleClose();
                    setIsOpenCreate(true);
                    setItemName({
                      id: menuState.row?._id || "",
                      name: menuState.row?.name || "",
                    });
                  }
                }}
              >
                Rename
              </MenuItem>
            </Tooltip>
            <MenuItem
              onClick={() => {
                handleDelete(menuState.row?._id); // Use menuState.row._id
                handleClose();
              }}
            >
              Delete
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
          <CardHeader title="Folders" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/" className="link-no-underline">
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
                    user?.role?.permissions?.create_folder
                      ? ""
                      : "You have no permission"
                  }
                  arrow
                >
                  <span>
                    <Button
                      sx={{ ml: 2, textTransform: "none" }}
                      variant="contained"
                      // component={Link}
                      // to={hasAddUsersPermission ? "/dashboard/create-user" : ""}
                      disabled={!user?.role?.permissions?.create_folder}
                      onClick={() => setIsOpenCreate(true)}
                    >
                      <AddIcon /> Create Folder
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
      <CreateFolder
        open={isOpenCreate}
        onClose={handleCloseModalResetPass}
        itemName={itemName}
        listData={listData}
        setItemName={setItemName}
      />
    </>
  );
};

export default FolderLIst;
