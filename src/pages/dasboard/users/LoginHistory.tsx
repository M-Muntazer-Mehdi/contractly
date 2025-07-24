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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

// ** Third Party Imports

import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { logiHistory } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { list } from "postcss";
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

interface Row {
  Date: string;
}

const formatDateTime = (dateTimeString: string) => {
  const dateTime = new Date(dateTimeString);

  // Format date as "day month year"
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = dateTime.toLocaleDateString(undefined, optionsDate);

  // Format time as "hh:mm am/pm"
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedTime = dateTime.toLocaleTimeString(undefined, optionsTime);

  return {
    formattedDate,
    formattedTime,
  };
};

const defaultColumns: GridColDef[] = [
  {
    flex: 0.2,
    field: "LoginDate",
    headerName: "Login Date",
    renderCell: ({ row }: { row: Row }) => {
      const { formattedDate } = formatDateTime(row.Date);

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
    field: "LoginTime",
    headerName: "Login Time",
    renderCell: ({ row }: { row: Row }) => {
      const { formattedTime } = formatDateTime(row.Date);

      return (
        <Typography sx={{ color: "text.secondary" }}>
          {formattedTime}
        </Typography>
      );
    },
  },
];
const LoginHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const id = user?._id;
  // ** State
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [List, setList] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [data, setData] = useState<any>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredList, setFilteredList] = useState<Array<any>>([]);

  const applyDateFilter = () => {
    if (startDate && endDate) {
      console.log(startDate, startDate, "logdate");

      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      const filtered = List.filter((item) => {
        const itemDate = new Date(item?.Date);
        return itemDate >= startDate && itemDate <= adjustedEndDate;
      });

      console.log(filtered, "logdatef");
      setFilteredList(filtered);
    } else {
      // Reset to full list if no dates are selected
      setFilteredList(List);
    }
  };
  useEffect(() => {
    // If you want to apply a default filter, uncomment and set default dates
    // setStartDate(defaultStartDate);
    // setEndDate(defaultEndDate);

    // Apply the filter or set the full list if no dates are provided
    if (startDate && endDate) {
      applyDateFilter();
    } else {
      setFilteredList(List);
    }
  }, [List]);

  const listData = async () => {
    try {
      setIsLoading(true);
      const { user } = await logiHistory(id);
      setList(user?.loginHistory);
      setData(user);
      console.log("user", user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listData();
  }, []);

  // const filteredList = useMemo(() => {
  //   let result = List;
  //   if (search?.trim().length) {
  //     result = result.filter((item) =>
  //       item.branchName?.toLowerCase().includes(search.trim().toLowerCase())
  //     );
  //   }
  //   return result;
  // }, [search, List]);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ mb: -4 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params: any) => (
                  <TextField {...params} size="small" />
                )}
              /> */}
              {/* <DatePicker
                sx={{ mr: 2, ml: 2 }}
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params: any) => (
                  <TextField {...params} size="small" />
                )}
              /> */}
              <Button
                onClick={applyDateFilter}
                variant="contained"
                size="large"
                sx={{ textTransform: "none", height: "3.5rem" }}
              >
                Apply Filter
              </Button>
            </Box>
          </LocalizationProvider>
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
              ></Box>
            ) : (
              <DataGrid
                autoHeight
                pagination
                rows={filteredList || []}
                columns={defaultColumns}
                // checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
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
    </>
  );
};

export default LoginHistory;
