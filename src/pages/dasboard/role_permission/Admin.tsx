/* eslint-disable @typescript-eslint/no-explicit-any */
// TeamForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  Collapse,
} from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ProgressCircularCustomization from "@/pages/dasboard/users/ProgressCircularCustomization";
import { useAuth } from "@/hooks/useAuth";
import { create, getroleById } from "@/service/api/roleperm";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

type FormValues = {
  name: string;
  desc: string;
  status: string;
};
interface Permissions {
  create_profile: boolean;
  edit_profile: boolean;
  reset_password: boolean;
  edisable_2fa: false;
  enable_2fa: false;
  // Add more permissions as needed
}

const initialPermissions: any = {
  create_profile: false,
  edit_profile: false,
  reset_password: false,
  edisable_2fa: false,
  enable_2fa: false,
  view_dashboard: false,
  edit_dashboard: false,
  view_teams_dashboard: false,
  edit_team_dashboard: false,
  view_teams_member_dashboard: false,
  view_exective_dashboard: false,
  view_any_dashboard: false,
  create_docs: false,
  view_docs: false,
  edit_docs: false,
  dublicate_docs: false,
  download_docs: false,
  share_docs: false,
  view_share_docs: false,
  edit_share_doc: false,
  comment_shere_doc: false,
  view_any_doc: false,
  edit_any_docs: false,
  dublicate_any_docs: false,
  share_any_docs: false,
  delete_any_docs: false,
  sign_doc: false,
  sign_share_doc: false,
  sign_team_doc: false,
  sign_any_doc: false,
  create_folder: false,
  view_folder: false,
  edit_folder: false,
  delete_folder: false,
  create_any_document_folder: false,
  view_any_document_folder: false,
  edit_any_document_folder: false,
  delete_any_document_folder: false,
  move_any_document_folder: false,
  create_template: false,
  view_template: false,
  edit_template: false,
  delete_template: false,
  create_any_template: false,
  view_any_template: false,
  edit_any_template: false,
  delete_any_template: false,
  dublicate_any_template: false,
  edit_template_folder: false,
  delete_template_folder: false,
  share_template: false,
  upload_public_template: false,
  view_reports: false,
  create_reports: false,
  download_reports: false,
  edit_company: false,
  create_branches: false,
  view_branches: false,
  edit_branches: false,
  archive_branches: false,
  delete_branches: false,
  create_teams: false,
  view_teams: false,
  edit_teams: false,
  delete_teams: false,
  archive_teams: false,
  add_users: false,
  view_profile_users: false,
  edit_users: false,
  delete_users: false,
  access_billing: false,
  upgrade_plans: false,
  change_payment_info: false,
  change_billing_owner: false,
  view_invoice_history: false,
  add_user_licences: false,
  create_approvals: false,
  view_approvals: false,
  edit_approvals: false,
  delete_approvals: false,
  edit_any_approvals: false,
  delete_any_approvals: false,
  create_categories: false,
  view_categories: false,
  edit_categories: false,
  delete_categories: false,
  edit_any_categories: false,
  delete_any_categories: false,
  create_clauses: false,
  view_clauses: false,
  edit_clauses: false,
  delete_clauses: false,
  edit_any_clauses: false,
  delete_any_clauses: false,
  create_fields: false,
  view_fields: false,
  edit_fields: false,
  delete_fields: false,
  edit_any_fields: false,
  delete_any_fields: false,
  create_tags: false,
  view_tags: false,
  edit_tags: false,
  delete_tags: false,
  edit_any_tags: false,
  delete_any_tags: false,
  // Add more permissions as needed
};

const Admin = () => {
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState("");
  const [permissions, setPermissions] = useState<any>(initialPermissions);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    profile: false,
    dashboards: false,
    contract: false,
    signature: false,
    folder: false,
    templates: false,
    reports: false,
    settings: false,
    company_Profile: false,
    configration: false,
  });

  // Function to handle checkbox changes
  const handleCheckboxChange = (permission: keyof any) => {
    setPermissions((prevPermissions: any) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }));
  };

  // Function to handle "Select All" checkbox
  const handleSelectAllChange = () => {
    setPermissions((prevPermissions: any) => {
      const allChecked = Object.values(prevPermissions).every((value) => value);
      const updatedPermissions: any = {} as any;
      Object.keys(prevPermissions).forEach((key) => {
        updatedPermissions[key as keyof any] = !allChecked;
      });
      return updatedPermissions;
    });
  };

  const handleSectionToggle = (section: string) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [section]: !prevOpenSections[section],
    }));
  };

  const UserlistData = async () => {
    try {
      setIsLoading(true);
      const data = await getroleById("65a62aeaf326bd32e198fbce");
      console.log(data.permissions);
      setPermissions(data.permissions);
      setList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    UserlistData();
  }, []);

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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} sx={{ display: "table" }}>
          <Typography variant="subtitle1">Admin</Typography>
          <Typography variant="subtitle2" sx={{ fontSize: "15px", mb: 2 }}>
            This role is system-defined and cannot be edited or deleted. If
            custom roles with specific permissions are required, a new role can
            be created.
          </Typography>
          <FormControl component="fieldset">
            <FormGroup>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("profile")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Profile</span>
                  {openSections.profile ? <ExpandLess /> : <ExpandMore />}
                </Typography>

                <Collapse
                  in={!!openSections.profile} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can view own profile"
                        control={
                          <Checkbox
                            disabled
                            sx={{ fontWeight: "bold" }}
                            checked={permissions.create_profile}
                            onChange={() =>
                              handleCheckboxChange("create_profile")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own profile"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_profile}
                            onChange={() =>
                              handleCheckboxChange("edit_profile")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can reset his own password"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.reset_password}
                            onChange={() =>
                              handleCheckboxChange("reset_password")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can enable own 2FA"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.enable_2fa}
                            onChange={() => handleCheckboxChange("enable_2fa")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view any document folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edisable_2fa}
                            onChange={() =>
                              handleCheckboxChange("edisable_2fa")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    {/* Add more permissions as needed */}
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("dashboards")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Dashboards</span>
                  {openSections.dashboards ? <ExpandLess /> : <ExpandMore />}
                </Typography>
                <Collapse
                  in={!!openSections.dashboards} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can view own dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_dashboard}
                            onChange={() =>
                              handleCheckboxChange("view_dashboard")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_dashboard}
                            onChange={() =>
                              handleCheckboxChange("edit_dashboard")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view own team's dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_teams_dashboard}
                            onChange={() =>
                              handleCheckboxChange("view_teams_dashboard")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can edit own team’s dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_team_dashboard}
                            onChange={() =>
                              handleCheckboxChange("edit_team_dashboard")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view own team members dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_teams_member_dashboard}
                            onChange={() =>
                              handleCheckboxChange(
                                "view_teams_member_dashboard"
                              )
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view executive dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_exective_dashboard}
                            onChange={() =>
                              handleCheckboxChange("view_exective_dashboard")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view any dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_any_dashboard}
                            onChange={() =>
                              handleCheckboxChange("view_any_dashboard")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    {/* Add more permissions as needed */}
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("contract")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Contracts/Documents</span>
                  {openSections.contract ? <ExpandLess /> : <ExpandMore />}
                </Typography>
                <Collapse
                  in={!!openSections.contract} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can create own documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_docs}
                            onChange={() => handleCheckboxChange("create_docs")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view own documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_docs}
                            onChange={() => handleCheckboxChange("view_docs")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_docs}
                            onChange={() => handleCheckboxChange("edit_docs")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can edit own team’s dashboard"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_team_dashboard}
                            onChange={() =>
                              handleCheckboxChange("edit_team_dashboard")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can duplicate own documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.dublicate_docs}
                            onChange={() =>
                              handleCheckboxChange("dublicate_docs")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can download own documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.download_docs}
                            onChange={() =>
                              handleCheckboxChange("download_docs")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can share own documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.share_docs}
                            onChange={() => handleCheckboxChange("share_docs")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view shared documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_share_docs}
                            onChange={() =>
                              handleCheckboxChange("view_share_docs")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit shared documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_share_doc}
                            onChange={() =>
                              handleCheckboxChange("edit_share_doc")
                            }
                            color="primary"
                          />
                        }
                      />{" "}
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can comment on shared documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.comment_shere_doc}
                            onChange={() =>
                              handleCheckboxChange("comment_shere_doc")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view any document"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_any_doc}
                            onChange={() =>
                              handleCheckboxChange("view_any_doc")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit any document"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_docs}
                            onChange={() =>
                              handleCheckboxChange("edit_any_docs")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can duplicate any document"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.dublicate_any_docs}
                            onChange={() =>
                              handleCheckboxChange("dublicate_any_docs")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can share any document"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.share_any_docs}
                            onChange={() =>
                              handleCheckboxChange("share_any_docs")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete any document"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_any_docs}
                            onChange={() =>
                              handleCheckboxChange("delete_any_docs")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("signature")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Signature</span>
                  {openSections.signature ? <ExpandLess /> : <ExpandMore />}
                </Typography>

                <Collapse
                  in={!!openSections.signature} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can sign own documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.sign_doc}
                            onChange={() => handleCheckboxChange("sign_doc")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can sign shared documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.sign_share_doc}
                            onChange={() =>
                              handleCheckboxChange("sign_share_doc")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can sign documents on team's behalf"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.sign_team_doc}
                            onChange={() =>
                              handleCheckboxChange("sign_team_doc")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can sign any document"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.sign_any_doc}
                            onChange={() =>
                              handleCheckboxChange("sign_any_doc")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    {/* Add more permissions as needed */}
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("folder")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Folders</span>
                  {openSections.folder ? <ExpandLess /> : <ExpandMore />}
                </Typography>

                <Collapse
                  in={!!openSections.folder} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can create own folders"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_folder}
                            onChange={() =>
                              handleCheckboxChange("create_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own folders"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_folder}
                            onChange={() => handleCheckboxChange("edit_folder")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete own folders"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_folder}
                            onChange={() =>
                              handleCheckboxChange("delete_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can edit any document folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_document_folder}
                            onChange={() =>
                              handleCheckboxChange("edit_any_document_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view any document folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_any_document_folder}
                            onChange={() =>
                              handleCheckboxChange("view_any_document_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete any document folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_any_document_folder}
                            onChange={() =>
                              handleCheckboxChange("delete_any_document_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can move any document to any folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.move_any_document_folder}
                            onChange={() =>
                              handleCheckboxChange("move_any_document_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create documents in any folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_any_document_folder}
                            onChange={() =>
                              handleCheckboxChange("create_any_document_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    {/* Add more permissions as needed */}
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("templates")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Templates</span>
                  {openSections.templates ? <ExpandLess /> : <ExpandMore />}
                </Typography>

                <Collapse
                  in={!!openSections.templates} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can create templates"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_template}
                            onChange={() =>
                              handleCheckboxChange("create_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view any template"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_template}
                            onChange={() =>
                              handleCheckboxChange("view_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can use any template to create documents"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_any_template}
                            onChange={() =>
                              handleCheckboxChange("create_any_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can duplicate any template"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.dublicate_any_template}
                            onChange={() =>
                              handleCheckboxChange("dublicate_any_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own templates"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_template}
                            onChange={() =>
                              handleCheckboxChange("edit_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can share own templates"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.share_template}
                            onChange={() =>
                              handleCheckboxChange("share_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can upload public templates"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.upload_public_template}
                            onChange={() =>
                              handleCheckboxChange("upload_public_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete own templates"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_template}
                            onChange={() =>
                              handleCheckboxChange("delete_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit any templates"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_template}
                            onChange={() =>
                              handleCheckboxChange("edit_any_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit any template folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_template}
                            onChange={() =>
                              handleCheckboxChange("edit_any_template")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete any template folder"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_template_folder}
                            onChange={() =>
                              handleCheckboxChange("delete_template_folder")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    {/* Add more permissions as needed */}
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("reports")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Reports</span>
                  {openSections.reports ? <ExpandLess /> : <ExpandMore />}
                </Typography>

                <Collapse
                  in={!!openSections.reports} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can view reports"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_reports}
                            onChange={() =>
                              handleCheckboxChange("view_reports")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can download reports"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.download_reports}
                            onChange={() =>
                              handleCheckboxChange("download_reports")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create reports"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_reports}
                            onChange={() =>
                              handleCheckboxChange("create_reports")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("settings")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Settings</span>
                  {openSections.settings ? <ExpandLess /> : <ExpandMore />}
                </Typography>

                <Collapse
                  in={!!openSections.settings} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can create branches"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_branches}
                            onChange={() =>
                              handleCheckboxChange("create_branches")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit branches"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_branches}
                            onChange={() =>
                              handleCheckboxChange("edit_branches")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can archive branches"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.archive_branches}
                            onChange={() =>
                              handleCheckboxChange("archive_branches")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can delete branches"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_branches}
                            onChange={() =>
                              handleCheckboxChange("delete_branches")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create teams"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_teams}
                            onChange={() =>
                              handleCheckboxChange("create_teams")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit teams"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_teams}
                            onChange={() => handleCheckboxChange("edit_teams")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete teams"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_teams}
                            onChange={() =>
                              handleCheckboxChange("delete_teams")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can archive teams"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.archive_teams}
                            onChange={() =>
                              handleCheckboxChange("archive_teams")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can add users"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.add_users}
                            onChange={() => handleCheckboxChange("add_users")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can edit users"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_users}
                            onChange={() => handleCheckboxChange("edit_users")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete users"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_users}
                            onChange={() =>
                              handleCheckboxChange("delete_users")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view any user's profile"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_profile_users}
                            onChange={() =>
                              handleCheckboxChange("view_profile_users")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can access billing"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.access_billing}
                            onChange={() =>
                              handleCheckboxChange("access_billing")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can upgrade plans"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.upgrade_plans}
                            onChange={() =>
                              handleCheckboxChange("upgrade_plans")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can change payment info"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.change_payment_info}
                            onChange={() =>
                              handleCheckboxChange("change_payment_info")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can change billing owner"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.change_billing_owner}
                            onChange={() =>
                              handleCheckboxChange("change_billing_owner")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view invoices history"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_invoice_history}
                            onChange={() =>
                              handleCheckboxChange("view_invoice_history")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can add user licences"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.add_user_licences}
                            onChange={() =>
                              handleCheckboxChange("add_user_licences")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    {/* Add more permissions as needed */}
                  </Grid>
                </Collapse>
              </div>

              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("company_profile")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Company Profile</span>
                  {openSections.company_profile ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </Typography>

                <Collapse
                  in={!!openSections.company_profile} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit company info"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_company}
                            onChange={() =>
                              handleCheckboxChange("edit_company")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </div>
              <div>
                <Typography
                  variant="subtitle1"
                  onClick={() => handleSectionToggle("configrations")}
                  sx={{
                    width: "350px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Configrations</span>
                  {openSections.configrations ? <ExpandLess /> : <ExpandMore />}
                </Typography>

                <Collapse
                  in={!!openSections.configrations} // Convert to boolean
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        label="Can view approvals"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_approvals}
                            onChange={() =>
                              handleCheckboxChange("view_approvals")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create approvals"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_approvals}
                            onChange={() =>
                              handleCheckboxChange("create_approvals")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own approvals"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_approvals}
                            onChange={() =>
                              handleCheckboxChange("edit_approvals")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can delete own approvals"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_approvals}
                            onChange={() =>
                              handleCheckboxChange("delete_approvals")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit any approval"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_approvals}
                            onChange={() =>
                              handleCheckboxChange("edit_any_approvals")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete any approval"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_any_approvals}
                            onChange={() =>
                              handleCheckboxChange("delete_any_approvals")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view categories"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_categories}
                            onChange={() =>
                              handleCheckboxChange("view_categories")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create categories"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_categories}
                            onChange={() =>
                              handleCheckboxChange("create_categories")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own categories"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_categories}
                            onChange={() =>
                              handleCheckboxChange("edit_categories")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can delete own categories"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_categories}
                            onChange={() =>
                              handleCheckboxChange("delete_categories")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit any category"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_categories}
                            onChange={() =>
                              handleCheckboxChange("edit_any_categories")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete any category"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_any_categories}
                            onChange={() =>
                              handleCheckboxChange("delete_any_categories")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view clauses"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_clauses}
                            onChange={() =>
                              handleCheckboxChange("view_clauses")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create clauses"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_clauses}
                            onChange={() =>
                              handleCheckboxChange("create_clauses")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own clauses"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_clauses}
                            onChange={() =>
                              handleCheckboxChange("edit_clauses")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete own clauses"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_clauses}
                            onChange={() =>
                              handleCheckboxChange("delete_clauses")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit any clause"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_clauses}
                            onChange={() =>
                              handleCheckboxChange("edit_any_clauses")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete any clause"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_any_clauses}
                            onChange={() =>
                              handleCheckboxChange("delete_any_clauses")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view custom fields"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_fields}
                            onChange={() => handleCheckboxChange("view_fields")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create custom fields"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_fields}
                            onChange={() =>
                              handleCheckboxChange("create_fields")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit own custom fields"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_fields}
                            onChange={() => handleCheckboxChange("edit_fields")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete own custom fields"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_fields}
                            onChange={() =>
                              handleCheckboxChange("delete_fields")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can edit any custom field"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_fields}
                            onChange={() =>
                              handleCheckboxChange("edit_any_fields")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can delete any custom field"
                        control={
                          <Checkbox
                            disabled
                            sx={{ fontWeight: "bold" }}
                            checked={permissions.delete_any_fields}
                            onChange={() =>
                              handleCheckboxChange("delete_any_fields")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can view tags"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.view_tags}
                            onChange={() => handleCheckboxChange("view_tags")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can create tags"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.create_tags}
                            onChange={() => handleCheckboxChange("create_tags")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can edit own tags"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_tags}
                            onChange={() => handleCheckboxChange("edit_tags")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete own tags"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_tags}
                            onChange={() => handleCheckboxChange("delete_tags")}
                            color="primary"
                          />
                        }
                      />
                    </Grid>

                    <Grid item>
                      <FormControlLabel
                        label="Can edit any tag"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.edit_any_tags}
                            onChange={() =>
                              handleCheckboxChange("edit_any_tags")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        label="Can delete any tag"
                        control={
                          <Checkbox
                            disabled
                            checked={permissions.delete_any_tags}
                            onChange={() =>
                              handleCheckboxChange("delete_any_tags")
                            }
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </div>
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
