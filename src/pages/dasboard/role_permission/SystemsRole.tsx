/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
  Card,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { create } from "@/service/api/tags";
import MenuIcon from "@mui/icons-material/Menu";
import AssessmentIcon from "@mui/icons-material/Assessment";
import OverView from "@/pages/dasboard/contract/sdk/OverView";
import { List, ListItemButton, ListItemIcon } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Collaborator from "@/pages/dasboard/role_permission/Collaborator";
import StanderUser from "@/pages/dasboard/role_permission/StanderUser";
import Admin from "@/pages/dasboard/role_permission/Admin";
import GlobalAdmin from "@/pages/dasboard/role_permission/GlobalAdmin";

type FormValues = {
  name: string;
  manager: string;
  status: string;
  members: [];
};

const SystemsRole = () => {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [member, setMamber] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<string>("overview");
  const [search, setSearch] = useState<string>("");
  const modules: Record<string, any> = {
    overview: {
      icon: "Collaborator",
      content: <Collaborator />,
    },
    standard_user: {
      icon: "Standard User",
      content: <StanderUser />,
    },
    Admin: {
      icon: "Admin",
      content: <Admin />,
    },
    global_admin: {
      icon: "Global Admin",
      content: <GlobalAdmin />,
    },

    // Add more modules as needed
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleModuleClick = (moduleName: string) => {
    setSelectedModule(moduleName);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        id: user._id,
        name: data.name,
        createdByName: user?.firstName,
      };

      const response = await create(payload);
      if (response.ok === true) {
        toast.success(response.message);
        navigate("/dashboard/tags-list");
      } else {
        const errorMessage = response.message || "An error occurred";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Failed to create clause.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data ||
          "An error occurred";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
            position: "absolute",
            margin: "auto",
            width: "70%",
          }}
        >
          <ProgressCircularCustomization />
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            opacity: isLoading ? "30%" : "100%",
            pb: 2,
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
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Roles & Permissions
              </Typography>

              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ mt: -2, mb: 0, fontSize: "14px" }}
              >
                <Link
                  style={{ marginRight: "-7px" }}
                  to="/dashboard/role-list"
                  className="link-no-underline"
                >
                  Home
                </Link>
                <Typography
                  sx={{ fontSize: "14px", ml: "-7px" }}
                  color="text.primary"
                >
                  System Roles
                </Typography>
              </Breadcrumbs>
            </Box>
          </div>
        </Box>
        <Card sx={{ mb: 3 }}>
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
        <Paper>
          <Grid container>
            <Box
              sx={{
                width: "100%",
                flexShrink: 0,
                display: "flex",
                border: "1px solid #BEBEBE",
                minHeight: "600px",
                maxHeight: "600px",
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={2}
                  sx={{
                    borderRight: sidebarExpanded ? "1px solid #BEBEBE" : "none",
                  }}
                >
                  <List>
                    {Object.keys(modules).map((key) => (
                      <ListItemButton
                        sx={{}}
                        key={key}
                        selected={selectedModule === key}
                        onClick={() =>
                          key === "toggle"
                            ? toggleSidebar()
                            : handleModuleClick(key)
                        }
                      >
                        <ListItemIcon sx={{ fontSize: "17px", color: "black" }}>
                          {modules[key].icon}
                        </ListItemIcon>
                      </ListItemButton>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={10}>
                  {sidebarExpanded && selectedModule !== "toggle" && (
                    <Box
                      sx={{
                        padding: 2,
                        maxHeight: "600px",
                        overflowY: "scroll",
                      }}
                    >
                      {modules[selectedModule].content}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default SystemsRole;
