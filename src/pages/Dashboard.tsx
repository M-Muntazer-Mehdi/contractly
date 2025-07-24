/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Badge,
  ListItemIcon,
  useMediaQuery,
  Collapse,
  useTheme,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import logo from "../assets/logo.jpg";
import home from "../assets/fi-rs-home.svg";
import template from "../assets/temlate.svg";
import reports from "../assets/reports.png";
import docoment from "../assets/document.svg";
import folder from "../assets/fi-rs-folder.svg";
import setting from "../assets/fi-rs-settings.png";
import billing from "../assets/billing.png";
import compony from "../assets/comony-profile.svg";
import userIcon from "../assets/user.png";
import configration from "../assets/configration.svg";
import approval from "../assets/approval_icon.png";
import categories from "../assets/categories.png";
import customfeild from "../assets/customfeild.png";
import clause from "../assets/clause.png";
import roles from "../assets/Roles.png";
import teamsIcon from "../assets/teams.png";
import tagsIcon from "../assets/tags.png";
import logoutIcon from "../assets/logout_icon.png";
import PersonIcon from "@mui/icons-material/Person";

// Import your page components
import HomePage from "@/pages/dasboard/Dashboard";
import TeamsList from "@/pages/dasboard/teams/TeamsLiat";
import SubPage1 from "@/pages/LoginPage";
import CreateBranch from "@/pages/dasboard/branch/CreateBranch";
import BranchList from "@/pages/dasboard/branch/BranchList";
import CreateTeam from "@/pages/dasboard/teams/CreateTeam";
import UpdateBranch from "@/pages/dasboard/branch/UpdateBranch";
import UpdateTeam from "@/pages/dasboard/teams/UpdateTeam";
import UserList from "@/pages/dasboard/users/UserList";
import CreateUser from "@/pages/dasboard/users/CreateUser";
import ResetPassword from "@/pages/ResetPassword";
import LoginHistory from "@/pages/dasboard/users/LoginHistory";
import UpdateUser from "@/pages/dasboard/users/UpdateUser";
import UserDetail from "@/pages/dasboard/users/UserDetail";
import UserEdit from "@/pages/dasboard/profile/UserEdit";
import { useAuth } from "@/hooks/useAuth";
import Setting from "@/pages/dasboard/profile/Setting";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryList from "@/pages/dasboard/category/CategoryList";
import CreateCategory from "@/pages/dasboard/category/CreateCategory";
import UpdateCategory from "@/pages/dasboard/category/UpdateCategoey";
import CreateTags from "@/pages/dasboard/tags/CreateTags";
import TagList from "@/pages/dasboard/tags/TagList";
import UpdateTags from "@/pages/dasboard/tags/UpdateTags";
import ClausesList from "@/pages/dasboard/clauses/ClausesList";
import UpdateClauses from "@/pages/dasboard/clauses/UpdateClauses";
import CreateClauses from "@/pages/dasboard/clauses/CreateClauses";
import FolderLIst from "@/pages/dasboard/folders/FolderList";
import Upload from "@/pages/dasboard/folders/Upload";
import ComponyList from "@/pages/dasboard/compony/ComponyList";
import UpdateCompony from "@/pages/dasboard/compony/UpdateCompony";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TaskIcon from "@mui/icons-material/Task";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import BusinessIcon from "@mui/icons-material/Business";
import TemplateList from "@/pages/dasboard/templates/TemplateList";
import CreateTemplate from "@/pages/dasboard/templates/CreateTemplate";
import UpdateTemplate from "@/pages/dasboard/templates/UpdateTemplate";
import DescriptionIcon from "@mui/icons-material/Description";
import FieldList from "@/pages/dasboard/customField/FieldList";
import InputIcon from "@mui/icons-material/Input";
import ApprovalList from "@/pages/dasboard/approval/ApprovalList";
import CreateApproval from "@/pages/dasboard/approval/CreateApproval";
import UpdateApproval from "@/pages/dasboard/approval/UpdateApproval";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ContractList from "@/pages/dasboard/contract/ContractList";
import ArticleIcon from "@mui/icons-material/Article";
import CreateContract from "@/pages/dasboard/contract/CreateContract";
import EditorDahsbord from "@/pages/dasboard/contract/sdk/EditorDahsbord";
import CustomTextEditor from "@/pages/dasboard/contract/sdk/CustomTextEditor";
import CardsSubscription from "@/pages/dasboard/billing/CardsSubcription";
import RoleList from "@/pages/dasboard/role_permission/RoleList";
import CreateCustomRole from "@/pages/dasboard/role_permission/CreateCustomRole";
import SystemsRole from "@/pages/dasboard/role_permission/SystemsRole";
import UserDetailSingleUser from "@/pages/dasboard/users/UserDetailSingleUser";
import DetailBranch from "@/pages/dasboard/branch/DetailBranch";
import { useContract } from "@/hooks/useContract";
import { useLocation } from "react-router-dom";
import { ContractContext } from "@/context/ContractContext";
import NewSyncsF from "@/pages/dasboard/contract/sdk/NewSyncsF";

// Usage: <ArticleIcon />

// Usage: <AssignmentIcon />

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { contractStatus, setContractStatus } = useContract();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(true);
  const [leftSideBar, setLeftSideBar] = useState(true);
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const [openSections, setOpenSections] = useState<any>({
    dashboard: false,
    contract: false,
    setting: false,
    configuration: false,
    button: "true",
  });
  const { leftsidebarExpanded, setLeftSidebarExpanded } =
    useContext(ContractContext);

  const location = useLocation();
  const drawerWidth = leftsidebarExpanded ? 53 : 230;
  // console.log(leftsidebarExpanded, "leftsidebarExpandedyyy");

  // Split the pathname by '/' and filter out empty strings
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Assuming 'editor-dahsbord' is always after 'dashboard',
  // and you want to get the segment after 'dashboard'
  const editorDashboardSegment =
    pathSegments[pathSegments.indexOf("dashboard") + 1];

  const [selectedModule, setSelectedModule] = useState<any>(null);

  const handleModuleClick = (moduleName: any) => {
    setSelectedModule(moduleName);
  };
  const statuses = ["Draft", "Review", "Signing", "Signed", "Active", "Terminated", "Deleted"];
  const expireDate = [
    "All",
    "Next 30 days",
    "Next 60 days",
    "Next 90 days",
    "Expired",
    "Active",
  ];
  const ExpireColors: any = {
    All: "#155BE5",
    "Next 30 days": "#FFAA04",
    "Next 60 days": "#725FE7",
    "Next 90 days": "#CDAD00",
    Expired: "#BC3D89",

    // Add more status-color mappings as needed
  };
  const statusColors: any = {
    Draft: "#FFAA04",
    Review: "#725FE7",
    Signing: "#CDAD00",
    Signed: "#BC3D89",
    Active: "#3F9748",
    // Add more status-color mappings as needed
  };
  // Properly type the section parameter
  const handleSectionClick = (section: keyof any) => {
    setOpenSections((prevSections: any) => ({
      // Set all sections to false initially
      ...Object.keys(prevSections).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      ),
      // Then set only the clicked section to true
      [section]: !prevSections[section],
    }));
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-account-menu";

  useEffect(() => {
    if (leftsidebarExpanded) {
      if (openSections.contract) {
        handleSectionClick("contract");
        setSelectedModule("contract");
      }
      // handleDrawerToggle();
    }
  }, [leftsidebarExpanded]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setLeftSideBar(!leftSideBar);
    setLeftSidebarExpanded((prevState: any) => !prevState);
    console.log(openSections, "openSections");
    if (openSections.contract) {
      handleSectionClick("contract");
    }
  };

  const handleStatusClick = (newStatus: any) => {
    setContractStatus({ status: newStatus });
  };
  const handleExpireClick = (expire: string) => {
    setContractStatus({ expire: expire });
  };
  const handleToggleExpire = () => {
    setOpen(!open);
  };

  const BurgerIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path className="hover-burger" d="M9.5625 10.8594H20.8125C20.9156 10.8594 21 10.775 21 10.6719V9.35938C21 9.25625 20.9156 9.17188 20.8125 9.17188H9.5625C9.45937 9.17188 9.375 9.25625 9.375 9.35938V10.6719C9.375 10.775 9.45937 10.8594 9.5625 10.8594ZM9.375 15.6406C9.375 15.7437 9.45937 15.8281 9.5625 15.8281H20.8125C20.9156 15.8281 21 15.7437 21 15.6406V14.3281C21 14.225 20.9156 14.1406 20.8125 14.1406H9.5625C9.45937 14.1406 9.375 14.225 9.375 14.3281V15.6406ZM21.1875 4.25H2.8125C2.70937 4.25 2.625 4.33437 2.625 4.4375V5.75C2.625 5.85312 2.70937 5.9375 2.8125 5.9375H21.1875C21.2906 5.9375 21.375 5.85312 21.375 5.75V4.4375C21.375 4.33437 21.2906 4.25 21.1875 4.25ZM21.1875 19.0625H2.8125C2.70937 19.0625 2.625 19.1469 2.625 19.25V20.5625C2.625 20.6656 2.70937 20.75 2.8125 20.75H21.1875C21.2906 20.75 21.375 20.6656 21.375 20.5625V19.25C21.375 19.1469 21.2906 19.0625 21.1875 19.0625ZM2.70469 12.6617L6.36797 15.5469C6.50391 15.6547 6.70547 15.5586 6.70547 15.3852V9.61484C6.70547 9.44141 6.50625 9.34531 6.36797 9.45312L2.70469 12.3383C2.68006 12.3574 2.66012 12.382 2.64641 12.41C2.6327 12.438 2.62557 12.4688 2.62557 12.5C2.62557 12.5312 2.6327 12.562 2.64641 12.59C2.66012 12.618 2.68006 12.6426 2.70469 12.6617Z" fill="#616161" />
      </svg>
    )
  }

  const drawer = (
    <div>
      <img
        src={logo}
        alt="Logo"
        style={{
          maxWidth: isMobile ? "100px" : "250px",
          marginTop: "0px",
          alignItems: "left",
          marginLeft: "-0.5rem",
        }}
      />

      <Divider />
      <div
        style={{
          display: "flex",
          justifyContent: leftsidebarExpanded ? "flex-start" : "flex-end",
          marginLeft: leftsidebarExpanded ? "0.5rem" : "0rem",
          marginTop: "0rem",
          marginBottom: ".3rem",
        }}
      >
        <IconButton
          onClick={() => {
            handleDrawerToggle();
          }}
        >
          <BurgerIcon />
        </IconButton>
      </div>
      <List
        onClick={() => {
          handleDrawerToggle(), setLeftSidebarExpanded(false);
        }}
      >
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Home" : ""}
        >
          <ListItemButton
            component={Link}
            to="/dashboard"
            sx={{
              height: "35px",
              mb: "16px",

            }}
            className="manual-list"
            onClick={() => handleModuleClick("home")}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <g clip-path="url(#clip0_3216_2515)">
                  <path className="hover-burger" d="M19 5.5V7.5H15V5.5H19ZM9 5.5V11.5H5V5.5H9ZM19 13.5V19.5H15V13.5H19ZM9 17.5V19.5H5V17.5H9ZM21 3.5H13V9.5H21V3.5ZM11 3.5H3V13.5H11V3.5ZM21 11.5H13V21.5H21V11.5ZM11 15.5H3V21.5H11V15.5Z" fill={selectedModule == "home" ? "#5D55E3" : "#616161"} />
                </g>
                <defs>
                  <clipPath id="clip0_3216_2515">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                </defs>
              </svg>
            </ListItemIcon>
            <span
              className="text-hover"
              style={{
                color: selectedModule === "home" ? "#5D55E3" : "",
              }}
            >
              Dashboard
            </span>
          </ListItemButton>
        </Tooltip>
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Inbox" : ""}
        >
          <ListItemButton
            component={Link}
            to="/dashboard"
            sx={{
              height: "35px",
              mb: "16px",
            }}
            className="manual-list"
            onClick={() => handleModuleClick("inbox")}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <g clip-path="url(#clip0_3216_2520)">
                  <path className="hover-burger" d="M19 3.5H5C3.9 3.5 3 4.4 3 5.5V19.5C3 20.0304 3.21071 20.5391 3.58579 20.9142C3.96086 21.2893 4.46957 21.5 5 21.5H19C20.1 21.5 21 20.6 21 19.5V5.5C21 4.4 20.1 3.5 19 3.5ZM19 19.5H5V16.5H8.56C9.25 17.69 10.53 18.5 12.01 18.5C13.49 18.5 14.76 17.69 15.46 16.5H19V19.5ZM19 14.5H14.01C14.01 15.6 13.11 16.5 12.01 16.5C10.91 16.5 10.01 15.6 10.01 14.5H5V5.5H19V14.5Z" fill={selectedModule === "inbox" ? "#5D55E3" : "#616161"} />
                </g>
                <defs>
                  <clipPath id="clip0_3216_2520">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                </defs>
              </svg>
            </ListItemIcon>
            <span
              className="text-hover"
              style={{
                color: selectedModule === "inbox" ? "#5D55E3" : "",
              }}
            >
              Inbox
            </span>
          </ListItemButton>
        </Tooltip>
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Documents" : ""}
        >
          <ListItemButton
          className="manual-list"
            sx={{
              height: "35px",
              mb: "16px",
            }}
            onClick={() => handleModuleClick("contract")}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <Link
                to="/dashboard/contract-list"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path className="hover-burger" d="M19.707 7.793L15.707 3.793C15.52 3.605 15.266 3.5 15 3.5H7C5.346 3.5 4 4.846 4 6.5V18.5C4 20.154 5.346 21.5 7 21.5H17C18.654 21.5 20 20.154 20 18.5V8.5C20 8.234 19.895 7.98 19.707 7.793ZM17.586 8.5H16.5C15.673 8.5 15 7.827 15 7V5.914L17.586 8.5ZM17 19.5H7C6.448 19.5 6 19.052 6 18.5V6.5C6 5.948 6.448 5.5 7 5.5H14V7C14 8.379 15.121 9.5 16.5 9.5H18V18.5C18 19.052 17.552 19.5 17 19.5Z" fill={selectedModule === "contract" ? "#5D55E3" : "#616161"} />
                </svg>
              </Link>
            </ListItemIcon>
            <Link
              to="/dashboard/contract-list"
              style={{
                color: "inherit",
                textDecoration: "none",
                // width: "150px",
              }}
            >
              <span
                style={{
                  color: selectedModule === "contract" ? "#5D55E3" : "",
                }}
                className="text-hover"
              >
                Document
              </span>

            </Link>

            {openSections.contract ? (
              <span style={{
                position: "relative",
                left: "25px"
              }}
                onClick={(event) => {
                  event.stopPropagation(); // Stop the click from propagating to the parent elements
                  handleModuleClick("contract")
                  handleSectionClick("contract");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                  <path className="burger-hover1" d="M12 1L6.5 8L1 1" stroke={selectedModule === "contract" ? "#5D55E3" : "#616161"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            ) : (
              <span style={{
                position: "relative",
                left: "25px"
              }}
                onClick={(event) => {
                  event.stopPropagation(); // Stop the click from propagating to the parent elements
                  handleModuleClick("contract")

                  handleSectionClick("contract");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                  <path className="burger-hover1" d="M1 1L8 6.5L1 12" stroke={selectedModule === "contract" ? "#5D55E3" : "#616161"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            )}
          </ListItemButton>
        </Tooltip>
        <Collapse in={openSections.contract} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ mt: -2 }}>
            {statuses?.map((statusItem) => (
              <ListItemButton
              className="dropdowns-icons"
                key={statusItem}
                sx={{
                  pl: leftsidebarExpanded ? 0.4 : 7,
                  fontSize: leftsidebarExpanded ? "3px" : "10px",
                }}
                onClick={() => handleStatusClick(statusItem)}
              >
                <div
                  className="bg-change"
                  style={{
                    height: leftsidebarExpanded ? "6px" : "10px",
                    width: leftsidebarExpanded ? "6px" : "10px",
                    // backgroundColor: "#D1D1D1",
                    borderRadius: leftsidebarExpanded ? "100%" : "50%",
                    marginRight: leftsidebarExpanded ? "4px" : "10px",
                    alignSelf: "center",
                  }}
                />
                {/* <ListItemText
                  primary={statusItem}
                  sx={{
                    fontSize: leftsidebarExpanded ? "5px" : "10px",
                    color:
                      statusItem === contractStatus.status
                        ? "#1976d2"
                        : "initial",
                  }}
                  primaryTypographyProps={{
                    variant: "subtitle2",
                    fontSize: leftsidebarExpanded ? "12px" : "14px",
                    color: "white",
                  }}
                /> */}
                <span className="text-status">
                  {statusItem}
                </span>
              </ListItemButton>
            ))}

          </List>
        </Collapse>
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Templates" : ""}
        >
          <ListItemButton
          className="manual-list"
            component={Link}
            to="/dashboard/template-list"
            sx={{
              height: "35px",
              mb: "16px",
            }}
            onClick={() => handleModuleClick("template")}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className="hover-burger" fill-rule="evenodd" clip-rule="evenodd" d="M3 3.5V9.5H21V3.5H3ZM19 5.5H5V7.5H19V5.5Z" fill={selectedModule === "template" ? "#5D55E3" : "#616161"} />
                <path className="hover-burger" fill-rule="evenodd" clip-rule="evenodd" d="M3 11.5V21.5H11V11.5H3ZM9 13.5H5V19.5H9V13.5Z" fill={selectedModule === "template" ? "#5D55E3" : "#616161"} />
                <path className="hover-burger" d="M21 11.5H13V13.5H21V11.5Z" fill={selectedModule === "template" ? "#5D55E3" : "#616161"} />
                <path className="hover-burger" d="M13 15.5H21V17.5H13V15.5Z" fill={selectedModule === "template" ? "#5D55E3" : "#616161"} />
                <path className="hover-burger" d="M21 19.5H13V21.5H21V19.5Z" fill={selectedModule === "template" ? "#5D55E3" : "#616161"} />
              </svg>
            </ListItemIcon>
            <span
              style={{
                color: selectedModule === "template" ? "#5D55E3" : "",
              }}
              className="text-hover"
            >
              Templates
            </span>
          </ListItemButton>
        </Tooltip>
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Folder" : ""}
        >
          <ListItemButton
            component={Link}
            to="/dashboard/folder-list"
            sx={{
              height: "35px",
              mb: "16px",
            }}
            className="manual-list"
            onClick={() => handleModuleClick("folder")}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className="hover-burger" d="M20.625 7.49375H12.2109L9.46172 4.86406C9.42674 4.83132 9.38073 4.81291 9.33281 4.8125H3.375C2.96016 4.8125 2.625 5.14766 2.625 5.5625V19.4375C2.625 19.8523 2.96016 20.1875 3.375 20.1875H20.625C21.0398 20.1875 21.375 19.8523 21.375 19.4375V8.24375C21.375 7.82891 21.0398 7.49375 20.625 7.49375ZM19.6875 18.5H4.3125V6.5H8.73047L11.5336 9.18125H19.6875V18.5Z" fill={
                  selectedModule === "folder" ? "#5D55E3" : "#616161"
                } />
              </svg>
            </ListItemIcon>
            <span
              style={{
                color: selectedModule === "folder" ? "#5D55E3" : "",
              }}
              className="text-hover"
            >
              Folders
            </span>
          </ListItemButton>
        </Tooltip>
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Reports" : ""}
        >
          <ListItemButton
          className="manual-list"
            component={Link}
            to="/dashboard/folder-list"
            sx={{
              height: "35px",
              mb: "16px",
            }}
            onClick={() => handleModuleClick("reports")}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className="burger-hover1" d="M9 17.5V15.5M12 17.5V13.5M15 17.5V11.5M17 21.5H7C6.46957 21.5 5.96086 21.2893 5.58579 20.9142C5.21071 20.5391 5 20.0304 5 19.5V5.5C5 4.96957 5.21071 4.46086 5.58579 4.08579C5.96086 3.71071 6.46957 3.5 7 3.5H12.586C12.8512 3.50006 13.1055 3.60545 13.293 3.793L18.707 9.207C18.8946 9.39449 18.9999 9.6488 19 9.914V19.5C19 20.0304 18.7893 20.5391 18.4142 20.9142C18.0391 21.2893 17.5304 21.5 17 21.5Z" stroke={selectedModule === "reports" ? "#5D55E3" : "#616161"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </ListItemIcon>
            <span
              style={{
                color: selectedModule === "reports" ? "#5D55E3" : "",
              }}
              className="text-hover"
            >
              Reports
            </span>
          </ListItemButton>
        </Tooltip>
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Settings" : ""}
        >
          <ListItemButton
            sx={{
              height: "35px",
              mb: "16px",
            }}
            className="manual-list"
            onClick={() => {
              handleSectionClick("setting")
              handleModuleClick("setting")
            }}
          // component={Link}
          // to="/dashboard/contract-list"
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className="hover-burger" d="M21.6751 15.1648L20.1399 13.8523C20.2126 13.407 20.2501 12.9523 20.2501 12.4977C20.2501 12.043 20.2126 11.5883 20.1399 11.143L21.6751 9.83047C21.7908 9.73134 21.8737 9.59932 21.9127 9.45195C21.9516 9.30458 21.9447 9.14885 21.893 9.00547L21.8719 8.94453C21.4493 7.76334 20.8165 6.66836 20.004 5.7125L19.9618 5.66328C19.8632 5.54739 19.7318 5.46408 19.585 5.42433C19.4381 5.38458 19.2827 5.39026 19.1391 5.44062L17.2336 6.11797C16.5305 5.5414 15.7454 5.08672 14.8969 4.76797L14.529 2.77578C14.5012 2.62588 14.4285 2.48797 14.3205 2.38038C14.2125 2.27279 14.0743 2.20062 13.9243 2.17344L13.861 2.16172C12.6399 1.9414 11.3555 1.9414 10.1344 2.16172L10.0711 2.17344C9.92114 2.20062 9.78295 2.27279 9.67494 2.38038C9.56694 2.48797 9.49422 2.62588 9.46646 2.77578L9.09615 4.77734C8.25448 5.09616 7.47068 5.5506 6.77584 6.12265L4.8563 5.44062C4.71279 5.38986 4.55722 5.38398 4.41028 5.42375C4.26333 5.46352 4.13197 5.54706 4.03365 5.66328L3.99146 5.7125C3.17993 6.66904 2.54718 7.76383 2.12349 8.94453L2.1024 9.00547C1.99693 9.29844 2.08365 9.62656 2.32037 9.83047L3.87427 11.157C3.80162 11.5977 3.76646 12.0477 3.76646 12.4953C3.76646 12.9453 3.80162 13.3953 3.87427 13.8336L2.32037 15.1602C2.20457 15.2593 2.1217 15.3913 2.08277 15.5387C2.04383 15.686 2.05068 15.8418 2.1024 15.9852L2.12349 16.0461C2.54771 17.2273 3.17584 18.3172 3.99146 19.2781L4.03365 19.3273C4.13221 19.4432 4.26358 19.5265 4.41043 19.5663C4.55729 19.606 4.71274 19.6004 4.8563 19.55L6.77584 18.868C7.47427 19.4422 8.25474 19.8969 9.09615 20.2133L9.46646 22.2148C9.49422 22.3647 9.56694 22.5026 9.67494 22.6102C9.78295 22.7178 9.92114 22.79 10.0711 22.8172L10.1344 22.8289C11.3667 23.0504 12.6287 23.0504 13.861 22.8289L13.9243 22.8172C14.0743 22.79 14.2125 22.7178 14.3205 22.6102C14.4285 22.5026 14.5012 22.3647 14.529 22.2148L14.8969 20.2227C15.745 19.9047 16.5346 19.4486 17.2336 18.8727L19.1391 19.55C19.2826 19.6008 19.4382 19.6066 19.5851 19.5669C19.7321 19.5271 19.8634 19.4436 19.9618 19.3273L20.004 19.2781C20.8196 18.3148 21.4477 17.2273 21.8719 16.0461L21.893 15.9852C21.9985 15.6969 21.9118 15.3687 21.6751 15.1648ZM18.4758 11.4195C18.5344 11.7734 18.5649 12.1367 18.5649 12.5C18.5649 12.8633 18.5344 13.2266 18.4758 13.5805L18.3211 14.5203L20.0719 16.018C19.8065 16.6294 19.4715 17.2082 19.0735 17.743L16.8985 16.9719L16.1626 17.5766C15.6024 18.0359 14.979 18.3969 14.304 18.65L13.411 18.9852L12.9915 21.2586C12.3295 21.3336 11.6612 21.3336 10.9993 21.2586L10.5797 18.9805L9.6938 18.6406C9.02584 18.3875 8.40474 18.0266 7.84927 17.5695L7.11334 16.9625L4.92427 17.7406C4.52584 17.2039 4.19302 16.625 3.92584 16.0156L5.69537 14.5039L5.54302 13.5664C5.48677 13.2172 5.4563 12.8562 5.4563 12.5C5.4563 12.1414 5.48443 11.7828 5.54302 11.4336L5.69537 10.4961L3.92584 8.98437C4.19068 8.37265 4.52584 7.79609 4.92427 7.25937L7.11334 8.0375L7.84927 7.43047C8.40474 6.97344 9.02584 6.6125 9.6938 6.35937L10.5821 6.02422L11.0016 3.74609C11.6602 3.67109 12.3329 3.67109 12.9938 3.74609L13.4133 6.01953L14.3063 6.35469C14.979 6.60781 15.6047 6.96875 16.1649 7.42812L16.9008 8.03281L19.0758 7.26172C19.4743 7.79844 19.8071 8.37734 20.0743 8.98672L18.3235 10.4844L18.4758 11.4195ZM12.0001 8.14062C9.72193 8.14062 7.87505 9.9875 7.87505 12.2656C7.87505 14.5437 9.72193 16.3906 12.0001 16.3906C14.2782 16.3906 16.1251 14.5437 16.1251 12.2656C16.1251 9.9875 14.2782 8.14062 12.0001 8.14062ZM13.8563 14.1219C13.6128 14.366 13.3235 14.5597 13.0049 14.6916C12.6864 14.8235 12.3449 14.8912 12.0001 14.8906C11.2993 14.8906 10.6407 14.6164 10.1438 14.1219C9.89964 13.8784 9.70602 13.5891 9.57409 13.2705C9.44216 12.9519 9.37452 12.6104 9.37505 12.2656C9.37505 11.5648 9.64927 10.9062 10.1438 10.4094C10.6407 9.9125 11.2993 9.64062 12.0001 9.64062C12.7008 9.64062 13.3594 9.9125 13.8563 10.4094C14.1005 10.6528 14.2941 10.9422 14.426 11.2607C14.5579 11.5793 14.6256 11.9208 14.6251 12.2656C14.6251 12.9664 14.3508 13.625 13.8563 14.1219Z" fill={selectedModule === "setting" || selectedModule === "user" || selectedModule === "company-profile" || selectedModule === "billing" ? "#5D55E3" : "#616161"} />
              </svg>
            </ListItemIcon>
            <span
              style={{
                color: selectedModule === "setting" || selectedModule === "user" || selectedModule === "company-profile" || selectedModule === "billing" ? "#5D55E3" : "",
              }}
              className="text-hover"
            >
              Settings
            </span>
            {openSections.setting ? (
              <span style={{
                position: "relative",
                left: "35px"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                  <path d="M12 1L6.5 8L1 1" stroke="#5D55E3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            ) : (
              <span style={{
                position: "relative",
                left: "35px"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                  <path className="burger-hover1" d="M1 1L8 6.5L1 12" stroke="#616161" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            )}
          </ListItemButton>
        </Tooltip>
        <Collapse in={openSections.setting} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Billing" : ""}
            >
              <ListItemButton
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                  // backgroundColor:
                  //   selectedModule === "billing" ? "#E4EDF8" : "transparent",
                }}
                className="settings"
                onClick={() => handleModuleClick("billing")}
                component={Link}
                to="/dashboard/billing"
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path className="burger-hover1" d="M11.2 10.7H2.9V2.4C2.9 1.31614 3.71614 0.5 4.8 0.5H13.6C14.6839 0.5 15.5 1.31614 15.5 2.4V2.7H14.9V2.4C14.9 2.04638 14.7799 1.71284 14.5336 1.46645C14.2872 1.22006 13.9536 1.1 13.6 1.1C13.2464 1.1 12.9128 1.22006 12.6664 1.46645C12.4201 1.71284 12.3 2.04638 12.3 2.4V12.3H12C11.8736 12.3 11.8072 12.2601 11.7736 12.2264C11.7399 12.1928 11.7 12.1264 11.7 12V11.2V10.7H11.2ZM4.8 2.7H4.3V3.2V4.8V5.3H4.8H10.4H10.9V4.8V3.2V2.7H10.4H4.8ZM4.8 5.9H4.3V6.4V8V8.5H4.8H9.6H10.1V8V6.4V5.9H9.6H4.8ZM9.42428 13.3C9.86383 14.2119 10.7522 14.8198 11.7894 14.8926C11.4496 15.2718 10.9561 15.5 10.4 15.5H2.4C1.31614 15.5 0.5 14.6839 0.5 13.6V13.3H2.4H9.42428Z" stroke={selectedModule === "billing" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color: selectedModule === "billing" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Billing
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Compony Profile" : ""}
            >
              <ListItemButton
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                }}
                onClick={() => handleModuleClick("company-profile")}
                component={Link}
                to="/dashboard/update-compony"
                className="settings"
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path className="burger-hover1" d="M12.6667 14V3.33333C12.6667 2.97971 12.5262 2.64057 12.2761 2.39052C12.0261 2.14048 11.687 2 11.3333 2H4.66667C4.31304 2 3.97391 2.14048 3.72386 2.39052C3.47381 2.64057 3.33333 2.97971 3.33333 3.33333V14M12.6667 14H14M12.6667 14H9.33333M3.33333 14H2M3.33333 14H6.66667M9.33333 14V10.6667C9.33333 10.4899 9.2631 10.3203 9.13807 10.1953C9.01305 10.0702 8.84348 10 8.66667 10H7.33333C7.15652 10 6.98695 10.0702 6.86193 10.1953C6.7369 10.3203 6.66667 10.4899 6.66667 10.6667V14M9.33333 14H6.66667M6 4.66667H6.66667M6 7.33333H6.66667M9.33333 4.66667H10M9.33333 7.33333H10" stroke={selectedModule === "company-profile" ? "#5D55E3" : "#616161"} stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color:
                      selectedModule === "company-profile"
                        ? "#5D55E3"
                        : "",
                  }}
                  className="text-status"
                >
                  Company Profile
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "User" : ""}
            >
              <ListItemButton
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                }}
                className="settings"
                onClick={() => handleModuleClick("user")}
                component={Link}
                to="/dashboard/user-list"
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path className="burger-hover1" d="M11.8275 10.6661C11.8275 10.1233 11.6907 9.61223 11.4501 9.16572L13.9948 9.16611H13.9949C14.8233 9.16611 15.4949 9.83767 15.4949 10.6661L15.4939 11.3674L15.4939 11.3815L15.4946 11.3956C15.5466 12.3418 15.2232 12.9922 14.5978 13.4317C13.9373 13.896 12.8802 14.166 11.4019 14.166C11.3485 14.166 11.2955 14.1657 11.243 14.165C11.6344 13.5284 11.8348 12.7731 11.8338 11.9142H11.834L11.8336 11.9003L11.8254 11.6199L11.8275 10.6672V10.6661ZM10.1598 11.6634L10.1598 11.6776L10.1606 11.6918C10.2204 12.7602 9.84959 13.5022 9.11686 14.0047C8.34659 14.5329 7.12014 14.8337 5.41349 14.8337C3.71376 14.8337 2.47461 14.5374 1.67466 14.01C0.907727 13.5043 0.5 12.7584 0.5 11.6988V10.6661C0.5 9.83767 1.17156 9.16611 1.99996 9.16611H8.66089C9.48912 9.16611 10.1606 9.83739 10.1609 10.6656C10.1609 10.6656 10.1609 10.6656 10.1609 10.6656C10.1609 10.6658 10.1609 10.6659 10.1609 10.6661L10.1598 11.6634ZM5.33323 1.16626C6.89831 1.16626 8.16705 2.435 8.16705 4.00007C8.16705 5.56515 6.89831 6.83389 5.33323 6.83389C3.76816 6.83389 2.49942 5.56515 2.49942 4.00007C2.49942 2.435 3.76816 1.16626 5.33323 1.16626ZM11.9998 2.49957C13.1964 2.49957 14.1664 3.4696 14.1664 4.66619C14.1664 5.86278 13.1964 6.83281 11.9998 6.83281C10.8032 6.83281 9.83316 5.86278 9.83316 4.66619C9.83316 3.4696 10.8032 2.49957 11.9998 2.49957Z" stroke={selectedModule === "user" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color: selectedModule === "user" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Users
                </span>
              </ListItemButton>
            </Tooltip>
          </List>
        </Collapse>
        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Configration" : ""}
        >
          <ListItemButton
            sx={{
              height: "35px",
              mb: "16px",
            }}
            className="manual-list"
            onClick={() => {
              handleSectionClick("configuration")
              handleModuleClick("configuration")
            }}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <g clip-path="url(#clip0_3216_1808)">
                  <path className="burger-hover1" d="M16 15.5C20.0089 15.4355 23 12.4674 23 8.5C23 5.48813 22.0029 6.48516 21 7.5C20.0089 8.47923 18 10.5 18 10.5L14 6.5C14 6.5 16.0207 4.4911 17 3.5C18.0148 2.49703 18.0148 1.5 16 1.5C12.0326 1.5 9.05305 4.4911 8.99998 8.5C9.04152 9.47626 8.99998 11.5 8.99998 11.5C7.11484 13.397 4.65921 15.8526 2.99998 17.5C0.0682291 20.4436 4.05636 24.4317 6.99998 21.5C8.6505 19.8376 11.1127 17.3754 13 15.5C13 15.5 15.0237 15.4585 16 15.5Z" stroke={selectedModule === "configuration" ? "#5D55E3" : "#616161"} stroke-width="1.5" />
                </g>
                <defs>
                  <clipPath id="clip0_3216_1808">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                </defs>
              </svg>
            </ListItemIcon>
            <span
              style={{
                color: selectedModule === "configuration" ? "#5D55E3" : "",
              }}
              className="text-hover"
            >
              Configuration
            </span>
            {openSections.configuration ? (
              <span style={{
                position: "relative",
                left: "25px"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                  <path d="M12 1L6.5 8L1 1" stroke="#5D55E3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            ) : (
              <span style={{
                position: "relative",
                left: "25px"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                  <path className="burger-hover1" d="M1 1L8 6.5L1 12" stroke={selectedModule === "configuration" ? "#5D55E3" : "#616161"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            )}
          </ListItemButton>
        </Tooltip>
        <Collapse in={openSections.configuration} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Approval" : ""}
            >
              <ListItemButton
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                  // mb: "1.3rem",
                }}
                className="settings"
                onClick={() => handleModuleClick("approval")}
                component={Link}
                to="/dashboard/approval-list"
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path className="burger-hover1" d="M8.44771 13.1063L8.94403 12.5156L10.2596 14.0778L10.6426 14.5327L11.025 14.0773L14.8514 9.51986L15.3472 10.11L10.6419 15.7219L8.44771 13.1063ZM5.3619 12.7831L5.08861 13.1061L5.3619 13.429L7.12707 15.5152H0.5V14.0758C0.5 13.2526 1.06727 12.4186 2.17642 11.7632C3.27091 11.1164 4.81433 10.6997 6.54712 10.697L7.09517 10.7347L5.3619 12.7831ZM6.5641 1C7.27243 1 7.97249 1.33188 8.50317 1.95904C9.03598 2.58872 9.34615 3.45819 9.34615 4.37879C9.34615 5.29939 9.03598 6.16885 8.50317 6.79853C7.97249 7.4257 7.27243 7.75758 6.5641 7.75758C5.85578 7.75758 5.15571 7.4257 4.62504 6.79853C4.09223 6.16885 3.78205 5.29939 3.78205 4.37879C3.78205 3.45819 4.09223 2.58872 4.62503 1.95904C5.15571 1.33188 5.85578 1 6.5641 1Z" stroke={selectedModule === "approval" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color: selectedModule === "approval" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Approvals
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Categories" : ""}
            >
              <ListItemButton
                className="settings"
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                  // mb: "1.3rem",
                }}
                component={Link}
                to="/dashboard/category-list"
                onClick={() => handleModuleClick("categories")}
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path className="burger-hover1" d="M13.1 12.5V13H13.6H15.5V13.6H13.6H13.1V14.1V16H12.5V14.1V13.6H12H10.1V13H12H12.5V12.5V10.6H13.1V12.5ZM0.5 1H6.7V7.2H0.5V1ZM12.4 1C14.1239 1 15.5 2.37614 15.5 4.1C15.5 5.82386 14.1239 7.2 12.4 7.2C10.6761 7.2 9.3 5.82386 9.3 4.1C9.3 2.37614 10.6761 1 12.4 1ZM3.6 11.1199L6.34508 16H0.854924L3.6 11.1199Z" stroke={selectedModule === "categories" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color:
                      selectedModule === "categories" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Categories
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Clauses" : ""}
            >
              <ListItemButton
                className="settings"
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                }}
                component={Link}
                to="/dashboard/clauses-list"
                onClick={() => handleModuleClick("clauses")}
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path className="burger-hover1" d="M9.38376 1.41423L8.98015 1H9.63523L14.2692 5.75595V6.42827L13.8966 6.0458L9.38376 1.41423ZM8.52564 1V1.76316V6.39474V6.89474H9.02564H13.5385H14.2692V8.54995C13.9026 8.46724 13.5215 8.42105 13.1282 8.42105C10.124 8.42105 7.70513 10.9225 7.70513 13.9737C7.70513 14.3818 7.7515 14.7774 7.83449 15.1579H1.64103C1.02516 15.1579 0.5 14.643 0.5 13.9737V2.18421C0.5 1.51329 1.01856 1 1.64103 1H8.52564ZM10.7979 13.7133L11.7444 14.6847L12.1026 15.0523L12.4607 14.6847L15.0117 12.0665L15.3333 12.4677L12.1185 15.7672L10.5298 13.9885L10.7979 13.7133Z" stroke={selectedModule === "clauses" ? "#5D55E3" : "#616161"} />

                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color: selectedModule === "clauses" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Clauses
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Custom Fields" : ""}
            >
              <ListItemButton
                className="settings"
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                }}
                component={Link}
                to="/dashboard/feild-list"
                onClick={() => handleModuleClick("custom-feild")}
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path className="burger-hover1" d="M10.7045 15.6695C10.7031 15.6723 10.6984 15.6805 10.6872 15.6943C10.6567 15.7316 10.5989 15.7823 10.5103 15.8347C10.3243 15.9448 10.1114 16 10 16H8.5V15.4H9.6C9.94478 15.4 10.2754 15.263 10.5192 15.0192C10.763 14.7754 10.9 14.4448 10.9 14.1V2.9C10.9 2.55522 10.763 2.22456 10.5192 1.98076C10.2754 1.73696 9.94478 1.6 9.6 1.6H8.5V1H10C10.1114 1 10.3243 1.05518 10.5103 1.16529C10.5989 1.21769 10.6567 1.26841 10.6872 1.30572C10.7014 1.32315 10.7051 1.33166 10.705 1.33165C10.7049 1.33165 10.7 1.3209 10.7 1.3H11.2H11.7C11.7 1.3209 11.6951 1.33165 11.695 1.33165C11.6949 1.33166 11.6986 1.32315 11.7128 1.30572C11.7433 1.26841 11.8011 1.21769 11.8897 1.16529C12.0757 1.05518 12.2886 1 12.4 1H13.9V1.6H12.8C12.4552 1.6 12.1246 1.73696 11.8808 1.98076C11.637 2.22456 11.5 2.55522 11.5 2.9V4.5V5H12H15.5V12H12H11.5V12.5V14.1C11.5 14.4448 11.637 14.7754 11.8808 15.0192C12.1246 15.263 12.4552 15.4 12.8 15.4H13.9V16H12.4C12.2886 16 12.0757 15.9448 11.8897 15.8347C11.8011 15.7823 11.7433 15.7316 11.7128 15.6943C11.6986 15.6769 11.6949 15.6684 11.695 15.6683C11.6951 15.6683 11.7 15.6791 11.7 15.7H11.2H10.7C10.7 15.683 10.7032 15.6728 10.7045 15.6695ZM10.7045 15.6695C10.7049 15.6687 10.705 15.6683 10.705 15.6683L10.7045 15.6695ZM0.5 5H8.3V5.6H1.6H1.1V6.1V10.9V11.4H1.6H8.3V12H0.5V5ZM14.4 11.4H14.9V10.9V6.1V5.6H14.4H12H11.5V6.1V10.9V11.4H12H14.4Z" stroke={selectedModule === "custom-feild" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color:
                      selectedModule === "custom-feild" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Custom Fields
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Roles" : ""}
            >
              <ListItemButton
                className="settings"
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",

                }}
                component={Link}
                to="/dashboard/role-list"
                onClick={() => handleModuleClick("roles")}
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path className="burger-hover1" d="M3.86667 7H6.83333V8H6H5.5V8.5V10H5.16667V8.5V8H4.66667H3.86667H3.46558L3.37857 8.39153C3.13324 9.49555 2.51907 10 2 10C1.64421 10 1.28381 9.79933 0.991025 9.36015C0.697205 8.91942 0.5 8.27048 0.5 7.5C0.5 6.72952 0.697205 6.08058 0.991025 5.63985C1.28381 5.20067 1.64421 5 2 5C2.51907 5 3.13324 5.50445 3.37857 6.60847L3.46558 7H3.86667ZM2 6C1.60944 6 1.29627 6.2042 1.10064 6.49765C0.91379 6.77793 0.833333 7.13336 0.833333 7.5C0.833333 7.86664 0.91379 8.22207 1.10064 8.50235C1.29627 8.7958 1.60944 9 2 9C2.39056 9 2.70373 8.7958 2.89936 8.50235C3.08621 8.22207 3.16667 7.86664 3.16667 7.5C3.16667 7.13336 3.08621 6.77793 2.89936 6.49765C2.70373 6.2042 2.39056 6 2 6ZM10.6667 11C11.4734 11 12.7184 11.299 13.7518 11.9167C14.785 12.5343 15.5 13.3993 15.5 14.5V16H5.83333V14.5C5.83333 13.3993 6.54832 12.5343 7.58154 11.9167C8.61491 11.299 9.85997 11 10.6667 11ZM10.6667 8C10.1538 8 9.62405 7.68469 9.19936 7.04765C8.77753 6.41491 8.5 5.5142 8.5 4.5C8.5 3.4858 8.77753 2.58509 9.19936 1.95235C9.62405 1.31531 10.1538 1 10.6667 1C11.1795 1 11.7093 1.31531 12.134 1.95235C12.5558 2.58509 12.8333 3.4858 12.8333 4.5C12.8333 5.5142 12.5558 6.41491 12.134 7.04765C11.7093 7.68469 11.1795 8 10.6667 8Z" stroke={selectedModule === "roles" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color: selectedModule === "roles" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Roles
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Teams" : ""}
            >
              <ListItemButton
                className="settings"
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",
                }}
                onClick={() => handleModuleClick("teams")}
                component={Link}
                to="/dashboard/teamlist"
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path className="burger-hover1" d="M2.78583 2.78581C2.78583 1.7996 3.5853 1.00013 4.5715 1.00013C5.55771 1.00013 6.35718 1.7996 6.35718 2.78581C6.35718 3.35941 6.08727 3.86975 5.66551 4.19725C5.65008 4.20867 5.63479 4.22016 5.61963 4.23171C5.32534 4.44552 4.96385 4.57148 4.5715 4.57148C3.5853 4.57148 2.78583 3.77201 2.78583 2.78581Z" stroke={selectedModule === "teams" ? "#5D55E3" : "#616161"} />
                    <path className="burger-hover1" d="M10.3802 4.23178C10.365 4.22017 10.3497 4.20865 10.3343 4.19725C9.91249 3.86975 9.64258 3.35941 9.64258 2.78581C9.64258 1.7996 10.4421 1.00013 11.4283 1.00013C12.4145 1.00013 13.2139 1.7996 13.2139 2.78581C13.2139 3.77201 12.4145 4.57148 11.4283 4.57148C11.036 4.57148 10.6745 4.44554 10.3802 4.23178Z" stroke={selectedModule === "teams" ? "#5D55E3" : "#616161"} />
                    <path className="burger-hover1" d="M6.45263 6.46468L6.45263 6.46468C6.76214 5.92964 7.33941 5.57148 7.99973 5.57148C8.66005 5.57148 9.23732 5.92964 9.54682 6.46468L9.54682 6.46468C9.69846 6.72681 9.7854 7.03107 9.7854 7.35716C9.7854 8.34336 8.98593 9.14283 7.99973 9.14283C7.01352 9.14283 6.21405 8.34336 6.21405 7.35716C6.21405 7.03107 6.30099 6.72681 6.45263 6.46468Z" stroke={selectedModule === "teams" ? "#5D55E3" : "#616161"} />
                    <path className="burger-hover1" d="M1.71424 6.7143H4.12377C4.08927 6.92367 4.07135 7.13843 4.07135 7.35714C4.07135 8.02236 4.23698 8.64942 4.52902 9.19879C3.52994 9.38334 2.68648 10.0102 2.20842 10.8681C2.0268 10.7675 1.85624 10.6537 1.69827 10.5269C0.957328 9.93222 0.5 9.0545 0.5 7.92856C0.5 7.25797 1.04364 6.7143 1.71424 6.7143Z" stroke={selectedModule === "teams" ? "#5D55E3" : "#616161"} />
                    <path className="burger-hover1" d="M11.8762 6.7143H14.2857C14.9563 6.7143 15.5 7.25795 15.5 7.92856C15.5 9.05446 15.0426 9.93217 14.3018 10.5269C14.1438 10.6537 13.9732 10.7675 13.7915 10.8681C13.3135 10.0102 12.47 9.38334 11.4709 9.19878C11.763 8.64943 11.9286 8.02237 11.9286 7.35714C11.9286 7.13842 11.9107 6.92365 11.8762 6.7143Z" stroke={selectedModule === "teams" ? "#5D55E3" : "#616161"} />
                    <path className="burger-hover1" d="M5.12648 15.0983L5.1265 15.0983C5.86567 15.6916 6.88252 15.9999 7.99958 15.9999C9.11663 15.9999 10.1335 15.6916 10.8727 15.0983C11.6136 14.5036 12.0709 13.6259 12.0709 12.4999C12.0709 12.3353 12.0383 12.1792 11.9797 12.0371L5.12648 15.0983ZM5.12648 15.0983C4.38555 14.5036 3.92822 13.6259 3.92822 12.4999M5.12648 15.0983L3.92822 12.4999M3.92822 12.4999C3.92822 12.3351 3.96081 12.1791 4.01944 12.037L3.92822 12.4999ZM4.01945 12.037C4.20187 11.5951 4.63661 11.2857 5.14246 11.2857H10.8567C11.3625 11.2857 11.7971 11.595 11.9797 12.0369L4.01945 12.037Z" stroke={selectedModule === "teams" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color: selectedModule === "teams" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Teams
                </span>
              </ListItemButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
              placement="right"
              title={leftsidebarExpanded ? "Tags" : ""}
            >
              <ListItemButton
                className="settings"
                sx={{
                  pl: leftsidebarExpanded ? 2 : 7,
                  fontSize: "12px",
                  height: "4vh",

                }}
                onClick={() => handleModuleClick("tags")}
                component={Link}
                to="/dashboard/tags-list"
              >
                <div >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path className="burger-hover1" d="M11.9418 10.5924L11.9418 10.5924L11.9376 10.5977L7.93757 15.5977C7.72294 15.8659 7.45672 16 7.2 16C6.93837 16 6.67343 15.8714 6.45443 15.5977L0.862434 8.60765C0.642512 8.33275 0.5 7.945 0.5 7.5V2.5C0.5 1.55626 1.08649 1 1.6 1H5.6C5.86365 1 6.12805 1.13045 6.33757 1.39235L11.9376 8.39235C12.1511 8.65925 12.3 9.04772 12.3 9.5C12.3 9.94648 12.1568 10.331 11.9418 10.5924ZM10.032 2.01039L15.1376 8.39235L15.1375 8.39238L15.1418 8.39755C15.3256 8.62115 15.4583 8.94398 15.4918 9.31572L15.3921 9.18976L9.87094 2.21172L10.032 2.01039ZM15.3925 9.80969L15.4918 9.68392C15.4585 10.0526 15.327 10.3708 15.1456 10.5977L11.232 15.4896L11.0706 15.2878L15.3925 9.80969ZM2.8 6C3.29146 6 3.73319 5.75522 4.03896 5.37301C4.34242 4.99369 4.5 4.49877 4.5 4C4.5 3.50123 4.34241 3.00631 4.03896 2.62699C3.73319 2.24478 3.29146 2 2.8 2C2.30854 2 1.86681 2.24478 1.56104 2.62699C1.25759 3.00631 1.1 3.50123 1.1 4C1.1 4.49877 1.25759 4.99369 1.56104 5.37301C1.86681 5.75522 2.30854 6 2.8 6Z" stroke={selectedModule === "tags" ? "#5D55E3" : "#616161"} />
                  </svg>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    color: selectedModule === "tags" ? "#5D55E3" : "",
                  }}
                  className="text-status"
                >
                  Tags
                </span>
              </ListItemButton>
            </Tooltip>
          </List>
        </Collapse>

        <Tooltip
          TransitionComponent={Zoom}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          placement="right"
          title={leftsidebarExpanded ? "Logout" : ""}
        >
          <ListItemButton
          className="manual-list"
            sx={{
              height: "35px",
            }}
            onClick={() => {
              navigate(`/`);
              logout();
              handleModuleClick("logout");
            }}
          >
            <ListItemIcon sx={{minWidth:"1px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className="burger-hover1" d="M9 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V5.5C3 4.96957 3.21071 4.46086 3.58579 4.08579C3.96086 3.71071 4.46957 3.5 5 3.5H9" stroke="#616161" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path className="burger-hover1" d="M16 17.5L21 12.5L16 7.5" stroke="#616161" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path className="burger-hover1" d="M21 12.5H9" stroke="#616161" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </ListItemIcon>
            <span
              className="text-hover"
            >
              Logout
            </span>
          </ListItemButton>
        </Tooltip>
      </List>
    </div>
  );

  return (
    <div style={{ display: "flex", background: "#E4EDF8" }}>
      <CssBaseline />
      {editorDashboardSegment !== "editor-dahsbord" && (
        <AppBar
          position="fixed"
          sx={{
            height: "6.4vh",
            bgcolor: "#FFFFFF",
            zIndex: (theme: any) => theme.zIndex.drawer + 1, // Ensure AppBar is above the Drawer
            width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust the width on larger screens
            ml: { sm: `${drawerWidth}px` }, // Push the AppBar to the right on larger screens
          }}
        >
          <Toolbar sx={{ hight: "5vh" }}>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ marginRight: 2, display: { sm: "none" } }}
            >
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
            <Typography
              color={"#4B4B4B"}
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            <IconButton>
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton>
              <div>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  id={menuId}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(`/dashboard/user-detail/${user?._id}`); // Use menuState.row._id
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(`/dashboard/profile-setting`); // Use menuState.row._id
                    }}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(`/`);
                      logout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <Box
        component="nav"
        sx={{
          background: "#E4EDF8",
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {!leftSideBar && (
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}
        {/* <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileOpen && leftSideBar}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            background: "red",
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer> */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              borderRight: "none",
              boxSizing: "border-box",
              width: drawerWidth,
              background: "#FFF",
              overflowX: "hidden",
              msOverflowY: "hidden",

            },
          }}
          open={leftSideBar}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          background: "#F8FAFD",
          flexGrow: 1,

          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {editorDashboardSegment !== "editor-dahsbord" && <Toolbar />}
        {/* routes  */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teamlist" element={<TeamsList />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/team-edit/:id" element={<UpdateTeam />} />
          <Route path="/create-branch" element={<CreateBranch />} />
          <Route path="/branchlist" element={<BranchList />} />
          <Route path="/branch-edit/:id" element={<UpdateBranch />} />
          <Route path="/branch-detail/:id" element={<DetailBranch />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-password/:token" element={<ResetPassword />} />
          <Route path="/user-edit/:id" element={<UpdateUser />} />
          <Route path="/user-update-user/:id" element={<UserEdit />} />
          <Route path="/user-detail/:id" element={<UserDetail />} />
          <Route
            path="/user-detail-single/:id"
            element={<UserDetailSingleUser />}
          />
          <Route path="/profile-setting" element={<Setting />} />

          <Route path="/login-history" element={<LoginHistory />} />

          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/create-cetegory" element={<CreateCategory />} />
          <Route path="/update-cetegory/:id" element={<UpdateCategory />} />

          <Route path="/create-tags" element={<CreateTags />} />
          <Route path="/tags-list" element={<TagList />} />
          <Route path="/update-tags/:id" element={<UpdateTags />} />

          <Route path="/create-clauses" element={<CreateClauses />} />
          <Route path="/clauses-list" element={<ClausesList />} />
          <Route path="/update-clauses/:id" element={<UpdateClauses />} />

          <Route path="/compony-list" element={<ComponyList />} />
          <Route path="/update-compony" element={<UpdateCompony />} />

          <Route path="/Upload-folder/:id" element={<Upload />} />
          <Route path="/folder-list" element={<FolderLIst />} />

          <Route path="/template-list" element={<TemplateList />} />
          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/update-template/:id" element={<UpdateTemplate />} />

          <Route path="/feild-list" element={<FieldList />} />

          <Route path="/approval-list" element={<ApprovalList />} />
          <Route path="/create-approval" element={<CreateApproval />} />
          <Route path="/update-approval/:id" element={<UpdateApproval />} />

          <Route path="/contract-list" element={<ContractList />} />
          <Route path="/create-contract" element={<CreateContract />} />
          <Route path="/editor-dahsbord" element={<EditorDahsbord />} />
          <Route path="/editor-dahsbord/:id" element={<EditorDahsbord />} />
          <Route path="/editor-dahsbord/open" element={<EditorDahsbord />} />

          <Route path="/sub-page-1" element={<SubPage1 />} />
          <Route path="/billing" element={<CardsSubscription />} />

          <Route path="/role-list" element={<RoleList />} />
          <Route path="/crete-custom-role/:id" element={<CreateCustomRole />} />
          <Route path="/crete-custom-role" element={<CreateCustomRole />} />
          <Route path="/system-role" element={<SystemsRole />} />

          <Route path="/editor" element={<CustomTextEditor />} />
          {/* <Route path="/test" element={<Default />} /> */}
          <Route path="/testSync" element={<NewSyncsF />} />
        </Routes>
      </Box>
    </div>
  );
}
