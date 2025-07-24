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
import DownloadIcon from "@mui/icons-material/Download";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
} from "@mui/material";
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
    flex: 0.2,
    field: "name",
    minWidth: 150,
    headerName: "Invoice number",
    renderCell: ({ row }: any) => {
      const { name } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Img src={logo} /> */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: "text.secondary" }}>
              {"1272442251"}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    field: "date",
    minWidth: 150,
    headerName: "Invoice date",
    renderCell: ({ row }: any) => {
      const { name } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Img src={logo} /> */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: "text.secondary" }}>
              {"24 Apr 2023"}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    field: "amount",
    minWidth: 150,
    headerName: "Amount",
    renderCell: ({ row }: any) => {
      const { name } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Img src={logo} /> */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ color: "text.secondary" }}>{"US$499"}</Typography>
          </Box>
        </Box>
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
];
const InvoiceDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 8,
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
            <DownloadIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="md">
        <DialogTitle>All invoices</DialogTitle>
        <Divider />
        <DialogContent>
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
                <Box sx={{ maxHeight: 510, width: "100%", overflow: "auto" }}>
                  <DataGrid
                    style={{ paddingLeft: "10px", paddingRight: "10px" }}
                    pagination
                    rows={filteredList || []}
                    columns={columns}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    pageSizeOptions={[7, 25, 50]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onRowSelectionModelChange={(rows: any) =>
                      setSelectedRows(rows)
                    }
                    getRowId={(row: any) => row._id}
                    // disableColumnMenu
                  />
                </Box>
              )}
            </Card>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceDialog;
