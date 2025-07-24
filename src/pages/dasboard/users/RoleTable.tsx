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
import { getList } from "@/service/api/roleperm";
// ** Third Party Imports

import toast from "react-hot-toast";
import permission from "@/assets/permission.png";
import Button from "@mui/material/Button";
import { Checkbox, Divider, FormControl } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getUserList } from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";

const RoleTable: React.FC<{
  setRoleId: React.Dispatch<React.SetStateAction<string>>;
  roleId: string;
}> = ({ setRoleId, roleId }) => {
  const navigate = useNavigate();
  // ** State
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 3,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [systemsRolelist, setsystemsRolelist] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

  const [selectedId, setSelectedId] = useState<any | null>(null);

  const handleCheckboxChange = (id: string) => {
    console.log(id);
    setRoleId(id);
    setSelectedId(id === selectedId ? null : id);
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();
      const excludedIds = [
        "65a7b5af40c7294e7706aac8",
        "65a7d392b1df3e0517bb7055",
        "65a7d271bcf56486353dc195",
        "65a62aeaf326bd32e198fbce",
      ];
      const filteredCustom = data.filter(
        (item: any) => !excludedIds.includes(item._id)
      );
      setCategorylist(filteredCustom);

      const includedIds = [
        "65a7b5af40c7294e7706aac8",
        "65a7d392b1df3e0517bb7055",
        "65a7d271bcf56486353dc195",
        "65a62aeaf326bd32e198fbce",
      ];
      const filteredSystem = data.filter((item: any) =>
        includedIds.includes(item._id)
      );

      setsystemsRolelist(filteredSystem);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(roleId, "roleId");

  useEffect(() => {
    setSelectedId(roleId);
    listData();
  }, []);

  const filteredList = useMemo(() => {
    let result = catategorylist;
    if (search?.trim().length) {
      result = result.filter((item) =>
        item.branchName?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return result;
  }, [search, catategorylist]);
  const defaultColumns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 125,
      field: "Role Name",
      headerName: "Role Name",
      renderCell: ({ row }: { row: any }) => {
        const { _id, name } = row;
        return (
          <Typography sx={{ color: "text.secondary" }}>
            <Checkbox
              sx={{ mr: 1 }}
              checked={_id === selectedId}
              onChange={() => handleCheckboxChange(_id)}
            />
            {name}
          </Typography>
        );
      },
    },

    {
      flex: 0.2,
      minWidth: 500,
      field: "desc",
      headerName: "Description",
      renderCell: ({ row }: { row: any }) => {
        const { desc } = row;
        return (
          <Typography sx={{ color: "text.secondar" }}>{`${desc}`}</Typography>
        );
      },
    },
  ];
  return (
    <>
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
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={permission}
                alt="send"
                style={{ marginRight: 8, height: "20px" }}
              />
              <Typography variant="subtitle1">
                System roles and permissions
              </Typography>
              <Divider sx={{ flexGrow: 1, ml: 2 }} />
            </Box>
            <div style={{ display: "flex", alignItems: "center" }}>
              {systemsRolelist?.map((list: any) => (
                <Typography
                  key={list._id}
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  <Checkbox
                    sx={{ mr: 1 }}
                    checked={list._id === selectedId}
                    onChange={() => handleCheckboxChange(list._id)}
                  />
                  {list.name}
                </Typography>
              ))}
            </div>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <img
                src={permission}
                alt="send"
                style={{ marginRight: 8, height: "20px" }}
              />
              <Typography variant="subtitle1">
                {" "}
                Custom roles and Permission
              </Typography>
              <Divider sx={{ flexGrow: 1, ml: 2 }} />
            </Box>
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

              <DataGrid
                style={{ maxHeight: 340 }}
                rows={filteredList || []}
                columns={defaultColumns}
                // checkboxSelection
                // hideSelectAll={true}
                disableRowSelectionOnClick
                pageSizeOptions={[3, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={(rows: any) => setSelectedRows(rows)}
                getRowId={(row) => row._id}
                // disableColumnMenu
              />
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default RoleTable;
