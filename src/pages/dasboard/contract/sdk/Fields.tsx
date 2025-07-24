/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContractContext } from "@/context/ContractContext";
import { useAuth } from "@/hooks/useAuth";
import { getUserListNameID } from "@/service/api/apiMethods";
import { getfeildList } from "@/service/api/customFeild";
import useStore from "@/context/ZustandStore";
import {
  Autocomplete,
  Box,
  Divider,
  MenuItem,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import {
  CheckBoxFormFieldInfo,
  TextFormFieldInfo,
} from "@syncfusion/ej2-react-documenteditor";
import React, { useContext, useEffect, useState } from "react";
import ps from "../../../../assets/icons/ps.svg";
import userIcon from "../../../../assets/icons/user.svg";
import companyIcon from "../../../../assets/icons/company.svg";
import signIcon from "../../../../assets/icons/sign.svg";
import titleIcon from "../../../../assets/icons/title.svg";
import dateIcon from "../../../../assets/icons/date.svg";

import textIcon from "../../../../assets/icons/textIcon.svg";
import checkIcon from "../../../../assets/icons/checkIcon.svg";
import radioIcon from "../../../../assets/icons/radioIcon.svg";
import shortIcon from "../../../../assets/icons/short.svg";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import SignatureMultiSendReq from "./SignatureMultiSendReq";
import OpenDrawSignature from "./OpenDrawSignature";
import ClearIcon from "@mui/icons-material/Clear";
import ReactQuill from "react-quill";
import { Label } from "@mui/icons-material";
import { AnyCnameRecord } from "dns";

interface OptionType {
  email: string;
  name: string;
}
interface FormField {
  fieldName?: string;
  value?: string;
}

interface Checkbox {
  id: string;
  label: string;
}

const Fields = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();

  const { user } = useAuth();
  const {
    activeSection,
    setActiveSection,
    showButtons,
    setShowButtons,
    recipients,
    setRecipients,
    setOpenMultiDialog,
    openMultiDialog,
    setDragFields,
    dragFields,
    editorRefContext,
    auditTrails,
    setAuditTrails,
  } = useContext(ContractContext);

  const [inputValue, setInputValue] = useState("");
  const [selectedCustomFeild, setSelectedCustomFeild] = useState<any>([]);
  const [show, setShow] = useState<any>("");
  const [showSidebar, setShowSidebar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Array<any>>([]);

  const [requiredField, setRequiredField] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const [ClickData, setClickData] = useState("");

  const [newDragedField, setNewDragedField] = useState("");

  const handleGetValue = (e: any) => {
    setTextFields({ ...textFields, placeholder: e.target.value });
  };

  const [selectionField, setSelectionField] = useState("");
  const [feildList, setFeildList] = useState<Array<any>>([]); // State for the message input
  // State to track if the comment is internal or external
  const [selectedEmails, setSelectedEmails] = useState<any | null>(null);

  const colors = ["#D3FDE4", "#D3DFFD", "#FFE1CB", "#3F9748"];
  const [backgroundColor, setBackgroundColor] = useState("#d9d9d9");
  const [items, setItems] = useState<any[]>([]);
  const [nextOptionNumber, setNextOptionNumber] = useState<number>(2);

  const handleOnChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: OptionType | null
  ) => {
    console.log("new", newValue);
    setSelectedEmails(newValue);
    if (newValue) {
      const index =
        options.findIndex((option: any) => option.email === newValue.email) %
        colors.length;
      const selectedColor = colors[index];
      setBackgroundColor(selectedColor); // Set the color state to the selected option's color
    } else {
      setBackgroundColor("#D9D9D9"); // Reset or handle deselection
    }
  };

  const checkBoxDrag = (e: any) => {
    //Insert Checkbox form field
    if (selectedEmails) {
      e.dataTransfer.setData("text/plain", "<input type='checkbox' />");
    }

    //Insert Drop down form field
  };

  // console.log("selection Field new", selectionField);

  useEffect(() => {
    const documentEditor = editorRefContext;
  }, [selectionField]);

  // handle change required

  // handle change value

  const handleSetValue = () => {
    if (!textFields) {
      console.error("No textField object provided.");
      return;
    }

    if (editorRefContext) {
      const editor = editorRefContext.editor;

      let container: HTMLElement | null | any = null;

      // Find an existing text field container or create a new one
      let existingContainer = Array.from(
        editor.scroll.domNode.querySelectorAll(".text-field-container")
      ).find((container: any) => {
        const input = container.querySelector('input[type="text"]');
        return input && input.getAttribute("data-id") === textFields.id;
      });

      if (existingContainer) {
        container = existingContainer;
      } else {
        // Create a new container if no existing container found
        const cursorPosition = editor.getLength() - 1;
        editor.insertEmbed(cursorPosition, "text-field-container", {
          backgroundColor: backgroundColor,
          required: requiredCheckbox, // Pass the required attribute here
          id: textFields.id,
          placeholder: textFields.placeholder,
        });
        container = editor.scroll.domNode.querySelector(
          ".text-field-container:last-of-type"
        );
      }

      // Handle the required attribute and asterisk
      if (requiredCheckbox) {
        if (!container.querySelector(".asterisk")) {
          const asterisk = document.createElement("span");
          asterisk.innerText = "*";
          asterisk.classList.add("asterisk");
          asterisk.style.position = "relative";
          asterisk.style.top = "5px";
          asterisk.style.transform = "translateY(-50%)";
          asterisk.style.right = "10px"; // Adjust right position as needed
          asterisk.style.color = "red"; // Adjust color as needed
          asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
          asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
          asterisk.style.height = "20px"; // Increase height of asterisk
          asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
          container.appendChild(asterisk);
        }
      } else {
        const asterisk = container.querySelector(".asterisk");
        if (asterisk) {
          asterisk.remove();
        }
      }

      // Update or insert text field
      const textFieldElement = container.querySelector('input[type="text"]');
      if (textFieldElement) {
        textFieldElement.placeholder = textFields.placeholder;
        textFieldElement.setAttribute("data-id", textFields.id);
      } else {
        const textFieldNode = document.createElement("div");
        textFieldNode.innerHTML = `<input type="text" id="${textFields.id}" placeholder="${textFields.placeholder}" data-id="${textFields.id}">`;
        container!.appendChild(textFieldNode);
      }
      setAuditTrails([
        ...auditTrails,
        {
          user: user.firstName,
          date: new Date(),
          message: `added text-field for ${
            selectedEmails.label || selectedEmails.email
          }`,
        },
      ]);

      // Set the selection to the end of the editor content
      setTextFields({}); // Clear textFields object

      editor.setSelection(editor.getLength(), 0);
    } else {
      console.error("Editor reference context is not set.");
    }
  };

  const DraggableField = ({ field }: any) => {
    const handleDragStart = (e: any) => {
      e.dataTransfer.setData("text/plain", `<input type="text" />`);

      if (editorRefContext) {
        const quill = editorRefContext.getEditor();

        if (quill && selectedEmails) {
          const selection = quill.getSelection();
          const cursorPosition = (selection && selection.index) || 0;
          const textFieldId = `text_field_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          const textField = {
            id: textFieldId,
            placeholder: "TextField",
            required: requiredCheckbox,
            backgroundColor,
          };

          quill.insertEmbed(cursorPosition, "text-field-container", textField);

          setTextFields(textField);

          // Get the updated document length after insertion
          const updatedLength = quill.getLength();

          // Ensure the new cursor position is within the document bounds
          if (cursorPosition + 1 <= updatedLength) {
            quill.setSelection(cursorPosition + 1);
          } else {
            console.error("The new cursor position is out of bounds.");
          }
        }
      } else {
        console.error("Editor reference context is not set.");
      }
    };

    return (
      <>
        {field?.id !== "RadioButton" && (
          <div
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable={selectedEmails ? true : false}
            onDragEnd={handleDragStart}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
      </>
    );
  };

  const fields = [
    { id: "Initial", icon: ps, label: "Initial", placeholder: "[Initial]" },

    {
      id: "DateSigned",
      icon: dateIcon,
      label: "Date Signed",
      placeholder: "[ Date Signed ]",
    },

    {
      id: "FullName",
      icon: userIcon,
      label: "Full Name",
      placeholder: "[ Full Name ]",
    },

    { id: "Title", icon: titleIcon, label: "Title", placeholder: "[ Title ]" },

    {
      id: "company",
      icon: companyIcon,
      label: "Company",
      placeholder: "[ Company ]",
    },
    {
      id: "Text",
      icon: textIcon,
      label: "Text",
      placeholder: "[ Text ]",
    },

    // {
    //   id: "ShortAnswer",
    //   icon: shortIcon,
    //   label: "Short Answer",
    //   placeholder: "[ Short Answer ]",
    // },
  ];

  console.log(showSidebar, "fieldstest");

  const buttonFields = [
    {
      id: "Checkbox",
      icon: checkIcon,
      label: "Checkbox",
      placeholder: "[ Checkbox ]", // This will be a command to insert a checkbox form field
    },

    {
      id: "RadioButton",
      icon: radioIcon,
      label: "Radio Button",
      placeholder: "[ Radio Button ]", // Command to insert a radio button form field
    },
  ];

  // button dragable fields

  const ButtonDraggableField = ({ field }: any) => {
    console.log("fields : ", field);

    const handleDragStart = (e: any) => {
      e.dataTransfer.setData("text/plain", field.placeholder);

      setShowSidebar(field.placeholder);
      const documentEditor = editorRefContext;
      if (selectedEmails) {
        documentEditor.editor.insertFormField("Text");
      }

      const textfieldInfo: TextFormFieldInfo = documentEditor.getFormFieldInfo(
        "Text1"
      ) as TextFormFieldInfo;

      console.log("text fielf info :", textfieldInfo);

      textfieldInfo.defaultValue = field?.label + (requiredField ? " *" : "");
      // textfieldInfo.format = "Lowercase";
      textfieldInfo.type = "Text";
      textfieldInfo.name = field?.label;
      documentEditor.setFormFieldInfo("Text1", textfieldInfo);
      setDragFields(dragFields + 1);

      setRecipients((prev: any) => {
        const updated = prev.map((user: any) => {
          const matches =
            user.email.trim().toLowerCase() ===
            selectedEmails?.email.trim().toLowerCase();

          if (matches) {
            return { ...user, field: dragFields + 1 };
          }
          return user;
        });
        // console.log("Updated recipients:", updated); // Log the full updated array
        return updated;
      });
    };

    const handleDragStartCheckbox = (e: any) => {
      e.dataTransfer.setData("text/plain", `<input type="checkbox" />`);

      if (editorRefContext) {
        const quill = editorRefContext.getEditor();

        if (quill && selectedEmails) {
          const selection = quill.getSelection();
          const cursorPosition = (selection && selection.index) || 0;
          const checkboxId = `checkbox_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          const checkbox = {
            label: "OptionCheckBox",
            checked: false,
            id: checkboxId,
            backgroundColor,
          };
          quill.insertEmbed(cursorPosition, "checkbox-container", checkbox);

          setCheckboxes([checkbox]);

          quill.setSelection(cursorPosition + 1);
        }
      } else {
        console.error("Editor reference context is not set.");
      }
    };

    const handleDragStartRadioButton = (e: any) => {
      const radioId = `radio${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const radioData = {
        label: "Option",
        id: radioId,
        backgroundColor,
      };

      setSelectionField("");

      e.dataTransfer.setData("text/plain", JSON.stringify(radioData));

      if (editorRefContext) {
        const quill = editorRefContext.getEditor();

        if (quill && selectedEmails) {
          const selection = quill.getSelection();
          const cursorPosition = (selection && selection.index) || 0;

          quill.insertEmbed(cursorPosition, "radio-container", radioData); // Pass the radioData
          setRadios([radioData]);
          quill.setSelection(cursorPosition + 1);
        }
      }
    };

    return (
      <>
        {field?.id == "Checkbox" && (
          // <div
          //   className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
          //   draggable={selectedEmails ? true : false}
          //   onDragEnd={handleDragStart}
          //   style={{ cursor: "grab", backgroundColor }}
          // >
          //   <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          // </div>
          <div
            onClick={checkBoxDrag}
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable={selectedEmails ? true : false}
            onDragEnd={handleDragStartCheckbox}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
        {field?.id == "RadioButton" && (
          <div
            // onClick={radioDrag}
            className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
            draggable={selectedEmails ? true : false}
            onDragEnd={handleDragStartRadioButton}
            style={{ cursor: "grab", backgroundColor }}
          >
            <img src={field?.icon} alt="" className="h-4 w-4" /> {field.label}
          </div>
        )}
      </>
    );
  };

  const listData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserListNameID(user?._id);
      // console.log({ data });

      setUserList(data);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const listFeildData = async () => {
    try {
      setIsLoading(true);
      const { data } = await getfeildList();

      setFeildList(data);

      // console.log("data", data);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      listFeildData();
      listData();
    }
  }, [user?._id]);

  const validRecipients = recipients.filter((recipient: any) =>
    userList.some((user) => recipient.email === recipient.email)
  );

  const options = validRecipients.map((recipient: any) => {
    const user = userList.find((user) => recipient.email === recipient.email);
    return {
      email: recipient.email,
      name: `${user.firstName} ${user.lastName}`,
    };
  });
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1 , #f46464"];

  const [OpenDrawSignatures, setOpenDrawSignatures] = useState(false);

  console.log("requiredField : ", requiredField);

  const handleCloseDrawSigDialog = () => {
    setOpenDrawSignatures(false);
  };

  // @ts-ignore
  const {
    checkboxes,
    setCheckboxes,
    updateCheckboxLabel,
    addCheckboxs,
    emptyCheckboxes,
    deleteCheckboxs,
    requiredCheckbox,
    setRequiredCheckbox,
    radios,
    setRadios,
    addRadioss,
    updateRadioLabel,
    deleteRadios,
    emptyRadios,
    setTextFields,
    textFields,
  } = useStore();

  console.log("TextFields", Object.values(textFields).length > 0);

  const addCheckbox = () => {
    addCheckboxs();
  };

  const handleSaveCheckboxes = () => {
    if (editorRefContext) {
      const editor = editorRefContext.editor;
      let container: HTMLElement | null | any = null;
      const allCheckboxIds = checkboxes.map((checkbox) => checkbox.id);

      if (delCheckboxes && delCheckboxes.length > 0) {
        delCheckboxes.forEach((delCheckbox: any) => {
          const delElem = document.getElementById(delCheckbox.id);
          if (delElem) {
            const parentDiv = delElem.parentNode;
            if (parentDiv && parentDiv.parentNode) {
              parentDiv.parentNode.removeChild(parentDiv);
            }
          }
        });
        setDelCheckboxes([]);
      }

      // Find an existing checkbox container or create a new one
      let existingContainer = Array.from(
        editor.scroll.domNode.querySelectorAll(".checkbox-container")
      ).find((container: any) => {
        const inputs = container.querySelectorAll('input[type="checkbox"]');
        return Array.from(inputs).some((input: any) =>
          allCheckboxIds.includes(input.id)
        );
      });

      if (existingContainer) {
        container = existingContainer;
      } else {
        // Create a new container if no existing container found
        const cursorPosition = editor.getLength() - 1;
        editor.insertEmbed(cursorPosition, "checkbox-container", {
          backgroundColor: backgroundColor,
          required: requiredCheckbox, // Pass the required attribute here
        });
        container = editor.scroll.domNode.querySelector(
          ".checkbox-container:last-of-type"
        );
      }

      // Handle the required attribute and asterisk
      if (requiredCheckbox) {
        if (!container.querySelector(".asterisk")) {
          const asterisk = document.createElement("span");
          asterisk.innerText = "*";
          asterisk.classList.add("asterisk");
          asterisk.style.position = "absolute";
          asterisk.style.top = "50%";
          asterisk.style.transform = "translateY(-50%)";
          asterisk.style.right = "10px"; // Adjust right position as needed
          asterisk.style.color = "red"; // Adjust color as needed
          asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
          asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
          asterisk.style.height = "20px"; // Increase height of asterisk
          asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
          container.appendChild(asterisk);
        }
      } else {
        const asterisk = container.querySelector(".asterisk");
        if (asterisk) {
          asterisk.remove();
        }
      }

      checkboxes.forEach((checkbox) => {
        const getInp = document.getElementById(checkbox.id);
        console.log("getInp", getInp);

        if (getInp) {
          // Update the label text
          const labelNode = getInp.nextSibling;
          if (labelNode) {
            labelNode.nodeValue = ` ${checkbox.label}`;
          }

          // Ensure the existing checkbox is within the container
          if (getInp.parentNode !== container) {
            container!.appendChild(getInp.parentNode!);
          }
        } else {
          // Insert new checkbox into the container
          const checkboxNode = document.createElement("div");
          checkboxNode.innerHTML = `<input type="checkbox" id="${
            checkbox.id
          }" ${checkbox.checked ? "checked" : ""} data-id="${checkbox.id}"> ${
            checkbox.label
          }`;
          container!.appendChild(checkboxNode);
        }
      });

      setAuditTrails([
        ...auditTrails,
        {
          user: user.firstName,
          date: new Date(),
          message: `added checkbox for ${
            selectedEmails.label || selectedEmails.email
          }`,
        },
      ]);
      // Set the selection to the end of the editor content
      editor.setSelection(editor.getLength(), 0);
      setShowSidebar("");
      emptyCheckboxes();
    } else {
      console.error(
        "Editor reference context is not set or no checkboxes to save."
      );
    }
  };

  const handleLabelChange2 = (e: any, index: any) => {
    const newLabel = e.target.value;
    updateCheckboxLabel(index, newLabel);
  };

  const [delCheckboxes, setDelCheckboxes] = useState<any>([]);
  const [delRadios, setDelRadios] = useState<any>([]);

  const deleteCheckbox = (index: number) => {
    deleteCheckboxs(index);
    const ids: any = checkboxes[index];
    setDelCheckboxes([...delCheckboxes, ids]);
  };

  const addRadio = () => {
    addRadioss();
  };

  const handleSaveRadios = () => {
    if (editorRefContext) {
      const randomName = `radioo${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const editor = editorRefContext.editor;
      let container: HTMLElement | null | any = null;
      const allRadioIds = radios?.map((radio) => radio.id);

      // Handle deletion of radios if any in delRadios
      if (delRadios && delRadios?.length > 0) {
        delRadios.forEach((delRadio: any) => {
          const delElem = document.getElementById(delRadio.id);
          if (delElem) {
            const parentDiv = delElem.parentNode;
            if (parentDiv && parentDiv.parentNode) {
              parentDiv.parentNode.removeChild(parentDiv);
            }
          }
        });
        setDelRadios([]);
      }

      // Find an existing radio container or create a new one
      let existingContainer = Array.from(
        editor.scroll.domNode.querySelectorAll(".radio-container")
      ).find((container: any) => {
        const inputs = container.querySelectorAll('input[type="radio"]');
        return Array.from(inputs).some((input: any) =>
          allRadioIds.includes(input.getAttribute("data-id"))
        );
      });

      if (existingContainer) {
        container = existingContainer;
      } else {
        // Create a new container if no existing container found
        const cursorPosition = editor.getLength() - 1;
        editor.insertEmbed(cursorPosition, "radio-container", {
          backgroundColor: backgroundColor,
          required: requiredCheckbox,
        }); // Pass the required attribute here
        container = editor.scroll.domNode.querySelector(
          ".radio-container:last-of-type"
        );
      }

      // Handle asterisk for required radios
      if (requiredCheckbox) {
        if (!container.querySelector(".asterisk")) {
          const asterisk = document.createElement("span");
          asterisk.innerText = "*";
          asterisk.classList.add("asterisk");
          asterisk.style.position = "absolute";
          asterisk.style.top = "50%";
          asterisk.style.transform = "translateY(-50%)";
          asterisk.style.right = "10px"; // Adjust right position as needed
          asterisk.style.color = "red"; // Adjust color as needed
          asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
          asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
          asterisk.style.height = "20px"; // Increase height of asterisk
          asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
          container.appendChild(asterisk);
        }
      } else {
        const asterisk = container.querySelector(".asterisk");
        if (asterisk) {
          asterisk.remove();
        }
      }

      // Update radios within the container
      radios?.forEach((radio: any) => {
        const getInp: any = document.querySelector(
          `input[type="radio"][data-id="${radio.id}"]`
        );
        if (getInp) {
          getInp.name = randomName;
          // Update existing radio button's label
          const parentNode: any = getInp.parentNode;
          if (parentNode) {
            const labelNode = parentNode.childNodes[1]; // Assuming label is the second child
            if (labelNode) {
              labelNode.nodeValue = ` ${radio.label}`; // Update the label text
            }
          }

          // Ensure the existing radio button is within the container
          if (
            parentNode &&
            parentNode.closest(".radio-container") !== container
          ) {
            container.appendChild(parentNode);
          }
        } else {
          // Insert new radio button into the container
          if (container) {
            const radioNode = document.createElement("div");
            radioNode.innerHTML = `<input type="radio" name="${randomName}"  id="${radio.id}" data-id="${radio.id}"> ${radio.label}`;
            container.appendChild(radioNode);
          }
        }
      });

      // Remove the container if it has no radios left
      const radiosInContainer = container.querySelectorAll(
        'input[type="radio"]'
      );
      if (radiosInContainer.length === 0) {
        container.remove();
      }
      setAuditTrails([
        ...auditTrails,
        {
          user: user.firstName,
          date: new Date(),
          message: `added radio for ${
            selectedEmails.label || selectedEmails.email
          }`,
        },
      ]);
      emptyRadios();
      setShowSidebar("");
      editor.setSelection(editor.getLength(), 0);
    } else {
      console.error(
        "Editor reference context is not set or no radios to save."
      );
    }
  };

  const handleLabelChangeRadio = (e: any, index: any) => {
    const newLabel = e.target.value;
    updateRadioLabel(index, newLabel);
  };

  const deleteRadio = (index: number) => {
    deleteRadios(index);
    const ids: any = radios[index];
    setDelRadios([...delRadios, ids]);
  };

  const handleRemoveElements = (
    elements: any[],
    setElements: (elements: any[]) => void
  ) => {
    elements.forEach((element: any) => {
      const delElem = document.getElementById(element.id);
      if (delElem) {
        const container = delElem?.closest(
          ".radio-container, .checkbox-container"
        ); // Adjust to match your class names
        if (container) {
          container?.remove();
        }
      }
    });
    setElements([]);
  };

  const handleRemoveRadios = () => {
    handleRemoveElements(radios, setRadios);
  };

  const handleRemoveCheckboxes = () => {
    handleRemoveElements(checkboxes, setCheckboxes);
  };

  const handleRemoveTextFields = () => {
    const delElem = document.getElementById(textFields.id);
    if (delElem) {
      const container = delElem?.closest(".text-field-container"); // Adjust to match your class names
      if (container) {
        container?.remove();
      }
      setTextFields({});
    }
  };

  return (
    <>
      <div>
        <Typography variant="body1" color="#155be5" sx={{ fontSize: "14px" }}>
          Fields
        </Typography>
        <p className="text-[#8A8A8A] text-[10px] pt-1">
          Drag and drop to assign signature fields for the signer to sign or add
          custom fields to get additional information.
        </p>

        <Divider sx={{ mt: 1, mb: 0.5 }} />
        <Box
          sx={{
            display: "flex",
            mb: 2,
            mt: 2,
            fontSize: "14px",
          }}
        >
          <Autocomplete
            size="small"
            fullWidth
            options={validRecipients}
            getOptionLabel={(option) => option.email}
            value={selectedEmails}
            onChange={handleOnChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Signer"
                variant="outlined"
                style={{
                  backgroundColor:
                    colors[
                      options.findIndex(
                        (opt: any) => opt?.email === selectedEmails?.email
                      ) % colors?.length
                    ],
                }}
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.email === value.email
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>{option.email}</li>
            )}
          />
        </Box>

        {selectionField ||
        showSidebar ||
        checkboxes.length > 0 ||
        delCheckboxes.length > 0 ||
        radios.length > 0 ||
        Object.values(textFields).length > 0 ||
        delRadios.length > 0 ? (
          <>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              {selectionField}
            </Typography>

            <Divider style={{ margin: "10px 0" }} />
            <FormControlLabel
              sx={{
                "& .MuiFormControlLabel-label": { fontSize: "12px" }, // Targeting the label directly
                // Apply any additional styling you need for the FormControlLabel here
              }}
              control={
                <Checkbox
                  checked={requiredCheckbox}
                  onChange={(e) => setRequiredCheckbox(e.target.checked)}
                  name="requiredField"
                  color="primary"
                  sx={{
                    padding: "5px", // Adjusts padding around the checkbox
                    "& .MuiSvgIcon-root": {
                      // Targets the SVG icon representing the checkbox
                      fontSize: "18px", // Adjust this value to scale the icon size
                    },
                  }}
                />
              }
              label="Required Field"
            />
            <Divider style={{ margin: "10px 0" }} />
            {/* for short abswer */}

            {Object.values(textFields).length > 0 && (
              <TextField
                label="Placeholder" // Label text
                value={textFields.placeholder}
                onChange={(e: any) => handleGetValue(e)} // Handle input changes
                fullWidth
                size="small"
                variant="standard"
                InputProps={{
                  sx: {
                    "::after": {
                      borderBottom: "2px solid", // Specify the color if needed, defaults to the theme's primary color
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
                    },
                    input: {
                      fontSize: "0.875rem",
                      "&:focus": {
                        // Shows the underline when the input is focused
                        borderBottom: "2px solid", // Adjust color as needed
                      },
                    },
                  },
                }}
              />
            )}

            {radios?.length > 0 && (
              <div>
                <div style={{ display: "flex" }}>
                  <IconButton color="secondary" sx={{ ml: -1.3 }}>
                    <img src={radioIcon} alt="Check Icon" />
                  </IconButton>{" "}
                  <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                    Radio
                  </Typography>
                </div>
                <div>
                  <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                    Value
                  </Typography>
                  {radios?.map((radio, index) => (
                    <div
                      key={radio.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <TextField
                        value={radio.label}
                        onChange={(e) => handleLabelChangeRadio(e, index)}
                        fullWidth
                        size="small"
                        variant="standard"
                      />
                      <IconButton
                        onClick={() => deleteRadio(index)}
                        aria-label="delete"
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    onClick={addRadio}
                    sx={{
                      mt: 0.5,
                      ml: -1,
                      fontSize: "12px",
                      textTransform: "none !important",
                      borderRadius: 0,
                      color:
                        activeSection === "collaborate"
                          ? "primary.main"
                          : "black",
                      fontWeight: "bold",
                      "&:hover": {
                        borderBottom: 2,
                        borderColor: "primary.main",
                        backgroundColor: "transparent",
                      },
                      borderColor:
                        activeSection === "collaborate"
                          ? "primary.main"
                          : "transparent",
                    }}
                  >
                    + Add new Radio
                  </Button>
                </div>
              </div>
            )}

            {checkboxes?.length > 0 && (
              <div>
                <div style={{ display: "flex" }}>
                  <IconButton color="secondary" sx={{ ml: -1.3 }}>
                    <img src={checkIcon} alt="Check Icon" />
                  </IconButton>{" "}
                  <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                    CheckBox
                  </Typography>
                </div>
                <div>
                  <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                    Value
                  </Typography>
                  {checkboxes?.map((checkbox, index) => (
                    <div
                      key={checkbox.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <TextField
                        value={checkbox.label}
                        onChange={(e) => handleLabelChange2(e, index)}
                        // value={item.label}
                        // onChange={(e) => handleLabelChange(index, e.target.value)}
                        fullWidth
                        size="small"
                        variant="standard"
                      />
                      <IconButton
                        onClick={() => deleteCheckbox(index)}
                        aria-label="delete"
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    onClick={addCheckbox}
                    sx={{
                      mt: 0.5,
                      ml: -1,
                      fontSize: "12px",
                      textTransform: "none !important",
                      borderRadius: 0,
                      color:
                        activeSection === "collaborate"
                          ? "primary.main"
                          : "black",
                      fontWeight: "bold",
                      "&:hover": {
                        borderBottom: 2,
                        borderColor: "primary.main",
                        backgroundColor: "transparent",
                      },
                      borderColor:
                        activeSection === "collaborate"
                          ? "primary.main"
                          : "transparent",
                    }}
                  >
                    + Add value
                  </Button>
                </div>
              </div>
            )}

            <Divider style={{ margin: "10px 0" }} />
            <div style={{ flex: 1, textAlign: "right", marginTop: "0px" }}>
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  mr: "20px",
                  textTransform: "none",
                  backgroundColor: "#DCDCDC",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                  color: "white",
                  padding: "2px 5px !important",
                  height: "25px !important",
                  fontSize: "0.675rem",
                }}
                onClick={() => {
                  {
                    radios.length > 0 && handleRemoveRadios();
                  }
                  {
                    checkboxes.length > 0 && handleRemoveCheckboxes();
                  }

                  {
                    Object.values(textFields).length > 0 &&
                      handleRemoveTextFields();
                  }
                }}
              >
                Remove
              </Button>

              <Button
                variant="contained"
                color="success"
                // disabled={!selectedCustomFeild && !inputValue.trim()}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#62BD6B",
                  "&:hover": {
                    backgroundColor: "#62BD6d",
                  },
                  color: "white",
                  padding: "2px 5px !important",
                  height: "25px !important",
                  fontSize: "0.675rem",
                }}
                onClick={() => {
                  setSelectionField("");

                  // if (selectedCustomFeild) {
                  //   handleAddSignatory(selectedCustomFeild.email);
                  // } else if (inputValue.trim() !== "") {
                  //   handleAddSignatory(inputValue.trim());
                  // }
                  if (
                    showSidebar === "[ Checkbox ]" ||
                    checkboxes.length > 0 ||
                    delCheckboxes.length > 0
                  ) {
                    handleSaveCheckboxes();
                  }
                  if (radios.length > 0 || delRadios.length > 0) {
                    handleSaveRadios();
                  }
                  {
                    Object.values(textFields).length > 0 && handleSetValue();
                  }
                }}
              >
                Save & Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="font-medium text-[14px] text-[#155be5] mt-10">
              Signature Fields
            </p>
            <div style={{ padding: "1px" }}>
              <div onClick={() => setOpenDrawSignatures(true)}>
                <div
                  className={`text-[#888888] flex items-center gap-x-2 text-[12px] h-6 w-full my-2 pl-2`}
                  style={{ cursor: "grab", backgroundColor }}
                >
                  <img src={signIcon} alt="" className="h-4 w-4" /> Signature
                </div>
              </div>

              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <DraggableField field={field} />
                  {/* Add a Divider after the 4th index */}
                  {index === 4 && <Divider sx={{ mt: 0, mb: 3 }} />}
                </React.Fragment>
              ))}
            </div>

            {/* buttonFields */}

            {buttonFields.map((field, index) => (
              <React.Fragment key={field.id}>
                <ButtonDraggableField field={field} />
              </React.Fragment>
            ))}

            <Divider sx={{ mt: 1, mb: 2 }} />
            <p className="font-medium text-[14px] text-[#155be5] my-3">
              Custom Fields
            </p>
            <Autocomplete
              size="small"
              fullWidth
              multiple
              options={feildList}
              value={selectedCustomFeild}
              onChange={(event, newValue) => {
                setSelectedCustomFeild(newValue);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              )}
              renderInput={(params) => <TextField {...params} label="Search" />}
              renderTags={() => null} // Optionally, prevent tags from rendering if `multiple` is enabled
            />
            <div style={{ marginTop: "10px" }}>
              {selectedCustomFeild.map((field: any) => (
                <p key={field._id}>{field.name}</p> // Ensure you return the name or the desired field
              ))}
            </div>
          </>
        )}
      </div>

      <OpenDrawSignature
        openDilog={OpenDrawSignatures}
        onClose={handleCloseDrawSigDialog}
        closeFirstOen={handleCloseDrawSigDialog}
        selectedEmails={selectedEmails}
      />
    </>
  );
};

export default Fields;
