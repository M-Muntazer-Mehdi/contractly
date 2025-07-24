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
  updateStatus,
} from "@/service/api/apiMethods";
import AddIcon from "@mui/icons-material/Add";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { deleterole, getList } from "@/service/api/roleperm";
import { deleteTags } from "@/service/api/tags";

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
    flex: 0.2,
    field: "name",
    // minWidth: 230,
    headerName: "Custom Role",
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
    flex: 0.2,
    field: "desc",
    minWidth: 230,
    headerName: "Role Description",
    renderCell: ({ row }: any) => {
      const { desc } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: "text.secondary" }}>
              {desc || "-"}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    field: "uploaded_by",
    minWidth: 140,
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
];

const RoleList = () => {
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
      const { data } = await getList();

      const excludedIds = [
        // "65a7b5af40c7294e7706aac8",
        "65a7d392b1df3e0517bb7055",
        // "65a7d271bcf56486353dc195",
        // "65a62aeaf326bd32e198fbce",
      ];
      const filteredData = data.filter(
        (item: any) => !excludedIds.includes(item._id)
      );

      setCategorylist(filteredData);

      console.log("dataaaa", filteredData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;

  const handleDelete = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete this role?")) {
        setIsLoading(true);
        const res = await deleterole(id);
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
          "Are you sure you want to change the status of this tag?"
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
          "Are you sure you want to change the status of this tag?"
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
    listData();
  }, []);

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
            <MenuItem
              onClick={() => {
                handleClose();
                navigate(`/dashboard/crete-custom-role/${menuState.row?._id}`); // Use menuState.row._id
              }}
            >
              Edit
            </MenuItem>

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
          <CardHeader title="Roles" />
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ pl: 2.2, mt: -2, mb: 2, fontSize: "13px" }}
          >
            <Link to="/dashboard/role-list" className="link-no-underline">
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
                <Button
                  sx={{ textTransform: "none", width: "fit-content", mr: 2 }}
                  variant="outlined"
                  component={Link}
                  to="/dashboard/system-role"
                >
                  System Roles
                </Button>

                <Button
                  sx={{ textTransform: "none", width: "fit-content" }}
                  variant="contained"
                  component={Link}
                  to="/dashboard/crete-custom-role"
                >
                  <AddIcon /> Create Custom Role
                </Button>
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

export default RoleList;
