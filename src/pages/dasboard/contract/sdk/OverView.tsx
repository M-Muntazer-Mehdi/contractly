/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext, useCallback } from "react";

import { useForm, Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getBranchList,
  getTeamsList,
  getUserListNameID,
} from "@/service/api/apiMethods";
import { useAuth } from "@/hooks/useAuth";
import { getCategoryList } from "@/service/api/category";
import { getList } from "@/service/api/tags";
import AddIcon from "@mui/icons-material/Add";
import { ContractContext } from "@/context/ContractContext";
import CloseIcon from "@mui/icons-material/Close";
import { log } from "console";
import _ from "lodash";
type FormValues = {
  name: string;
  with_name: string;
  currency: string;
  disription: string;
  value: number;
  category: string;
  tags: string;
  branch: string;
  team: string;
  contractType: string;
  status: string;
  subcategory: string;
};
interface Field {
  name: string;
  value: string;
  isEditing: boolean;
}

const OverView = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const {
    formState,
    setFormState,
    contract,
    setContract,
    setDucomentName,
    documentName,
    IsTemplate,
  } = useContext(ContractContext);
  const { user } = useAuth();
  const [teamData, setTeamData] = useState<Array<any>>([]);
  const [branchData, setBranchData] = useState<Array<any>>([]);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [catategorylist, setCategorylist] = useState<Array<any>>([]);
  const [taglist, setTaglist] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addField, setAddFied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [fields, setFields] = useState<any>([]);
  const [newField, setNewField] = useState<any>({ name: "", value: "" });

  const saveFormData = useCallback(
    _.debounce((newState) => {
      // setContract(newState); // Make sure setContract is defined and imported
    }, 1000),
    []
  );

  const handleInputChange = (field: any, value: any) => {
    const newState = { ...formState, [field]: value };
    if (field === "category") {
      // Reset subcategory when category changes
      newState.subcategory = "";
    }
    setFormState(newState);
    saveFormData(newState);
  };

  console.log(formState, "formState");

  // No need to handle form submission in the same way if you're updating continuously

  const handleAddField = () => {
    setFields([...fields, { ...newField, isEditing: false }]);
    setNewField({ name: "", value: "" });
  };

  const handleFieldChange = (index: any, key: any, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleDeleteField = (index: any) => {
    const updatedFields = fields.filter((_: any, i: any) => i !== index);
    setFields(updatedFields);
  };

  const handleEditField = (index: any) => {
    const updatedFields = [...fields];
    updatedFields[index].isEditing = !updatedFields[index].isEditing;
    setFields(updatedFields);
  };

  const handleNewFieldChange = (key: any, value: any) => {
    setNewField({ ...newField, [key]: value });
  };

  const canAddField =
    newField?.name?.trim() !== "" && newField?.value?.trim() !== "";

  const onSubmit = async (data: FormValues) => {
    try {
      // Assuming data contains the updated overview fields
      // const updatedOverview: any = {
      //   name: documentName,
      //   with_name: data?.with_name,
      //   vendor: "Vendor Name", // Modify as needed
      //   currency: data?.currency,
      //   value: data?.value,
      //   subcategory: data?.subcategory,
      //   tags: data?.tags,
      //   category: data?.category,
      //   branch: data?.branch,
      //   team: data?.team,
      //   contractType: "Type1", // Modify as needed
      //   status: "Active",
      //   feild: newField, // Modify as needed
      //   // Add other fields as necessary
      // };
      // console.log(updatedOverview, "dataupdat");
      // setContract(updatedOverview);
      // updateContractOverview(updatedOverview);
      // toast.success("Contract overview updated successfully");
    } catch (error) {
      // toast.error("Failed to update contract overview");
    }
  };
  // console.log(contract, "contract");

  useEffect(() => {
    const category = catategorylist.find((c) => c._id === selectedCategory);
    setSubCategories(category ? category.subCategories : []);
  }, [selectedCategory, catategorylist]);

  const getTeamsData = async () => {
    try {
      const { data } = await getTeamsList(user?._id);
      setTeamData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getBranchData = async () => {
    try {
      const { data } = await getBranchList(user?._id);

      setBranchData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const CategorylistData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getCategoryList(user?._id);
      setCategorylist(data);
      console.log("branc", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const TaglistData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getList();

      setTaglist(data);

      console.log("teams", data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getBranchData();
      getTeamsData();
      CategorylistData();
      TaglistData();
    }
  }, [user?._id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="subtitle1" color="black">
        Overview
      </Typography>
      <Divider sx={{ mt: 0.1, mb: 1, pl: -1, background: "#174B8B" }} />
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            whiteSpace: "nowrap",
            color: "#000000",
          }}
        >
          Document Name
        </Typography>
        <Controller
          name="name"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              title={documentName}
              {...field}
              placeholder="Add document name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
              variant="standard"
              value={documentName}
              onChange={(e) => {
                field.onChange(e); // Ensure the form state is updated
                setDucomentName(e.target.value); // Update the global state
              }}
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid transparent", // Default state with transparent color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                    color: "gray", // Default placeholder color
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      borderBottom: "2px solid transparent", // Transparent on focus by default
                    },
                    "&:not(:placeholder-shown)": {
                      // When input has content
                      "&::placeholder": {
                        color: "#0F151B !important", // New placeholder color when typing
                      },
                      "&:focus": {
                        borderBottom: "1px solid #174B8B", // New underline color when typing
                      },
                    },
                  },
                },
              }}
              inputProps={{
                maxLength: 50, // HTML5 attribute to limit characters directly in the input field
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            whiteSpace: "nowrap",
            color: "#000000",
          }}
        >
          With
        </Typography>
        <Controller
          name="with_name"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              value={formState.with_name}
              onChange={(e) => handleInputChange("with_name", e.target.value)}
              placeholder="Add third party name"
              fullWidth
              error={!!errors.with_name}
              // helperText={errors.with_name}
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid transparent", // Default state with transparent color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                    color: "gray", // Default placeholder color
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      borderBottom: "2px solid transparent", // Transparent on focus by default
                    },
                    "&:not(:placeholder-shown)": {
                      // When input has content
                      "&::placeholder": {
                        color: "#0F151B !important",
                      },
                      "&:focus": {
                        borderBottom: "1px solid #174B8B", // New underline color when typing
                      },
                    },
                  },
                },
              }}
              inputProps={{
                maxLength: 50, // HTML5 attribute to limit characters directly in the input field
              }}
            />
          )}
        />
      </Box>
      {IsTemplate && (
        <Box sx={{ mb: 0 }}>
          <Typography
            variant="body1"
            sx={{
              minWidth: "75px",
              mr: 2,
              mb: 0.8,
              whiteSpace: "nowrap",
              color: "#000000",
            }}
          >
            Description
          </Typography>
          <Controller
            name="disription"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                value={formState.disription}
                onChange={(e) =>
                  handleInputChange("disription", e.target.value)
                }
                placeholder="Add disription"
                fullWidth
                error={!!errors.disription}
                // helperText={errors.with_name}
                variant="standard"
                InputProps={{
                  disableUnderline: true, // Disables the underline by default
                  sx: {
                    "::after": {
                      borderBottom: "2px solid transparent", // Default state with transparent color
                    },
                    "::before": {
                      borderBottom: "none !important", // Hides the underline
                    },
                    ":hover:not(.Mui-disabled)::before": {
                      borderBottom: "none !important", // Ensures underline stays hidden on hover
                    },
                    "input:focus + fieldset": {
                      border: "none", // Optional: for outlined variant if ever used
                    },
                    "::placeholder": {
                      fontSize: "0.55rem",
                      color: "gray", // Default placeholder color
                    },
                    input: {
                      fontSize: "0.875rem",
                      "&:focus": {
                        borderBottom: "2px solid transparent", // Transparent on focus by default
                      },
                      "&:not(:placeholder-shown)": {
                        // When input has content
                        "&::placeholder": {
                          color: "#0F151B !important",
                        },
                        "&:focus": {
                          borderBottom: "1px solid #174B8B", // New underline color when typing
                        },
                      },
                    },
                  },
                }}
                inputProps={{
                  maxLength: 50, // HTML5 attribute to limit characters directly in the input field
                }}
              />
            )}
          />
        </Box>
      )}

      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{
            minWidth: "75px",
            mr: 2,
            mb: 0.8,
            whiteSpace: "nowrap",
            color: "#000000",
          }}
        >
          Annual Value
        </Typography>
        <Controller
          name="value"
          control={control}
          //   rules={{ required: "This field is required" }}
          render={({ field }) => (
            <TextField
              value={formState.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              placeholder="Add value"
              fullWidth
              error={!!errors.value}
              // helperText={errors.name?.value}
              variant="standard"
              InputProps={{
                disableUnderline: true, // Disables the underline by default
                sx: {
                  "::after": {
                    borderBottom: "2px solid transparent", // Default state with transparent color
                  },
                  "::before": {
                    borderBottom: "none !important", // Hides the underline
                  },
                  ":hover:not(.Mui-disabled)::before": {
                    borderBottom: "none !important", // Ensures underline stays hidden on hover
                  },
                  "input:focus + fieldset": {
                    border: "none", // Optional: for outlined variant if ever used
                  },
                  "::placeholder": {
                    fontSize: "0.55rem",
                    color: "gray", // Default placeholder color
                  },
                  input: {
                    fontSize: "0.875rem",
                    "&:focus": {
                      borderBottom: "2px solid transparent", // Transparent on focus by default
                    },
                    "&:not(:placeholder-shown)": {
                      // When input has content
                      "&::placeholder": {
                        color: "#0F151B !important",
                      },
                      "&:focus": {
                        borderBottom: "1px solid #174B8B", // New underline color when typing
                      },
                    },
                  },
                },
              }}
            />
          )}
        />
      </Box>
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{ minWidth: "75px", mt: 0.8, mr: 2, color: "#000000" }}
        >
          Currency
        </Typography>

        <Controller
          name="branch"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                value={formState?.currency}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange("currency", e.target.value);
                }}
                labelId="subcategory-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === undefined) {
                    return (
                      <em
                        style={{
                          color: "#92929D",
                          fontStyle: "normal",
                          fontSize: "13px",
                        }}
                      >
                        Choose currency
                      </em> // Placeholder text with custom color and font size
                    );
                  }
                  return value; // Ensure this reflects the selected option text correctly
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px",
                    marginLeft: "-0.8rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
              >
                <MenuItem value="$">$</MenuItem>
                <MenuItem value="NZ$">NZ$</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* <Box sx={{ mb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            minWidth: "75px",
            mr: 2,
            whiteSpace: "nowrap",
            color: "#155BE5",
          }}
        >
          Branch
        </Typography>
        <FormControl fullWidth size="small">
          <Controller
            name="branch"
            control={control}
            defaultValue=""
            rules={{ required: " Branch is required" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="branch-label"
                placeholder="Branch"
                displayEmpty
                renderValue={(value: any) => {
                  if (value === undefined) {
                    return (
                      <em
                        style={{
                          color: "#C2C2C2",
                          fontStyle: "normal",
                          fontSize: "13px",
                          
                        }}
                      >
                        Select branch
                      </em> // Placeholder text with custom color
                    );
                  }
                  const selectedBranch = branchData.find(
                    (branch) => branch._id === value
                  );
                  return selectedBranch ? selectedBranch.branchName : "";
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px", // Ensure consistent font size
                     marginLeft: "-0.8rem",
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
              >
                {branchData?.map((branch: any) => (
                  <MenuItem key={branch?._id} value={branch?._id}>
                    {branch?.branchName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Box> */}
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{
            minWidth: "75px",
            mr: 2,
            whiteSpace: "nowrap",
            color: "#000000",
          }}
        >
          Team
        </Typography>

        <Controller
          name="branch"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                value={formState.teams}
                onChange={(e) => {
                  handleInputChange("teams", e.target.value);
                }}
                labelId="subcategory-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === undefined) {
                    return (
                      <em
                        style={{
                          color: "#92929D",
                          fontStyle: "normal",
                          fontSize: "13px",
                        }}
                      >
                        Select team
                      </em> // Placeholder text with custom color
                    );
                  }

                  // Find the team with the matching ID in teamData and return its name
                  const selectedTeam = teamData.find(
                    (team) => team._id === value
                  );
                  return selectedTeam ? selectedTeam.name : "";
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px",
                    marginLeft: "-0.8rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
              >
                {teamData?.map((team: any) => (
                  <MenuItem key={team._id} value={team._id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{ minWidth: "75px", mr: 2, color: "#000000" }}
        >
          Category
        </Typography>
        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              {/* Optional: add this line if you want a label */}
              <Select
                {...field}
                value={formState?.category}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange("category", e.target.value);
                }}
                labelId="manager-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === undefined) {
                    return (
                      <em
                        style={{
                          color: "#92929D",
                          fontStyle: "normal",
                          fontSize: "13px",
                        }}
                      >
                        Select category
                      </em> // Placeholder text with custom color
                    );
                  }
                  // Find the selected manager by ID
                  const selectedCategory = catategorylist.find(
                    (category) => category._id === value
                  );
                  return selectedCategory ? `${selectedCategory.name}` : "";
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px", // Ensure consistent font size
                    marginLeft: "-0.8rem",
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
              >
                {catategorylist?.map((category: any) => (
                  <MenuItem key={category?._id} value={category?._id}>
                    {category?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{ minWidth: "75px", mr: 2, color: "#000000" }}
        >
          Subcategory
        </Typography>
        <Controller
          name="subcategory"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                value={formState?.subcategory}
                labelId="subcategory-label"
                displayEmpty
                renderValue={(value) =>
                  value === undefined ? (
                    <em
                      style={{
                        color: "#92929D",
                        fontStyle: "normal",
                        fontSize: "13px",
                      }}
                    >
                      Select subcategory
                    </em>
                  ) : (
                    value
                  )
                }
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px", // Ensure consistent font size
                    marginLeft: "-0.8rem",
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange("subcategory", e.target.value);
                }}
              >
                {formState.category &&
                  catategorylist
                    .find((cat) => cat._id === formState.category)
                    ?.subCategories.map((subCategory: any) => (
                      <MenuItem key={subCategory._id} value={subCategory.name}>
                        {subCategory.name}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="body1"
          sx={{
            minWidth: "75px",
            mr: 2,
            whiteSpace: "nowrap",
            color: "#000000",
          }}
        >
          Tag
        </Typography>

        <Controller
          name="tags"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                value={formState.tags}
                onChange={(e) => {
                  handleInputChange("tags", e.target.value);
                }}
                labelId="subcategory-label"
                displayEmpty
                renderValue={(value) => {
                  if (value === undefined) {
                    return (
                      <em
                        style={{
                          color: "#92929D",
                          fontStyle: "normal",
                          fontSize: "13px",
                        }}
                      >
                        Select tag
                      </em> // Placeholder text with custom color
                    );
                  }
                  // Find the selected manager by ID
                  const selectedTags = taglist.find(
                    (tags) => tags._id === value
                  );
                  return selectedTags ? `${selectedTags.name}` : "";
                }}
                sx={{
                  ".MuiSelect-select": {
                    border: "none", // Remove border
                    fontSize: "13px",
                    marginLeft: "-0.8rem", // Ensure consistent font size
                    "&:focus": {
                      backgroundColor: "transparent", // Remove the background color on focus
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensure no border
                  },
                }}
              >
                {taglist?.map((tag: any) => (
                  <MenuItem key={tag?._id} value={tag?._id}>
                    {tag?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Divider sx={{ mt: 1, mb: 2, background: "#174B8B" }} />
      <Box>
        <Button
          onClick={() => {
            // if (canAddField) {
            //   handleAddField();
            // }
            setAddFied((prevState) => !prevState);
          }}
          size="small"
          sx={{
            fontSize: "12px",
            mb: "5px",
            textTransform: "none",
            backgroundColor: "#174B8B",
            "&:hover": {
              backgroundColor: "#2B6EC2",
            },
          }}
          variant="contained"
        >
          <AddIcon sx={{ fontSize: "14px" }} /> Add Field
        </Button>

        {fields?.map((field: any, index: any) => (
          <Box key={index} sx={{ display: "flex", width: "100px" }}>
            {field.isEditing ? (
              <></>
            ) : (
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    minWidth: "200px",
                    maxWidth: "200px",
                    flexDirection: "column", // This ensures items are stacked vertically if needed
                  }}
                >
                  <Typography
                    style={{
                      wordWrap: "break-word", // Breaks the words to prevent overflow
                      whiteSpace: "normal", // Allows the text to wrap
                    }}
                  >
                    {field.name}:
                  </Typography>
                  <Typography
                    style={{
                      wordWrap: "break-word", // Allows long words to be broken and wrapped
                      whiteSpace: "normal", // Ensures text wraps to next line
                    }}
                  >
                    {field.value}
                  </Typography>
                </div>

                <IconButton onClick={() => handleDeleteField(index)}>
                  <CloseIcon
                    sx={{
                      cursor: "pointer",
                      color: "action.active",

                      fontSize: "18px",
                    }}
                  />
                </IconButton>
              </div>
            )}
          </Box>
        ))}

        {addField && (
          <>
            <TextField
              value={newField?.name}
              onChange={(e) => handleNewFieldChange("name", e.target.value)}
              placeholder="Enter name"
              size="small"
              sx={{ mr: 2 }}
              variant="standard"
              // onKeyPress={(e) => {
              //   if (e.key === "Enter") {
              //     handleAddField();
              //   }
              // }}
              inputProps={{
                maxLength: 40,
              }}
            />
            <TextField
              value={newField?.value}
              onChange={(e) => handleNewFieldChange("value", e.target.value)}
              placeholder="Enter value"
              size="small"
              variant="standard"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddField();
                }
              }}
              inputProps={{
                maxLength: 40,
              }}
            />
          </>
        )}
      </Box>
    </form>
  );
};

export default OverView;
