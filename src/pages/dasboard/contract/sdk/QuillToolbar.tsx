import { ContractContext } from "@/context/ContractContext";
import useStore from "@/context/ZustandStore";
import { Menu, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from 'react-dom';
import { Quill } from "react-quill";
import DropdownBarImage from "../../../../assets/shape.png";
import { Sketch } from "@uiw/react-color";
import ResizeModule from "quill-resize-module";
//import { setWaitingForBold } from './sharedflag';
import { getCtrlShiftAPressed, setCtrlShiftAPressed, getEditorInstances,   clearHighlight } from './sharedflag';
import TableGridPicker from './TableGridPicker'; // make sure path is correct
Quill.register("modules/resize", ResizeModule);

import CustomOrderedList from './customOrderedList'; // path to your blot

type Page = 
  | { type: 'pageBreak' }
  | { type: 'content'; content: string };


type QuillToolbarProps = {
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
};


const BlockEmbed1 = Quill.import('blots/block/embed');

class TableBlot extends BlockEmbed1 {
  static blotName = 'htmlTable';
  static tagName = 'div';
  static className = 'custom-html-table';

  static create(value: string) {
    const node = super.create() as HTMLElement;
    node.innerHTML = value;

    // Enable contentEditable for all cells
    TableBlot.makeCellsEditable(node);

    // Bind cell click events to dynamically add row/column
    TableBlot.addInteractionListeners(node);

    return node;
  }

  static value(node: HTMLElement) {
    return node.innerHTML;
  }

  static makeCellsEditable(node: HTMLElement) {
    const cells = node.querySelectorAll('td, th');
    cells.forEach((cell) => {
      (cell as HTMLElement).contentEditable = 'true';
      (cell as HTMLElement).style.padding = '8px';
    });
  }

static showActionMenu(cell: HTMLTableCellElement, table: HTMLTableElement, node: HTMLElement) {
  const existingMenu = document.getElementById('table-action-menu');
  if (existingMenu) existingMenu.remove();

  const menu = document.createElement('div');
  menu.id = 'table-action-menu';
  menu.style.position = 'absolute';
  menu.style.background = '#fff';
  menu.style.border = '1px solid #ccc';
  menu.style.padding = '6px';
  menu.style.boxShadow = '0px 2px 8px rgba(0,0,0,0.15)';
  menu.style.zIndex = '9999';

  const createMenuItem = (label: string, onClick: (e: MouseEvent) => void) => {
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.style.cursor = 'pointer';
    btn.style.padding = '4px';
    btn.onclick = onClick;
    return btn;
  };

  const rowIndex = cell.parentElement ? Array.from((cell.parentElement.parentElement as HTMLTableElement).rows).indexOf(cell.parentElement as HTMLTableRowElement) : -1;

  const colIndex = Array.from(cell.parentElement!.children).indexOf(cell);

  menu.appendChild(createMenuItem('+ Add Row', (e) => {
    e.stopPropagation();
    TableBlot.insertRow(table);
    node.innerHTML = table.outerHTML;
    TableBlot.makeCellsEditable(node);
    TableBlot.addInteractionListeners(node);
    menu.remove();
  }));

  menu.appendChild(createMenuItem('+ Add Column', (e) => {
    e.stopPropagation();
    TableBlot.insertColumn(table);
    node.innerHTML = table.outerHTML;
    TableBlot.makeCellsEditable(node);
    TableBlot.addInteractionListeners(node);
    menu.remove();
  }));

  if (table.rows.length > 1) {
    menu.appendChild(createMenuItem('🗑 Delete Row', (e) => {
      e.stopPropagation();
      TableBlot.deleteRow(table, rowIndex);
      node.innerHTML = table.outerHTML;
      TableBlot.makeCellsEditable(node);
      TableBlot.addInteractionListeners(node);
      menu.remove();
    }));
  }

  if (table.rows[0].cells.length > 1) {
    menu.appendChild(createMenuItem('🗑 Delete Column', (e) => {
      e.stopPropagation();
      TableBlot.deleteColumn(table, colIndex);
      node.innerHTML = table.outerHTML;
      TableBlot.makeCellsEditable(node);
      TableBlot.addInteractionListeners(node);
      menu.remove();
    }));
  }

  document.body.appendChild(menu);

  const rect = cell.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY}px`;
  menu.style.left = `${rect.left + window.scrollX}px`;

  document.addEventListener('click', () => {
    menu.remove();
  }, { once: true });
}


  static addInteractionListeners(node: HTMLElement) {
  const table = node.querySelector('table');
  if (!table) return;

  const lastRow = table.rows[table.rows.length - 1];
  const lastColIndex = lastRow ? lastRow.cells.length - 1 : -1;

  // Prevent duplicate listeners
  const allCells = table.querySelectorAll('td, th');
  allCells.forEach((cell) => {
    const clone = cell.cloneNode(true);
    cell.parentNode?.replaceChild(clone, cell);
  });

  Array.from(table.rows).forEach((row, rowIndex) => {
    Array.from(row.cells).forEach((cell, colIndex) => {
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        const isLastRow = rowIndex === table.rows.length - 1;
        const isLastCol = colIndex === lastColIndex;

        if (isLastRow || isLastCol) {
          TableBlot.showActionMenu(cell as HTMLTableCellElement, table, node);
        }
      });
    });
  });
}


  static insertRow(table: HTMLTableElement) {
    const row = table.insertRow();
    const colCount = table.rows[0]?.cells.length || 1;
    for (let i = 0; i < colCount; i++) {
      const cell = row.insertCell();
      cell.contentEditable = 'true';
      cell.style.padding = '8px';
    }
  }

  static insertColumn(table: HTMLTableElement) {
    Array.from(table.rows).forEach((row) => {
      const cell = row.insertCell();
      cell.contentEditable = 'true';
      cell.style.padding = '8px';
    });
  }

  static deleteRow(table: HTMLTableElement, rowIndex: number) {
    if (table.rows.length > 1 && rowIndex >= 0) {
      table.deleteRow(rowIndex);
    }
  }

  static deleteColumn(table: HTMLTableElement, colIndex: number) {
    if (table.rows[0].cells.length > 1 && colIndex >= 0) {
      Array.from(table.rows).forEach((row) => {
        if (row.cells[colIndex]) {
          row.deleteCell(colIndex);
        }
      });
    }
  }

}

// Register blot
Quill.register(TableBlot);


// Custom CheckboxBlot for Quill
const BlockEmbed = Quill.import("blots/block/embed");

class ResizableImage extends BlockEmbed {
  static blotName = "resizableImage";
  static tagName = "img";

  static create(value: { src: string; width?: string; height?: string }) {
    const node = super.create() as HTMLImageElement;
    node.setAttribute("src", value.src);
    if (value.width) node.style.width = value.width;
    if (value.height) node.style.height = value.height;
    node.classList.add("resizable");
    return node;
  }

  static value(node: HTMLImageElement) {
    return {
      src: node.getAttribute("src") || "",
      width: node.style.width || undefined,
      height: node.style.height || undefined,
    };
  }
}

Quill.register({ "formats/resizableImage": ResizableImage });


class VideoBlot extends BlockEmbed {
  static create(value: any) {
    const node = super.create();
    node.setAttribute("controls", true); // Add controls to the video
    node.setAttribute("src", value); // Set the video source
    node.setAttribute("width", "100%"); // Optional: Set default width
    node.setAttribute("height", "auto"); // Optional: Set default height
    return node;
  }


  static value(node: any) {
    return node.getAttribute("src"); // Get the video source
  }

  format(name: any, value: any) {
    if (name === "video" && value) {
      this.domNode.setAttribute("src", value); // Update the video source
    } else {
      super.format(name, value);
    }
  }
}

VideoBlot.blotName = "video";
VideoBlot.tagName = "video";

Quill.register(VideoBlot);

class AudioBlot extends BlockEmbed {
  static create(value: any) {
    const node = super.create();
    node.setAttribute("src", value);
    node.setAttribute("controls", true);
    node.setAttribute("width", "100%");
    return node;
  }

  static value(node: any) {
    return node.getAttribute("src");
  }
}

AudioBlot.blotName = "audio";
AudioBlot.tagName = "audio";

Quill.register(AudioBlot);

class CheckboxContainerBlot extends BlockEmbed {
  static create(value: any) {
    const store: any = useStore.getState();
    const checkboxes = store.checkboxes;

    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.innerHTML = `<input type="checkbox" id="${value.id}" name="${value.name
      }" ${value.checked ? "checked" : ""} data-id="${value.id}"> ${value.label}`;
    node.classList.add("checkbox-container");
    node.setAttribute("draggable", "true");

    node.style.backgroundColor = value.backgroundColor || "#f0f0f0"; // Set the background color
    node.style.padding = "4px";
    node.style.margin = "2px 0px"; // Set margin as needed
    node.style.position = "relative"; // Ensure the container is the reference for the asterisk positioning

    node.addEventListener("click", () => {
      const checkboxElements = node.querySelectorAll('input[type="checkbox"]');
      const checkboxArray: any = [];

      checkboxElements.forEach((checkbox: any) => {
        const label = checkbox.nextSibling.nodeValue.trim();
        const checkboxData = {
          id: checkbox.getAttribute("data-id"),
          label,
          checked: checkbox.checked,
        };
        checkboxArray.push(checkboxData);
      });

      const isRequired = node.querySelector(".asterisk") !== null;
      // @ts-ignore
      store.setRequiredCheckbox(isRequired);
      // Update Zustand state
      store.setRadios([]);
      store.setTextFields({});
      store.setCheckboxes(checkboxArray);
    });

    // Check if the required attribute is true and add asterisk accordingly
    if (value.required) {
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
      node.appendChild(asterisk);
    }

    return node;
  }

  static value(node: any) {
    return {
      backgroundColor: node.style.backgroundColor,
      margin: node.style.margin,
      required: node.querySelector(".asterisk") !== null, // Check if the asterisk is present
    };
  }
}

CheckboxContainerBlot.blotName = "checkbox-container";
CheckboxContainerBlot.tagName = "div";

// Register CheckboxContainerBlot with Quill
Quill.register(CheckboxContainerBlot);

class RadioContainerBlot extends BlockEmbed {
  static create(value: any) {
    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.innerHTML = `<input type="radio" id="${value.id}" name="${value.name}" data-id="${value.id}"> ${value.label}`;
    node.setAttribute("draggable", "true");
    node.classList.add("radio-container");
    node.style.backgroundColor = value.backgroundColor || "#f0f0f0"; // Set the background color
    node.style.margin = "2px 0px";
    node.style.padding = "4px";
    node.style.position = "relative"; // Ensure position for absolute elements

    const required = value.required; // Check if required flag is passed

    // Add event listener for updating Zustand state
    node.addEventListener("click", () => {
      const store = useStore.getState();
      const radios: any[] = node.querySelectorAll('input[type="radio"]');
      const radioArray: any[] = [];

      radios.forEach((radio: any) => {
        const label = radio.nextSibling.nodeValue.trim();
        const radioData = {
          id: radio.getAttribute("data-id"),
          label,
        };
        radioArray.push(radioData);
      });

      // Update Zustand state
      store.setCheckboxes([]);
      store.setTextFields({});
      store.setRadios(radioArray);
      const isRequired = node.querySelector(".asterisk") !== null;
      // @ts-ignore
      store.setRequiredCheckbox(isRequired);
    });

    // Handle asterisk addition or removal
    const existingAsterisk = node.querySelector(".asterisk");
    if (required) {
      if (!existingAsterisk) {
        const asterisk = document.createElement("span");
        asterisk.innerText = "*";
        asterisk.classList.add("asterisk");
        asterisk.style.position = "absolute";
        asterisk.style.bottom = "2px";
        asterisk.style.right = "4px";
        asterisk.style.color = "red"; // Adjust color as needed
        asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
        asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
        asterisk.style.height = "20px"; // Increase height of asterisk
        asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
        node.appendChild(asterisk);
      }
    } else {
      if (existingAsterisk) {
        existingAsterisk.remove();
      }
    }

    return node;
  }

  static value(node: any) {
    return {
      backgroundColor: node.style.backgroundColor,
      margin: node.style.margin,
      required: node.querySelector(".asterisk") !== null,
    };
  }
}

RadioContainerBlot.blotName = "radio-container";
RadioContainerBlot.tagName = "div";
Quill.register(RadioContainerBlot);

class TextFieldContainerBlot extends BlockEmbed {
  static create(value: any) {
    console.log("value", value);
    const store: any = useStore.getState();

    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.classList.add("text-field-container");

    const input = document.createElement("input");
    input.type = "text";
    input.id = value.id;
    input.placeholder = value.placeholder || "";
    input.setAttribute("data-id", value.id);

    // Style the input
    input.style.backgroundColor = value.backgroundColor;
    input.style.outline = "none";
    node.appendChild(input);

    node.style.margin = "2px 0px"; // Set margin as needed
    node.style.position = "relative"; // Ensure the container is the reference for the asterisk positioning

    // Event listener to handle clicks on the node
    const handleClick = () => {
      const textFieldElement = node.querySelector('input[type="text"]');
      if (textFieldElement) {
        const textFieldData = {
          id: textFieldElement.getAttribute("data-id"),
          placeholder: textFieldElement.placeholder,
        };
        store.setCheckboxes([]);
        store.setRadios([]);
        store.setTextFields(textFieldData);

        const isRequired = node.querySelector(".asterisk") !== null;
        store.setRequiredCheckbox(isRequired);
      }
    };

    node.addEventListener("click", handleClick);

    // Check if the required attribute is true and add asterisk accordingly
    if (value.required) {
      const asterisk = document.createElement("span");
      asterisk.innerText = "*";
      asterisk.classList.add("asterisk");
      asterisk.style.position = "relative"; // Use absolute positioning
      asterisk.style.top = "5px"; // Center vertically
      asterisk.style.right = "10px"; // Adjust right position as needed
      asterisk.style.color = "red"; // Adjust color as needed
      asterisk.style.fontSize = "20px"; // Increase font size for larger asterisk
      asterisk.style.transform = "translateY(-50%)"; // Ensure the asterisk is vertically centered
      asterisk.style.lineHeight = "1"; // Ensure the asterisk is vertically centered
      asterisk.style.height = "20px"; // Increase height of asterisk
      asterisk.style.width = "20px"; // Increase width of asterisk for better visibility
      node.appendChild(asterisk);
    }

    // Attach the handleClick function to the node, and keep a reference to remove it later if needed
    node.__handleClick = handleClick;

    return node;
  }

  static value(node: any) {
    const input = node.querySelector('input[type="text"]');
    if (input) {
      return {
        backgroundColor: node.style.backgroundColor,
        margin: node.style.margin,
        required: node.querySelector(".asterisk") !== null, // Check if the asterisk is present
        id: input.getAttribute("data-id"),
        placeholder: input.placeholder,
      };
    }
    return {
      backgroundColor: node.style.backgroundColor,
      margin: node.style.margin,
      required: node.querySelector(".asterisk") !== null, // Check if the asterisk is present
    };
  }

  static destroy(node: any) {
    // Clean up event listeners or any other resources when the node is destroyed
    if (node.__handleClick) {
      node.removeEventListener("click", node.__handleClick);
    }
    // Remove any other resources if necessary
  }
}

TextFieldContainerBlot.blotName = "text-field-container";
TextFieldContainerBlot.tagName = "div";

// Register TextFieldContainerBlot with Quill
Quill.register(TextFieldContainerBlot);

class SignatureBlot extends BlockEmbed {
  static create(value: any) {
    let node = super.create();
    node.setAttribute("contenteditable", "false");
    node.classList.add("main-signature");
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("outer-row");
    outerDiv.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-2" style="background-color:#f8f9fa;">
      <div style="font-size:14px; color:#202124; font-weight:600;">SIGNATURES</div>
      <div class="d-flex justify-content-end" style="font-size:12px; color:#007bff; cursor:pointer;">Add Signers</div>
    </div>
  `;
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const recipients = value.recipients || [];
    const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
    recipients.forEach((recipient: any, index: number) => {
      const initials = recipient.label
        ? recipient.label
          .split(" ")
          .map((word: any) => word.charAt(0))
          .join("")
          .substring(0, 2)
        : recipient.email
          ? recipient.email.charAt(0)
          : "P";

      const child = document.createElement("div");
      child.className = "col-6";
      child.innerHTML = ` <div style="background-color: ${bubbleColors[index % bubbleColors.length]
        }; height: 28px; width: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; text-align: center; margin-left:50%">${initials.toUpperCase()}</div>    <div style="margin-left:15%;"><label style="color:#aaa;font-size:14px;">Full Name</label> <input type="text" value=${recipient.label || recipient.email
        } /> </div>  <div style="margin-left:15%;"><label style="color:#aaa;font-size:14px;">Company</label> <input type="text"/> </div> <div style="margin-left:15%;"><label style="color:#aaa;font-size:14px;" className='px-2'>Title</label> <input type="text" /> </div> `;
      rowDiv.appendChild(child);
    });
    node.appendChild(outerDiv);
    node.appendChild(rowDiv);
    return node;
  }
  static value(node: any) {
    return {
      recipients: Array.from(node.querySelectorAll(".col-6")).map(
        (div: any) => {
          return {
            label: div.querySelector('input[placeholder="Full Name"]').value,
            // Add other fields as needed
          };
        }
      ),
    };
  }
}

SignatureBlot.blotName = "signature-blot";
SignatureBlot.tagName = "div";

Quill.register(SignatureBlot);
// Add sizes to whitelist and register them
const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = [
  "11.55px",   // ≈ 7pt
  "13.2px",   // ≈ 8pt
  "14.85px",   // ≈ 9pt
  "16.5px",   // ≈ 10pt
  "18.15px", // ≈ 11pt
  "17.8px", // ≈ 12pt
  "23.1px", // ≈ 14pt
  "29.7px", // ≈ 18pt
  "39.6px", // ≈ 24pt
  "59.4px", // ≈ 36pt
  "79.2px", // ≈ 48pt
  "118.8px", // ≈ 72pt
];
Quill.register(SizeStyle, true);


// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
  "algerian",
  "arial",
  "calibri",
  "cambria",
  "cambria-math",
  "candara",
  "comic-sans-ms",
  "courier-new",
  "georgia",
  "helvetica",
  "impact",
  "segoe-print",
  "segoe-script",
  "segoe-ui",
  "lucida-sans",
  "times-new-roman",
  "verdana",
  "wingdings",
];

Quill.register(Font, true);

const oldFonts = [
  "algerian",
  "arial",
  "calibri",
  "cambria",
  "cambria-math",
  "candara",
  "comic-sans-ms",
  "courier-new",
  "georgia",
  "helvetica",
  "impact",
  "segoe-print",
  "segoe-script",
  "segoe-ui",
  "lucida-sans",
  "times-new-roman",
  "verdana",
  "wingdings",
];

const oldSize = [
  "8px",
  "10px",
  "12px",
  "13px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "26px",
  "28px",
  "32px",
  "36px",
  "40px",
  "44px",
  "48px",
  "54px",
  "60px",
  "72px",
];

const listHandler = function (value: any) {
  // @ts-ignore
  const formats = this.quill.getFormat();
  if (value === "upper-alpha" || value === "lower-alpha") {
    // @ts-ignore
    this.quill.format("list", value);
  } else if (value === "ordered" || value === "bullet") {
    // @ts-ignore
    this.quill.format("list", value);
  }
};

function undoChange(this: any) {
  const quill = this.quill;
  if (quill && quill.history) {
    quill.history.undo();
  } else {
    console.warn("Undo failed: Quill instance or history module not available.");
  }
}

function redoChange(this: any) {
  const quill = this.quill;
  if (quill && quill.history) {
    quill.history.redo();
  } else {
    console.warn("redo failed: Quill instance or history module not available.");
  }
}

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
      list: listHandler,
    },
  },
  history: {
    delay: 0,
    maxStack: 1000,
    userOnly: true,
  },
  resize: {
    modules: ['Resize', 'DisplaySize', 'Toolbar']
  },
  clipboard: {
     matchVisual: false
  }
};

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "radio-container",
  "checkbox-container",
  "text-field-container",
  "signature-blot",
  "lineHeight",
  "video",
  "audio",
  "customHeading",
  'htmlTable',
];

const List = Quill.import("formats/list");

// Custom Lists
class FlowerList extends List {
  static create(value: any) {
    const node = super.create(value);
    node.setAttribute("data-list-type", value);
    return node;
  }

  static formats(node: any) {
    return node.getAttribute("data-list-type") || "";
  }
}

Quill.register(FlowerList, true);

const Parchment = Quill.import("parchment");

const lineHeightConfig = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ["1", "1.15", "1.5", "2", "2.5", "3"],
};

const LineHeightStyle = new Parchment.Attributor.Style(
  "lineHeight",
  "line-height",
  lineHeightConfig
);

const customHeading = {
  scope: Parchment.Scope.INLINE,
  whitelist: ["heading-1", "heading-2", "heading-3", "heading-4", "paragraph"],
};
const CustomHeadingAttribute = new Parchment.Attributor.Class(
  "customHeading",
  "class",
  customHeading
);
Quill.register(CustomHeadingAttribute, true);
Quill.register(LineHeightStyle, true);

export default function QuillToolbar(props: any) {
  const { pages, setPages } = props as QuillToolbarProps;
  
  const {
    isBoldActive,
    setIsBoldActive,
    isItalicActive,
    setIsItalicActive,
    isUnderlineActive,
    setIsUnderlineActive,
    isStrikeActive,
    setIsStrikeActive,
    isScriptActive,
    setIsScriptActive,
    isListActive,
    setIsListActive,
    handleChangeSelection,
    scrollPageRef,
  
  } = props;

  const {
    editorRefContext,
    setDocumentPageSize,
    documentPageSize,
    documentPageMargins,
    setDocumentPageMargins,
    setBgColor,
    bgColorSvg,
    setBgColorSvg,
    fontColorSvg,
    setFontColorSvg,
    setSelectedFont,
    setSelectedHeaders,
    setSelectedFontSize,
    selectedFontValue,
    selectedFontSizeValue,
    selectedHeadersValue,
    setSelectedFontValue,
    setSelectedFontSizeValue,
    setSelectedHeadersValue,
    spacing,
    setSpacing,
    setBgColorSelection,
    editMode,
    setPrevBgColor,
    setPrevFontColor,
    setContractNewFontStyles,
    contractNewFont,
    contractNewFontStyles,
    setContractNewFontSize,
    contractNewFontSize,
  } = useContext(ContractContext);

  const toolbarRef: any = useRef(null);
  
  
  const [currentPage, setCurrentPage] = useState(0);

// const handleAddPage = () => {
//     setPages(prevPages => {
//       const updatedPages = [...prevPages, { content: '' }];
//       const newIndex = updatedPages.length - 1;
//       setCurrentPage(newIndex);
//       console.log('📄 New page added at index:', newIndex);

//       // Simulate Quill history.record if needed
//       // const quill = editorRefContext?.getEditor();
//       // quill?.history?.record();

//       return updatedPages;
//     });
//   };

const PageBreakComponent = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  // A ref to hold the latest version of the page break function
    const pageBreakHandlerRef = useRef<(() => void) | null>(null);

  // This function adds a new page
  // const handleAddPage = () => {
  //   setPages((prevPages) => {
  //     const updatedPages = [...prevPages, { content: '' }];
  //     const newIndex = updatedPages.length - 1;
  //     setCurrentPage(newIndex);

  //     console.log('📄 Page break added at index:', newIndex);

  //     // Simulate Quill history.record if needed
  //     // const quill = yourEditorRef.current;
  //     // if (quill) {
  //     //   quill.history.record();
  //     //   console.log('✍️ Quill history recorded');
  //     // }

  //     return updatedPages;
  //   });
  // }

  // Store the handler so it can be triggered outside
  // pageBreakHandlerRef.current = handleAddPage;

  // External trigger for page break
  const triggerPageBreak = () => {
    if (pageBreakHandlerRef.current) {
      console.log('🧠 Triggering page break...');
      pageBreakHandlerRef.current();
    }
  };
};


  // Trigger function (could be called from outside later)
  const triggerPageBreak = () => {
    console.log('🧠 Triggering page break...');
    PageBreakComponent();
  };

function removeListFromEmptyLines(editor:any) {
  const delta = editor.getContents();
  let index = 0;

  console.log("🔍 Running removeListFromEmptyLines");
  console.log("Delta ops:", delta.ops);

  delta.ops?.forEach((op:any, i:any) => {
    const insert = op.insert;
     const currentListType = op.attributes.list; // ✅ Fix here

    if (typeof insert === 'string' && insert === '\n') {
      const attributes = op.attributes;
      console.log(`Line break at index ${index} with attributes:`, attributes);

      if (attributes && attributes.list) {
        const prevOp = delta.ops[i - 1];
        const prevText = typeof prevOp?.insert === 'string' ? prevOp.insert : '';

        console.log(`→ Checking previous op at i=${i - 1}:`, prevOp);
        console.log(`→ Previous text: "${prevText}"`);

        if (!prevText || /^[\s\u200b]*$/.test(prevText)) {
          console.log(`⚠️ Empty or invisible list line at index ${index}. Removing list.`);
          editor.formatLine(index, 1, { list: false, skipNumber: true }, 'user');
        }
      }
    }

    // Advance index
    if (typeof insert === 'string') {
      index += insert.length;
    } else {
      index += 1;
    }
  });

  console.log("✅ Finished checking for empty list lines");
}

function removeListFromEmptyLinesalpha(editor: any) {
  const delta = editor.getContents();
  let index = 0;

  console.log("🔍 Running removeListFromEmptyLines");
  console.log("Delta ops:", delta.ops);

  const listTypesToCheck = ['lower-alpha', 'upper-alpha'];

  delta.ops?.forEach((op: any, i: number) => {
    const insert = op.insert;
    const listType = op.attributes?.list;

    if (typeof insert === 'string' && insert === '\n') {
      console.log(`↪️ Line break at index ${index} with attributes:`, op.attributes);

      if (listTypesToCheck.includes(listType)) {
        const prevOp = delta.ops[i - 1];
        const prevText = typeof prevOp?.insert === 'string' ? prevOp.insert : '';

        console.log(`→ Checking previous op at i=${i - 1}:`, prevOp);
        console.log(`→ Previous text: "${prevText}"`);

        if (!prevText || /^[\s\u200b]*$/.test(prevText)) {
          console.log(`⚠️ Empty or invisible list line at index ${index}. Removing list formatting.`);
          editor.formatLine(index, 1, { list: false, skipNumber: true }, 'user');
        }
      }
    }

    // Advance index
    if (typeof insert === 'string') {
      index += insert.length;
    } else {
      index += 1;
    }
  });

  console.log("✅ Finished checking for empty list lines");
}

function removeListFromEmptyLinesroman(editor: any) {
  const delta = editor.getContents();
  let index = 0;

  console.log("🔍 Running removeListFromEmptyLines");
  console.log("Delta ops:", delta.ops);

  const listTypesToCheck = ['lower-roman', 'upper-roman'];

  delta.ops?.forEach((op: any, i: number) => {
    const insert = op.insert;
    const listType = op.attributes?.list;

    if (typeof insert === 'string' && insert === '\n') {
      console.log(`↪️ Line break at index ${index} with attributes:`, op.attributes);

      if (listTypesToCheck.includes(listType)) {
        const prevOp = delta.ops[i - 1];
        const prevText = typeof prevOp?.insert === 'string' ? prevOp.insert : '';

        console.log(`→ Checking previous op at i=${i - 1}:`, prevOp);
        console.log(`→ Previous text: "${prevText}"`);

        if (!prevText || /^[\s\u200b]*$/.test(prevText)) {
          console.log(`⚠️ Empty or invisible list line at index ${index}. Removing list formatting.`);
          editor.formatLine(index, 1, { list: false, skipNumber: true }, 'user');
        }
      }
    }

    // Advance index
    if (typeof insert === 'string') {
      index += insert.length;
    } else {
      index += 1;
    }
  });

  console.log("✅ Finished checking for empty list lines");
}




const handleListClick = (value: string) => {
  console.log('[📋 handleListClick] List format value:', value);

  const editor = editorRefContext.getEditor();
  if (!editor) return;

  const range = editor.getSelection(true);
  if (!range) return;

  const [block, offset] = editor.scroll.descendant(
    Quill.import('blots/block'),
    range.index
  );
  

  if (block && block.domNode.tagName === 'LI') {
    // Get the current list type from the blot's attributes (safer)
    const formats = editor.getFormat(range);
    const currentList = formats.list || null;

    if (currentList === value) {
      // Remove list formatting if clicking the same list type
      editor.format('list', false, 'user');
      setIsListActive('');
    } else {
      // Apply new list type
      editor.format('list', value, 'user');
      setIsListActive(value);
    }
  } else {
    // If not inside a list item, just toggle formatting for current line(s)
    if (value === 'none') {
      editor.format('list', false, 'user');
      setIsListActive('');
    } else {
      editor.format('list', value, 'user');
      setIsListActive(value);
    }
  }

  // Close menus
  setAnchorEl2(null);
  setAnchorEl(null);
};


  const [indexCursor, setIndexCursor] = useState<any>(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);

  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open = Boolean(anchorEl2);

  const [anchorElMargins, setAnchorElMargins] = React.useState(null);
  const openMargins = Boolean(anchorElMargins);

  const [anchorElOrientation, setAnchorElOrientation] = React.useState(null);
  const openOrientation = Boolean(anchorElOrientation);

  const [anchorElTextColr, setAnchorElTextColor] = React.useState(null);
  const openTextColor = Boolean(anchorElTextColr);

  const [anchorElFontColor, setAnchorElFontColor] = React.useState(null);
  const openFontColor = Boolean(anchorElFontColor);

  const [anchorElBgColor, setAnchorElBgColor] = React.useState(null);
  const openBgColor = Boolean(anchorElBgColor);

  const [anchorElSize, setAnchorElSize] = React.useState(null);
  const openSize = Boolean(anchorElSize);

  const [anchorElSpacing, setAnchorElSpacing] = React.useState(null);
  const openSpacing = Boolean(anchorElSpacing);

  const [anchorElPicture, setAnchorElPicture] = React.useState(null);
  const openPicutre = Boolean(anchorElPicture);

  const [anchorElMedia, setAnchorElMedia] = React.useState(null);
  const openMedia = Boolean(anchorElMedia);

  const [anchorElAlignment, setAnchorElAlignment] = React.useState(null);
  const openAlignment = Boolean(anchorElAlignment);

  const [anchorElColumns, setAnchorElColumns] = React.useState(null);
  const openColumns = Boolean(anchorElColumns);

  const [anchorElCase, setAnchorElCase] = React.useState(null);
  const openCase = Boolean(anchorElCase);

  const [anchorElLink, setAnchorElLink] = React.useState(null);
  const openLink = Boolean(anchorElLink);

  const [anchorElFormula, setAnchorElFormula] = React.useState<any>(null);
  const openFormula = Boolean(anchorElFormula);

  const [anchorElLinkPicture, setAnchorElLinkPicture] = React.useState(null);
  const openLinkPicture = Boolean(anchorElLinkPicture);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [prevSelectionBg, setPrevSelectionBg] = useState<any>(null);
  const [TextColor, setTextColor] = useState("");

  const [selectedColumn, setSelectedColumn] = useState("one");
  const [dispalyTextChange, setDisplayTextChange] = useState(false);

  const [showFormattingMarks, setShowFormattingMarks] = useState(false);
  const [selectedAlign, setSelectedAlign] = useState("left");

  const [linkUrl, setLinkUrl] = useState("");
  const [displayText, setDisplayText] = useState("");

  const [selection, setSelection] = useState<any>(null);
  const [cursorIndex, setCursorIndex] = useState<number>(0);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    if (range.length > 0) {
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 0);
    }
  };

  const handleClose2 = () => {
    const editor = editorRefContext.getEditor();
    const scrollContainer = scrollPageRef.current;
    const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;

    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }

      setTimeout(() => {
        editor.focus();

        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollY,
            behavior: 'smooth' // Makes the scroll smooth
          });
        }
      }, 0);
    }
    setAnchorEl2(null);
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    if (range.length > 0) {
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 0);
    }
  };

  const handleClose = (event: any) => {
    event.preventDefault();
    const editor = editorRefContext.getEditor();

    // Save the current scroll position of the scrollable container
    const scrollContainer = scrollPageRef.current; // Ensure scrollPageRef is defined and points to the correct container
    const scrollY = scrollContainer ? scrollContainer.scrollTop : 0; // Get scroll position of scrollPageRef
    // console.log

    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }

      // Make sure the editor retains focus after closing the menu
      setTimeout(() => {
        editor.focus();

        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollY,
            behavior: 'smooth'
          });
        }
      }, 0);
    }
    setAnchorEl(null);
  };

// Opens the margin popover and stores the cursor position
const handleOpenMargins = (event: any) => {
  if (openMargins) return; // Prevent re-opening if already open

  const editor = editorRefContext.getEditor(); // Get Quill editor instance
  const range = editor.getSelection(true); // Get current selection (with fallback to cursor position)

  setIndexCursor(range); // Save the current cursor position to restore later
  setAnchorElMargins(event.currentTarget); // Set anchor element for the margin popover

  // Restore scroll position if previously saved
  const scrollContainer = scrollPageRef.current;
  if (scrollPosition) {
    scrollContainer.scrollTop = scrollPosition;
  }
};

// Closes the margin popover and restores cursor focus and position
const handleCloseMargins = () => {
  const editor = editorRefContext.getEditor(); // Get Quill editor instance
  setAnchorElMargins(null); // Close the margin popover

  // Restore the saved cursor position
  if (indexCursor) {
    if (indexCursor.length > 0) {
      editor.setSelection(indexCursor.index + indexCursor.length, 0);
    } else {
      editor.setSelection(indexCursor.index, 0);
    }

    // Delay focus to ensure selection is applied correctly
    setTimeout(() => {
      editor.focus();
    }, 0);
  }
};


  const handleOpenOrientation = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    setAnchorElOrientation(event.currentTarget);
  };

  const handleCloseOrientation = () => {
    const editor = editorRefContext.getEditor();
    setAnchorElOrientation(null);
    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      setTimeout(() => {
        editor.focus();
      }, 0);
    }
  };

  const handleOpenTextColor = (event: any) => {
    if (openTextColor) return;
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    const scrollContainer = scrollPageRef.current;
    const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;
    setScrollPosition(scrollY);
    if (range.length > 0) {
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 0);
      setBgColorSelection(range);
    }
    setAnchorElTextColor(event.currentTarget);
  };

  const handleCloseTextColor = () => {
    const editor = editorRefContext.getEditor();
    const selection = editor.getSelection(true);
    const scrollContainer = scrollPageRef.current;

    setPrevSelectionBg(null);
    if (selection.length) {
      setTimeout(() => {
        editor.setSelection(selection.length, 0);
      }, 0);
    }
    setTimeout(() => {
      if (scrollPosition) {
        scrollContainer.scrollTo({
          top: scrollPosition,
          behavior: 'smooth' // Makes the scroll smooth
        });
      }
    }, 0);
    setAnchorElTextColor(null);
    editor.focus();
  };

  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const handleOpenFontColor = (event: any) => {
    if (openFontColor) return;
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    const scrollContainer = scrollPageRef.current;
    const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;
    setScrollPosition(scrollY);
    setIndexCursor(range);
    if (range.length > 0) {
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 0);
    }
    setAnchorElFontColor(event.currentTarget);
  };

  const handleCloseFontColor = () => {
    const editor = editorRefContext.getEditor();
    const scrollContainer = scrollPageRef.current;

    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      editor.focus();
    }

    if (scrollPosition) {
      scrollContainer.scrollTo({
        top: scrollPosition,
        behavior: 'smooth' // Makes the scroll smooth
      });
    }

    setAnchorElFontColor(null);
  };

  const handleSaveFontColor = (color: string) => {
    if (getCtrlShiftAPressed()) {
  console.log("Apply font color after Ctrl+Shift+Z");
  setCtrlShiftAPressed(false);

  const editors = getEditorInstances();
  console.log("editors:", editors);


  editors.forEach((editor, i) => {
    if (!editor) return;

    console.log(`Editor [${i}] processing...`);
    clearHighlight(editor);
    const length = editor.getLength();
    if (length <= 1) return;

    // Apply font color from start to end (excluding trailing newline)
    editor.formatText(0, length - 1, { color }, "user");

    console.log(`Editor [${i}] colored from 0 to ${length - 1} with color: ${color}`);
  });

  // Optional: set color UI/icon state
  setFontColorSvg(color);
  handleCloseCase();
    }

    const editor = editorRefContext.getEditor();
    if (!editor) return;

    const range = editor.getSelection(true);

    if (range.length === 0) {
      setPrevFontColor(color);
      const [line] = editor.getLine(range.index);
      const text = line?.domNode?.innerText;
      if (text === "\u200B" || (text.trim() === "\u200B" && text.trim().length <= 1)) {
        editor.formatText(range.index - 1, 1, { color }, "user");
      } else {
        editor.format("color", color, "user");
      }
    } else {
      editor.formatText(range.index, range.length, { color }, "user");
      editor.setSelection(range.index + range.length, 0);
    }

    setFontColorSvg(color);
    editor.focus();
  };

  const handleOpenBgColor = (event: any) => {
    setAnchorElBgColor(event.currentTarget);
  };

  const handleCloseBgColor = () => {
    setAnchorElBgColor(null);
  };

  const handleOpenSize = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    setAnchorElSize(event.currentTarget);
  };

  const handleCloseSize = (event: any) => {
    const editor = editorRefContext.getEditor();
    setAnchorElSize(null);
    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      setTimeout(() => {
        editor.focus();
      }, 0);
    }
  };

  const handleOpenAlignment = (event: any) => {
    const editor = editorRefContext.getEditor();

    if (!editor) return;

    // Get the current selection (cursor or text range)
    const range = editor.getSelection(true);

    // Save the selection for later restoration
    setIndexCursor(range);

    // Ensure selection remains intact after menu opens
    if (range && range.length > 0) {
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 0);
    }

    // Open the alignment menu anchored to the clicked element
    setAnchorElAlignment(event.currentTarget);
  };


  const handleCloseAlignment = (event: any) => {
    const editor = editorRefContext.getEditor();
    if (!editor) return;

    const scrollContainer = scrollPageRef.current;
    const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;

    if (indexCursor) {
      // Restore the cursor to the end of the previous selection
      const { index, length } = indexCursor;
      const restoreIndex = length > 0 ? index + length : index;
      editor.setSelection(restoreIndex, 0);

      // Restore scroll and focus after setting the selection
      setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollY,
            behavior: 'smooth', // Smooth scrolling back to previous position
          });
        }
        editor.focus();
      }, 0);
    }

    // Close the alignment dropdown
    setAnchorElAlignment(null);
  };

  const handleOpenPicture = (event: any) => {
    const editor = editorRefContext.getEditor();
    setAnchorElPicture(event.currentTarget);
    const range = editor.getSelection(true);
    setCursorIndex(range.index);
  };

  const handleClosePicture = (event: any) => {
    const editor = editorRefContext.getEditor();

    setAnchorElPicture(null);
    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      setTimeout(() => {
        editor.focus();
      }, 0);
    }
  };

  const handleOpenMedia = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setCursorIndex(range.index);
    setAnchorElMedia(event.currentTarget);
  };

  const handleCloseMedia = (event: any) => {
    const editor = editorRefContext.getEditor();

    setAnchorElMedia(null);
    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      setTimeout(() => {
        editor.focus();
      }, 0);
    }
  };

  const handleOpenColumns = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    if (range.length > 0) {
      editor.setSelection(range.index, range.length);
    }
    setAnchorElColumns(event.currentTarget);
  };

  const handleCloseColumns = () => {
    const editor = editorRefContext.getEditor();
    setAnchorElColumns(null);
    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      setTimeout(() => {
        editor.focus();
      }, 0);
    }
  };

  const handleOpenSpacing = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    if (range.length > 0) {
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 0);
    }
    setAnchorElSpacing(event.currentTarget);
  };

  const handleCloseSpacing = () => {
    const editor = editorRefContext.getEditor();
    const scrollContainer = scrollPageRef.current;
    const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;
    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollY,
            behavior: 'smooth' // Makes the scroll smooth
          });
        }
        editor.focus();
      }, 0);
    }
    setAnchorElSpacing(null);
  };

  const handleOpenLinkPicture = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    setAnchorElLinkPicture(event.currentTarget);
  };

  const handleCloseLinkPicture = () => {
    const editor = editorRefContext.getEditor();
    setAnchorElLinkPicture(null);
    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }
      setTimeout(() => {
        editor.focus();
      }, 0);
    }
  };

  const handleOpenCase = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setIndexCursor(range);
    if (range.length > 0) {
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 0);
    }
    setAnchorElCase(event.currentTarget);
  };

  const handleCloseCase = () => {
    const editor = editorRefContext.getEditor();
    const scrollContainer = scrollPageRef.current;
    const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;

    if (indexCursor) {
      if (indexCursor.length > 0) {
        editor.setSelection(indexCursor.index + indexCursor.length, 0);
      } else {
        editor.setSelection(indexCursor.index, 0);
      }

      setTimeout(() => {
        editor.focus();

        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollY,
            behavior: 'smooth' // Makes the scroll smooth
          });
        }
      }, 0);
    }
    setAnchorElCase(null);
  };

  const scrollLeft = () => {
    toolbarRef.current.scrollBy({ left: -1000, behavior: "smooth" });
    const editor = editorRefContext.getEditor();
    editor.focus();
  };

  const scrollRight = () => {
    toolbarRef.current.scrollBy({ left: 1000, behavior: "smooth" });
    const editor = editorRefContext.getEditor();
    editor.focus();
  };

  const handleFontChange = (event: SelectChangeEvent<any>) => {
    if (getCtrlShiftAPressed()) {
      console.log("Apply font family after Ctrl+Shift+Z");
      setCtrlShiftAPressed(false);

      const editors = getEditorInstances();
      console.log("editors:", editors);

      editors.forEach((editor, i) => {
        if (!editor) return;

        clearHighlight(editor);
        const length = editor.getLength();
        if (length <= 1) return;

        editor.formatText(0, length - 1, { font: event.target.value }, "user");
        console.log(`Editor [${i}] font family set from 0 to ${length - 1} with font: ${event.target.value}`);
      });

      setSelectedFont(event.target.value);
      setSelectedFontValue(event.target.value);
      handleCloseCase(); // if needed
      return;
    }


    const editor = editorRefContext.getEditor();
    if (!editor) return;
    const range = editor.getSelection(true);
    if (range.length === 0) {
      setSelectedFont(event.target.value);
      const [line] = editor.getLine(range.index);
      const text = line?.domNode?.innerText;
      if (text == "\u200B") {
        editor.formatText(
          range.index - 1,
          1,
          { font: event.target.value },
          "user"
        );
      }
      else if (text.trim() == "\u200B" && text.trim().length <= 1) {
        editor.formatText(range.index - 1, 1, { font: event.target.value }, "user");
      } else {
        editor.format("font", event.target.value, "user");
      }
    } else {
      // setSelectedFont(event.target.value);
      editor.formatText(
        range.index,
        range.length,
        {
          font: event.target.value,
        },
        "user"
      );
    }
    setSelectedFontValue(event.target.value);
    setTimeout(() => {
      editor.focus();
    }, 0);
  };

  const handleFontSizeChange = (event: SelectChangeEvent<HTMLElement>) => {
    if (getCtrlShiftAPressed()) {
      console.log("Apply font size after Ctrl+Shift+Z");
      setCtrlShiftAPressed(false);

      const editors = getEditorInstances();
      console.log("editors:", editors);

      editors.forEach((editor, i) => {
        if (!editor) return;

        clearHighlight(editor);
        const length = editor.getLength();
        if (length <= 1) return;

        editor.formatText(0, length - 1, { size: event.target.value }, "user");
        console.log(`Editor [${i}] font size set from 0 to ${length - 1} with size: ${event.target.value}`);
      });

      setSelectedFontSize(event.target.value);
      setSelectedFontSizeValue(event.target.value);
      handleCloseCase(); // if needed
      return;
    }

    const editor = editorRefContext.getEditor();
    if (!editor) return;
    const range = editor.getSelection(true);
    if (range.length === 0) {
      setSelectedFontSize(event.target.value);
      const [line] = editor.getLine(range.index);
      const text = line?.domNode?.innerText;
      if (text == "\u200B") {
        editor.formatText(
          range.index - 1,
          1,
          { size: event.target.value },
          "user"
        );
      }
      else if (text.trim() == "\u200B" && text.trim().length <= 1) {
        editor.formatText(range.index - 1, 1, { size: event.target.value }, "user");
      }
      else {
        editor.format("size", event.target.value, "user");
      }
    } else {
      editor.formatText(
        range.index,
        range.length,
        {
          size: event.target.value,
        },
        "user"
      );
    }
    setSelectedFontSizeValue(event.target.value);
    setTimeout(() => {
      editor.focus();
    }, 0);
  };

  const handleHeaderChange = (event: SelectChangeEvent<any>) => {
    const editor = editorRefContext?.getEditor();
    const selectedHeaderValue = event.target.value;
    setSelectedHeadersValue(selectedHeaderValue);

    const range = editor.getSelection();

    const headerSizes: Record<string, string> = {
      1: "24.8px",
      2: "20px",
      3: "18.5px",
      4: "16.5px",
      default: "16px",
    };

    const getClass: Record<string, string> = {
      1: "heading-1",
      2: "heading-2",
      3: "heading-3",
      4: "heading-4",
      0: "paragraph",
    };

    // Get the corresponding font size for the selected header
    const size = headerSizes[selectedHeaderValue] || headerSizes.default;

    if (range) {
      if (range.length > 0) {
        editor.formatText(
          range.index,
          range.length,
          { size, customHeading: getClass[selectedHeaderValue] },
          "user"
        );
      } else {
        const [line, offset] = editor.getLine(range.index);
        const lineLength = line.length();
        if (lineLength > 1) {
          editor.formatText(
            range.index - offset,
            lineLength,
            { size, customHeading: getClass[selectedHeaderValue] },
            "user"
          );
        } else {
          editor.format("customHeading", getClass[selectedHeaderValue], "user");
          editor.format("size", size, "user");
        }
      }
    }

    setSelectedFontSizeValue(size);

    setTimeout(() => {
      editor.focus();
    }, 0);
  };

const customLabels = {
  "11.55px": "7",
  "13.2px": "8",
  "14.85px": "9",
  "16.5px": "10",
  "18.15px": "11",
  "19.8px": "12",
  "23.1px": "14",
  "29.7px": "18",
  "39.6px": "24",
  "59.4px": "36",
  "79.2px": "48",
  "118.8px": "72",
};

  const handleSelectOrientation = (value: any) => {
    if (value === "landscape") {
      setDocumentPageSize({
        width: "30cm",
        height: "21cm",
        title: "Landscape",
        desc: "Landscape",
      });
    } else {
      setDocumentPageSize({
        title: "A4",
        desc: "21 cm x 29.7 cm",
        width: "21cm",
        height: "29.7cm",
      });
    }
    handleCloseOrientation();
  };

  const handleSelectMargins = (value: any) => {
    setDocumentPageMargins(value);
    handleCloseMargins();
  };

  useEffect(() => {
    if (!editorRefContext) return;

    const quill = editorRefContext.getEditor();

    // Function to check the undo/redo history
    const checkHistory = () => {
      const undoStack = quill.history.stack.undo;
      const redoStack = quill.history.stack.redo;

          console.log("Undo Stack:", undoStack);
      console.log("Redo Stack:", redoStack);

      // Set state for undo/redo availability based on the stack lengths
      setCanUndo(undoStack.length > 0); // If undo stack has entries, enable undo
      setCanRedo(redoStack.length > 0); // If redo stack has entries, enable redo
    };

    // Attach event listeners for content changes and selection changes
    quill.on("text-change", checkHistory);
    quill.on("selection-change", checkHistory);

    // Initial check when the editor is loaded
    checkHistory();
    // Cleanup function to remove event listeners when the component is unmounted
    return () => {
      quill.off("text-change", checkHistory);
      quill.off("selection-change", checkHistory);
    };
  }, [editorRefContext]); // Dependency array ensures effect runs when editorRefContext is set

  const handleSelectSize = (value: any) => {
    setAnchorElSize(null);
    setDocumentPageSize(value);
  };

  const pageSizes = [
    {
      title: "A3",
      desc: "29.7 cm x 42 cm",
      width: "29.7cm",
      height: "42cm",
    },
    {
      title: "A4",
      desc: "21 cm x 29.7 cm",
      width: "21cm",
      height: "29.7cm",
    },
    {
      title: "A5",
      desc: "14.8 cm x 21 cm",
      width: "14.8cm",
      height: "21cm",
    },
    {
      title: "A6",
      desc: "10.5 cm x 14.8 cm",
      width: "10.5cm",
      height: "14.8cm",
    },
    {
      title: "JIS B5",
      desc: "18.2 cm x 25.7 cm",
      width: "18.2cm",
      height: "25.7cm",
    },
    {
      title: "JIS B6",
      desc: "12.8 cm x 18.2 cm",
      width: "12.8cm",
      height: "18.2cm",
    },
    {
      title: "US Letter",
      desc: "21.59 cm x 27.94 cm",
      width: "21.59cm",
      height: "27.94cm",
    },
    {
      title: "US Legal",
      desc: "21.59 cm x 35.56 cm",
      width: "21.59cm",
      height: "35.56cm",
    },
    {
      title: "Indian Legal",
      desc: "21.5 cm x 34.5 cm",
      width: "21.5cm",
      height: "35.56cm",
    },
  ];

  const lineSpacing = [
    {
      value: "1",
    },
    {
      value: "1.15",
    },
    {
      value: "1.5",
    },
    {
      value: "2",
    },
    {
      value: "2.5",
    },
    {
      value: "3",
    },
  ];

  const handleTextHighlightColorChange = (color: any) => {
    handletTextHighlightColor(color.hex);
    setBgColorSvg(color.hex);
  };

  const handletTextHighlightColor = (color: string) => {
    if (getCtrlShiftAPressed()) {
  console.log("Apply background color after Ctrl+Shift+Z");
  setCtrlShiftAPressed(false);

  const editors = getEditorInstances();
  console.log("editors:", editors);

  editors.forEach((editor, i) => {
    if (!editor) return;

    clearHighlight(editor);
    const length = editor.getLength();
    if (length <= 1) return;

    editor.formatText(0, length - 1, { background: color }, "user");

    console.log(`Editor [${i}] background colored from 0 to ${length - 1} with color: ${color}`);
  });

  setPrevBgColor(color);
  setFontColorSvg(color); // optional: update UI state if needed
  handleCloseCase();
  return; // Stop further processing since we've already applied to all editors
    }
    const editor = editorRefContext.getEditor();
    if (!editor) return;
    const range = editor.getSelection(true);
    if (range.length === 0 && !prevSelectionBg) {
      const [line] = editor.getLine(range.index);
      const text = line?.domNode?.innerText;
      if (text == "\u200B") {
        editor.formatText(range.index - 1, 1, { background: color }, "user");
      }
      else if (text.trim() == "\u200B" && text.trim().length <= 1) {
        editor.formatText(range.index - 1, 1, { background: color }, "user");
      }
      else {
        editor.format("background", color, "user");
      }
      setPrevBgColor(color);
    } else {
      // setPrevBgColor(color);
      if (prevSelectionBg) {
        const range = prevSelectionBg;
        editor.formatText(
          range.index,
          range.length,
          {
            background: color,
          },
          "user"
        );
        setPrevSelectionBg(range);
        editor.setSelection(range.index + range.length, 0);
      } else {
        editor.formatText(
          range.index,
          range.length,
          {
            background: color,
          },
          "user"
        );
        setPrevSelectionBg(range);
        editor.setSelection(range.index + range.length, 0);
      }
    }
  };

  const handleFontColorChange = (color: any) => {
    // const editor = editorRefContext.getEditor();
    // const range = editor.getSelection(true);
    // if(range.length > 0) {
    //   editor.setSelection(range.index,range.length)
    // }
    handleSaveFontColor(color.hex);
    setFontColorSvg(color.hex);
  };

  const handleBgColorChange = (color: any) => {
    setBgColor(color.hex);
    setBgColorSvg(color.hex);
  };

  const toSentenceCase = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const toLowerCase = (text: string): string => {
    return text?.toLowerCase?.() ?? '';
  };

  const toUpperCase = (text: string): string => {
    return text?.toUpperCase?.() ?? '';
  };

  const toCapitalizeEachWord = (text: string): string => {
    if (!text) return '';
    return text.replace(/\w\S*/g, (word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  };

  const toToggleCase = (text: string): string => {
    if (!text) return '';
    return Array.from(text)
      .map((char) =>
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  };


  const handleTextTransformation = (transformationFunction: Function) => {
    if (getCtrlShiftAPressed()) {
      console.log("Text transformation after Ctrl+Shift+Z");
      setCtrlShiftAPressed(false);

      const editors = getEditorInstances();
      console.log("editors:", editors);

      editors.forEach((editor, i) => {
        console.log(`Editor [${i}] processing...`);

        clearHighlight(editor);
        let selection = editor.getSelection();
        console.log(`Editor [${i}] original selection:`, selection);

        // If no selection, apply to full content
        const index = 0;
        const length = editor.getLength(); // includes the trailing newline

        console.log(`Editor [${i}] applying transformation from index ${index} to length ${length}`);

        const contents = editor.getContents(index, length);
        console.log(`Editor [${i}] contents:`, contents);

        const Delta = (editor.constructor as any).imports.delta;
        let delta = new Delta();

        const transformedOps = contents?.ops?.map((op: any, opIndex: number) => {
          if (op.insert && typeof op.insert === "string") {
            const transformedSegment = transformationFunction(op.insert);
            console.log(`Editor [${i}] op[${opIndex}]:`, op.insert, "->", transformedSegment);
            return {
              insert: transformedSegment,
              attributes: op.attributes || {},
            };
          } else {
            console.log(`Editor [${i}] op[${opIndex}] is non-string or embed:`, op);
            return op;
          }
        });

        delta.retain(index);
        delta.delete(length);

        transformedOps?.forEach((op: any) => {
          delta = delta.insert(op.insert, op.attributes);
        });

        console.log(`Editor [${i}] delta to apply:`, delta);
        editor.updateContents(delta, "user");
      });

      handleCloseCase();
    }

    const editor = editorRefContext.getEditor();
    const selection = editor.getSelection();

    if (selection && selection.length > 0) {
      const { index, length } = selection;

      // Get the contents of the selection
      const contents = editor.getContents(index, length);
      let delta = new editor.constructor.imports.delta();

      // Create a transformation result array
      const transformedOps = contents.ops.map((op: any) => {
        if (op.insert && typeof op.insert === "string") {
          const transformedSegment = transformationFunction(op.insert);

          // Return a new operation with transformed text but keep the original attributes
          return {
            insert: transformedSegment,
            attributes: op.attributes || {}, // Handle undefined attributes
          };
        } else {
          // Handle non-string inserts (like images or embeds)
          return op;
        }
      });

      // Step 1: Construct the Delta to replace selected text
      delta.retain(index); // Retain everything before the selection
      delta.delete(length); // Delete the selected content

      // Step 2: Insert the transformed ops into the delta
      transformedOps.forEach((op: any) => {
        delta = delta.insert(op.insert, op.attributes);
      });

      // Step 3: Apply the delta
      editor.updateContents(delta, "user");
    }

    handleCloseCase(); // Close any UI elements related to the transformation
  };

const handleClickColumns = (value: string) => {
  const editorContainer = editorRefContext.editor?.root;

  if (!editorContainer) {
    console.error("Editor container not found");
    return;
  }

  setSelectedColumn(value);

  // Clear previous column-related styles
  editorContainer.style.columnCount = "";
  editorContainer.style.columnGap = "";
  editorContainer.style.columnRule = "";
  editorContainer.style.marginLeft = "";
  editorContainer.style.transform = "";

  // Force reflow
  void editorContainer.offsetHeight;

  switch (value) {
    case "one":
      editorContainer.style.columnCount = "1";
      editorContainer.style.width = "100%"; // Ensure full width
      break;
    case "two":
      editorContainer.style.columnCount = "2";
      editorContainer.style.columnGap = "30px";
      break;
    case "three":
      editorContainer.style.columnCount = "3";
      editorContainer.style.columnGap = "30px";
      break;
    case "left":
    case "right":
      editorContainer.style.columnCount = "2";
      editorContainer.style.columnGap = "30px";
      // Additional positioning if needed for left/right layout
      break;
    default:
      editorContainer.style.columnCount = "1";
      break;
  }

  handleCloseColumns();
};


  const toggleFormattingMarks = () => {
    setShowFormattingMarks(!showFormattingMarks);
  };

  const handleSelectSpacing = (value: any) => {
  // Update the spacing state to the selected value
  setSpacing(value);

  // Close the spacing dropdown/menu by clearing its anchor element
  setAnchorElSpacing(null);

  // Get the Quill editor instance from the context/ref
  const quillEditor = editorRefContext.getEditor();

  if (quillEditor) {
    // Get the current selection range in the editor (true means get the current cursor position or selection)
    const savedRange = quillEditor.getSelection(true);

    if (savedRange) {
      // If there is an active selection (even length 0 means just cursor), format the lines within the selection
      quillEditor.formatLine(
        savedRange.index, // Start index of selection
        savedRange.length, // Length of selection
        { lineHeight: value }, // Apply the lineHeight formatting with the selected value
        "user" // Source of the change (user-triggered)
      );
    } else {
      // If there is no selection (cursor not focused), just apply lineHeight format to the current cursor position
      quillEditor.format("lineHeight", value, "user");
    }
  }
};


  useEffect(() => {
    if (!editorRefContext) return;

    const editor = editorRefContext.getEditor();
    const editorContainer = editor.root;
    const paragraphs = editorContainer.querySelectorAll("p");

    paragraphs.forEach((p: HTMLElement) => {
      // 🔁 Step 1: Remove old formatting marks (even broken/multi-character ones)
      const oldMarks = p.querySelectorAll(".formatting-mark");
      oldMarks.forEach((mark) => {
        const parent = mark.parentNode;
        if (!parent) return;

        const textContent = mark.textContent || "";

        // Convert special symbols to original characters
    const restoredText = textContent
    .replace(/·/g, " ")
    .replace(/→/g, "\t")
    .replace(/¶/g, "");


        const textNode = document.createTextNode(restoredText);
        parent.replaceChild(textNode, mark);
      });

      // ✅ Step 2: If formatting is enabled, wrap each character
      if (showFormattingMarks) {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
        const textNodes: Text[] = [];

        while (walker.nextNode()) {
          textNodes.push(walker.currentNode as Text);
        }

        textNodes.forEach((textNode) => {
          const originalText = textNode.textContent ?? "";
          const fragment = document.createDocumentFragment();

          for (let i = 0; i < originalText.length; i++) {
            const char = originalText[i];
            const span = document.createElement("span");
            span.className = "formatting-mark";

            if (char === " " || char === ".") {
              span.textContent = "·";
              span.setAttribute("contenteditable", "false");
            } else if (char === "\t") {
              span.textContent = "→";
              span.setAttribute("contenteditable", "false");
            } else {
              span.textContent = char;
            }

            fragment.appendChild(span);
          }

          textNode.parentNode?.replaceChild(fragment, textNode);
        });

        // 🧩 Step 3: Add paragraph end mark
        const endMark = document.createElement("span");
        endMark.className = "formatting-mark";
        endMark.setAttribute("contenteditable", "false");
        endMark.textContent = "¶";
        p.appendChild(endMark);
      }
    });
  }, [showFormattingMarks, editorRefContext]);


  useEffect(() => {
    if (!editorRefContext) return;

    const editor = editorRefContext.getEditor();
    const editorContainer = editor.root;
    const paragraphs = editorContainer.querySelectorAll("p");

    paragraphs.forEach((p: HTMLElement) => {
      // 🔁 Step 1: Remove old formatting marks (even broken/multi-character ones)
      const oldMarks = p.querySelectorAll(".formatting-mark");
      oldMarks.forEach((mark) => {
        const parent = mark.parentNode;
        if (!parent) return;

        const textContent = mark.textContent || "";

        // Convert special symbols to original characters
    const restoredText = textContent
    .replace(/·/g, " ")
    .replace(/→/g, "\t")
    .replace(/¶/g, "");


        const textNode = document.createTextNode(restoredText);
        parent.replaceChild(textNode, mark);
      });

      // ✅ Step 2: If formatting is enabled, wrap each character
      if (showFormattingMarks) {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
        const textNodes: Text[] = [];

        while (walker.nextNode()) {
          textNodes.push(walker.currentNode as Text);
        }

        textNodes.forEach((textNode) => {
          const originalText = textNode.textContent ?? "";
          const fragment = document.createDocumentFragment();

          for (let i = 0; i < originalText.length; i++) {
            const char = originalText[i];
            const span = document.createElement("span");
            span.className = "formatting-mark";

            if (char === " " || char === ".") {
              span.textContent = "·";
              span.setAttribute("contenteditable", "false");
            } else if (char === "\t") {
              span.textContent = "→";
              span.setAttribute("contenteditable", "false");
            } else {
              span.textContent = char;
            }

            fragment.appendChild(span);
          }

          textNode.parentNode?.replaceChild(fragment, textNode);
        });

        // 🧩 Step 3: Add paragraph end mark
        const endMark = document.createElement("span");
        endMark.className = "formatting-mark";
        endMark.setAttribute("contenteditable", "false");
        endMark.textContent = "¶";
        p.appendChild(endMark);
      }
    });
  }, [showFormattingMarks, editorRefContext]);

  useEffect(() => {
    // console.log("I am called")
    if (!editorRefContext) return;
    const quill = editorRefContext.getEditor();
    const range = quill.getSelection(true);
    let savedSelection: any = false;

    if (range&& range.length > 0) {
      savedSelection = true;
    }
    const restoreSelection = () => {
      if (savedSelection) {
        quill.setSelection(range.index, range.length);
      }
    };


    const attachColorListeners = () => {
      const menuColor = document.getElementById("menu-color");
      // console.log(menuColor)
      if (menuColor) {
        // console.log("I worked")
        menuColor.addEventListener("click", restoreSelection);
        menuColor.addEventListener("change", restoreSelection);
      }
    };

    setTimeout(() => {
      attachColorListeners();
    }, 100);

    return () => {
      const menuColor = document.getElementById("menu-color");
      if (menuColor) {
        menuColor.removeEventListener("click", attachColorListeners);
      }
      if (menuColor) {
        menuColor.removeEventListener("click", restoreSelection);
        menuColor.removeEventListener("change", restoreSelection);
      }
    };
  }, [openFontColor]);

  const handleAlignment = (align: string) => {
    // Update local state to reflect selected alignment (used for UI highlighting or state)
    setSelectedAlign(align);

    // Get the Quill editor instance from context
    const quill = editorRefContext.getEditor();

    // Get the current selection range in the editor
    const range = quill.getSelection();

    if (!range) return; // If no selection, exit early to avoid errors

    // If 'left' is selected, remove the alignment formatting (Quill treats default as 'left')
    if (align === "left") {
      quill.format("align", false, "user");
    } else {
      // Otherwise, apply the selected alignment
      quill.format("align", align, "user");
    }

    // Close the alignment dropdown/menu
    setAnchorElAlignment(null);

    // Ensure the editor remains focused after applying formatting
    quill.focus();
  };

  const handleOpenLink = (event: any) => {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setCursorIndex(range.index);

    if (range && range.length > 0) {
      setSelection(range);
      const selectedText = editor.getText(range.index, range.length);
      setDisplayText(selectedText);
      setDisplayTextChange(true);
      setTimeout(() => {
        editor.setSelection(range.index, range.length);
      }, 100);
    } else {
      setDisplayText("");
    }
    setAnchorElLink(event.currentTarget);
  };

  const handleOpenFormula = (event: any) => {
    console.log("cicked dnjcjd bcj")
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
    setCursorIndex(range.index);

    if (range && range.length > 0) {
      setSelection(range);
      editor.setSelection(range.index, range.length);
    }
    console.log("formula : ", event.current);
    setAnchorElFormula(event.currentTarget);
  };

const [isSaving, setIsSaving] = useState(false);

const handleAddLink = () => {
  if (isSaving) return; // Prevent double clicks
  setIsSaving(true);

  const editor = editorRefContext.getEditor();

  if (selection) {
    const { index, length } = selection;

    let delta = new editor.constructor.imports.delta();

    delta = delta
      .retain(index)
      .delete(length)
      .insert(displayText, { link: linkUrl });

    editor.updateContents(delta, "user");
  } else {
    editor.insertText(cursorIndex, displayText, { link: linkUrl }, "user");
  }

  setDisplayText("");
  setLinkUrl("");
  handleCloseLink();
  setSelection(null);

  // Allow another click after a short delay or after async logic
  setTimeout(() => setIsSaving(false), 300);
};


  const handleCloseLink = () => {
    setDisplayTextChange(false);
    const editor = editorRefContext.getEditor();
    setAnchorElLink(null);
    editor.focus();
    setSelection(null);
  };

  const handleLinkUrlChange = (e: any) => {
    const url = e.target.value;
    setLinkUrl(url);

    if (!dispalyTextChange) {
      setDisplayText(url);
    }
  };

  const handleDisplayTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayText(e.target.value);
    setDisplayTextChange(true);
  };

  const [displayFormula, setDisplayFormula] = useState("");
  const handleFormulaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayFormula(e.target.value);
    //setDisplayTextChange(true);
  };

const handlePictureFromFile = () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;

      const quill = editorRefContext.getEditor();
      const cursorIndex = quill.getSelection()?.index ?? quill.getLength();

      quill.insertEmbed(cursorIndex, "image", imageUrl, "user");
      quill.setSelection(cursorIndex + 1);
      quill.focus();

      const img = quill.root.querySelector(`img[src="${imageUrl}"]`);
      if (img) {
        console.log("Before adding class - image size:", img.naturalWidth, "x", img.naturalHeight);
        
        img.classList.add("resizable");
        
const rect = img.getBoundingClientRect();
      console.log(
        "After adding class - image size:",
        Math.round(rect.width),
        "x",
        Math.round(rect.height)
      );
      }
    };

    reader.readAsDataURL(file);
  };

  fileInput.click();
  setAnchorElPicture(null);
};


  const handleVideoFromFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const videoUrl = event.target.result;
          const quill = editorRefContext.getEditor();
          quill.insertEmbed(cursorIndex, "video", videoUrl, "user");
          quill.setSelection(cursorIndex + 1);
          quill.focus();
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
    setAnchorElMedia(null);
  };

  const handleAudioFromFile = () => {
    // Create a file input element for audio files
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*";

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const audioUrl = event.target.result;
          const quill = editorRefContext.getEditor();
          quill.insertEmbed(cursorIndex, "audio", audioUrl, "user");
          quill.setSelection(cursorIndex + 1);
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  };

  const [linkUrlImage, setLinkUrlImage] = useState("");
  const handleAddLinkPicture = () => {
    if (linkUrlImage.trim().length > 0) {
      const quill = editorRefContext.getEditor();
      quill.insertEmbed(cursorIndex, "image", linkUrlImage, "user");
      const img = quill.root.querySelector(`img[src="${linkUrlImage}"]`);
      if (img) {
        img.classList.add("resizable");
      }
      setAnchorElLinkPicture(null);
      setAnchorElPicture(null);
    }
  };

  const handleClean = () => {
    const editor = editorRefContext.getEditor();
    const length = editor.getLength();

    editor.formatText(
      0,
      length,
      {
        color: "black",
        background: "#fefefe",
        lineHeight: "1",
        font: "arial",
        size: "13px",
        header: false,
        bold: false,
        italic: false,
        underline: false,
        strike: false,
        list: false,
      },
      "user"
    );

    setPrevBgColor("#fefefe");
    setPrevFontColor("black");
    setSelectedFont("arial");
    setSelectedFontSize("17.5px");
    setSelectedHeaders(0);
  };

  const handleUndo = () => {
    const editor = editorRefContext?.getEditor();

    const undoStack = editor.history.stack.undo;

    const lastOp = undoStack[undoStack.length - 1];

    const containsNewline = lastOp && lastOp.undo.ops && lastOp.undo.ops.some((op: any) => op.insert === '\n');

    editor.history.undo();

    if (containsNewline) {
      editor.history.undo();
    }

    const range = editor.getSelection(true);
    handleChangeSelection(range, "user");
  };

  const handleRedo = () => {
    const editor = editorRefContext?.getEditor();
    const redoStack = editor.history.stack.redo;
    const lastOp = redoStack[redoStack.length - 1];
    const containsNewline = lastOp && lastOp.undo.ops && lastOp.undo.ops.some((op: any) => op.insert == '\u200B');
    editor.history.redo();

    if (containsNewline) {
      editor.history.redo();
    }
    const range = editor.getSelection(true);
    handleChangeSelection(range, "user");
  };

  const ScrollLeftSvg = () => {
    return (
      <svg
        className="scroll-left"
        width="20"
        height="38"
        viewBox="0 0 14 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="13" height="39" fill="white" />
        <rect
          className="scroll-left-stroke"
          x="0.5"
          y="0.5"
          width="13"
          height="39"
          stroke="#EEEEEE"
        />
        <path
          className="scroll-left-stroke"
          d="M10 24L4 20L10 16"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const ScrollRightSvg = () => {
    return (
      <svg
        width="20"
        height="38"
        viewBox="0 0 15 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="13.0453" height="39" fill="white" />
        <rect
          className="scroll-left-stroke"
          x="0.5"
          y="0.5"
          width="13.0453"
          height="39"
          stroke="#EEEEEE"
        />
        <path
          className="scroll-left-stroke"
          d="M4 16.0171L10.0226 19.983L4.04541 24.017"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const RedoSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={canRedo ? "history-svg-selected" : "history-svg"}
          d="M12.924 14.7462C14.796 13.2368 16 10.8859 16 8.24643C16 3.6912 12.43 0.00619412 8.012 7.76047e-06C3.588 -0.0061786 0 3.68708 0 8.24643C0 10.8282 1.15 13.1316 2.952 14.6431C3.022 14.7009 3.124 14.6885 3.18 14.6163L3.968 13.5749C4.022 13.5048 4.01 13.4038 3.944 13.3461C3.782 13.21 3.626 13.0635 3.476 12.9089C2.89124 12.308 2.42527 11.5958 2.104 10.8117C1.768 10.0013 1.6 9.13726 1.6 8.24643C1.6 7.35559 1.768 6.49156 2.102 5.67909C2.424 4.89342 2.886 4.18817 3.474 3.58191C4.062 2.97565 4.746 2.4993 5.508 2.1673C6.298 1.82292 7.136 1.6497 8 1.6497C8.864 1.6497 9.702 1.82292 10.49 2.1673C11.252 2.4993 11.936 2.97565 12.524 3.58191C13.112 4.18817 13.574 4.89342 13.896 5.67909C14.23 6.49156 14.398 7.35559 14.398 8.24643C14.398 9.13726 14.23 10.0013 13.896 10.8138C13.5747 11.5979 13.1088 12.3101 12.524 12.9109C12.338 13.1027 12.142 13.2821 11.938 13.4471L11.124 12.3727C11.1056 12.3482 11.0808 12.3295 11.0525 12.3188C11.0242 12.3081 10.9936 12.3058 10.9641 12.3123C10.9347 12.3188 10.9076 12.3337 10.886 12.3553C10.8644 12.3769 10.8491 12.4044 10.842 12.4346L10.05 15.7794C10.026 15.8825 10.102 15.9835 10.204 15.9835L13.544 16C13.678 16 13.754 15.8412 13.67 15.734L12.924 14.7462Z"
        // fill={canRedo ? "#7771E8" : "#7F7F7F"}
        />
      </svg>
    );
  };

  const UndoSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={canUndo ? "history-svg-selected" : "history-svg"}
          d="M7.988 7.75946e-06C3.57 0.00619332 0 3.69072 0 8.24535C0 10.8845 1.204 13.235 3.076 14.7443L2.326 15.734C2.244 15.8433 2.32 16.002 2.452 16L5.792 15.9835C5.896 15.9835 5.972 15.8825 5.946 15.7794L5.156 12.433C5.14887 12.4028 5.13362 12.3753 5.11201 12.3537C5.0904 12.3321 5.06331 12.3172 5.03385 12.3107C5.00439 12.3042 4.97376 12.3065 4.94548 12.3172C4.91721 12.3279 4.89243 12.3466 4.874 12.3711L4.06 13.4453C3.856 13.2804 3.66 13.101 3.474 12.9093C2.88924 12.3085 2.42327 11.5963 2.102 10.8124C1.768 9.99999 1.6 9.13607 1.6 8.24535C1.6 7.35463 1.768 6.49072 2.102 5.67835C2.424 4.89278 2.886 4.18763 3.474 3.58144C4.062 2.97526 4.746 2.49897 5.508 2.16701C6.298 1.82269 7.136 1.64949 8 1.64949C8.864 1.64949 9.702 1.82269 10.49 2.16701C11.252 2.49897 11.936 2.97526 12.524 3.58144C13.112 4.18763 13.574 4.89278 13.896 5.67835C14.23 6.49072 14.398 7.35463 14.398 8.24535C14.398 9.13607 14.23 9.99999 13.896 10.8124C13.5747 11.5963 13.1088 12.3085 12.524 12.9093C12.374 13.0639 12.218 13.2082 12.056 13.3464C12.0235 13.3736 12.0028 13.4129 11.9983 13.4557C11.9938 13.4986 12.0059 13.5415 12.032 13.5752L12.82 14.6165C12.876 14.6886 12.978 14.701 13.048 14.6433C14.85 13.1299 16 10.8268 16 8.24535C16 3.6866 12.412 -0.0061778 7.988 7.75946e-06Z"
        />
        gi
      </svg>
    );
  };

  const TextHighlightSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M15.9591 7.89808L9.62977 0.0522995C9.61666 0.0357239 9.60107 0.0225709 9.58391 0.0135957C9.56675 0.00462048 9.54834 0 9.52975 0C9.51117 0 9.49276 0.00462048 9.4756 0.0135957C9.45844 0.0225709 9.44285 0.0357239 9.42974 0.0522995L5.16671 5.33674C5.13988 5.37023 5.12465 5.41568 5.12431 5.46323C5.12398 5.51077 5.13857 5.55655 5.16493 5.59063L5.16671 5.59288L5.88109 6.47811L3.78797 9.06866C3.76114 9.10215 3.7459 9.1476 3.74557 9.19514C3.74524 9.24268 3.75983 9.28847 3.78618 9.32255L3.78797 9.32479L4.49342 10.1988L1.11621 14.4003H0.144661C0.0660796 14.4003 0 14.4812 0 14.58V15.8203C0 15.9191 0.0642937 16 0.142875 16H6.30257C6.34007 16 6.37579 15.982 6.40258 15.9483L7.76168 14.2498L8.4832 15.144C8.49631 15.1606 8.51189 15.1737 8.52905 15.1827C8.54622 15.1917 8.56462 15.1963 8.58321 15.1963C8.6018 15.1963 8.6202 15.1917 8.63736 15.1827C8.65453 15.1737 8.67011 15.1606 8.68322 15.144L10.7746 12.5467L11.4907 13.4342C11.5038 13.4507 11.5194 13.4639 11.5366 13.4729C11.5537 13.4818 11.5721 13.4865 11.5907 13.4865C11.6093 13.4865 11.6277 13.4818 11.6449 13.4729C11.662 13.4639 11.6776 13.4507 11.6907 13.4342L15.9538 8.14972C16.0145 8.08232 16.0145 7.96998 15.9591 7.89808ZM5.81858 14.3868H2.95751L5.35781 11.3986L6.78834 13.1713L5.81858 14.3868ZM8.58321 12.9916L5.52211 9.19673L6.74727 7.6779L9.80836 11.4727L8.58321 12.9916ZM11.5925 11.2817L6.89907 5.46481L9.52975 2.20472L14.2232 8.0239L11.5925 11.2817Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const FontColorSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M3.70265 14.6667H2.2666L7.33327 2H8.6666L13.7333 14.6667H12.2972L10.6972 10.6667H5.30265L3.70265 14.6667ZM5.83598 9.33333H10.1639L7.99994 3.92345L5.83598 9.33333Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const ShadeColorSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M14.2783 10.2395C14.1991 10.2964 12.5565 12.0614 12.5565 13.3008C12.5565 14.6076 13.3735 15.442 14.2783 15.4875C15.0582 15.5259 16 14.7081 16 13.3008C16 11.9888 14.3575 10.2964 14.2783 10.2395ZM0 9.36489C0 9.83196 0.179059 10.271 0.504466 10.6017L5.31325 15.4875C5.63865 15.8181 6.07081 16 6.53051 16C6.99021 16 7.42236 15.8181 7.74777 15.4875L13.7738 9.36489L13.1652 8.74652L6.53051 2.00558L4.55655 0L3.33929 1.23676L5.31325 3.24233L0.504466 8.12814C0.179059 8.45875 0 8.89783 0 9.36489ZM6.53051 4.47909L11.3393 9.36489L6.53051 14.2507H6.53137L6.53051 15.1253V14.2507L1.72173 9.36489L6.53051 4.47909Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const ChangeCaseSvg = () => {
    return (
      <svg
        width="18"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M7.09727 10.3333H2.76937L1.43604 13.6667H0L4.26667 3H5.6L9.86667 13.6667H8.4306L7.09727 10.3333ZM6.56394 9L4.93333 4.92344L3.30271 9H6.56394ZM13.6 8.69007V8.33333H14.9333V13.6667H13.6V13.3099C13.2078 13.5368 12.7524 13.6667 12.2667 13.6667C10.7939 13.6667 9.6 12.4727 9.6 11C9.6 9.52727 10.7939 8.33333 12.2667 8.33333C12.7524 8.33333 13.2078 8.4632 13.6 8.69007ZM12.2667 12.3333C13.0031 12.3333 13.6 11.7364 13.6 11C13.6 10.2636 13.0031 9.66667 12.2667 9.66667C11.5303 9.66667 10.9333 10.2636 10.9333 11C10.9333 11.7364 11.5303 12.3333 12.2667 12.3333Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const BoldSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-hover"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.99984 7.99998C9.83504 7.99998 11.3228 6.50758 11.3228 4.66665C11.3228 2.8257 9.83504 1.33331 7.99984 1.33331H3.6665V7.99998H7.99984Z"
          stroke={isBoldActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.34357 14.6667C11.1788 14.6667 12.6665 13.1743 12.6665 11.3333C12.6665 9.4924 11.1788 8 9.34357 8H3.6665V14.6667H9.34357Z"
          stroke={isBoldActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const ItalicSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-hover"
          d="M6.6665 2H11.9998"
          stroke={isItalicActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M4 14H9.33333"
          stroke={isItalicActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M9.66683 1.98413L6.3335 14"
          stroke={isItalicActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const UnderlineSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-hover"
          d="M2.6665 14.6667H13.3332"
          stroke={isUnderlineActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M12.3332 2.03232C12.3332 4.25452 12.3332 5.11109 12.3332 7.33332C12.3332 9.72656 10.3931 11.6667 7.99984 11.6667C5.6066 11.6667 3.6665 9.72656 3.6665 7.33332C3.6665 5.11109 3.6665 4.25452 3.6665 2.03232"
          stroke={isUnderlineActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
        />
      </svg>
    );
  };

  const StrikeThroughSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          className="stroke-hover"
          d="M1 10.0421H17"
          stroke={isStrikeActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M11.4352 5.17391C11.462 4.07617 11.0446 3.01408 10.2776 2.22833C9.51057 1.44257 8.45886 0.999673 7.36079 1C5.58204 1.00167 4.07465 2.30984 3.82253 4.07064C3.57042 5.83143 4.65015 7.51004 6.35697 8.01078L9.12358 8.81774C11.1197 9.39737 12.3852 11.3574 12.0918 13.4152C11.7984 15.473 10.0356 17.0013 7.95697 17C5.26758 17 3.0874 14.8198 3.0874 12.1304"
          stroke={isStrikeActive ? "#7771E8" : "#7F7F7F"}
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const SubScriptSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M15.5 13C15.5 13.1326 15.4474 13.2598 15.3536 13.3536C15.2598 13.4473 15.1326 13.5 15 13.5H12C11.9072 13.5 11.8162 13.4742 11.7372 13.4253C11.6582 13.3765 11.5944 13.3067 11.5528 13.2236C11.5113 13.1406 11.4937 13.0476 11.5021 12.9551C11.5104 12.8626 11.5443 12.7743 11.6 12.7L14.2982 9.10251C14.3846 8.98738 14.4451 8.85495 14.4756 8.71428C14.5061 8.57361 14.5059 8.42801 14.4749 8.28743C14.444 8.14685 14.3831 8.01461 14.2964 7.89973C14.2096 7.78486 14.0991 7.69007 13.9724 7.62183C13.8456 7.55359 13.7057 7.51352 13.562 7.50435C13.4184 7.49518 13.2744 7.51713 13.14 7.56871C13.0056 7.62028 12.884 7.70025 12.7833 7.80317C12.6827 7.90608 12.6055 8.02951 12.5569 8.16501C12.535 8.22694 12.5011 8.28394 12.4572 8.33277C12.4132 8.3816 12.3601 8.42129 12.3008 8.44958C12.2415 8.47788 12.1772 8.49421 12.1116 8.49767C12.046 8.50112 11.9804 8.49162 11.9185 8.4697C11.8566 8.44779 11.7995 8.41389 11.7507 8.36995C11.7019 8.326 11.6622 8.27287 11.6339 8.21359C11.6056 8.1543 11.5893 8.09002 11.5858 8.02443C11.5824 7.95883 11.5919 7.89319 11.6138 7.83126C11.6824 7.63864 11.78 7.4576 11.9032 7.29439C12.2224 6.87079 12.6969 6.59136 13.2221 6.51758C13.7474 6.44379 14.2805 6.5817 14.7041 6.90095C15.1277 7.22021 15.4071 7.69466 15.4809 8.21994C15.5547 8.74521 15.4168 9.27829 15.0975 9.70189L13 12.5H15C15.1326 12.5 15.2598 12.5527 15.3536 12.6465C15.4474 12.7402 15.5 12.8674 15.5 13ZM9.32754 3.12501C9.2779 3.08198 9.22026 3.04915 9.15792 3.0284C9.09558 3.00765 9.02977 2.99939 8.96424 3.00409C8.8987 3.00879 8.83474 3.02636 8.776 3.0558C8.71727 3.08523 8.66491 3.12596 8.62192 3.17564L5.75004 6.48626L2.87817 3.17376C2.78862 3.08478 2.66873 3.03296 2.54256 3.0287C2.4164 3.02445 2.29329 3.06808 2.19796 3.15083C2.10262 3.23359 2.04212 3.34934 2.0286 3.47485C2.01507 3.60037 2.04953 3.72635 2.12504 3.82751L5.08817 7.25001L2.12504 10.6725C2.03818 10.7728 1.99472 10.9035 2.00421 11.0358C2.01371 11.1681 2.07538 11.2913 2.17567 11.3781C2.27595 11.465 2.40663 11.5085 2.53896 11.499C2.67129 11.4895 2.79443 11.4278 2.88129 11.3275L5.75629 8.01501L8.62817 11.3275C8.67117 11.3772 8.72354 11.4179 8.78228 11.4473C8.84101 11.4767 8.90497 11.4943 8.97049 11.499C9.03602 11.5037 9.10182 11.4954 9.16416 11.4747C9.22649 11.454 9.28413 11.4211 9.33379 11.3781C9.38345 11.3351 9.42415 11.2828 9.45356 11.224C9.48298 11.1653 9.50054 11.1013 9.50524 11.0358C9.50994 10.9703 9.50169 10.9045 9.48096 10.8421C9.46023 10.7798 9.42742 10.7222 9.38442 10.6725L6.41192 7.25001L9.37817 3.82751C9.46411 3.72742 9.50702 3.59742 9.49754 3.46584C9.48805 3.33425 9.42695 3.21175 9.32754 3.12501Z"
          fill={isScriptActive == "sub" ? "#7771E8" : "#7F7F7F"}
        />
      </svg>
    );
  };

 const SuperScriptSvg = () => {
  return (
    <svg
       width="18"
  height="18"
  viewBox="0 0 16 16"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    className="fill-hover"
    transform="translate(1, 1)" 
    d="M9.33 3.13C9.28 3.08 9.22 3.05 9.16 3.03C9.10 3.01 9.03 2.99 8.96 3.00C8.90 3.01 8.83 3.03 8.78 3.06C8.72 3.09 8.66 3.13 8.62 3.18L5.75 6.49L2.88 3.17C2.79 3.08 2.67 3.03 2.54 3.03C2.42 3.02 2.29 3.07 2.20 3.15C2.10 3.23 2.04 3.35 2.03 3.47C2.02 3.60 2.05 3.73 2.13 3.83L5.09 7.25L2.13 10.67C2.04 10.77 2.00 10.90 2.00 11.04C2.01 11.17 2.08 11.29 2.18 11.38C2.28 11.47 2.41 11.51 2.54 11.50C2.67 11.49 2.79 11.43 2.88 11.33L5.76 8.02L8.63 11.33C8.67 11.38 8.72 11.42 8.78 11.45C8.84 11.48 8.90 11.49 8.97 11.50C9.04 11.50 9.10 11.49 9.16 11.47C9.23 11.45 9.28 11.42 9.33 11.38C9.38 11.34 9.42 11.28 9.45 11.22C9.48 11.17 9.50 11.10 9.51 11.04C9.51 10.97 9.50 10.90 9.48 10.84C9.46 10.78 9.43 10.72 9.38 10.67L6.41 7.25L9.38 3.83C9.46 3.73 9.51 3.60 9.50 3.47C9.49 3.33 9.43 3.21 9.33 3.13Z"
    fill={isScriptActive == "super" ? "#7771E8" : "#7F7F7F"}
  />
  <text
    x="11"
    y="10"
    fontSize="14"
    fill={isScriptActive == "super" ? "#7771E8" : "#7F7F7F"}
  >
    ²
  </text>
    </svg>
  );
};


  const FormattingSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_537" fill="white">
          <path d="M13.75 2H6.5C5.43913 2 4.42172 2.42143 3.67157 3.17157C2.92143 3.92172 2.5 4.93913 2.5 6C2.5 7.06087 2.92143 8.07828 3.67157 8.82843C4.42172 9.57857 5.43913 10 6.5 10H8.25V14H11.75V3H13.75V2ZM8.25 9H6.5C5.70435 9 4.94129 8.68393 4.37868 8.12132C3.81607 7.55871 3.5 6.79565 3.5 6C3.5 5.20435 3.81607 4.44129 4.37868 3.87868C4.94129 3.31607 5.70435 3 6.5 3H8.25V9ZM10.75 13H9.25V3H10.75V13Z" />
        </mask>
        <path
          className="fill-hover"
          d="M13.75 2H6.5C5.43913 2 4.42172 2.42143 3.67157 3.17157C2.92143 3.92172 2.5 4.93913 2.5 6C2.5 7.06087 2.92143 8.07828 3.67157 8.82843C4.42172 9.57857 5.43913 10 6.5 10H8.25V14H11.75V3H13.75V2ZM8.25 9H6.5C5.70435 9 4.94129 8.68393 4.37868 8.12132C3.81607 7.55871 3.5 6.79565 3.5 6C3.5 5.20435 3.81607 4.44129 4.37868 3.87868C4.94129 3.31607 5.70435 3 6.5 3H8.25V9ZM10.75 13H9.25V3H10.75V13Z"
          fill={showFormattingMarks ? "#7771E8" : "#7F7F7F"}
        />
        <path
          className="fill-hover"
          d="M13.75 2H15V0.75H13.75V2ZM6.5 2V0.75V2ZM2.5 6H1.25H2.5ZM6.5 10V11.25V10ZM8.25 10H9.5V8.75H8.25V10ZM8.25 14H7V15.25H8.25V14ZM11.75 14V15.25H13V14H11.75ZM11.75 3V1.75H10.5V3H11.75ZM13.75 3V4.25H15V3H13.75ZM8.25 9V10.25H9.5V9H8.25ZM3.5 6H2.25H3.5ZM6.5 3V1.75V3ZM8.25 3H9.5V1.75H8.25V3ZM10.75 13V14.25H12V13H10.75ZM9.25 13H8V14.25H9.25V13ZM9.25 3V1.75H8V3H9.25ZM10.75 3H12V1.75H10.75V3ZM13.75 0.75H6.5V3.25H13.75V0.75ZM6.5 0.75C5.10761 0.75 3.77226 1.30312 2.78769 2.28769L4.55546 4.05546C5.07118 3.53973 5.77065 3.25 6.5 3.25V0.75ZM2.78769 2.28769C1.80312 3.27226 1.25 4.60761 1.25 6H3.75C3.75 5.27065 4.03973 4.57118 4.55546 4.05546L2.78769 2.28769ZM1.25 6C1.25 7.39239 1.80312 8.72774 2.78769 9.71231L4.55546 7.94454C4.03973 7.42882 3.75 6.72935 3.75 6H1.25ZM2.78769 9.71231C3.77226 10.6969 5.10761 11.25 6.5 11.25V8.75C5.77065 8.75 5.07118 8.46027 4.55546 7.94454L2.78769 9.71231ZM6.5 11.25H8.25V8.75H6.5V11.25ZM7 10V14H9.5V10H7ZM8.25 15.25H11.75V12.75H8.25V15.25ZM13 14V3H10.5V14H13ZM11.75 4.25H13.75V1.75H11.75V4.25ZM15 3V2H12.5V3H15ZM8.25 7.75H6.5V10.25H8.25V7.75ZM6.5 7.75C6.03587 7.75 5.59075 7.56563 5.26256 7.23744L3.4948 9.0052C4.29183 9.80223 5.37283 10.25 6.5 10.25V7.75ZM5.26256 7.23744C4.93437 6.90925 4.75 6.46413 4.75 6H2.25C2.25 7.12717 2.69777 8.20817 3.4948 9.0052L5.26256 7.23744ZM4.75 6C4.75 5.53587 4.93437 5.09075 5.26256 4.76256L3.4948 2.9948C2.69777 3.79183 2.25 4.87283 2.25 6H4.75ZM5.26256 4.76256C5.59075 4.43437 6.03587 4.25 6.5 4.25V1.75C5.37283 1.75 4.29183 2.19777 3.4948 2.9948L5.26256 4.76256ZM6.5 4.25H8.25V1.75H6.5V4.25ZM7 3V9H9.5V3H7ZM10.75 11.75H9.25V14.25H10.75V11.75ZM10.5 13V3H8V13H10.5ZM9.25 4.25H10.75V1.75H9.25V4.25ZM9.5 3V13H12V3H9.5Z"
          // fill="#7F7F7F"
          fill={showFormattingMarks ? "#7771E8" : "#7F7F7F"}
          mask="url(#path-1-inside-1_2581_537)"
        />
      </svg>
    );
  };

  const NumberingSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-highlighter"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 11.5C5 11.3674 5.05268 11.2402 5.14645 11.1464C5.24021 11.0527 5.36739 11 5.5 11H14.5C14.6326 11 14.7598 11.0527 14.8536 11.1464C14.9473 11.2402 15 11.3674 15 11.5C15 11.6326 14.9473 11.7598 14.8536 11.8536C14.7598 11.9473 14.6326 12 14.5 12H5.5C5.36739 12 5.24021 11.9473 5.14645 11.8536C5.05268 11.7598 5 11.6326 5 11.5ZM5 7.5C5 7.36739 5.05268 7.24021 5.14645 7.14645C5.24021 7.05268 5.36739 7 5.5 7H14.5C14.6326 7 14.7598 7.05268 14.8536 7.14645C14.9473 7.24021 15 7.36739 15 7.5C15 7.63261 14.9473 7.75979 14.8536 7.85355C14.7598 7.94732 14.6326 8 14.5 8H5.5C5.36739 8 5.24021 7.94732 5.14645 7.85355C5.05268 7.75979 5 7.63261 5 7.5ZM5 3.5C5 3.36739 5.05268 3.24021 5.14645 3.14645C5.24021 3.05268 5.36739 3 5.5 3H14.5C14.6326 3 14.7598 3.05268 14.8536 3.14645C14.9473 3.24021 15 3.36739 15 3.5C15 3.63261 14.9473 3.75979 14.8536 3.85355C14.7598 3.94732 14.6326 4 14.5 4H5.5C5.36739 4 5.24021 3.94732 5.14645 3.85355C5.05268 3.75979 5 3.63261 5 3.5Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M1.713 11.865V11.391H2C2.217 11.391 2.363 11.254 2.363 11.074C2.363 10.889 2.205 10.764 2.002 10.764C1.779 10.764 1.635 10.916 1.629 11.074H1.039C1.055 10.607 1.412 10.287 2.025 10.287C2.613 10.285 2.979 10.578 2.982 10.99C2.98389 11.1313 2.93543 11.2687 2.84528 11.3775C2.75513 11.4863 2.62919 11.5595 2.49 11.584V11.617C2.64781 11.6288 2.79501 11.7009 2.90098 11.8184C3.00696 11.936 3.06356 12.0898 3.059 12.248C3.062 12.781 2.557 13.048 2.008 13.048C1.352 13.048 1.008 12.678 1 12.254H1.582C1.59 12.432 1.768 12.56 2.004 12.563C2.258 12.563 2.428 12.418 2.426 12.213C2.424 12.018 2.271 11.865 2.012 11.865H1.712H1.713ZM1.709 7.16598H1.105V7.13098C1.105 6.72298 1.4 6.28698 2.063 6.28698C2.646 6.28698 3.023 6.61298 3.023 7.04298C3.023 7.43198 2.766 7.65998 2.547 7.89098L2.01 8.46298V8.49298H3.064V8.99998H1.143V8.60498L2.1 7.61498C2.238 7.47298 2.393 7.31098 2.393 7.10698C2.393 6.92698 2.246 6.78698 2.051 6.78698C2.00598 6.78533 1.9611 6.79291 1.91913 6.80926C1.87715 6.82561 1.83897 6.85038 1.80693 6.88205C1.77489 6.91371 1.74967 6.9516 1.73283 6.99338C1.71599 7.03516 1.70788 7.07995 1.709 7.12498V7.16598ZM2.564 4.99998H1.929V2.92398H1.898L1.3 3.34398V2.77698L1.929 2.33398H2.564V4.99998Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const BulletSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className="stroke-highlighter"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 11.5C5 11.3674 5.05268 11.2402 5.14645 11.1464C5.24021 11.0527 5.36739 11 5.5 11H14.5C14.6326 11 14.7598 11.0527 14.8536 11.1464C14.9473 11.2402 15 11.3674 15 11.5C15 11.6326 14.9473 11.7598 14.8536 11.8536C14.7598 11.9473 14.6326 12 14.5 12H5.5C5.36739 12 5.24021 11.9473 5.14645 11.8536C5.05268 11.7598 5 11.6326 5 11.5ZM5 7.5C5 7.36739 5.05268 7.24021 5.14645 7.14645C5.24021 7.05268 5.36739 7 5.5 7H14.5C14.6326 7 14.7598 7.05268 14.8536 7.14645C14.9473 7.24021 15 7.36739 15 7.5C15 7.63261 14.9473 7.75979 14.8536 7.85355C14.7598 7.94732 14.6326 8 14.5 8H5.5C5.36739 8 5.24021 7.94732 5.14645 7.85355C5.05268 7.75979 5 7.63261 5 7.5ZM5 3.5C5 3.36739 5.05268 3.24021 5.14645 3.14645C5.24021 3.05268 5.36739 3 5.5 3H14.5C14.6326 3 14.7598 3.05268 14.8536 3.14645C14.9473 3.24021 15 3.36739 15 3.5C15 3.63261 14.9473 3.75979 14.8536 3.85355C14.7598 3.94732 14.6326 4 14.5 4H5.5C5.36739 4 5.24021 3.94732 5.14645 3.85355C5.05268 3.75979 5 3.63261 5 3.5ZM2 4.5C2.26522 4.5 2.51957 4.39464 2.70711 4.20711C2.89464 4.01957 3 3.76522 3 3.5C3 3.23478 2.89464 2.98043 2.70711 2.79289C2.51957 2.60536 2.26522 2.5 2 2.5C1.73478 2.5 1.48043 2.60536 1.29289 2.79289C1.10536 2.98043 1 3.23478 1 3.5C1 3.76522 1.10536 4.01957 1.29289 4.20711C1.48043 4.39464 1.73478 4.5 2 4.5ZM2 8.5C2.26522 8.5 2.51957 8.39464 2.70711 8.20711C2.89464 8.01957 3 7.76522 3 7.5C3 7.23478 2.89464 6.98043 2.70711 6.79289C2.51957 6.60536 2.26522 6.5 2 6.5C1.73478 6.5 1.48043 6.60536 1.29289 6.79289C1.10536 6.98043 1 7.23478 1 7.5C1 7.76522 1.10536 8.01957 1.29289 8.20711C1.48043 8.39464 1.73478 8.5 2 8.5ZM2 12.5C2.26522 12.5 2.51957 12.3946 2.70711 12.2071C2.89464 12.0196 3 11.7652 3 11.5C3 11.2348 2.89464 10.9804 2.70711 10.7929C2.51957 10.6054 2.26522 10.5 2 10.5C1.73478 10.5 1.48043 10.6054 1.29289 10.7929C1.10536 10.9804 1 11.2348 1 11.5C1 11.7652 1.10536 12.0196 1.29289 12.2071C1.48043 12.3946 1.73478 12.5 2 12.5Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const LineSpacingSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_2581_616)">
          <mask id="path-1-inside-1_2581_616" fill="white">
            <path d="M15.5 1.5H7.5V2.5H15.5V1.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 1.5H7.5V2.5H15.5V1.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 1.5V0.25H6.25V1.5H7.5ZM15.5 1.5H16.75V0.25H15.5V1.5ZM15.5 2.5V3.75H16.75V2.5H15.5ZM7.5 2.5H6.25V3.75H7.5V2.5ZM7.5 2.75H15.5V0.25H7.5V2.75ZM14.25 1.5V2.5H16.75V1.5H14.25ZM15.5 1.25H7.5V3.75H15.5V1.25ZM8.75 2.5V1.5H6.25V2.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-1-inside-1_2581_616)"
          />
          <mask id="path-3-inside-2_2581_616" fill="white">
            <path d="M15.5 5.5H7.5V6.5H15.5V5.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 5.5H7.5V6.5H15.5V5.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 5.5V4.25H6.25V5.5H7.5ZM15.5 5.5H16.75V4.25H15.5V5.5ZM15.5 6.5V7.75H16.75V6.5H15.5ZM7.5 6.5H6.25V7.75H7.5V6.5ZM7.5 6.75H15.5V4.25H7.5V6.75ZM14.25 5.5V6.5H16.75V5.5H14.25ZM15.5 5.25H7.5V7.75H15.5V5.25ZM8.75 6.5V5.5H6.25V6.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-3-inside-2_2581_616)"
          />
          <mask id="path-5-inside-3_2581_616" fill="white">
            <path d="M15.5 9.5H7.5V10.5H15.5V9.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 9.5H7.5V10.5H15.5V9.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 9.5V8.25H6.25V9.5H7.5ZM15.5 9.5H16.75V8.25H15.5V9.5ZM15.5 10.5V11.75H16.75V10.5H15.5ZM7.5 10.5H6.25V11.75H7.5V10.5ZM7.5 10.75H15.5V8.25H7.5V10.75ZM14.25 9.5V10.5H16.75V9.5H14.25ZM15.5 9.25H7.5V11.75H15.5V9.25ZM8.75 10.5V9.5H6.25V10.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-5-inside-3_2581_616)"
          />
          <mask id="path-7-inside-4_2581_616" fill="white">
            <path d="M15.5 13.5H7.5V14.5H15.5V13.5Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M15.5 13.5H7.5V14.5H15.5V13.5Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M7.5 13.5V12.25H6.25V13.5H7.5ZM15.5 13.5H16.75V12.25H15.5V13.5ZM15.5 14.5V15.75H16.75V14.5H15.5ZM7.5 14.5H6.25V15.75H7.5V14.5ZM7.5 14.75H15.5V12.25H7.5V14.75ZM14.25 13.5V14.5H16.75V13.5H14.25ZM15.5 13.25H7.5V15.75H15.5V13.25ZM8.75 14.5V13.5H6.25V14.5H8.75Z"
            fill="#7F7F7F"
            mask="url(#path-7-inside-4_2581_616)"
          />
          <mask id="path-9-inside-5_2581_616" fill="white">
            <path d="M0.75 11.5V12.4434L3.52928 15.4974L6.25 12.4403V11.5H3.975V4.49997H6.25V3.55653L3.47072 0.502533L0.75 3.55969V4.49997H2.975V11.5H0.75ZM2.14181 3.49997L3.47903 1.99741L4.84644 3.49997H2.14181ZM4.85819 12.5L3.52097 14.0025L2.15356 12.5H4.85819Z" />
          </mask>
          <path
            className="stroke-highlighter"
            d="M0.75 11.5V12.4434L3.52928 15.4974L6.25 12.4403V11.5H3.975V4.49997H6.25V3.55653L3.47072 0.502533L0.75 3.55969V4.49997H2.975V11.5H0.75ZM2.14181 3.49997L3.47903 1.99741L4.84644 3.49997H2.14181ZM4.85819 12.5L3.52097 14.0025L2.15356 12.5H4.85819Z"
            fill="#7F7F7F"
          />
          <path
            className="stroke-highlighter"
            d="M0.75 11.5V10.25H-0.5V11.5H0.75ZM0.75 12.4434H-0.5V12.927L-0.174485 13.2847L0.75 12.4434ZM3.52928 15.4974L2.6048 16.3387L3.53965 17.366L4.46305 16.3284L3.52928 15.4974ZM6.25 12.4403L7.18377 13.2713L7.5 12.9159V12.4403H6.25ZM6.25 11.5H7.5V10.25H6.25V11.5ZM3.975 11.5H2.725V12.75H3.975V11.5ZM3.975 4.49997V3.24997H2.725V4.49997H3.975ZM6.25 4.49997V5.74997H7.5V4.49997H6.25ZM6.25 3.55653H7.5V3.0729L7.17449 2.71521L6.25 3.55653ZM3.47072 0.502533L4.3952 -0.338791L3.46035 -1.36606L2.53695 -0.328476L3.47072 0.502533ZM0.75 3.55969L-0.183769 2.72868L-0.5 3.08402V3.55969H0.75ZM0.75 4.49997H-0.5V5.74997H0.75V4.49997ZM2.975 4.49997H4.225V3.24997H2.975V4.49997ZM2.975 11.5V12.75H4.225V11.5H2.975ZM2.14181 3.49997L1.20805 2.66896L-0.643968 4.74997H2.14181V3.49997ZM3.47903 1.99741L4.40352 1.15608L3.46866 0.128825L2.54527 1.1664L3.47903 1.99741ZM4.84644 3.49997V4.74997H7.67413L5.77092 2.65864L4.84644 3.49997ZM4.85819 12.5L5.79195 13.331L7.64397 11.25H4.85819V12.5ZM3.52097 14.0025L2.59648 14.8439L3.53134 15.8711L4.45473 14.8335L3.52097 14.0025ZM2.15356 12.5V11.25H-0.674131L1.22908 13.3413L2.15356 12.5ZM-0.5 11.5V12.4434H2V11.5H-0.5ZM-0.174485 13.2847L2.6048 16.3387L4.45377 14.6561L1.67449 11.6021L-0.174485 13.2847ZM4.46305 16.3284L7.18377 13.2713L5.31623 11.6092L2.59551 14.6664L4.46305 16.3284ZM7.5 12.4403V11.5H5V12.4403H7.5ZM6.25 10.25H3.975V12.75H6.25V10.25ZM5.225 11.5V4.49997H2.725V11.5H5.225ZM3.975 5.74997H6.25V3.24997H3.975V5.74997ZM7.5 4.49997V3.55653H5V4.49997H7.5ZM7.17449 2.71521L4.3952 -0.338791L2.54623 1.34386L5.32551 4.39786L7.17449 2.71521ZM2.53695 -0.328476L-0.183769 2.72868L1.68377 4.3907L4.40449 1.33354L2.53695 -0.328476ZM-0.5 3.55969V4.49997H2V3.55969H-0.5ZM0.75 5.74997H2.975V3.24997H0.75V5.74997ZM1.725 4.49997V11.5H4.225V4.49997H1.725ZM2.975 10.25H0.75V12.75H2.975V10.25ZM3.07558 4.33098L4.4128 2.82842L2.54527 1.1664L1.20805 2.66896L3.07558 4.33098ZM2.55455 2.83873L3.92195 4.3413L5.77092 2.65864L4.40352 1.15608L2.55455 2.83873ZM4.84644 2.24997H2.14181V4.74997H4.84644V2.24997ZM3.92442 11.669L2.5872 13.1715L4.45473 14.8335L5.79195 13.331L3.92442 11.669ZM4.44545 13.1612L3.07805 11.6586L1.22908 13.3413L2.59648 14.8439L4.44545 13.1612ZM2.15356 13.75H4.85819V11.25H2.15356V13.75Z"
            fill="#7F7F7F"
            mask="url(#path-9-inside-5_2581_616)"
          />
        </g>
        <defs>
          <clipPath id="clip0_2581_616">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const AlignmentSvg = () => {
    return (
      <svg
        width="24"
        height="23"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M1.5 3.5V4.5H14.5V3.5H1.5ZM1.5 5.5V6.5H10.5V5.5H1.5ZM1.5 7.5V8.5H14.5V7.5H1.5ZM1.5 9.5V10.5H10.5V9.5H1.5ZM1.5 11.5V12.5H14.5V11.5H1.5Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const IncreaseIndentSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <mask id="path-1-inside-1_2752_2482" fill="white">
          <path d="M2.25 3.9375C2.25 3.78832 2.30926 3.64524 2.41475 3.53975C2.52024 3.43426 2.66332 3.375 2.8125 3.375H15.1875C15.3367 3.375 15.4798 3.43426 15.5852 3.53975C15.6907 3.64524 15.75 3.78832 15.75 3.9375C15.75 4.08668 15.6907 4.22976 15.5852 4.33525C15.4798 4.44074 15.3367 4.5 15.1875 4.5H2.8125C2.66332 4.5 2.52024 4.44074 2.41475 4.33525C2.30926 4.22976 2.25 4.08668 2.25 3.9375ZM2.97675 6.35175C3.029 6.29937 3.09107 6.25781 3.15941 6.22945C3.22775 6.20109 3.30101 6.18649 3.375 6.18649C3.44899 6.18649 3.52225 6.20109 3.59059 6.22945C3.65893 6.25781 3.721 6.29937 3.77325 6.35175L6.02325 8.60175C6.07563 8.654 6.11719 8.71607 6.14555 8.78441C6.17391 8.85275 6.18851 8.92601 6.18851 9C6.18851 9.07399 6.17391 9.14725 6.14555 9.21559C6.11719 9.28393 6.07563 9.346 6.02325 9.39825L3.77325 11.6483C3.72095 11.7005 3.65886 11.742 3.59053 11.7703C3.5222 11.7986 3.44896 11.8132 3.375 11.8132C3.30104 11.8132 3.2278 11.7986 3.15947 11.7703C3.09114 11.742 3.02905 11.7005 2.97675 11.6483C2.92445 11.596 2.88297 11.5339 2.85466 11.4655C2.82636 11.3972 2.81179 11.324 2.81179 11.25C2.81179 11.176 2.82636 11.1028 2.85466 11.0345C2.88297 10.9661 2.92445 10.904 2.97675 10.8517L4.82963 9L2.97675 7.14825C2.92437 7.096 2.88281 7.03393 2.85445 6.96559C2.82609 6.89725 2.81149 6.82399 2.81149 6.75C2.81149 6.67601 2.82609 6.60275 2.85445 6.53441C2.88281 6.46607 2.92437 6.404 2.97675 6.35175ZM7.875 7.3125C7.875 7.16332 7.93426 7.02024 8.03975 6.91475C8.14524 6.80926 8.28832 6.75 8.4375 6.75H15.1875C15.3367 6.75 15.4798 6.80926 15.5852 6.91475C15.6907 7.02024 15.75 7.16332 15.75 7.3125C15.75 7.46168 15.6907 7.60476 15.5852 7.71025C15.4798 7.81574 15.3367 7.875 15.1875 7.875H8.4375C8.28832 7.875 8.14524 7.81574 8.03975 7.71025C7.93426 7.60476 7.875 7.46168 7.875 7.3125ZM7.875 10.6875C7.875 10.5383 7.93426 10.3952 8.03975 10.2898C8.14524 10.1843 8.28832 10.125 8.4375 10.125H15.1875C15.3367 10.125 15.4798 10.1843 15.5852 10.2898C15.6907 10.3952 15.75 10.5383 15.75 10.6875C15.75 10.8367 15.6907 10.9798 15.5852 11.0852C15.4798 11.1907 15.3367 11.25 15.1875 11.25H8.4375C8.28832 11.25 8.14524 11.1907 8.03975 11.0852C7.93426 10.9798 7.875 10.8367 7.875 10.6875ZM2.25 14.0625C2.25 13.9133 2.30926 13.7702 2.41475 13.6648C2.52024 13.5593 2.66332 13.5 2.8125 13.5H15.1875C15.3367 13.5 15.4798 13.5593 15.5852 13.6648C15.6907 13.7702 15.75 13.9133 15.75 14.0625C15.75 14.2117 15.6907 14.3548 15.5852 14.4602C15.4798 14.5657 15.3367 14.625 15.1875 14.625H2.8125C2.66332 14.625 2.52024 14.5657 2.41475 14.4602C2.30926 14.3548 2.25 14.2117 2.25 14.0625Z" />
        </mask>
        <path
          className="fill-hover"
          d="M2.25 3.9375C2.25 3.78832 2.30926 3.64524 2.41475 3.53975C2.52024 3.43426 2.66332 3.375 2.8125 3.375H15.1875C15.3367 3.375 15.4798 3.43426 15.5852 3.53975C15.6907 3.64524 15.75 3.78832 15.75 3.9375C15.75 4.08668 15.6907 4.22976 15.5852 4.33525C15.4798 4.44074 15.3367 4.5 15.1875 4.5H2.8125C2.66332 4.5 2.52024 4.44074 2.41475 4.33525C2.30926 4.22976 2.25 4.08668 2.25 3.9375ZM2.97675 6.35175C3.029 6.29937 3.09107 6.25781 3.15941 6.22945C3.22775 6.20109 3.30101 6.18649 3.375 6.18649C3.44899 6.18649 3.52225 6.20109 3.59059 6.22945C3.65893 6.25781 3.721 6.29937 3.77325 6.35175L6.02325 8.60175C6.07563 8.654 6.11719 8.71607 6.14555 8.78441C6.17391 8.85275 6.18851 8.92601 6.18851 9C6.18851 9.07399 6.17391 9.14725 6.14555 9.21559C6.11719 9.28393 6.07563 9.346 6.02325 9.39825L3.77325 11.6483C3.72095 11.7005 3.65886 11.742 3.59053 11.7703C3.5222 11.7986 3.44896 11.8132 3.375 11.8132C3.30104 11.8132 3.2278 11.7986 3.15947 11.7703C3.09114 11.742 3.02905 11.7005 2.97675 11.6483C2.92445 11.596 2.88297 11.5339 2.85466 11.4655C2.82636 11.3972 2.81179 11.324 2.81179 11.25C2.81179 11.176 2.82636 11.1028 2.85466 11.0345C2.88297 10.9661 2.92445 10.904 2.97675 10.8517L4.82963 9L2.97675 7.14825C2.92437 7.096 2.88281 7.03393 2.85445 6.96559C2.82609 6.89725 2.81149 6.82399 2.81149 6.75C2.81149 6.67601 2.82609 6.60275 2.85445 6.53441C2.88281 6.46607 2.92437 6.404 2.97675 6.35175ZM7.875 7.3125C7.875 7.16332 7.93426 7.02024 8.03975 6.91475C8.14524 6.80926 8.28832 6.75 8.4375 6.75H15.1875C15.3367 6.75 15.4798 6.80926 15.5852 6.91475C15.6907 7.02024 15.75 7.16332 15.75 7.3125C15.75 7.46168 15.6907 7.60476 15.5852 7.71025C15.4798 7.81574 15.3367 7.875 15.1875 7.875H8.4375C8.28832 7.875 8.14524 7.81574 8.03975 7.71025C7.93426 7.60476 7.875 7.46168 7.875 7.3125ZM7.875 10.6875C7.875 10.5383 7.93426 10.3952 8.03975 10.2898C8.14524 10.1843 8.28832 10.125 8.4375 10.125H15.1875C15.3367 10.125 15.4798 10.1843 15.5852 10.2898C15.6907 10.3952 15.75 10.5383 15.75 10.6875C15.75 10.8367 15.6907 10.9798 15.5852 11.0852C15.4798 11.1907 15.3367 11.25 15.1875 11.25H8.4375C8.28832 11.25 8.14524 11.1907 8.03975 11.0852C7.93426 10.9798 7.875 10.8367 7.875 10.6875ZM2.25 14.0625C2.25 13.9133 2.30926 13.7702 2.41475 13.6648C2.52024 13.5593 2.66332 13.5 2.8125 13.5H15.1875C15.3367 13.5 15.4798 13.5593 15.5852 13.6648C15.6907 13.7702 15.75 13.9133 15.75 14.0625C15.75 14.2117 15.6907 14.3548 15.5852 14.4602C15.4798 14.5657 15.3367 14.625 15.1875 14.625H2.8125C2.66332 14.625 2.52024 14.5657 2.41475 14.4602C2.30926 14.3548 2.25 14.2117 2.25 14.0625Z"
          fill="#7F7F7F"
        />
        <path
          className="fill-hover"
          d="M2.8125 3.375V4.625V3.375ZM3.77325 6.35175L2.88825 7.23452L2.88937 7.23563L3.77325 6.35175ZM6.02325 8.60175L5.13937 9.48563L5.14048 9.48675L6.02325 8.60175ZM6.18851 9H4.93851H6.18851ZM6.02325 9.39825L5.14048 8.51325L5.13937 8.51437L6.02325 9.39825ZM3.375 11.8132V10.5632V11.8132ZM2.81179 11.25H4.06179H2.81179ZM2.97675 10.8517L2.09313 9.9676L2.09287 9.96787L2.97675 10.8517ZM4.82963 9L5.71324 9.88415L6.59793 9L5.71324 8.11585L4.82963 9ZM2.97675 7.14825L3.86037 6.2641L3.85952 6.26325L2.97675 7.14825ZM3.5 3.9375C3.5 4.11984 3.42757 4.29471 3.29864 4.42364L1.53087 2.65587C1.19096 2.99578 1 3.45679 1 3.9375H3.5ZM3.29864 4.42364C3.16971 4.55257 2.99484 4.625 2.8125 4.625V2.125C2.33179 2.125 1.87078 2.31596 1.53087 2.65587L3.29864 4.42364ZM2.8125 4.625H15.1875V2.125H2.8125V4.625ZM15.1875 4.625C15.0052 4.625 14.8303 4.55257 14.7014 4.42364L16.4691 2.65587C16.1292 2.31596 15.6682 2.125 15.1875 2.125V4.625ZM14.7014 4.42364C14.5724 4.2947 14.5 4.11983 14.5 3.9375H17C17 3.4568 16.809 2.99578 16.4691 2.65587L14.7014 4.42364ZM14.5 3.9375C14.5 3.75517 14.5724 3.5803 14.7014 3.45136L16.4691 5.21913C16.809 4.87922 17 4.4182 17 3.9375H14.5ZM14.7014 3.45136C14.8303 3.32243 15.0052 3.25 15.1875 3.25V5.75C15.6682 5.75 16.1292 5.55904 16.4691 5.21913L14.7014 3.45136ZM15.1875 3.25H2.8125V5.75H15.1875V3.25ZM2.8125 3.25C2.99484 3.25 3.16971 3.32243 3.29864 3.45136L1.53087 5.21913C1.87078 5.55904 2.33179 5.75 2.8125 5.75V3.25ZM3.29864 3.45136C3.42757 3.58029 3.5 3.75516 3.5 3.9375H1C1 4.41821 1.19096 4.87922 1.53087 5.21913L3.29864 3.45136ZM3.86175 7.23452C3.79789 7.29854 3.72202 7.34934 3.6385 7.384L2.68033 5.0749C2.46013 5.16628 2.26011 5.30019 2.09175 5.46898L3.86175 7.23452ZM3.6385 7.384C3.55497 7.41866 3.46542 7.43649 3.375 7.43649V4.93649C3.1366 4.93649 2.90053 4.98353 2.68033 5.0749L3.6385 7.384ZM3.375 7.43649C3.28458 7.43649 3.19503 7.41866 3.1115 7.384L4.06967 5.0749C3.84947 4.98353 3.6134 4.93649 3.375 4.93649V7.43649ZM3.1115 7.384C3.02798 7.34934 2.95211 7.29854 2.88825 7.23452L4.65825 5.46898C4.48989 5.30019 4.28987 5.16628 4.06967 5.0749L3.1115 7.384ZM2.88937 7.23563L5.13937 9.48563L6.90713 7.71787L4.65713 5.46787L2.88937 7.23563ZM5.14048 9.48675C5.07646 9.42289 5.02566 9.34702 4.991 9.2635L7.3001 8.30533C7.20872 8.08513 7.07481 7.88511 6.90602 7.71675L5.14048 9.48675ZM4.991 9.2635C4.95634 9.17997 4.93851 9.09042 4.93851 9H7.43851C7.43851 8.7616 7.39147 8.52553 7.3001 8.30533L4.991 9.2635ZM4.93851 9C4.93851 8.90957 4.95634 8.82003 4.991 8.7365L7.3001 9.69467C7.39147 9.47447 7.43851 9.2384 7.43851 9H4.93851ZM4.991 8.7365C5.02566 8.65298 5.07646 8.57711 5.14048 8.51325L6.90602 10.2833C7.07481 10.1149 7.20873 9.91487 7.3001 9.69467L4.991 8.7365ZM5.13937 8.51437L2.88937 10.7644L4.65713 12.5321L6.90713 10.2821L5.13937 8.51437ZM2.88937 10.7644C2.95314 10.7006 3.02885 10.65 3.11218 10.6155L4.06889 12.9252C4.28887 12.8341 4.48876 12.7005 4.65713 12.5321L2.88937 10.7644ZM3.11218 10.6155C3.19551 10.581 3.28482 10.5632 3.375 10.5632V13.0632C3.61311 13.0632 3.84889 13.0163 4.06889 12.9252L3.11218 10.6155ZM3.375 10.5632C3.46518 10.5632 3.55449 10.581 3.63782 10.6155L2.68111 12.9252C2.90111 13.0163 3.13689 13.0632 3.375 13.0632V10.5632ZM3.63782 10.6155C3.72115 10.65 3.79686 10.7006 3.86063 10.7644L2.09287 12.5321C2.26124 12.7005 2.46113 12.8341 2.68111 12.9252L3.63782 10.6155ZM3.86063 10.7644C3.92441 10.8281 3.975 10.9039 4.00951 10.9872L1.69981 11.9439C1.79093 12.1639 1.92449 12.3638 2.09287 12.5321L3.86063 10.7644ZM4.00951 10.9872C4.04403 11.0705 4.06179 11.1598 4.06179 11.25H1.56179C1.56179 11.4881 1.60869 11.7239 1.69981 11.9439L4.00951 10.9872ZM4.06179 11.25C4.06179 11.3402 4.04403 11.4295 4.00951 11.5128L1.69981 10.5561C1.60869 10.7761 1.56179 11.0119 1.56179 11.25H4.06179ZM4.00951 11.5128C3.975 11.5961 3.92441 11.6719 3.86063 11.7356L2.09287 9.96787C1.92449 10.1362 1.79093 10.3361 1.69981 10.5561L4.00951 11.5128ZM3.86036 11.7359L5.71324 9.88415L3.94601 8.11585L2.09313 9.9676L3.86036 11.7359ZM5.71324 8.11585L3.86036 6.2641L2.09313 8.0324L3.94601 9.88415L5.71324 8.11585ZM3.85952 6.26325C3.92354 6.32711 3.97434 6.40298 4.009 6.4865L1.6999 7.44467C1.79127 7.66487 1.92519 7.86488 2.09398 8.03325L3.85952 6.26325ZM4.009 6.4865C4.04365 6.57003 4.06149 6.65957 4.06149 6.75H1.56149C1.56149 6.98841 1.60853 7.22447 1.6999 7.44467L4.009 6.4865ZM4.06149 6.75C4.06149 6.84043 4.04365 6.92997 4.009 7.0135L1.6999 6.05533C1.60853 6.27553 1.56149 6.51159 1.56149 6.75H4.06149ZM4.009 7.0135C3.97434 7.09702 3.92354 7.17289 3.85952 7.23675L2.09398 5.46675C1.92519 5.63512 1.79127 5.83513 1.6999 6.05533L4.009 7.0135ZM9.125 7.3125C9.125 7.49484 9.05257 7.66971 8.92364 7.79864L7.15587 6.03087C6.81596 6.37078 6.625 6.83179 6.625 7.3125H9.125ZM8.92364 7.79864C8.79471 7.92757 8.61984 8 8.4375 8V5.5C7.95679 5.5 7.49578 5.69096 7.15587 6.03087L8.92364 7.79864ZM8.4375 8H15.1875V5.5H8.4375V8ZM15.1875 8C15.0052 8 14.8303 7.92757 14.7014 7.79864L16.4691 6.03087C16.1292 5.69096 15.6682 5.5 15.1875 5.5V8ZM14.7014 7.79864C14.5724 7.6697 14.5 7.49483 14.5 7.3125H17C17 6.8318 16.809 6.37078 16.4691 6.03087L14.7014 7.79864ZM14.5 7.3125C14.5 7.13017 14.5724 6.9553 14.7014 6.82636L16.4691 8.59413C16.809 8.25422 17 7.7932 17 7.3125H14.5ZM14.7014 6.82636C14.8303 6.69743 15.0052 6.625 15.1875 6.625V9.125C15.6682 9.125 16.1292 8.93404 16.4691 8.59413L14.7014 6.82636ZM15.1875 6.625H8.4375V9.125H15.1875V6.625ZM8.4375 6.625C8.61984 6.625 8.79471 6.69743 8.92364 6.82636L7.15587 8.59413C7.49578 8.93404 7.95679 9.125 8.4375 9.125V6.625ZM8.92364 6.82636C9.05257 6.95529 9.125 7.13016 9.125 7.3125H6.625C6.625 7.79321 6.81596 8.25422 7.15587 8.59413L8.92364 6.82636ZM9.125 10.6875C9.125 10.8698 9.05257 11.0447 8.92364 11.1736L7.15587 9.40587C6.81596 9.74578 6.625 10.2068 6.625 10.6875H9.125ZM8.92364 11.1736C8.7947 11.3026 8.61983 11.375 8.4375 11.375V8.875C7.9568 8.875 7.49578 9.06596 7.15587 9.40587L8.92364 11.1736ZM8.4375 11.375H15.1875V8.875H8.4375V11.375ZM15.1875 11.375C15.0052 11.375 14.8303 11.3026 14.7014 11.1736L16.4691 9.40587C16.1292 9.06596 15.6682 8.875 15.1875 8.875V11.375ZM14.7014 11.1736C14.5724 11.0447 14.5 10.8698 14.5 10.6875H17C17 10.2068 16.809 9.74578 16.4691 9.40587L14.7014 11.1736ZM14.5 10.6875C14.5 10.5052 14.5724 10.3303 14.7014 10.2014L16.4691 11.9691C16.809 11.6292 17 11.1682 17 10.6875H14.5ZM14.7014 10.2014C14.8303 10.0724 15.0052 10 15.1875 10V12.5C15.6682 12.5 16.1292 12.309 16.4691 11.9691L14.7014 10.2014ZM15.1875 10H8.4375V12.5H15.1875V10ZM8.4375 10C8.61983 10 8.7947 10.0724 8.92364 10.2014L7.15587 11.9691C7.49578 12.309 7.9568 12.5 8.4375 12.5V10ZM8.92364 10.2014C9.05257 10.3303 9.125 10.5052 9.125 10.6875H6.625C6.625 11.1682 6.81596 11.6292 7.15587 11.9691L8.92364 10.2014ZM3.5 14.0625C3.5 14.2448 3.42757 14.4197 3.29864 14.5486L1.53087 12.7809C1.19096 13.1208 1 13.5818 1 14.0625H3.5ZM3.29864 14.5486C3.1697 14.6776 2.99483 14.75 2.8125 14.75V12.25C2.3318 12.25 1.87078 12.441 1.53087 12.7809L3.29864 14.5486ZM2.8125 14.75H15.1875V12.25H2.8125V14.75ZM15.1875 14.75C15.0052 14.75 14.8303 14.6776 14.7014 14.5486L16.4691 12.7809C16.1292 12.441 15.6682 12.25 15.1875 12.25V14.75ZM14.7014 14.5486C14.5724 14.4197 14.5 14.2448 14.5 14.0625H17C17 13.5818 16.809 13.1208 16.4691 12.7809L14.7014 14.5486ZM14.5 14.0625C14.5 13.8802 14.5724 13.7053 14.7014 13.5764L16.4691 15.3441C16.809 15.0042 17 14.5432 17 14.0625H14.5ZM14.7014 13.5764C14.8303 13.4474 15.0052 13.375 15.1875 13.375V15.875C15.6682 15.875 16.1292 15.684 16.4691 15.3441L14.7014 13.5764ZM15.1875 13.375H2.8125V15.875H15.1875V13.375ZM2.8125 13.375C2.99483 13.375 3.1697 13.4474 3.29864 13.5764L1.53087 15.3441C1.87078 15.684 2.3318 15.875 2.8125 15.875V13.375ZM3.29864 13.5764C3.42757 13.7053 3.5 13.8802 3.5 14.0625H1C1 14.5432 1.19096 15.0042 1.53087 15.3441L3.29864 13.5764Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2752_2482)"
        />
      </svg>
    );
  };

  const DecreaseIndentSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1252" fill="white">
          <path
            className="fill-hover"
            d="M2 3.5C2 3.36739 2.05268 3.24021 2.14645 3.14645C2.24021 3.05268 2.36739 3 2.5 3H13.5C13.6326 3 13.7598 3.05268 13.8536 3.14645C13.9473 3.24021 14 3.36739 14 3.5C14 3.63261 13.9473 3.75979 13.8536 3.85355C13.7598 3.94732 13.6326 4 13.5 4H2.5C2.36739 4 2.24021 3.94732 2.14645 3.85355C2.05268 3.75979 2 3.63261 2 3.5ZM12.646 5.646C12.7399 5.55211 12.8672 5.49937 13 5.49937C13.1328 5.49937 13.2601 5.55211 13.354 5.646C13.4479 5.73989 13.5006 5.86722 13.5006 6C13.5006 6.13278 13.4479 6.26011 13.354 6.354L11.707 8L13.354 9.646C13.4479 9.73989 13.5006 9.86722 13.5006 10C13.5006 10.1328 13.4479 10.2601 13.354 10.354C13.2601 10.4479 13.1328 10.5006 13 10.5006C12.8672 10.5006 12.7399 10.4479 12.646 10.354L10.646 8.354C10.5994 8.30755 10.5625 8.25238 10.5373 8.19163C10.5121 8.13089 10.4991 8.06577 10.4991 8C10.4991 7.93423 10.5121 7.86911 10.5373 7.80837C10.5625 7.74762 10.5994 7.69245 10.646 7.646L12.646 5.646ZM2 6.5C2 6.36739 2.05268 6.24021 2.14645 6.14645C2.24021 6.05268 2.36739 6 2.5 6H8.5C8.63261 6 8.75979 6.05268 8.85355 6.14645C8.94732 6.24021 9 6.36739 9 6.5C9 6.63261 8.94732 6.75979 8.85355 6.85355C8.75979 6.94732 8.63261 7 8.5 7H2.5C2.36739 7 2.24021 6.94732 2.14645 6.85355C2.05268 6.75979 2 6.63261 2 6.5ZM2 9.5C2 9.36739 2.05268 9.24021 2.14645 9.14645C2.24021 9.05268 2.36739 9 2.5 9H8.5C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5C9 9.63261 8.94732 9.75979 8.85355 9.85355C8.75979 9.94732 8.63261 10 8.5 10H2.5C2.36739 10 2.24021 9.94732 2.14645 9.85355C2.05268 9.75979 2 9.63261 2 9.5ZM2 12.5C2 12.3674 2.05268 12.2402 2.14645 12.1464C2.24021 12.0527 2.36739 12 2.5 12H13.5C13.6326 12 13.7598 12.0527 13.8536 12.1464C13.9473 12.2402 14 12.3674 14 12.5C14 12.6326 13.9473 12.7598 13.8536 12.8536C13.7598 12.9473 13.6326 13 13.5 13H2.5C2.36739 13 2.24021 12.9473 2.14645 12.8536C2.05268 12.7598 2 12.6326 2 12.5Z"
          />
        </mask>
        <path
          className="fill-hover"
          d="M2 3.5C2 3.36739 2.05268 3.24021 2.14645 3.14645C2.24021 3.05268 2.36739 3 2.5 3H13.5C13.6326 3 13.7598 3.05268 13.8536 3.14645C13.9473 3.24021 14 3.36739 14 3.5C14 3.63261 13.9473 3.75979 13.8536 3.85355C13.7598 3.94732 13.6326 4 13.5 4H2.5C2.36739 4 2.24021 3.94732 2.14645 3.85355C2.05268 3.75979 2 3.63261 2 3.5ZM12.646 5.646C12.7399 5.55211 12.8672 5.49937 13 5.49937C13.1328 5.49937 13.2601 5.55211 13.354 5.646C13.4479 5.73989 13.5006 5.86722 13.5006 6C13.5006 6.13278 13.4479 6.26011 13.354 6.354L11.707 8L13.354 9.646C13.4479 9.73989 13.5006 9.86722 13.5006 10C13.5006 10.1328 13.4479 10.2601 13.354 10.354C13.2601 10.4479 13.1328 10.5006 13 10.5006C12.8672 10.5006 12.7399 10.4479 12.646 10.354L10.646 8.354C10.5994 8.30755 10.5625 8.25238 10.5373 8.19163C10.5121 8.13089 10.4991 8.06577 10.4991 8C10.4991 7.93423 10.5121 7.86911 10.5373 7.80837C10.5625 7.74762 10.5994 7.69245 10.646 7.646L12.646 5.646ZM2 6.5C2 6.36739 2.05268 6.24021 2.14645 6.14645C2.24021 6.05268 2.36739 6 2.5 6H8.5C8.63261 6 8.75979 6.05268 8.85355 6.14645C8.94732 6.24021 9 6.36739 9 6.5C9 6.63261 8.94732 6.75979 8.85355 6.85355C8.75979 6.94732 8.63261 7 8.5 7H2.5C2.36739 7 2.24021 6.94732 2.14645 6.85355C2.05268 6.75979 2 6.63261 2 6.5ZM2 9.5C2 9.36739 2.05268 9.24021 2.14645 9.14645C2.24021 9.05268 2.36739 9 2.5 9H8.5C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5C9 9.63261 8.94732 9.75979 8.85355 9.85355C8.75979 9.94732 8.63261 10 8.5 10H2.5C2.36739 10 2.24021 9.94732 2.14645 9.85355C2.05268 9.75979 2 9.63261 2 9.5ZM2 12.5C2 12.3674 2.05268 12.2402 2.14645 12.1464C2.24021 12.0527 2.36739 12 2.5 12H13.5C13.6326 12 13.7598 12.0527 13.8536 12.1464C13.9473 12.2402 14 12.3674 14 12.5C14 12.6326 13.9473 12.7598 13.8536 12.8536C13.7598 12.9473 13.6326 13 13.5 13H2.5C2.36739 13 2.24021 12.9473 2.14645 12.8536C2.05268 12.7598 2 12.6326 2 12.5Z"
          fill="#7F7F7F"
          strokeWidth="1.25"
        />
        <path
          className="fill-hover"
          d="M2.5 3V4.25V3ZM13 5.49937V6.74937V5.49937ZM13.354 6.354L14.2376 7.23815L14.2379 7.23788L13.354 6.354ZM11.707 8L10.8234 7.11585L9.9387 8L10.8234 8.88415L11.707 8ZM13.354 9.646L14.2379 8.76212L14.2376 8.76185L13.354 9.646ZM13 10.5006V11.7506V10.5006ZM12.646 10.354L11.7621 11.2379L12.646 10.354ZM10.646 8.354L11.5299 7.47012L11.5288 7.469L10.646 8.354ZM10.646 7.646L11.5288 8.531L11.5299 8.52988L10.646 7.646ZM3.25 3.5C3.25 3.69891 3.17098 3.88968 3.03033 4.03033L1.26256 2.26256C0.934375 2.59075 0.75 3.03587 0.75 3.5H3.25ZM3.03033 4.03033C2.88968 4.17098 2.69891 4.25 2.5 4.25V1.75C2.03587 1.75 1.59075 1.93438 1.26256 2.26256L3.03033 4.03033ZM2.5 4.25H13.5V1.75H2.5V4.25ZM13.5 4.25C13.3011 4.25 13.1103 4.17098 12.9697 4.03033L14.7374 2.26256C14.4092 1.93437 13.9641 1.75 13.5 1.75V4.25ZM12.9697 4.03033C12.829 3.88968 12.75 3.69891 12.75 3.5H15.25C15.25 3.03587 15.0656 2.59075 14.7374 2.26256L12.9697 4.03033ZM12.75 3.5C12.75 3.30109 12.829 3.11032 12.9697 2.96967L14.7374 4.73744C15.0656 4.40925 15.25 3.96413 15.25 3.5H12.75ZM12.9697 2.96967C13.1103 2.82902 13.3011 2.75 13.5 2.75V5.25C13.9641 5.25 14.4092 5.06563 14.7374 4.73744L12.9697 2.96967ZM13.5 2.75H2.5V5.25H13.5V2.75ZM2.5 2.75C2.69891 2.75 2.88968 2.82902 3.03033 2.96967L1.26256 4.73744C1.59075 5.06562 2.03587 5.25 2.5 5.25V2.75ZM3.03033 2.96967C3.17098 3.11032 3.25 3.30109 3.25 3.5H0.75C0.75 3.96413 0.934375 4.40925 1.26256 4.73744L3.03033 2.96967ZM13.5299 6.52988C13.3893 6.67042 13.1987 6.74937 13 6.74937V4.24937C12.5357 4.24937 12.0904 4.43381 11.7621 4.76212L13.5299 6.52988ZM13 6.74937C12.8013 6.74937 12.6107 6.67042 12.4701 6.52988L14.2379 4.76212C13.9096 4.43381 13.4643 4.24937 13 4.24937V6.74937ZM12.4701 6.52988C12.3296 6.38935 12.2506 6.19874 12.2506 6H14.7506C14.7506 5.53571 14.5662 5.09043 14.2379 4.76212L12.4701 6.52988ZM12.2506 6C12.2506 5.80126 12.3296 5.61065 12.4701 5.47012L14.2379 7.23788C14.5662 6.90957 14.7506 6.46429 14.7506 6H12.2506ZM12.4704 5.46985L10.8234 7.11585L12.5906 8.88415L14.2376 7.23815L12.4704 5.46985ZM10.8234 8.88415L12.4704 10.5302L14.2376 8.76185L12.5906 7.11585L10.8234 8.88415ZM12.4701 10.5299C12.3296 10.3893 12.2506 10.1987 12.2506 10H14.7506C14.7506 9.53571 14.5662 9.09043 14.2379 8.76212L12.4701 10.5299ZM12.2506 10C12.2506 9.80126 12.3296 9.61065 12.4701 9.47012L14.2379 11.2379C14.5662 10.9096 14.7506 10.4643 14.7506 10H12.2506ZM12.4701 9.47012C12.6107 9.32958 12.8013 9.25063 13 9.25063V11.7506C13.4643 11.7506 13.9096 11.5662 14.2379 11.2379L12.4701 9.47012ZM13 9.25063C13.1987 9.25063 13.3893 9.32958 13.5299 9.47012L11.7621 11.2379C12.0904 11.5662 12.5357 11.7506 13 11.7506V9.25063ZM13.5299 9.47012L11.5299 7.47012L9.76212 9.23788L11.7621 11.2379L13.5299 9.47012ZM11.5288 7.469C11.5986 7.53867 11.654 7.62144 11.6918 7.71255L9.38274 8.67072C9.47096 8.88332 9.60026 9.07644 9.76323 9.239L11.5288 7.469ZM11.6918 7.71255C11.7296 7.80367 11.7491 7.90135 11.7491 8H9.24911C9.24911 8.23019 9.29452 8.45811 9.38274 8.67072L11.6918 7.71255ZM11.7491 8C11.7491 8.09865 11.7296 8.19633 11.6918 8.28745L9.38274 7.32928C9.29452 7.54189 9.24911 7.76981 9.24911 8H11.7491ZM11.6918 8.28745C11.654 8.37856 11.5986 8.46133 11.5288 8.531L9.76323 6.761C9.60026 6.92356 9.47096 7.11668 9.38274 7.32928L11.6918 8.28745ZM11.5299 8.52988L13.5299 6.52988L11.7621 4.76212L9.76212 6.76212L11.5299 8.52988ZM3.25 6.5C3.25 6.69891 3.17098 6.88968 3.03033 7.03033L1.26256 5.26256C0.934375 5.59075 0.75 6.03587 0.75 6.5H3.25ZM3.03033 7.03033C2.88968 7.17098 2.69891 7.25 2.5 7.25V4.75C2.03587 4.75 1.59075 4.93438 1.26256 5.26256L3.03033 7.03033ZM2.5 7.25H8.5V4.75H2.5V7.25ZM8.5 7.25C8.30109 7.25 8.11032 7.17098 7.96967 7.03033L9.73744 5.26256C9.40925 4.93437 8.96413 4.75 8.5 4.75V7.25ZM7.96967 7.03033C7.82902 6.88968 7.75 6.69891 7.75 6.5H10.25C10.25 6.03587 10.0656 5.59075 9.73744 5.26256L7.96967 7.03033ZM7.75 6.5C7.75 6.30109 7.82902 6.11032 7.96967 5.96967L9.73744 7.73744C10.0656 7.40925 10.25 6.96413 10.25 6.5H7.75ZM7.96967 5.96967C8.11032 5.82902 8.30109 5.75 8.5 5.75V8.25C8.96413 8.25 9.40925 8.06563 9.73744 7.73744L7.96967 5.96967ZM8.5 5.75H2.5V8.25H8.5V5.75ZM2.5 5.75C2.69891 5.75 2.88968 5.82902 3.03033 5.96967L1.26256 7.73744C1.59075 8.06562 2.03587 8.25 2.5 8.25V5.75ZM3.03033 5.96967C3.17098 6.11032 3.25 6.30109 3.25 6.5H0.75C0.75 6.96413 0.934375 7.40925 1.26256 7.73744L3.03033 5.96967ZM3.25 9.5C3.25 9.69891 3.17098 9.88968 3.03033 10.0303L1.26256 8.26256C0.934374 8.59075 0.75 9.03587 0.75 9.5H3.25ZM3.03033 10.0303C2.88968 10.171 2.69891 10.25 2.5 10.25V7.75C2.03587 7.75 1.59075 7.93437 1.26256 8.26256L3.03033 10.0303ZM2.5 10.25H8.5V7.75H2.5V10.25ZM8.5 10.25C8.30109 10.25 8.11032 10.171 7.96967 10.0303L9.73744 8.26256C9.40925 7.93437 8.96413 7.75 8.5 7.75V10.25ZM7.96967 10.0303C7.82902 9.88968 7.75 9.69891 7.75 9.5H10.25C10.25 9.03587 10.0656 8.59075 9.73744 8.26256L7.96967 10.0303ZM7.75 9.5C7.75 9.30109 7.82902 9.11032 7.96967 8.96967L9.73744 10.7374C10.0656 10.4092 10.25 9.96413 10.25 9.5H7.75ZM7.96967 8.96967C8.11032 8.82902 8.30109 8.75 8.5 8.75V11.25C8.96413 11.25 9.40925 11.0656 9.73744 10.7374L7.96967 8.96967ZM8.5 8.75H2.5V11.25H8.5V8.75ZM2.5 8.75C2.69891 8.75 2.88968 8.82902 3.03033 8.96967L1.26256 10.7374C1.59075 11.0656 2.03587 11.25 2.5 11.25V8.75ZM3.03033 8.96967C3.17098 9.11032 3.25 9.30109 3.25 9.5H0.75C0.75 9.96413 0.934374 10.4092 1.26256 10.7374L3.03033 8.96967ZM3.25 12.5C3.25 12.6989 3.17098 12.8897 3.03033 13.0303L1.26256 11.2626C0.934374 11.5908 0.75 12.0359 0.75 12.5H3.25ZM3.03033 13.0303C2.88968 13.171 2.69891 13.25 2.5 13.25V10.75C2.03587 10.75 1.59075 10.9344 1.26256 11.2626L3.03033 13.0303ZM2.5 13.25H13.5V10.75H2.5V13.25ZM13.5 13.25C13.3011 13.25 13.1103 13.171 12.9697 13.0303L14.7374 11.2626C14.4092 10.9344 13.9641 10.75 13.5 10.75V13.25ZM12.9697 13.0303C12.829 12.8897 12.75 12.6989 12.75 12.5H15.25C15.25 12.0359 15.0656 11.5908 14.7374 11.2626L12.9697 13.0303ZM12.75 12.5C12.75 12.3011 12.829 12.1103 12.9697 11.9697L14.7374 13.7374C15.0656 13.4092 15.25 12.9641 15.25 12.5H12.75ZM12.9697 11.9697C13.1103 11.829 13.3011 11.75 13.5 11.75V14.25C13.9641 14.25 14.4092 14.0656 14.7374 13.7374L12.9697 11.9697ZM13.5 11.75H2.5V14.25H13.5V11.75ZM2.5 11.75C2.69891 11.75 2.88968 11.829 3.03033 11.9697L1.26256 13.7374C1.59075 14.0656 2.03587 14.25 2.5 14.25V11.75ZM3.03033 11.9697C3.17098 12.1103 3.25 12.3011 3.25 12.5H0.75C0.75 12.9641 0.934374 13.4092 1.26256 13.7374L3.03033 11.9697Z"
          fill="#7F7F7F"
          strokeWidth="1.25"
          mask="url(#path-1-inside-1_2581_1252)"
        />
      </svg>
    );
  };

  const PageBreakSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_2376_7709)">
          <path
            className="stroke-highlighter"
            d="M14 4.5V9H13V4.5H11C10.6022 4.5 10.2206 4.34196 9.93934 4.06066C9.65804 3.77936 9.5 3.39782 9.5 3V1H4C3.73478 1 3.48043 1.10536 3.29289 1.29289C3.10536 1.48043 3 1.73478 3 2V9H2V2C2 1.46957 2.21071 0.960859 2.58579 0.585786C2.96086 0.210714 3.46957 0 4 0L9.5 0L14 4.5ZM13 12H14V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16H4C3.46957 16 2.96086 15.7893 2.58579 15.4142C2.21071 15.0391 2 14.5304 2 14V12H3V14C3 14.2652 3.10536 14.5196 3.29289 14.7071C3.48043 14.8946 3.73478 15 4 15H12C12.2652 15 12.5196 14.8946 12.7071 14.7071C12.8946 14.5196 13 14.2652 13 14V12ZM0.5 10C0.367392 10 0.240215 10.0527 0.146447 10.1464C0.0526784 10.2402 0 10.3674 0 10.5C0 10.6326 0.0526784 10.7598 0.146447 10.8536C0.240215 10.9473 0.367392 11 0.5 11H15.5C15.6326 11 15.7598 10.9473 15.8536 10.8536C15.9473 10.7598 16 10.6326 16 10.5C16 10.3674 15.9473 10.2402 15.8536 10.1464C15.7598 10.0527 15.6326 10 15.5 10H0.5Z"
            fill="#7F7F7F"
          />
        </g>
        <defs>
          <clipPath id="clip0_2376_7709">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const MarginSvg = () => {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M3.90909 1V17M14.0909 1V17M1 3.90909H17M1 14.0909H17M1.66667 17H16.3333C16.7015 17 17 16.6744 17 16.2727V1.72727C17 1.32561 16.7015 1 16.3333 1H1.66667C1.29848 1 1 1.32561 1 1.72727V16.2727C1 16.6744 1.29848 17 1.66667 17Z"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const OrientationSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          d="M16 10.4444V14.8889C16 15.1836 15.8703 15.4662 15.6395 15.6746C15.4087 15.8829 15.0957 16 14.7692 16H4.92308C4.59666 16 4.28361 15.8829 4.05279 15.6746C3.82198 15.4662 3.69231 15.1836 3.69231 14.8889V8.22222C3.69231 7.92754 3.82198 7.64492 4.05279 7.43655C4.28361 7.22817 4.59666 7.11111 4.92308 7.11111H12.3077L16 10.4444ZM4.92308 8.22222V14.8889H14.7692V11H11.6923V8.22222H4.92308Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M6.15385 1.18519L1.23077 1.18519C0.904349 1.18519 0.591298 1.31005 0.360484 1.53232C0.12967 1.75458 0 2.05604 0 2.37037V11.8519C0 12.1662 0.12967 12.4676 0.360484 12.6899C0.591298 12.9122 0.904349 13.037 1.23077 13.037H8.61539C8.9418 13.037 9.25486 12.9122 9.48567 12.6899C9.71648 12.4676 9.84615 12.1662 9.84615 11.8519V4.74074L6.15385 1.18519ZM8.61539 11.8519H1.23077V2.37037H5.53846V5.33333H8.61539V11.8519Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const PageSizeSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-highlighter"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.8609 0H3.33913C3.26261 0 3.2 0.0631579 3.2 0.140351V1.19298C3.2 1.27018 3.26261 1.33333 3.33913 1.33333H15.8609C15.9374 1.33333 16 1.27018 16 1.19298V0.140351C16 0.0631579 15.9374 0 15.8609 0ZM0 2.81159V15.8551C0 15.9348 0.0757895 16 0.168421 16H1.43158C1.52421 16 1.6 15.9348 1.6 15.8551V2.81159C1.6 2.73188 1.52421 2.66667 1.43158 2.66667H0.168421C0.0757895 2.66667 0 2.73188 0 2.81159ZM14.4 7.22L10.536 4H4.8V14.6667H14.4V7.22ZM4.8 2.66667H11.2L16 6.66667V14.6667C16 15.4 15.28 16 14.4 16H4.8C3.92 16 3.2 15.4 3.2 14.6667V4C3.2 3.26667 3.92 2.66667 4.8 2.66667Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const TrackChangeSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M13.3332 7.66665V4.66665L10.3332 1.33331H3.33317C2.96498 1.33331 2.6665 1.63179 2.6665 1.99998V14C2.6665 14.3682 2.96498 14.6666 3.33317 14.6666H7.33317"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="stroke-hover"
          d="M10.6668 14.6667L14.0002 11.3333L12.6668 10L9.3335 13.3333V14.6667H10.6668Z"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10 1.33331V4.66665H13.3333"
          stroke="#7F7F7F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const TableSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1385" fill="white">
          <path d="M1.75 14.75H14.25C14.3826 14.75 14.5098 14.6973 14.6036 14.6036C14.6973 14.5098 14.75 14.3826 14.75 14.25V1.75C14.75 1.61739 14.6973 1.49021 14.6036 1.39645C14.5098 1.30268 14.3826 1.25 14.25 1.25H1.75C1.61739 1.25 1.49021 1.30268 1.39645 1.39645C1.30268 1.49021 1.25 1.61739 1.25 1.75V14.25C1.25 14.3826 1.30268 14.5098 1.39645 14.6036C1.49021 14.6973 1.61739 14.75 1.75 14.75ZM8.5 2.25H13.75V7.5H8.5V2.25ZM8.5 8.5H13.75V13.75H8.5V8.5ZM2.25 2.25H7.5V7.5H2.25V2.25ZM2.25 8.5H7.5V13.75H2.25V8.5Z" />
        </mask>
        <path
          className="stroke-highlighter"
          d="M1.75 14.75H14.25C14.3826 14.75 14.5098 14.6973 14.6036 14.6036C14.6973 14.5098 14.75 14.3826 14.75 14.25V1.75C14.75 1.61739 14.6973 1.49021 14.6036 1.39645C14.5098 1.30268 14.3826 1.25 14.25 1.25H1.75C1.61739 1.25 1.49021 1.30268 1.39645 1.39645C1.30268 1.49021 1.25 1.61739 1.25 1.75V14.25C1.25 14.3826 1.30268 14.5098 1.39645 14.6036C1.49021 14.6973 1.61739 14.75 1.75 14.75ZM8.5 2.25H13.75V7.5H8.5V2.25ZM8.5 8.5H13.75V13.75H8.5V8.5ZM2.25 2.25H7.5V7.5H2.25V2.25ZM2.25 8.5H7.5V13.75H2.25V8.5Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M14.25 1.25V0V1.25ZM1.75 1.25V0V1.25ZM1.25 1.75H0H1.25ZM1.25 14.25H0H1.25ZM8.5 2.25V1H7.25V2.25H8.5ZM13.75 2.25H15V1H13.75V2.25ZM13.75 7.5V8.75H15V7.5H13.75ZM8.5 7.5H7.25V8.75H8.5V7.5ZM8.5 8.5V7.25H7.25V8.5H8.5ZM13.75 8.5H15V7.25H13.75V8.5ZM13.75 13.75V15H15V13.75H13.75ZM8.5 13.75H7.25V15H8.5V13.75ZM2.25 2.25V1H1V2.25H2.25ZM7.5 2.25H8.75V1H7.5V2.25ZM7.5 7.5V8.75H8.75V7.5H7.5ZM2.25 7.5H1V8.75H2.25V7.5ZM2.25 8.5V7.25H1V8.5H2.25ZM7.5 8.5H8.75V7.25H7.5V8.5ZM7.5 13.75V15H8.75V13.75H7.5ZM2.25 13.75H1V15H2.25V13.75ZM1.75 16H14.25V13.5H1.75V16ZM14.25 16C14.7141 16 15.1592 15.8156 15.4874 15.4874L13.7197 13.7197C13.8603 13.579 14.0511 13.5 14.25 13.5V16ZM15.4874 15.4874C15.8156 15.1592 16 14.7141 16 14.25H13.5C13.5 14.0511 13.579 13.8603 13.7197 13.7197L15.4874 15.4874ZM16 14.25V1.75H13.5V14.25H16ZM16 1.75C16 1.28587 15.8156 0.840754 15.4874 0.512563L13.7197 2.28033C13.579 2.13968 13.5 1.94891 13.5 1.75H16ZM15.4874 0.512563C15.1592 0.184374 14.7141 0 14.25 0V2.5C14.0511 2.5 13.8603 2.42098 13.7197 2.28033L15.4874 0.512563ZM14.25 0H1.75V2.5H14.25V0ZM1.75 0C1.28587 0 0.840752 0.184374 0.512563 0.512563L2.28033 2.28033C2.13968 2.42098 1.94891 2.5 1.75 2.5V0ZM0.512563 0.512563C0.184374 0.840752 0 1.28587 0 1.75H2.5C2.5 1.94891 2.42098 2.13968 2.28033 2.28033L0.512563 0.512563ZM0 1.75V14.25H2.5V1.75H0ZM0 14.25C0 14.7141 0.184374 15.1592 0.512563 15.4874L2.28033 13.7197C2.42098 13.8603 2.5 14.0511 2.5 14.25H0ZM0.512563 15.4874C0.840754 15.8156 1.28587 16 1.75 16V13.5C1.94891 13.5 2.13968 13.579 2.28033 13.7197L0.512563 15.4874ZM8.5 3.5H13.75V1H8.5V3.5ZM12.5 2.25V7.5H15V2.25H12.5ZM13.75 6.25H8.5V8.75H13.75V6.25ZM9.75 7.5V2.25H7.25V7.5H9.75ZM8.5 9.75H13.75V7.25H8.5V9.75ZM12.5 8.5V13.75H15V8.5H12.5ZM13.75 12.5H8.5V15H13.75V12.5ZM9.75 13.75V8.5H7.25V13.75H9.75ZM2.25 3.5H7.5V1H2.25V3.5ZM6.25 2.25V7.5H8.75V2.25H6.25ZM7.5 6.25H2.25V8.75H7.5V6.25ZM3.5 7.5V2.25H1V7.5H3.5ZM2.25 9.75H7.5V7.25H2.25V9.75ZM6.25 8.5V13.75H8.75V8.5H6.25ZM7.5 12.5H2.25V15H7.5V12.5ZM3.5 13.75V8.5H1V13.75H3.5Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2581_1385)"
        />
      </svg>
    );
  };

  const LinkSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_2510_956)">
          <mask id="path-1-inside-1_2510_956" fill="white">
            <path d="M14.2959 1.74481C12.6388 0.0877485 9.94252 0.0877485 8.28549 1.74481L5.28027 4.75003L5.98743 5.45712L8.99259 2.4519C9.60208 1.84241 10.4287 1.5 11.2907 1.50001C12.1526 1.50001 12.9793 1.84242 13.5888 2.45192C14.1983 3.06142 14.5407 3.88807 14.5407 4.75002C14.5407 5.61198 14.1983 6.43863 13.5888 7.04812L10.5836 10.0533L11.2906 10.7604L14.2958 7.75522C15.9531 6.09816 15.9531 3.4019 14.2959 1.74481Z" />
          </mask>
          <path
            className="fill-hover"
            d="M14.2959 1.74481C12.6388 0.0877485 9.94252 0.0877485 8.28549 1.74481L5.28027 4.75003L5.98743 5.45712L8.99259 2.4519C9.60208 1.84241 10.4287 1.5 11.2907 1.50001C12.1526 1.50001 12.9793 1.84242 13.5888 2.45192C14.1983 3.06142 14.5407 3.88807 14.5407 4.75002C14.5407 5.61198 14.1983 6.43863 13.5888 7.04812L10.5836 10.0533L11.2906 10.7604L14.2958 7.75522C15.9531 6.09816 15.9531 3.4019 14.2959 1.74481Z"
            fill="#7F7F7F"
          />
          <path
            className="fill-hover"
            d="M14.2959 1.74481L13.412 2.62869L13.412 2.62872L14.2959 1.74481ZM8.28549 1.74481L9.16938 2.62869L9.16938 2.62869L8.28549 1.74481ZM5.28027 4.75003L4.39639 3.86615L3.51247 4.75007L4.39643 5.63395L5.28027 4.75003ZM5.98743 5.45712L5.10359 6.34105L5.98748 7.22486L6.87132 6.341L5.98743 5.45712ZM8.99259 2.4519L8.10871 1.56802L8.10869 1.56803L8.99259 2.4519ZM13.5888 7.04812L12.7049 6.16424L12.7049 6.16424L13.5888 7.04812ZM10.5836 10.0533L9.69967 9.16946L8.81585 10.0533L9.69961 10.9372L10.5836 10.0533ZM11.2906 10.7604L10.4066 11.6443L11.2905 12.5283L12.1744 11.6443L11.2906 10.7604ZM14.2958 7.75522L13.4119 6.87128L13.4119 6.87133L14.2958 7.75522ZM15.1798 0.860928C13.0345 -1.28429 9.54679 -1.2843 7.4016 0.860936L9.16938 2.62869C10.3383 1.45979 12.2431 1.45978 13.412 2.62869L15.1798 0.860928ZM7.40161 0.860928L4.39639 3.86615L6.16416 5.63391L9.16938 2.62869L7.40161 0.860928ZM4.39643 5.63395L5.10359 6.34105L6.87127 4.5732L6.16412 3.86611L4.39643 5.63395ZM6.87132 6.341L9.87648 3.33578L8.10869 1.56803L5.10354 4.57325L6.87132 6.341ZM9.87647 3.33579C10.2515 2.96072 10.7603 2.75001 11.2907 2.75001L11.2907 0.250008C10.0972 0.250004 8.95262 0.724106 8.10871 1.56802L9.87647 3.33579ZM11.2907 2.75001C11.8211 2.75001 12.3298 2.96073 12.7049 3.3358L14.4727 1.56804C13.6288 0.724122 12.4842 0.250012 11.2907 0.250008L11.2907 2.75001ZM12.7049 3.3358C13.08 3.71088 13.2907 4.21959 13.2907 4.75002L15.7907 4.75003C15.7907 3.55655 15.3166 2.41196 14.4727 1.56804L12.7049 3.3358ZM13.2907 4.75002C13.2907 5.28046 13.08 5.78916 12.7049 6.16424L14.4727 7.93201C15.3166 7.0881 15.7907 5.9435 15.7907 4.75003L13.2907 4.75002ZM12.7049 6.16424L9.69967 9.16946L11.4674 10.9372L14.4727 7.93201L12.7049 6.16424ZM9.69961 10.9372L10.4066 11.6443L12.1745 9.87661L11.4675 9.16952L9.69961 10.9372ZM12.1744 11.6443L15.1797 8.6391L13.4119 6.87133L10.4067 9.87655L12.1744 11.6443ZM15.1796 8.63916C17.3251 6.49393 17.3251 3.00616 15.1797 0.860903L13.412 2.62872C14.581 3.79765 14.581 5.70238 13.4119 6.87128L15.1796 8.63916Z"
            fill="#7F7F7F"
            mask="url(#path-1-inside-1_2510_956)"
          />
          <mask id="path-3-inside-2_2510_956" fill="white">
            <path d="M7.04794 13.5889C6.43844 14.1984 5.61179 14.5408 4.74984 14.5408C3.88789 14.5408 3.06124 14.1984 2.45175 13.5889C1.84226 12.9794 1.49985 12.1528 1.49985 11.2908C1.49985 10.4289 1.84226 9.60221 2.45175 8.99272L5.28022 6.16425L4.57312 5.45715L1.74462 8.28562C1.34843 8.67993 1.03392 9.14852 0.819092 9.66456C0.604264 10.1806 0.493342 10.7339 0.492679 11.2929C0.492015 11.8519 0.601623 12.4055 0.815225 12.922C1.02883 13.4386 1.34223 13.9079 1.73748 14.3032C2.13273 14.6984 2.60207 15.0118 3.11862 15.2254C3.63517 15.439 4.18877 15.5486 4.74774 15.548C5.30671 15.5473 5.86006 15.4364 6.3761 15.2215C6.89213 15.0067 7.36072 14.6922 7.75503 14.296L10.5835 11.4676L9.87637 10.7605L7.04794 13.5889Z" />
          </mask>
          <path
            className="fill-hover"
            d="M7.04794 13.5889C6.43844 14.1984 5.61179 14.5408 4.74984 14.5408C3.88789 14.5408 3.06124 14.1984 2.45175 13.5889C1.84226 12.9794 1.49985 12.1528 1.49985 11.2908C1.49985 10.4289 1.84226 9.60221 2.45175 8.99272L5.28022 6.16425L4.57312 5.45715L1.74462 8.28562C1.34843 8.67993 1.03392 9.14852 0.819092 9.66456C0.604264 10.1806 0.493342 10.7339 0.492679 11.2929C0.492015 11.8519 0.601623 12.4055 0.815225 12.922C1.02883 13.4386 1.34223 13.9079 1.73748 14.3032C2.13273 14.6984 2.60207 15.0118 3.11862 15.2254C3.63517 15.439 4.18877 15.5486 4.74774 15.548C5.30671 15.5473 5.86006 15.4364 6.3761 15.2215C6.89213 15.0067 7.36072 14.6922 7.75503 14.296L10.5835 11.4676L9.87637 10.7605L7.04794 13.5889Z"
            fill="#7F7F7F"
          />
          <path
            className="fill-hover"
            d="M7.04794 13.5889L7.93182 14.4728L7.93182 14.4728L7.04794 13.5889ZM4.74984 14.5408V13.2908V14.5408ZM2.45175 8.99272L1.56786 8.10883L1.56786 8.10883L2.45175 8.99272ZM5.28022 6.16425L6.1641 7.04813L7.04798 6.16425L6.1641 5.28036L5.28022 6.16425ZM4.57312 5.45715L5.45701 4.57327L4.57313 3.68939L3.68924 4.57327L4.57312 5.45715ZM1.74462 8.28562L2.62641 9.17161L2.6285 9.16951L1.74462 8.28562ZM7.75503 14.296L6.87114 13.4121L6.86904 13.4142L7.75503 14.296ZM10.5835 11.4676L11.4674 12.3514L12.3512 11.4676L11.4674 10.5837L10.5835 11.4676ZM9.87637 10.7605L10.7603 9.87658L9.87637 8.9927L8.99249 9.87658L9.87637 10.7605ZM6.16405 12.705C5.78898 13.0801 5.28027 13.2908 4.74984 13.2908V15.7908C5.94332 15.7908 7.08791 15.3167 7.93182 14.4728L6.16405 12.705ZM4.74984 13.2908C4.21941 13.2908 3.7107 13.0801 3.33563 12.705L1.56787 14.4728C2.41178 15.3167 3.55637 15.7908 4.74984 15.7908V13.2908ZM3.33563 12.705C2.96056 12.3299 2.74985 11.8212 2.74985 11.2908H0.249849C0.249849 12.4843 0.723952 13.6289 1.56786 14.4728L3.33563 12.705ZM2.74985 11.2908C2.74985 10.7604 2.96056 10.2517 3.33563 9.8766L1.56786 8.10883C0.723953 8.95275 0.249849 10.0973 0.249849 11.2908H2.74985ZM3.33563 9.8766L6.1641 7.04813L4.39633 5.28036L1.56786 8.10883L3.33563 9.8766ZM6.1641 5.28036L5.45701 4.57327L3.68924 6.34104L4.39633 7.04813L6.1641 5.28036ZM3.68924 4.57327L0.860745 7.40173L2.6285 9.16951L5.457 6.34104L3.68924 4.57327ZM0.862843 7.39964C0.350128 7.90992 -0.0568902 8.51634 -0.334903 9.18415L1.97309 10.145C2.12473 9.78071 2.34674 9.44994 2.6264 9.1716L0.862843 7.39964ZM-0.334903 9.18415C-0.612916 9.85196 -0.756462 10.5681 -0.75732 11.2914L1.74268 11.2944C1.74315 10.8998 1.82144 10.5092 1.97309 10.145L-0.334903 9.18415ZM-0.75732 11.2914C-0.758179 12.0148 -0.616334 12.7312 -0.339907 13.3997L1.97036 12.4444C1.81958 12.0797 1.74221 11.689 1.74268 11.2944L-0.75732 11.2914ZM-0.339907 13.3997C-0.0634806 14.0682 0.342097 14.6756 0.853599 15.1871L2.62136 13.4193C2.34236 13.1403 2.12114 12.809 1.97036 12.4444L-0.339907 13.3997ZM0.853599 15.1871C1.3651 15.6986 1.97248 16.1041 2.64095 16.3806L3.59628 14.0703C3.23166 13.9195 2.90036 13.6983 2.62136 13.4193L0.853599 15.1871ZM2.64095 16.3806C3.30943 16.657 4.02586 16.7988 4.74923 16.798L4.74625 14.298C4.35168 14.2984 3.9609 14.2211 3.59628 14.0703L2.64095 16.3806ZM4.74923 16.798C5.4726 16.7971 6.1887 16.6535 6.85651 16.3755L5.89568 14.0675C5.53142 14.2192 5.14082 14.2975 4.74625 14.298L4.74923 16.798ZM6.85651 16.3755C7.52432 16.0975 8.13073 15.6905 8.64102 15.1778L6.86904 13.4142C6.59071 13.6939 6.25994 13.9159 5.89568 14.0675L6.85651 16.3755ZM8.63891 15.1799L11.4674 12.3514L9.69958 10.5837L6.87115 13.4121L8.63891 15.1799ZM11.4674 10.5837L10.7603 9.87658L8.99249 11.6444L9.69958 12.3514L11.4674 10.5837ZM8.99249 9.87658L6.16405 12.705L7.93182 14.4728L10.7603 11.6444L8.99249 9.87658Z"
            fill="#7F7F7F"
            mask="url(#path-3-inside-2_2510_956)"
          />
          <mask id="path-5-inside-3_2510_956" fill="white">
            <path d="M11.114 4.21959L4.04297 11.2906L4.75008 11.9978L11.8212 4.9267L11.114 4.21959Z" />
          </mask>
          <path
            className="fill-hover"
            d="M11.114 4.21959L4.04297 11.2906L4.75008 11.9978L11.8212 4.9267L11.114 4.21959Z"
            fill="#7F7F7F"
          />
          <path
            className="fill-hover"
            d="M4.04297 11.2906L3.15908 10.4068L2.2752 11.2906L3.15908 12.1745L4.04297 11.2906ZM11.114 4.21959L11.9979 3.33571L11.114 2.45183L10.2302 3.33571L11.114 4.21959ZM11.8212 4.9267L12.705 5.81058L13.5889 4.9267L12.705 4.04282L11.8212 4.9267ZM4.75008 11.9978L3.86619 12.8816L4.75008 13.7655L5.63396 12.8816L4.75008 11.9978ZM4.92685 12.1745L11.9979 5.10347L10.2302 3.33571L3.15908 10.4068L4.92685 12.1745ZM10.2302 5.10347L10.9373 5.81058L12.705 4.04282L11.9979 3.33571L10.2302 5.10347ZM10.9373 4.04282L3.86619 11.1139L5.63396 12.8816L12.705 5.81058L10.9373 4.04282ZM5.63396 11.1139L4.92685 10.4068L3.15908 12.1745L3.86619 12.8816L5.63396 11.1139Z"
            fill="#7F7F7F"
            mask="url(#path-5-inside-3_2510_956)"
          />
        </g>
        <defs>
          <clipPath id="clip0_2510_956">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const PictureSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1395" fill="white">
          <path d="M1.25 14.75H14.75V1.25H1.25V14.75ZM13.75 10.8794L10.2696 7.39903L11.7259 5.94278L13.75 7.96672V10.8794ZM2.25 2.25H13.75V6.5525L11.726 4.52844L9.5625 6.69194L6.4375 3.56694L2.25 7.75444V2.25ZM2.25 9.16875L6.4375 4.98125L13.75 12.2937V13.75H2.25V9.16875Z" />
        </mask>
        <path
          className="stroke-highlighter"
          d="M1.25 14.75H14.75V1.25H1.25V14.75ZM13.75 10.8794L10.2696 7.39903L11.7259 5.94278L13.75 7.96672V10.8794ZM2.25 2.25H13.75V6.5525L11.726 4.52844L9.5625 6.69194L6.4375 3.56694L2.25 7.75444V2.25ZM2.25 9.16875L6.4375 4.98125L13.75 12.2937V13.75H2.25V9.16875Z"
          fill="#7F7F7F"
        />
        <path
          className="stroke-highlighter"
          d="M1.25 14.75H0V16H1.25V14.75ZM14.75 14.75V16H16V14.75H14.75ZM14.75 1.25H16V0H14.75V1.25ZM1.25 1.25V0H0V1.25H1.25ZM13.75 10.8794L12.8661 11.7633L15 13.8972V10.8794H13.75ZM10.2696 7.39903L9.38574 6.51515L8.50186 7.39903L9.38574 8.28291L10.2696 7.39903ZM11.7259 5.94278L12.6097 5.05886L11.7258 4.17506L10.842 5.0589L11.7259 5.94278ZM13.75 7.96672H15V7.44892L14.6338 7.08279L13.75 7.96672ZM2.25 2.25V1H1V2.25H2.25ZM13.75 2.25H15V1H13.75V2.25ZM13.75 6.5525L12.8661 7.43638L15 9.5703V6.5525H13.75ZM11.726 4.52844L12.6099 3.64456L11.726 2.76066L10.8421 3.64456L11.726 4.52844ZM9.5625 6.69194L8.67862 7.57582L9.56251 8.45971L10.4464 7.57581L9.5625 6.69194ZM6.4375 3.56694L7.32138 2.68305L6.4375 1.79917L5.55362 2.68305L6.4375 3.56694ZM2.25 7.75444H1V10.7722L3.13388 8.63832L2.25 7.75444ZM2.25 9.16875L1.36612 8.28487L1 8.65098V9.16875H2.25ZM6.4375 4.98125L7.32138 4.09737L6.4375 3.21348L5.55362 4.09737L6.4375 4.98125ZM13.75 12.2937H15V11.776L14.6339 11.4099L13.75 12.2937ZM13.75 13.75V15H15V13.75H13.75ZM2.25 13.75H1V15H2.25V13.75ZM1.25 16H14.75V13.5H1.25V16ZM16 14.75V1.25H13.5V14.75H16ZM14.75 0H1.25V2.5H14.75V0ZM0 1.25V14.75H2.5V1.25H0ZM14.6339 9.99556L11.1535 6.51515L9.38574 8.28291L12.8661 11.7633L14.6339 9.99556ZM11.1535 8.28291L12.6098 6.82666L10.842 5.0589L9.38574 6.51515L11.1535 8.28291ZM10.842 6.82671L12.8662 8.85064L14.6338 7.08279L12.6097 5.05886L10.842 6.82671ZM12.5 7.96672V10.8794H15V7.96672H12.5ZM2.25 3.5H13.75V1H2.25V3.5ZM12.5 2.25V6.5525H15V2.25H12.5ZM14.6339 5.66862L12.6099 3.64456L10.8421 5.41231L12.8661 7.43638L14.6339 5.66862ZM10.8421 3.64456L8.67861 5.80806L10.4464 7.57581L12.6099 5.41231L10.8421 3.64456ZM10.4464 5.80805L7.32138 2.68305L5.55362 4.45082L8.67862 7.57582L10.4464 5.80805ZM5.55362 2.68305L1.36612 6.87055L3.13388 8.63832L7.32138 4.45082L5.55362 2.68305ZM3.5 7.75444V2.25H1V7.75444H3.5ZM3.13388 10.0526L7.32138 5.86513L5.55362 4.09737L1.36612 8.28487L3.13388 10.0526ZM5.55362 5.86513L12.8661 13.1776L14.6339 11.4099L7.32138 4.09737L5.55362 5.86513ZM12.5 12.2937V13.75H15V12.2937H12.5ZM13.75 12.5H2.25V15H13.75V12.5ZM3.5 13.75V9.16875H1V13.75H3.5Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2581_1395)"
        />
      </svg>
    );
  };

  const MediaSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_2581_1400)">
          <path
            className="stroke-highlighter"
            d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0L15 0C15.2652 0 15.5196 0.105357 15.7071 0.292893C15.8946 0.48043 16 0.734784 16 1V15C16 15.2652 15.8946 15.5196 15.7071 15.7071C15.5196 15.8946 15.2652 16 15 16H1C0.734784 16 0.48043 15.8946 0.292893 15.7071C0.105357 15.5196 0 15.2652 0 15V1ZM4 1V7H12V1H4ZM12 9H4V15H12V9ZM1 1V3H3V1H1ZM3 4H1V6H3V4ZM1 7V9H3V7H1ZM3 10H1V12H3V10ZM1 13V15H3V13H1ZM15 1H13V3H15V1ZM13 4V6H15V4H13ZM15 7H13V9H15V7ZM13 10V12H15V10H13ZM15 13H13V15H15V13Z"
            fill="#7F7F7F"
          />
        </g>
        <defs>
          <clipPath id="clip0_2581_1400">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const FormulaSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <mask id="path-1-inside-1_2581_1405" fill="white">
          <path d="M12.5636 6.45147L10.4533 8.49141L10.3581 8.04669L10.3568 8.04044C10.2601 7.6167 10.0269 7.23645 9.69308 6.95819C9.35922 6.67993 8.94318 6.51908 8.50897 6.50037L8.49869 6.49994H6.39919L6.98813 3.75969C7.03616 3.55221 7.15029 3.36595 7.31333 3.22894C7.47638 3.09193 7.67951 3.01159 7.89216 3H9.38081V2H7.88081L7.86022 2.00044C7.42601 2.01918 7.00998 2.18007 6.67614 2.45835C6.34229 2.73663 6.10913 3.11689 6.0125 3.54063L5.37638 6.5H2.75V7.5H5.16144L4.14269 12.2402C4.09466 12.4477 3.98054 12.634 3.8175 12.771C3.65445 12.9081 3.45131 12.9884 3.23866 13H1.75V14H3.26028L3.27056 13.9996C3.70477 13.9808 4.12081 13.82 4.45467 13.5417C4.78853 13.2635 5.02172 12.8832 5.11838 12.4595L6.18438 7.5H8.47716C8.68974 7.51161 8.89281 7.59192 9.05582 7.72887C9.21882 7.86581 9.33296 8.05198 9.38106 8.25937L9.60606 9.31059L6.04784 12.75H7.48666L9.85263 10.4629L10.0111 11.2033L10.0124 11.2096C10.109 11.6333 10.3422 12.0135 10.6761 12.2918C11.01 12.5701 11.426 12.7309 11.8602 12.7496L13.5 12.75V11.75H11.8922C11.6796 11.7384 11.4765 11.6581 11.3135 11.5212C11.1504 11.3842 11.0363 11.198 10.9882 10.9906L10.7 9.64375L14.0024 6.45147H12.5636Z" />
        </mask>
        <path
          className="fill-hover"
          d="M12.5636 6.45147L10.4533 8.49141L10.3581 8.04669L10.3568 8.04044C10.2601 7.6167 10.0269 7.23645 9.69308 6.95819C9.35922 6.67993 8.94318 6.51908 8.50897 6.50037L8.49869 6.49994H6.39919L6.98813 3.75969C7.03616 3.55221 7.15029 3.36595 7.31333 3.22894C7.47638 3.09193 7.67951 3.01159 7.89216 3H9.38081V2H7.88081L7.86022 2.00044C7.42601 2.01918 7.00998 2.18007 6.67614 2.45835C6.34229 2.73663 6.10913 3.11689 6.0125 3.54063L5.37638 6.5H2.75V7.5H5.16144L4.14269 12.2402C4.09466 12.4477 3.98054 12.634 3.8175 12.771C3.65445 12.9081 3.45131 12.9884 3.23866 13H1.75V14H3.26028L3.27056 13.9996C3.70477 13.9808 4.12081 13.82 4.45467 13.5417C4.78853 13.2635 5.02172 12.8832 5.11838 12.4595L6.18438 7.5H8.47716C8.68974 7.51161 8.89281 7.59192 9.05582 7.72887C9.21882 7.86581 9.33296 8.05198 9.38106 8.25937L9.60606 9.31059L6.04784 12.75H7.48666L9.85263 10.4629L10.0111 11.2033L10.0124 11.2096C10.109 11.6333 10.3422 12.0135 10.6761 12.2918C11.01 12.5701 11.426 12.7309 11.8602 12.7496L13.5 12.75V11.75H11.8922C11.6796 11.7384 11.4765 11.6581 11.3135 11.5212C11.1504 11.3842 11.0363 11.198 10.9882 10.9906L10.7 9.64375L14.0024 6.45147H12.5636Z"
          fill="#7F7F7F"
        />
        <path
          className="fill-hover"
          d="M12.5636 6.45147V5.20147H12.0582L11.6948 5.55274L12.5636 6.45147ZM10.4533 8.49141L9.231 8.75303L9.70248 10.9558L11.3221 9.39014L10.4533 8.49141ZM10.3581 8.04669L11.5805 7.78506L11.5789 7.77805L10.3581 8.04669ZM10.3568 8.04044L11.5776 7.77179L11.5755 7.76252L10.3568 8.04044ZM8.50897 6.50037L8.56275 5.25153L8.56209 5.2515L8.50897 6.50037ZM8.49869 6.49994L8.55181 5.25107L8.52526 5.24994H8.49869V6.49994ZM6.39919 6.49994L5.17709 6.23728L4.85199 7.74994H6.39919V6.49994ZM6.98813 3.75969L5.77034 3.47772L5.76811 3.48736L5.76603 3.49703L6.98813 3.75969ZM7.89216 3V1.75H7.85812L7.82414 1.75185L7.89216 3ZM9.38081 3V4.25H10.6308V3H9.38081ZM9.38081 2H10.6308V0.75H9.38081V2ZM7.88081 2V0.75H7.86754L7.85426 0.750282L7.88081 2ZM7.86022 2.00044L7.83367 0.750719L7.81998 0.75101L7.8063 0.751601L7.86022 2.00044ZM6.0125 3.54063L4.79378 3.26272L4.79205 3.27032L4.79041 3.27793L6.0125 3.54063ZM5.37638 6.5V7.75H6.38624L6.59846 6.76269L5.37638 6.5ZM2.75 6.5V5.25H1.5V6.5H2.75ZM2.75 7.5H1.5V8.75H2.75V7.5ZM5.16144 7.5L6.38353 7.76265L6.70862 6.25H5.16144V7.5ZM4.14269 12.2402L5.36049 12.5221L5.36271 12.5125L5.36478 12.5029L4.14269 12.2402ZM3.23866 13V14.25H3.2727L3.30669 14.2481L3.23866 13ZM1.75 13V11.75H0.5V13H1.75ZM1.75 14H0.5V15.25H1.75V14ZM3.26028 14V15.25H3.28688L3.31345 15.2489L3.26028 14ZM3.27056 13.9996L3.32374 15.2484L3.3244 15.2484L3.27056 13.9996ZM5.11838 12.4595L6.33707 12.7375L6.33882 12.7298L6.34046 12.7222L5.11838 12.4595ZM6.18438 7.5V6.25H5.1745L4.96229 7.23732L6.18438 7.5ZM8.47716 7.5L8.5453 6.25186L8.51126 6.25H8.47716V7.5ZM9.38106 8.25937L10.6034 7.99775L10.6011 7.98734L10.5987 7.97696L9.38106 8.25937ZM9.60606 9.31059L10.4748 10.2094L10.9736 9.72726L10.8284 9.04897L9.60606 9.31059ZM6.04784 12.75L5.17909 11.8512L2.9561 14H6.04784V12.75ZM7.48666 12.75V14H7.99206L8.35543 13.6487L7.48666 12.75ZM9.85263 10.4629L11.075 10.2013L10.6036 7.99845L8.98385 9.56417L9.85263 10.4629ZM10.0111 11.2033L8.78874 11.4649L8.78899 11.4661L10.0111 11.2033ZM10.0124 11.2096L8.79034 11.4723L8.79197 11.4799L8.7937 11.4875L10.0124 11.2096ZM11.8602 12.7496L11.8064 13.9985L11.8332 13.9996L11.8599 13.9996L11.8602 12.7496ZM13.5 12.75L13.4997 14L14.75 14.0003V12.75H13.5ZM13.5 11.75H14.75V10.5H13.5V11.75ZM11.8922 11.75L11.8241 12.9981L11.8581 13H11.8922V11.75ZM10.9882 10.9906L9.76586 11.2522L9.76809 11.2626L9.7705 11.273L10.9882 10.9906ZM10.7 9.64375L9.83123 8.74501L9.33255 9.22706L9.47767 9.90529L10.7 9.64375ZM14.0024 6.45147L14.8712 7.35021L17.094 5.20147H14.0024V6.45147ZM11.6948 5.55274L9.58453 7.59268L11.3221 9.39014L13.4323 7.3502L11.6948 5.55274ZM11.6756 8.22978L11.5804 7.78506L9.13581 8.30831L9.231 8.75303L11.6756 8.22978ZM11.5789 7.77805L11.5775 7.7718L9.13596 8.30908L9.13733 8.31532L11.5789 7.77805ZM11.5755 7.76252C11.4179 7.07164 11.0377 6.45166 10.4934 5.99798L8.89278 7.9184C9.01615 8.02123 9.10233 8.16176 9.13804 8.31835L11.5755 7.76252ZM10.4934 5.99798C9.94905 5.54429 9.27072 5.28202 8.56275 5.25153L8.45518 7.74922C8.61565 7.75613 8.7694 7.81557 8.89278 7.9184L10.4934 5.99798ZM8.56209 5.2515L8.55181 5.25107L8.44557 7.74881L8.45585 7.74925L8.56209 5.2515ZM8.49869 5.24994H6.39919V7.74994H8.49869V5.24994ZM7.62128 6.76259L8.21022 4.02234L5.76603 3.49703L5.17709 6.23728L7.62128 6.76259ZM8.20591 4.04165C8.19285 4.09805 8.16183 4.14868 8.11751 4.18592L6.50916 2.27197C6.13876 2.58323 5.87948 3.00638 5.77034 3.47772L8.20591 4.04165ZM8.11751 4.18592C8.07319 4.22316 8.01798 4.245 7.96018 4.24815L7.82414 1.75185C7.34104 1.77818 6.87956 1.96071 6.50916 2.27197L8.11751 4.18592ZM7.89216 4.25H9.38081V1.75H7.89216V4.25ZM10.6308 3V2H8.13081V3H10.6308ZM9.38081 0.75H7.88081V3.25H9.38081V0.75ZM7.85426 0.750282L7.83367 0.750719L7.88677 3.25016L7.90736 3.24972L7.85426 0.750282ZM7.8063 0.751601C7.09836 0.782166 6.42008 1.04448 5.87578 1.49818L7.4765 3.41852C7.59989 3.31567 7.75365 3.2562 7.91414 3.24927L7.8063 0.751601ZM5.87578 1.49818C5.33148 1.95189 4.95132 2.57186 4.79378 3.26272L7.23122 3.81853C7.26693 3.66192 7.35311 3.52137 7.4765 3.41852L5.87578 1.49818ZM4.79041 3.27793L4.15429 6.23731L6.59846 6.76269L7.23459 3.80332L4.79041 3.27793ZM5.37638 5.25H2.75V7.75H5.37638V5.25ZM1.5 6.5V7.5H4V6.5H1.5ZM2.75 8.75H5.16144V6.25H2.75V8.75ZM3.93934 7.23735L2.92059 11.9776L5.36478 12.5029L6.38353 7.76265L3.93934 7.23735ZM2.92489 11.9584C2.93794 11.902 2.96896 11.8513 3.01328 11.8141L4.62171 13.728C4.99212 13.4167 5.25138 12.9935 5.36049 12.5221L2.92489 11.9584ZM3.01328 11.8141C3.0576 11.7768 3.11281 11.755 3.17062 11.7519L3.30669 14.2481C3.78981 14.2218 4.25131 14.0393 4.62171 13.728L3.01328 11.8141ZM3.23866 11.75H1.75V14.25H3.23866V11.75ZM0.5 13V14H3V13H0.5ZM1.75 15.25H3.26028V12.75H1.75V15.25ZM3.31345 15.2489L3.32374 15.2484L3.21739 12.7507L3.20711 12.7511L3.31345 15.2489ZM3.3244 15.2484C4.03234 15.2179 4.71064 14.9556 5.25497 14.5019L3.65437 12.5815C3.53098 12.6843 3.37721 12.7438 3.21672 12.7507L3.3244 15.2484ZM5.25497 14.5019C5.79929 14.0483 6.17949 13.4283 6.33707 12.7375L3.89968 12.1815C3.86395 12.3381 3.77777 12.4787 3.65437 12.5815L5.25497 14.5019ZM6.34046 12.7222L7.40646 7.76268L4.96229 7.23732L3.89629 12.1968L6.34046 12.7222ZM6.18438 8.75H8.47716V6.25H6.18438V8.75ZM8.40901 8.74814C8.35124 8.74499 8.29606 8.72316 8.25177 8.68595L9.85986 6.77178C9.48955 6.46068 9.02824 6.27823 8.5453 6.25186L8.40901 8.74814ZM8.25177 8.68595C8.20747 8.64874 8.17646 8.59815 8.16338 8.54179L10.5987 7.97696C10.4895 7.50582 10.2302 7.08289 9.85986 6.77178L8.25177 8.68595ZM8.15875 8.521L8.38375 9.57222L10.8284 9.04897L10.6034 7.99775L8.15875 8.521ZM8.73731 8.41183L5.17909 11.8512L6.91659 13.6488L10.4748 10.2094L8.73731 8.41183ZM6.04784 14H7.48666V11.5H6.04784V14ZM8.35543 13.6487L10.7214 11.3616L8.98385 9.56417L6.61788 11.8513L8.35543 13.6487ZM8.6303 10.7245L8.78874 11.4649L11.2334 10.9418L11.075 10.2013L8.6303 10.7245ZM8.78899 11.4661L8.79034 11.4723L11.2345 10.9468L11.2331 10.9405L8.78899 11.4661ZM8.7937 11.4875C8.95126 12.1784 9.33146 12.7983 9.8758 13.252L11.4764 11.3316C11.353 11.2288 11.2668 11.0882 11.2311 10.9316L8.7937 11.4875ZM9.8758 13.252C10.4201 13.7057 11.0985 13.968 11.8064 13.9985L11.914 11.5008C11.7535 11.4939 11.5998 11.4344 11.4764 11.3316L9.8758 13.252ZM11.8599 13.9996L13.4997 14L13.5003 11.5L11.8605 11.4996L11.8599 13.9996ZM14.75 12.75V11.75H12.25V12.75H14.75ZM13.5 10.5H11.8922V13H13.5V10.5ZM11.9602 10.5019C12.018 10.505 12.0732 10.5268 12.1175 10.564L10.5094 12.4783C10.8798 12.7894 11.3412 12.9718 11.8241 12.9981L11.9602 10.5019ZM12.1175 10.564C12.1618 10.6013 12.1928 10.6519 12.2059 10.7082L9.7705 11.273C9.87977 11.7442 10.1391 12.1672 10.5094 12.4783L12.1175 10.564ZM12.2105 10.7291L11.9223 9.38221L9.47767 9.90529L9.76586 11.2522L12.2105 10.7291ZM11.5688 10.5425L14.8712 7.35021L13.1336 5.55273L9.83123 8.74501L11.5688 10.5425ZM14.0024 5.20147H12.5636V7.70147H14.0024V5.20147Z"
          fill="#7F7F7F"
          mask="url(#path-1-inside-1_2581_1405)"
        />
      </svg>
    );
  };

  const SourceCodeSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M5.85392 4.85402C5.90041 4.80753 5.93728 4.75234 5.96244 4.6916C5.9876 4.63087 6.00055 4.56577 6.00055 4.50002C6.00055 4.43428 5.9876 4.36918 5.96244 4.30844C5.93728 4.2477 5.90041 4.19251 5.85392 4.14602C5.80743 4.09953 5.75224 4.06266 5.6915 4.0375C5.63076 4.01234 5.56566 3.99939 5.49992 3.99939C5.43417 3.99939 5.36907 4.01234 5.30833 4.0375C5.24759 4.06266 5.19241 4.09953 5.14592 4.14602L1.64592 7.64602C1.59935 7.69247 1.56241 7.74764 1.5372 7.80839C1.512 7.86913 1.49902 7.93425 1.49902 8.00002C1.49902 8.06579 1.512 8.13091 1.5372 8.19165C1.56241 8.2524 1.59935 8.30758 1.64592 8.35402L5.14592 11.854C5.2398 11.9479 5.36714 12.0007 5.49992 12.0007C5.63269 12.0007 5.76003 11.9479 5.85392 11.854C5.9478 11.7601 6.00055 11.6328 6.00055 11.5C6.00055 11.3672 5.9478 11.2399 5.85392 11.146L2.70692 8.00002L5.85392 4.85402ZM10.1459 4.85402C10.052 4.76013 9.99929 4.6328 9.99929 4.50002C9.99929 4.36725 10.052 4.23991 10.1459 4.14602C10.2398 4.05213 10.3671 3.99939 10.4999 3.99939C10.6327 3.99939 10.76 4.05213 10.8539 4.14602L14.3539 7.64602C14.4005 7.69247 14.4374 7.74764 14.4626 7.80839C14.4878 7.86913 14.5008 7.93425 14.5008 8.00002C14.5008 8.06579 14.4878 8.13091 14.4626 8.19165C14.4374 8.2524 14.4005 8.30758 14.3539 8.35402L10.8539 11.854C10.76 11.9479 10.6327 12.0007 10.4999 12.0007C10.3671 12.0007 10.2398 11.9479 10.1459 11.854C10.052 11.7601 9.99929 11.6328 9.99929 11.5C9.99929 11.3672 10.052 11.2399 10.1459 11.146L13.2929 8.00002L10.1459 4.85402Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const ClearFormattingSvg = () => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-hover"
          d="M8.4343 9.37693L7.73663 13.3333H6.38275L7.28329 8.226L2.34326 3.28595L3.28607 2.34314L13.657 12.7141L12.7142 13.6569L8.4343 9.37693ZM7.84863 5.02006L8.02849 3.99999H6.82856L5.49521 2.66666H13.3334V3.99999H9.38236L8.99956 6.17101L7.84863 5.02006Z"
          fill="#7F7F7F"
        />
      </svg>
    );
  };

  const DropdownImage = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="8"
        viewBox="0 0 11 8"
        fill="none"
      >
        <path
          className="hover-dropdown"
          d="M10 1.5L5.5 6.5L1 1.5"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const SelectDropdownImage = () => {
    return (
      <svg
        style={{
          position: "relative",
          right: "0.8rem",
          cursor: "pointer",
          pointerEvents: "none",
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 11 8"
        fill="none"
      >
        <path
          className="hover-dropdown"
          d="M10 1.5L5.5 6.5L1 1.5"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const SelectDropdownImage2 = () => {
    return (
      <svg
        style={{
          position: "relative",
          right: "0.8rem",
          cursor: "pointer",
          pointerEvents: "none",
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 11 8"
        fill="none"
      >
        <path
          className="hover-dropdown"
          d="M10 1.5L5.5 6.5L1 1.5"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const SelectDropdownImage3 = () => {
    return (
      <svg
        style={{
          position: "relative",
          right: "0.8rem",
          cursor: "pointer",
          pointerEvents: "none",
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 11 8"
        fill="none"
      >
        <path
          className="hover-dropdown"
          d="M10 1.5L5.5 6.5L1 1.5"
          stroke="#7F7F7F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };

  const [showGrid, setShowGrid] = useState(false);

  const insertTable = (rows: number, cols: number) => {
    const quill = editorRefContext.getEditor?.();
    if (!quill) return;

    const range = quill.getSelection(true);
    if (!range) return;

    let tableHTML = `<table border="1" style="border-collapse: collapse; width: 100%;">`;

    // Header
    tableHTML += '<thead><tr>';
    for (let c = 0; c < cols; c++) {
      tableHTML += `<th style="padding: 8px;"></th>`;
    }
    tableHTML += '</tr></thead>';

    // Body
    tableHTML += '<tbody>';
    for (let r = 0; r < rows - 1; r++) {
      tableHTML += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHTML += `<td style="padding: 8px;"></td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';

    quill.insertEmbed(range.index, 'htmlTable', tableHTML, 'user');
    const deltaAfterInsert = quill.getContents();
    console.log("Delta after insert:", JSON.stringify(deltaAfterInsert, null, 2));
    quill.setSelection(range.index + 1);
  };

  const handleTableSizeSelect = (rows: number, cols: number) => {
    insertTable(rows, cols);
    setShowGrid(false);
  };

  const handleBold = () => {
    if (getCtrlShiftAPressed()) {
        console.log("Bold after Ctrl+Shift+A");
        setCtrlShiftAPressed(false);
        const editors = getEditorInstances()
        console.log("editor: ", editors)
        editors.forEach(editor => {
        if (editor) {
                clearHighlight(editor);
                const length = editor.getLength();
                const formats = editor.getFormat(0, length);
                const isBold = formats.bold === true;
                editor.formatText(0, length, 'bold', !isBold); // Toggle bold
        }
        });
      }

    const editor = editorRefContext.getEditor();
    if (!editor) return;

    const format = editor.getFormat();
    const isCurrentlyBold = !!format.bold; // Ensures boolean value

    const newBoldState = !isCurrentlyBold;

    // Update state and apply formatting
    setIsBoldActive(newBoldState);
    editor.format("bold", newBoldState, "user");

    editor.focus();
  };


  const handleItalic = () => {
      if (getCtrlShiftAPressed()) {
        console.log("italic after Ctrl+Shift+A");
        setCtrlShiftAPressed(false);

        const editors = getEditorInstances();
        console.log("editor: ", editors)
        editors.forEach(editor => {
        if (editor) {
            clearHighlight(editor);
            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isItalic = formats.italic === true;
            editor.formatText(0, length, 'italic', !isItalic); // Toggle italic
        }
        });
      }

    const editor = editorRefContext.getEditor();
    if (!editor) return;

    const currentFormat = editor.getFormat();
    const isItalicActive = !!currentFormat.italic;

    // Toggle italic formatting
    editor.format("italic", !isItalicActive, "user");

    // Optionally update local UI state (if you're using it)
    setIsItalicActive(!isItalicActive);

    editor.focus();
  };


  const handleUnderline = () => {
    if (getCtrlShiftAPressed()) {
        console.log("underline after Ctrl+Shift+A");
        setCtrlShiftAPressed(false);

        const editors = getEditorInstances();
        console.log("editor: ", editors)
        editors.forEach(editor => {
        if (editor) {
            clearHighlight(editor);
            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isUnderline = formats.underline === true;
            editor.formatText(0, length, 'underline', !isUnderline); // Toggle underline
        }
        });
      }

    const editor = editorRefContext.getEditor();
    if (!editor) return;

    const currentFormat = editor.getFormat();
    const isUnderlineActive = !!currentFormat.underline;

    // Toggle underline formatting
    editor.format("underline", !isUnderlineActive, "user");

    // Optionally update local UI state (e.g., for toolbar button state)
    setIsUnderlineActive(!isUnderlineActive);

    editor.focus();
  };


  const handleStrikethrough = () => {
      if (getCtrlShiftAPressed()) {
        console.log("strikethrough after Ctrl+Shift+A");
        setCtrlShiftAPressed(false);

        const editors = getEditorInstances();
        console.log("editor: ", editors)
        editors.forEach(editor => {
        if (editor) {
            clearHighlight(editor);
            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isStrike = formats.strike === true;
            editor.formatText(0, length, 'strike', !isStrike); // Toggle strike
        }
        });
      }

    const editor = editorRefContext.getEditor();

    if (!editor) return; // Safety check in case editor is not initialized

    // Get current format at cursor position
    const currentFormat = editor.getFormat();
    const isStrikethrough = currentFormat.strike === true;

    // Update local UI state (e.g., toggle strikethrough button style)
    setIsStrikeActive(!isStrikethrough);

    // Apply or remove strikethrough formatting
    editor.format("strike", !isStrikethrough, "user");

    // Bring focus back to the editor
    editor.focus();
  };


  const originalFontSizeMap = new Map<any, string>();
  const handleSuperscript = () => {
    const editor = editorRefContext.getEditor();
    const currentFormat = editor.getFormat();
    const isSuperscript = currentFormat.script === "super";

    // This is the actual selected size before superscript
    const userSelectedSize = selectedFontSizeValue || "14px";

    const getReducedSize = (size: string): string => {
      const pxMatch = size.match(/^(\d+)px$/);
      if (pxMatch) {
        const reduced = Math.max(parseInt(pxMatch[1], 10) - 4, 8);
        return `${reduced}px`;
      }
      return size;
    };

    if (isSuperscript) {
      // Restore the original size from the map
      const originalSize = originalFontSizeMap.get(editor) || userSelectedSize;
      editor.format("script", false, "user");
      editor.format("size", originalSize, "user");
      setIsScriptActive("");
      originalFontSizeMap.delete(editor);
    } else {
      // Store the original size
      originalFontSizeMap.set(editor, userSelectedSize);

      // Apply reduced size and superscript
      const reducedSize = getReducedSize(userSelectedSize);
      editor.format("script", "super", "user");
      editor.format("size", reducedSize, "user");
      setIsScriptActive("super");
    }

    editor.focus();
  };
  const handleSubscript = () => {
    const editor = editorRefContext.getEditor();
    const currentFormat = editor.getFormat();
    const isSubscript = currentFormat.script === "sub";

    // This is the actual selected size before subscript
    const userSelectedSize = selectedFontSizeValue || "14px";

    const getReducedSize = (size: string): string => {
      const pxMatch = size.match(/^(\d+)px$/);
      if (pxMatch) {
        const reduced = Math.max(parseInt(pxMatch[1], 10) - 4, 8);
        return `${reduced}px`;
      }
      return size;
    };

    if (isSubscript) {
      // Restore the original size from the map
      const originalSize = originalFontSizeMap.get(editor) || userSelectedSize;
      editor.format("script", false, "user");
      editor.format("size", originalSize, "user");
      setIsScriptActive("");
      originalFontSizeMap.delete(editor);
    } else {
      // Store the original size
      originalFontSizeMap.set(editor, userSelectedSize);

      // Apply reduced size and subscript
      const reducedSize = getReducedSize(userSelectedSize);
      editor.format("script", "sub", "user");
      editor.format("size", reducedSize, "user");
      setIsScriptActive("sub");
    }

    editor.focus();
  };
  
  const handleIncreaseIndent = () => {
    if (getCtrlShiftAPressed()) {
        console.log("increaseindent after Ctrl+Shift+A");
        setCtrlShiftAPressed(false);

        const editors = getEditorInstances();
        console.log("editor: ", editors)
        editors.forEach(editor => {
          if (editor) {
              clearHighlight(editor);
              const length = editor.getLength();
              let index = 0;

              while (index < length) {
                  const [line, offset] = editor.getLine(index);
                  if (line) {
                      const formats = editor.getFormat(index, 1); // Get formats for the line
                      const currentIndent = formats.indent || 0;
                      editor.formatLine(index, 1, 'indent', currentIndent + 1);
                      index += line.length(); // Move to the start of the next line
                  } else {
                      break;
                  }
              }
          }
        });
    }

    if (editorRefContext) {
      const editor = editorRefContext.getEditor();
      const currentIndent = editor.getFormat().indent || 0;
      editor.format("indent", currentIndent + 1, "user");
    }
  };
  const handleDecreaseIndent = () => {
    if (getCtrlShiftAPressed()) {
        console.log("decreaseindent after Ctrl+Shift+Z");
        setCtrlShiftAPressed(false);

        const editors = getEditorInstances();
        console.log("editor: ", editors);
        editors.forEach(editor => {
            if (editor) {
                clearHighlight(editor);
                const length = editor.getLength();
                let index = 0;

                while (index < length) {
                    const [line, offset] = editor.getLine(index);
                    if (line) {
                        const formats = editor.getFormat(index, 1);
                        const currentIndent = formats.indent || 0;
                        const newIndent = Math.max(0, currentIndent - 1); // prevent negative indent
                        editor.formatLine(index, 1, 'indent', newIndent);
                        index += line.length();
                    } else {
                        break;
                    }
                }
            }
        });
    }
    if (editorRefContext) {
      const editor = editorRefContext.getEditor();
      const currentIndent = editor.getFormat().indent || 0;
      if (currentIndent > 0) {
        editor.format("indent", currentIndent - 1, "user");
      }
    }
  };

const handleCloseformula = () => {
    setDisplayFormula("");
    const editor = editorRefContext.getEditor();
    setAnchorElFormula(null)
    editor.focus();
    setSelection(null);
};

const handleInsertFormula = () => {
  if (editorRefContext) {
    const editor = editorRefContext.getEditor();
    const range = editor.getSelection(true);
      console.log("clicked : ", editor);
    if (range) {
      // Insert or replace formula at cursor with the current input value
      editor.insertText(range.index, displayFormula, {
        bold: true,
        italic: true
      }, "user");

      // Move cursor after the formula
      editor.setSelection(range.index + 1, 0, "user");
    }
    handleCloseformula();
  }
};

  const handleInsertCodeBlock = () => {
    if (editorRefContext) {
      const editor = editorRefContext.getEditor();
      const range = editor.getSelection();

      if (range) {
        const currentFormat = editor.getFormat(range);

        if (currentFormat["code-block"]) {
          editor.format("code-block", false, "user");
        } else {
          editor.format("code-block", true, "user");
        }
      }
    }
  };
  useEffect(() => {
    if (!editorRefContext) return;
    const quill = editorRefContext.getEditor();

    const makeClass = (fontClass: string, fontFamily: string) => {
      const cleanedFontClass = fontClass.split(",")[0];
      const cssRule = `.${cleanedFontClass} { font-family: "${fontFamily}"; }`;
      const style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = `.${cleanedFontClass} { font-family: "${fontFamily}"; }`;
      setContractNewFontStyles((prevValues: any) => {
        if (!prevValues.includes(cssRule)) {
          return [...prevValues, cssRule];
        } else return prevValues;
      });
      document.head.appendChild(style);
    };

    quill.clipboard.addMatcher(
      Node.ELEMENT_NODE,
      (node: HTMLElement, delta: any) => {
        // console.log(node);
        let fontFamily = node.style.fontFamily
          ? node.style.fontFamily.toLowerCase().replace(/['"]/g, "") // Remove quotes
          : "";

        var fontClass = fontFamily.replace(/\s+/g, "-").split(",")[0];
        var fontSize = node.style.fontSize;

        if (!fontClass) {
          if (node.tagName === "UL") {
            node.querySelectorAll("li").forEach((li: HTMLElement) => {
              li.childNodes.forEach((child: any) => {
                fontSize = child?.style?.fontSize;
                fontClass = child?.className?.replace("ql-font-", "");
                fontFamily = child?.className?.replace("ql-font-", "");
              });
            });
          } else {
            if (node.childNodes) {
              node.childNodes.forEach((child: any) => {
                if (child.nodeType === 1 && child.className ) {
                  fontSize = child?.style?.fontSize;
                  fontClass = child?.className?.replace("ql-font-", "");
                  fontFamily = child?.className?.replace("ql-font-", "");
                } else if (child.nodeType === 3) {
                  fontSize = node?.style?.fontSize;
                  fontClass = node?.className?.replace("ql-font-", "");
                  fontFamily = node?.className?.replace("ql-font-", "");
                }
              });
            }
          }
        }

        if (!fontClass) {
          fontFamily = "arial";
          fontClass = "arial";
        }

        if (fontSize && !oldSize.includes(fontSize)) {
          // if (fontSize.includes("pt")) {
          //   const fs = fontSize.replace("pt", "");
          //   const pt = Math.floor(Number(fs) * 1.333);
          //   fontSize = `${pt}px`;
          // }

          if (!SizeStyle.whitelist.includes(fontSize)) {
            SizeStyle.whitelist.push(fontSize);
            setContractNewFontSize((prevValues: string[]) => {
              if (!prevValues.includes(fontSize)) {
                return [...prevValues, fontSize];
              } else return [...prevValues, fontSize];
            });
          }
        }

        if (fontFamily && !oldFonts.includes(fontClass)) {
          if (!Font.whitelist.includes(fontClass)) {
            fontClass = "arial";
            fontFamily = "arial";
            makeClass(`ql-font-${fontClass}`, fontFamily);
          }
        }

        delta.ops.forEach((op: any) => {
          if (op.insert) {
            if (!op.attributes) {
              op.attributes = {};
            }
            op.attributes.font = fontClass;
            if (!op.attributes.header) {
              console.log(fontSize);
              if(fontSize) {
                op.attributes.size = fontSize;
              }
              else op.attributes.size = "12px";
              op.attributes.customHeading = "paragraph";
            }
            else {
              op.attributes.size = fontSize;
              op.attributes.customHeading = op.attributes.header == 1 ? "heading-1" : op.attributes.header == 2 ? "heading-2" : op.attributes.header == 3 ? "heading-3" : op.attributes.header == 4 ? "heading-4" : "";
              delete op?.attributes?.header;
            }
            op.attributes.style = op.attributes.style
              ? `${op.attributes.style}; font-family: ${fontFamily};`
              : `font-family: ${fontFamily};`;
            if (!op.attributes.color) {
              op.attributes.color = "black";
            }
            if (!op.attributes.background) {
              op.attributes.background = "#fefefe";
            }
            if(!op.attributes.lineHeight) {
              op.attributes.lineHeight = 1;
            }
            if (node.tagName === "DIV") {
              console.log("ss")
              const newOps: any[] = [];

              node.childNodes.forEach((child: any) => {
                
                if (child.nodeType === Node.ELEMENT_NODE) {
                  if (child.tagName === "BR") {
                    newOps.push({ insert: "\n" });
                  }
                  if (child.tagName.includes("H")) {
                    newOps.push({ insert: "\n" });
                    const header = parseInt(child.tagName.charAt(1));
                    newOps.push({
                      insert: child?.innerText,
                      attributes: {
                        ...op?.attributes,
                        customHeading: header == 1 ? "heading-1" : header == 2 ? "heading-2" : header == 3 ? "heading-3" : header == 4 ? "heading-4" : "",
                        size: header == 1 ? "24px" : header == 2 ? "18px" : header == 3 ? "14px" : header == 4 ? "13px" : "",
                        color: "black",
                        background: "#fefefe",
                        font:"arial",
                        lineHeight:1.5
                      },
                    })
                    newOps.push({ insert: "\n" })
                  }
                  if(child.tagName == "P") {
                    newOps.push({
                      insert:child.innerText,
                      attributes:{
                        ...op.attributes,
                        lineHeight:1,
                        size:op?.attributes?.size || "12px"
                      },
                    
                    })
                  }
                  if(child.tagName == "DIV") {
                    console.log(child);
                  }
                } else if (child.nodeType === Node.TEXT_NODE) {
                  console.log(node)
                  newOps.push({ insert: child.nodeValue || "", attributes: { 
                    ...op.attributes ,
                    size:op.attributes.size || "12px"

                  } });
                }
              });
              delta.ops = [...newOps];
            }
            // delete op.attributes.bold;
          }
        });


        if (fontSize) {
          setSelectedFontSize(fontSize);
          setSelectedFontSizeValue(fontSize);
        }
        setSelectedFont(fontClass);
        setSelectedFontValue(fontClass);
        return delta;
      }
    );
  }, [editorRefContext]);
  useEffect(() => {
    if (!editorRefContext) return;
    const editor = editorRefContext.getEditor();

    const updateListMarkerColor = () => {
      const listItems: any = document.querySelectorAll(".ql-editor ul");

      listItems.forEach((ul: HTMLElement) => {
        const dataList = ul.getAttribute("data-list-type");
        ul.childNodes.forEach((li: any) => {
          li.childNodes.forEach((child: any) => {
            var textColor = child?.style?.color;
            var fontSize = child?.style?.fontSize;
            const size = Number(fontSize.replace("px", ""));

            // Set text color for list marker
            if (textColor) {
              li.style.setProperty("--list-marker-color", textColor);
            } else {
              li.style.setProperty("--list-marker-color", fontColorSvg);
            }

            // Calculate and set the list size
            let listSize;

            switch (dataList) {
              case "bullet-dot":
                listSize = size / 2 - 1;
                break;
              case "bullet-dot-large":
              case "bullet-circle":
              case "bullet-square":
              case "bullet-flower":
              case "bullet-arrow":
              case "bullet-tick":
                listSize = size / 2;
                break;
              default:
                listSize = size;
            }

            // Check if the calculated listSize is -1 and set to 0 if true
            listSize = listSize < 0 ? Number(selectedFontSizeValue.replace("px", '') / 2) : listSize; // Ensures no negative values

            // Set the calculated size to the CSS variable
            li.style.setProperty("--list-size", listSize + "px");
          });
        });
      });

    };
    updateListMarkerColor();
    // Update marker color on text change
    editor.on("text-change", updateListMarkerColor);

    // Update marker color on selection change (captures backspace behavior)
    editor.on("selection-change", updateListMarkerColor);

    // Use MutationObserver to capture DOM changes directly
    const observer = new MutationObserver(updateListMarkerColor);
    const targetNode = document.querySelector(".ql-editor");

    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Cleanup observer and event listeners on unmount
    return () => {
      editor.off("text-change", updateListMarkerColor);
      editor.off("selection-change", updateListMarkerColor);
      observer.disconnect();
    };
  }, [editorRefContext, fontColorSvg, selectedFontSizeValue]);
  const formatFont = (index: number, selectedFont: string, length?: number) => {
    if (length) {
      if (!editorRefContext) return;
      const quill = editorRefContext.getEditor();
      setTimeout(() => {
        quill.formatText(index, length, { font: selectedFont });
        quill.setSelection(length, 0);
        quill.focus();
      }, 200);
      setSelectedFont(selectedFont);
      setSelectedFontValue(selectedFont);
    }
  };
  useEffect(() => {
    contractNewFont?.forEach((newFont: string) => {
      if (!Font.whitelist.includes(newFont) && newFont != "ql-cursor") {
        Font?.whitelist?.push(newFont);
      }
    });
  }, [contractNewFont]);
  useEffect(() => {
    contractNewFontSize?.forEach((newFont: string) => {
      if (!SizeStyle.whitelist.includes(newFont)) {
        SizeStyle?.whitelist?.push(newFont);
      }
    });
  }, [contractNewFontSize]);
  useEffect(() => {
    contractNewFontStyles?.forEach((styleRule: any) => {
      if (!document.querySelector(styleRule.split(" ")[0])) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styleRule;
        document.head.appendChild(style);
      }
    });
  }, [contractNewFontStyles]);

  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ height: "100%" }}>
      <button onClick={scrollLeft} className="scroll-left">
        <ScrollLeftSvg />
      </button>
      <div
        id="toolbar"
        ref={toolbarRef}
        className="toolbar mx-1 mt-1"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          overflowY: "hidden",
          height: 53,
          pointerEvents: editMode ? "all" : "none",
          // opacity: editMode ? "1" : "0.7",
          border: "none",
          marginBottom: "-2px",
        }}
      >
        <span className="ql-formats">
          <button
            className="btn-undo"
            id="undo"
            style={{
              cursor: canUndo ? "pointer" : "default",
            }}
            onClick={() => {
              handleUndo();
            }}
          >
            <UndoSvg />
          </button>

          <button
            id="redo"
            className="btn-undo ml-2"
            style={{
              cursor: canRedo ? "pointer" : "default",
            }}
            onClick={() => {
              handleRedo();
            }}
          >
            <RedoSvg />
          </button>
        </span>
        <ReactTooltip
          anchorId="undo"
          className="custom-tooltip"
          place="bottom"
          content={"Undo"}
        />
        <ReactTooltip
          anchorId="redo"
          className="custom-tooltip"
          place="bottom"
          content={"Redo"}
        />
        <span className="ql-formats b-r">
          <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Select Font"
            data-tooltip-place="bottom"
          >
            <span
              className="ql-formats"
              style={{
                height: 30,
              }}
            >
              <Select
                className="ql-font select-comps"
                defaultValue="arial"
                IconComponent={SelectDropdownImage}
                style={{
                  height: 30,
                  borderRadius: 5,
                  color: "#626469",
                  width: "134px",
                  textAlign: "center",
                }}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d9d9d9",
                    textAlign: "start",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7771e8",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7771e8",
                  },
                  // Change SVG icon color on hover and focus
                  "&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root": {
                    fill: "#7771e8 !important",
                  },
                  ".MuiSvgIcon-root": {
                    fill: "#7F7F7F !important",
                  },
                  fontSize: "13px",
                }}
                renderValue={() => (
                  <div
                    style={{
                      // position: "relative",
                      // left: "-0.2rem"
                      textAlign: "start",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedFontValue?.charAt(0)?.toUpperCase() +
                      selectedFontValue?.slice(1)?.replace("-", " ")}
                  </div>
                )}
                onChange={handleFontChange}
                value={selectedFontValue}
                MenuProps={{
                  style: {
                    height: "360px",
                  },
                }}
              >
                {Font.whitelist.map((font: any) => (
                  <MenuItem
                    className={
                      selectedFontValue === font
                        ? `selected-font ql-font-${font} select-fonts `
                        : `ql-font-${font} select-fonts `
                    }
                    style={{
                      color: "#7F7F7F",
                      fontSize: "13px",
                    }}
                    key={font}
                    value={font}
                  >
                    {font.charAt(0).toUpperCase() +
                      font.slice(1).replace("-", " ")}
                  </MenuItem>
                ))}
              </Select>
            </span>
          </a>
          <a
            data-tooltip-id="tooltip-font-size"
            data-tooltip-content="Font Size"
            data-tooltip-place="bottom"
          >
            <span className="ql-formats">
              <Select
                style={{
                  width: "86px",
                  height: 30,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
                  color: "#626469",
                }}
                className="ql-size select-comps"
                IconComponent={SelectDropdownImage2}
                onChange={handleFontSizeChange}
                value={selectedFontSizeValue}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d9d9d9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7771e8",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7771e8",
                  },
                  // Change SVG icon color on hover and focus
                  "&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root": {
                    fill: "#7771e8 !important",
                  },
                  ".MuiSvgIcon-root": {
                    fill: "#7F7F7F !important",
                  },
                  fontSize: "13px",
                }}
                MenuProps={{
                  style: {
                    height: "360px",
                  },
                }}
                renderValue={() => (
                  <div
                    style={{
                      position: "relative",
                      left: "-0.2rem",
                    }}
                  >
                  {customLabels[selectedFontSizeValue as keyof typeof customLabels] ??
                     selectedFontSizeValue.replace("px", "")}
                  </div>
                )}
              >
                {SizeStyle.whitelist
                  .sort((a: any, b: any) => parseInt(a) - parseInt(b))
                  .map((size: any) => (
                    <MenuItem
                      style={{
                        color: "#7F7F7F",
                        fontSize: "13px",
                      }}
                      className={
                        selectedFontSizeValue === size
                          ? `selected-font select-fonts `
                          : ` select-fonts`
                      }
                      key={size}
                      value={size}
                    >
                      {customLabels[size as keyof typeof customLabels] 
  ? customLabels[size as keyof typeof customLabels] 
  : size.replace("", "")}
                    </MenuItem>
                  ))}
              </Select>
            </span>
          </a>
          <a
            data-tooltip-id="tooltip-header"
            data-tooltip-content="Headers"
            data-tooltip-place="bottom"
          >
            <span className="">
              <Select
                className="text-center select-comps"
                style={{
                  height: 30,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
                  color: "#626469",
                  width: "118px",
                }}
                IconComponent={SelectDropdownImage3}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d9d9d9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7771e8",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7771e8",
                  },
                  // Change SVG icon color on hover and focus
                  "&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root": {
                    fill: "#7771e8 !important",
                  },
                  ".MuiSvgIcon-root": {
                    fill: "#7F7F7F !important",
                  },
                  fontSize: "13px",
                }}
                defaultValue="0"
                onChange={(e) => {
                  handleHeaderChange(e);
                }}
                renderValue={() => (
                  <div
                    style={{
                      position: "relative",
                      left: "-0.2rem",
                      fontSize: "13px",
                    }}
                  >
                    {selectedHeadersValue == 0
                      ? "Paragraph"
                      : selectedHeadersValue == 1
                        ? "Heading 1"
                        : selectedHeadersValue == 2
                          ? "Heading 2"
                          : selectedHeadersValue == 3
                            ? "Heading 3"
                            : selectedHeadersValue == 4
                              ? "Heading 4"
                              : ""}
                  </div>
                )}
                value={selectedHeadersValue}
              >
                <MenuItem
                  className={
                    selectedHeadersValue === 0
                      ? `selected-font select-fonts `
                      : ` select-fonts`
                  }
                  value={0}
                  style={{ fontSize: "14px", color: "#7F7F7F" }}
                >
                  Paragraph
                </MenuItem>
                <MenuItem
                  className={
                    selectedHeadersValue === 1
                      ? `selected-font select-fonts `
                      : ` select-fonts`
                  }
                  value={1}
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#7F7F7F",
                  }}
                >
                  Heading 1
                </MenuItem>
                <MenuItem
                  className={
                    selectedHeadersValue === 2
                      ? `selected-font select-fonts `
                      : ` select-fonts`
                  }
                  value={2}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#7F7F7F",
                  }}
                >
                  Heading 2
                </MenuItem>
                <MenuItem
                  className={
                    selectedHeadersValue === 3
                      ? `selected-font select-fonts `
                      : ` select-fonts`
                  }
                  value={3}
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#7F7F7F",
                  }}
                >
                  Heading 3
                </MenuItem>
                <MenuItem
                  className={
                    selectedHeadersValue === 4
                      ? `selected-font select-fonts `
                      : ` select-fonts`
                  }
                  value={4}
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#7F7F7F",
                  }}
                >
                  Heading 4
                </MenuItem>
              </Select>
            </span>
          </a>
        </span>
        <ReactTooltip
          id="my-tooltip"
          className="custom-tooltip tooltip-select"
          place="bottom"
          style={{
            position: "absolute",
          }}
        />
        <ReactTooltip
          id="tooltip-font-size"
          className="custom-tooltip tooltip-select"
          place="bottom"
        />
        <ReactTooltip
          id="tooltip-header"
          className="custom-tooltip tooltip-select"
          place="bottom"
        />
     
        <span className="ql-formats ql-text-highlight">
          <a
            data-tooltip-id="menu-item"
            data-tooltip-content="Text Highlight Color"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseDown={(e) => {
                handleOpenTextColor(e);
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, cursor: "pointer" }}
              >
                <TextHighlightSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                id="openTextColor-button"
                aria-controls={openTextColor ? "openTextColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openTextColor ? "true" : undefined}
              >
                <span
                  style={{
                    marginRight: "8px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <rect
                      width="10"
                      height="10"
                      rx="2"
                      fill={
                        bgColorSvg === "#D9D9D940" ||
                          bgColorSvg === "#ffffff" ||
                          bgColorSvg == "#fefefe"
                          ? "#E6E6E6"
                          : bgColorSvg
                      }
                    />
                  </svg>
                </span>
              </span>
              <Menu
                id="openTextColor-menu" // Updated ID to avoid conflict
                anchorEl={anchorElTextColr}
                open={openTextColor}
                onClose={handleCloseTextColor}
                keepMounted
                MenuListProps={{
                  "aria-labelledby": "openTextColor-button", // Updated aria-labelledby
                }}
                className="text-center"
              >
                <Sketch
                  color={bgColorSvg}
                  onChange={handleTextHighlightColorChange}
                />
              </Menu>
            </span>
          </a>
        </span>
        {openTextColor ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item"
            place="bottom"
          />
        )}
        <span className="ql-formats ql-text-highlight">
          <a
            data-tooltip-id="menu-item-1"
            data-tooltip-content="Font Color"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseDown={(e) => {
                handleOpenFontColor(e);
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, cursor: "pointer" }}
              >
                <FontColorSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                id="openFontColor-button"
                aria-controls={openFontColor ? "openFontColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openFontColor ? "true" : undefined}
              >
                <span style={{ marginRight: "8px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <rect
                      width="10"
                      height="10"
                      rx="2"
                      fill={
                        fontColorSvg == "white" ||
                          fontColorSvg === "#fefefe" ||
                          fontColorSvg == "#ffffff"
                          ? "#E6E6E6"
                          : fontColorSvg
                      }
                    />
                  </svg>
                </span>
              </span>
              <Menu
                id="openTextColor-menu" // Updated ID to avoid conflict
                anchorEl={anchorElFontColor}
                // keepMounted
                open={openFontColor}
                onClose={handleCloseFontColor}
                MenuListProps={{
                  "aria-labelledby": "openFontColor-button", // Updated aria-labelledby
                }}
                className="text-center"
              >
                <Sketch
                  color={fontColorSvg == "black" ? "#000000" : fontColorSvg}
                  onChange={handleFontColorChange}
                  id="menu-color"
                />
              </Menu>
            </span>
          </a>
        </span>
        {openFontColor ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-1"
            place="bottom"
          />
        )}

        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-2"
            data-tooltip-content="Shading"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
              onMouseDown={(e) => {
                handleOpenBgColor(e);
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, cursor: "pointer" }}
              >
                <ShadeColorSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                id="openBgColor-button"
                aria-controls={openBgColor ? "openBgColor-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openBgColor ? "true" : undefined}
              >
                <span style={{ marginRight: "8px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <rect width="10" height="10" rx="2" fill="#E6E6E6" />
                  </svg>
                </span>
              </span>
              <Menu
                id="openTextColor-menu" // Updated ID to avoid conflict
                anchorEl={anchorElBgColor}
                open={openBgColor}
                onClose={handleCloseBgColor}
                MenuListProps={{
                  "aria-labelledby": "openBgColor-button", // Updated aria-labelledby
                }}
                keepMounted
                className="text-center"
              >
                <Sketch color="#9b9b9b" onChange={handleBgColorChange} />
              </Menu>
            </span>
          </a>
        </span>
        {openBgColor ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-2"
            place="bottom"
          />
        )}

        

        <span className="ql-formats b-r">
          <a
            data-tooltip-id="menu-item-3"
            data-tooltip-content="Change Case"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <ChangeCaseSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                onMouseDown={(e) => {
                  handleOpenCase(e);
                }}
                id="openCase-button"
                aria-controls={openCase ? "openCase-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openCase ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openCase-menu"
                anchorEl={anchorElCase}
                open={openCase}
                keepMounted
                onClose={handleCloseCase}
                MenuListProps={{
                  "aria-labelledby": "openCase-button",
                }}
              >
                <MenuItem
                  className="margins-color select-fonts"
                  style={{
                    color: "#7F7F7F",
                    fontSize: "13px",
                  }}
                  onClick={() => handleTextTransformation(toSentenceCase)}
                >
                  Sentence case
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#7F7F7F",
                    fontSize: "13px",
                  }}
                  className="margins-color select-fonts"
                  onClick={() => handleTextTransformation(toLowerCase)}
                >
                  lowercase
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#7F7F7F",
                    fontSize: "13px",
                  }}
                  className="margins-color select-fonts"
                  onClick={() => handleTextTransformation(toUpperCase)}
                >
                  UPPERCASE
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#7F7F7F",
                    fontSize: "13px",
                  }}
                  className="margins-color select-fonts"
                  onClick={() => handleTextTransformation(toCapitalizeEachWord)}
                >
                  Capitalize Each Word
                </MenuItem>
                <MenuItem
                  style={{
                    color: "#7F7F7F",
                    fontSize: "13px",
                  }}
                  className="margins-color select-fonts"
                  onClick={() => handleTextTransformation(toToggleCase)}
                >
                  tOGGLE cASE
                </MenuItem>
              </Menu>
            </span>
          </a>
        </span>
        {openCase ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-3"
            place="bottom"
          />
        )}
        <span className="ql-formats b-r">
          <button
            className={`btn-undo ${isBoldActive ? 'active' : ''}`}
            id="bold"
            onClick={handleBold}
          >
            <BoldSvg />
          </button>
          <button
            className={`btn-undo ml-2 ${isItalicActive ? 'active' : ''}`}
            id="italic"
            onClick={handleItalic}
          >
            <ItalicSvg />
          </button>
          <button
            className={`btn-undo mx-2 ${isUnderlineActive ? 'active' : ''}`}
            id="underline"
            onClick={handleUnderline}
          >
            <UnderlineSvg />
          </button>
          <button
            className={`btn-undo ${isStrikeActive ? 'active' : ''}`}
            id="strike"
            onClick={handleStrikethrough}
          >
            <StrikeThroughSvg />
          </button>
        </span>
        <ReactTooltip
          anchorId="bold"
          className="custom-tooltip"
          place="bottom"
          content={"Bold"}
        />
        <ReactTooltip
          anchorId="italic"
          className="custom-tooltip"
          place="bottom"
          content={"Italic"}
        />
        <ReactTooltip
          anchorId="strike"
          className="custom-tooltip"
          place="bottom"
          content={"Strikethrough"}
        />
        <ReactTooltip
          anchorId="underline"
          className="custom-tooltip"
          place="bottom"
          content={"Underline"}
        />
        <span className="ql-formats b-r">
          <button
            className={`btn-undo ${isScriptActive ? 'super' : ''}`}
            id="superscript"
            onClick={handleSuperscript}
          >
            <SuperScriptSvg />
          </button>
          <button 
            className={`btn-undo mx-2 ${isScriptActive ? 'sub' : ''}`} 
            id="subscript" 
            onClick={handleSubscript}>
            <SubScriptSvg />
          </button>
          <button
            className={`btn-undo ${showFormattingMarks ? 'super' : ''}`}
            id="formatting-marks"
            onClick={toggleFormattingMarks}
          >
            <FormattingSvg />
          </button>
        </span>
        <ReactTooltip
          anchorId="superscript"
          className="custom-tooltip"
          place="bottom"
          content={"Superscript"}
        />
        <ReactTooltip
          anchorId="subscript"
          className="custom-tooltip"
          place="bottom"
          content={"Subscript"}
        />
        <ReactTooltip
          anchorId="formatting-marks"
          className="custom-tooltip"
          place="bottom"
          content={"Show/Hide formatting marks"}
        />

        <span className="ql-formats ">
          <a
            data-tooltip-id="menu-item-4"
            data-tooltip-content="Numbering"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
                onMouseDown={(e) => {
                  handleListClick("default");
                  removeListFromEmptyLines(editorRefContext.getEditor());
                }}
              >
                <NumberingSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                  borderLeft: "1px solid #EEE",
                }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onMouseDown={(e) => {
                  // console.log(e)
                  handleClick(e);
                }}
              >
                <img src={DropdownBarImage} alt="Bar" />
              </span>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open1}
                keepMounted
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                  style: {
                    height: 108,
                    width: 158,
                  },
                }}
              >
                <div className="d-flex">
                  <MenuItem
                    value="none"
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    className="mx-1 list-items"
                    style={{
                      height: 42,
                      width: 42,
                      padding: 0,
                      border:
                        isListActive == "" || isListActive == "bullet"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => {
                      handleListClick("none");
                      //removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div
                      className="e-de-list-header-presetmenu"
                      style={{
                        position: "relative",
                        left: 7,
                        color: isListActive == "" ? "#7771E8" : "",
                      }}
                    >
                      <div>
                        <span className="e-de-bullets">None</span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 list-items"
                    sx={{
                      ":hover": {
                        border: "1px solid rgb(119, 113, 232) !important",
                      },
                    }}
                    style={{
                      height: 42,
                      width: 42,
                      padding: 2,
                      border:
                        isListActive == "default"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => {
                      handleListClick("default");
                      removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div
                      className={
                        isListActive == "default"
                          ? "e-de-list-header-presetmenu-selected"
                          : "e-de-list-header-presetmenu"
                      }
                    >
                      <div>
                        1.
                        <span
                          className={
                            isListActive == "default"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        2.
                        <span
                          className={
                            isListActive == "default"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        3.
                        <span
                          className={
                            isListActive == "default"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        >
                          {" "}
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="lower-alpha"
                    className="mx-1 list-items"
                    style={{
                      height: 42,
                      width: 42,
                      padding: 2,
                      border:
                        isListActive == "lower-alpha"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    sx={{
                      ":hover": {
                        border: "1px solid rgb(119, 113, 232) !important",
                      },
                    }}
                    onClick={() => {
  handleListClick("lower-alpha");
  removeListFromEmptyLinesalpha(editorRefContext.getEditor());
}}
                  >
                    <div
                      className={
                        isListActive == "lower-alpha"
                          ? "e-de-list-header-presetmenu-selected"
                          : "e-de-list-header-presetmenu"
                      }
                    >
                      <div>
                        a.
                        <span
                          className={
                            isListActive == "lower-alpha"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        b.
                        <span
                          className={
                            isListActive == "lower-alpha"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        c.
                        <span
                          className={
                            isListActive == "lower-alpha"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        >
                          {" "}
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <div className="d-flex py-2">
                  <MenuItem
                    value="upper-alpha"
                    className="mx-1 list-items"
                    style={{
                      height: 42,
                      width: 42,
                      padding: 2,
                      border:
                        isListActive == "upper-alpha"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    sx={{
                      ":hover": {
                        border: "1px solid rgb(119, 113, 232) !important",
                      },
                    }}
                    onClick={() => {
                      handleListClick("upper-alpha");
                      removeListFromEmptyLinesalpha(editorRefContext.getEditor());
                    }}
                  >
                    <div
                      className={
                        isListActive == "upper-alpha"
                          ? "e-de-list-header-presetmenu-selected"
                          : "e-de-list-header-presetmenu"
                      }
                    >
                      <div>
                        A.
                        <span
                          className={
                            isListActive == "upper-alpha"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        B.
                        <span
                          className={
                            isListActive == "upper-alpha"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        C.
                        <span
                          className={
                            isListActive == "upper-alpha"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        >
                          {" "}
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="lower-roman"
                    className="mx-1 list-items"
                    style={{
                      height: 42,
                      width: 42,
                      padding: 2,
                      border:
                        isListActive == "lower-roman"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    sx={{
                      ":hover": {
                        border: "1px solid rgb(119, 113, 232) !important",
                      },
                    }}
                  onClick={() => { 
                    handleListClick("lower-roman");
                    removeListFromEmptyLinesroman(editorRefContext.getEditor());
                  }}
                  >
                    <div
                      className={
                        isListActive == "lower-roman"
                          ? "e-de-list-header-presetmenu-selected"
                          : "e-de-list-header-presetmenu"
                      }
                    >
                      <div>
                        i.
                        <span
                          className={
                            isListActive == "lower-roman"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        ii.
                        <span
                          className={
                            isListActive == "lower-roman"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        iii.
                        <span
                          className={
                            isListActive == "lower-roman"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        >
                          {" "}
                        </span>
                      </div>
                    </div>{" "}
                  </MenuItem>

                  <MenuItem
                    value="upper-roman"
                    className="mx-1 list-items"
                    style={{
                      height: 42,
                      width: 42,
                      padding: 2,
                      border:
                        isListActive == "upper-roman"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    sx={{
                      ":hover": {
                        border: "1px solid rgb(119, 113, 232) !important",
                      },
                    }}
                    onClick={() => { handleListClick("upper-roman");
                      removeListFromEmptyLinesroman(editorRefContext.getEditor());
                    }}
                  >
                    <div
                      className={
                        isListActive == "upper-roman"
                          ? "e-de-list-header-presetmenu-selected"
                          : "e-de-list-header-presetmenu"
                      }
                    >
                      <div>
                        I.
                        <span
                          className={
                            isListActive == "upper-roman"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        II.
                        <span
                          className={
                            isListActive == "upper-roman"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        ></span>
                      </div>
                      <div>
                        III.
                        <span
                          className={
                            isListActive == "upper-roman"
                              ? "e-de-list-line-selected"
                              : "e-de-list-line"
                          }
                        >
                          {" "}
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
              </Menu>
            </span>
          </a>
        </span>
        {open1 ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-4"
            place="bottom"
          />
        )}

        <span className="ql-formats ">
          <a
            data-tooltip-id="menu-item-5"
            data-tooltip-content="Bullets"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30, cursor: "pointer" }}
                onMouseDown={() => { handleListClick("bullet-dot");
                      //removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
              >
                <BulletSvg />
              </span>

              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                  borderLeft: "1px solid #EEE",
                }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onMouseDown={(e) => {
                  handleClick2(e);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl2}
                open={open}
                keepMounted
                onClose={handleClose2}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                  style: {
                    height: 72,
                  },
                }}
              >
                <div className="d-flex">
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    style={{
                      height: 24,
                      width: 42,
                      border:
                        isListActive == "" ||
                          isListActive == "bullet" ||
                          isListActive == "default"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    onClick={() => { handleListClick("none");
                      //removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div
                      className="e-de-list-header-presetmenu"
                      style={{
                        position: "relative",
                        left: "-0.6rem",
                        color: isListActive === "" ? "#7771e8" : "black",
                      }}
                    >
                      <div>
                        <span
                          className="e-de-bullets hover-color-none"
                          style={{ position: "relative", right: 1 }}
                        >
                          None
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    style={{
                      height: 24,
                      width: 42,
                      border:
                        isListActive == "bullet-dot-large"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => { handleListClick("bullet-dot-large");
                      //removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div className={"e-de-bullet-list-header-presetmenu"}>
                      <div>
                        <span
                          className={
                            isListActive === "bullet-dot-large"
                              ? "e-de-ctnr-bullet-dot-selected e-icons e-de-ctnr-list"
                              : "e-de-ctnr-bullet-dot e-icons e-de-ctnr-list"
                          }
                        ></span>
                      </div>
                    </div>{" "}
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    style={{
                      height: 24,
                      width: 42,
                      border:
                        isListActive == "bullet-circle"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => { handleListClick("bullet-circle");
                      //removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span
                          className={
                            isListActive === "bullet-circle"
                              ? "e-de-ctnr-bullet-circle-selected e-icons e-de-ctnr-list"
                              : "e-de-ctnr-bullet-circle e-icons e-de-ctnr-list"
                          }
                        ></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    style={{
                      height: 24,
                      width: 42,
                      border:
                        isListActive == "bullet-square"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => { handleListClick("bullet-square");
                      //removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span
                          className={
                            isListActive === "bullet-square"
                              ? "e-de-ctnr-bullet-square-selected e-icons e-de-ctnr-list"
                              : "e-de-ctnr-bullet-square e-icons e-de-ctnr-list"
                          }
                        ></span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <div className="d-flex py-2">
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    style={{
                      height: 24,
                      width: 42,
                      border:
                        isListActive == "bullet-flower"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => { handleListClick("bullet-flower");
                      //removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span
                          className={
                            isListActive === "bullet-flower"
                              ? "e-de-ctnr-bullet-flower-selected e-icons e-de-ctnr-list"
                              : "e-de-ctnr-bullet-flower e-icons e-de-ctnr-list"
                          }
                        ></span>
                      </div>
                    </div>
                  </MenuItem>

                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    style={{
                      height: 24,
                      width: 42,
                      border:
                        isListActive == "bullet-arrow"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => { handleListClick("bullet-arrow");
                     // removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span
                          className={
                            isListActive === "bullet-arrow"
                              ? "e-de-ctnr-bullet-arrow-selected e-icons e-de-ctnr-list"
                              : "e-de-ctnr-bullet-arrow e-icons e-de-ctnr-list"
                          }
                        ></span>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem
                    value="default"
                    className="mx-1 bullet-list-items"
                    sx={{
                      ":hover": {
                        border: "1px solid #7771E8 !important",
                      },
                    }}
                    style={{
                      height: 24,
                      width: 42,
                      border:
                        isListActive == "bullet-tick"
                          ? "1px solid #7771E8"
                          : "1px solid #cccccc",
                    }}
                    onClick={() => {  handleListClick("bullet-tick");
                     // removeListFromEmptyLines(editorRefContext.getEditor());
                    }}
                  >
                    <div className="e-de-bullet-list-header-presetmenu">
                      <div>
                        <span
                          className={
                            isListActive === "bullet-tick"
                              ? "e-de-ctnr-bullet-tick-selected e-icons e-de-ctnr-list"
                              : "e-de-ctnr-bullet-tick e-icons e-de-ctnr-list"
                          }
                        ></span>
                      </div>
                    </div>
                  </MenuItem>
                </div>
              </Menu>
            </span>
          </a>
        </span>

        {open ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-5"
            place="bottom"
          />
        )}

        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-6"
            data-tooltip-content="Line Spacing"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <LineSpacingSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                onMouseDown={(e) => {
                  handleOpenSpacing(e);
                }}
                id="openSpacing-button"
                aria-controls={openSpacing ? "openSpacing-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSpacing ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openSpacing-menu"
                anchorEl={anchorElSpacing}
                open={openSpacing}
                onClose={handleCloseSpacing}
                MenuListProps={{
                  "aria-labelledby": "openSize-button",
                }}
              >
                {lineSpacing.map((size, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => handleSelectSpacing(size.value)}
                      className="select-fonts"
                      style={{
                        color: spacing == size.value ? "#7771E8" : "#7F7F7F",
                      }}
                    >
                      <div className="container">
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 550,
                            // color:"#7F7F7F"
                          }}
                        >
                          {size.value == "1"
                            ? "1"
                            : size.value == "1.15"
                              ? "1.15"
                              : size.value == "1.5"
                                ? "1.5"
                                : size.value == "2"
                                  ? "2"
                                  : size.value == "2.5"
                                    ? "2.5"
                                    : size.value == "3"
                                      ? "3"
                                      : ""}
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </Menu>
            </span>
          </a>
        </span>
        {openSpacing ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-6"
            place="bottom"
          />
        )}

        <span className="ql-formats b-r">
          <a
            data-tooltip-id="menu-item-7"
            data-tooltip-content="Alignment"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <AlignmentSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                onMouseDown={(e) => {
                  handleOpenAlignment(e);
                }}
                id="openAlignment-button"
                aria-controls={openAlignment ? "openSpacing-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openAlignment ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openSpacing-menu"
                anchorEl={anchorElAlignment}
                open={openAlignment}
                onClose={handleCloseAlignment}
                MenuListProps={{
                  "aria-labelledby": "openSize-button",
                }}
              >
                <div className="d-flex">
                  <a
                    data-tooltip-id="align-left"
                    data-tooltip-content="Align to left"
                    data-tooltip-place="bottom"
                  >
                    <MenuItem
                      className="orientation"
                      onClick={() => handleAlignment("left")}
                      id="align-left"
                    >
                      <svg
                        width="16"
                        height="13"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM0 2.22222H6.66667V3.33333H0V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM0 6.66667H6.66667V7.77778H0V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          className={
                            selectedAlign === "left"
                              ? "orientation-svg-selected"
                              : "orientation-svg"
                          }
                        />
                      </svg>
                    </MenuItem>
                  </a>
                  <a
                    data-tooltip-id="align-center"
                    data-tooltip-content="Center Text"
                    data-tooltip-place="bottom"
                  >
                    <MenuItem
                      className="orientation"
                      onClick={() => handleAlignment("center")}
                      id="align-center"
                    >
                      <svg
                        width="16"
                        height="13"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM2.22222 2.22222H7.77778V3.33333H2.22222V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM2.22222 6.66667H7.77778V7.77778H2.22222V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          className={
                            selectedAlign === "center"
                              ? "orientation-svg-selected"
                              : "orientation-svg"
                          }
                        />
                      </svg>
                    </MenuItem>
                  </a>
                  <a
                    data-tooltip-id="align-right"
                    data-tooltip-content="Align to right"
                    data-tooltip-place="bottom"
                  >
                    <MenuItem
                      onClick={() => handleAlignment("right")}
                      className="orientation"
                      id="align-right"
                    >
                      <svg
                        width="16"
                        height="13"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM3.33333 2.22222H10V3.33333H3.33333V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM3.33333 6.66667H10V7.77778H3.33333V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          className={
                            selectedAlign === "right"
                              ? "orientation-svg-selected"
                              : "orientation-svg"
                          }
                        />
                      </svg>
                    </MenuItem>
                  </a>
                  <a
                    data-tooltip-id="align-justify"
                    data-tooltip-content="Justify Text"
                    data-tooltip-place="bottom"
                  >
                    <MenuItem
                      onClick={() => handleAlignment("justify")}
                      className="orientation"
                    >
                      <svg
                        width="16"
                        height="13"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0H10V1.11111H0V0ZM0 2.22222H10V3.33333H0V2.22222ZM0 4.44444H10V5.55556H0V4.44444ZM0 6.66667H10V7.77778H0V6.66667ZM0 8.88889H10V10H0V8.88889Z"
                          className={
                            selectedAlign === "justify"
                              ? "orientation-svg-selected"
                              : "orientation-svg"
                          }
                        />
                      </svg>
                    </MenuItem>
                  </a>
                </div>
              </Menu>
            </span>
          </a>
        </span>
        {openAlignment ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-7"
            place="bottom"
          />
        )}
        <ReactTooltip
          id="align-left"
          className="custom-tooltip"
          place="bottom"
        />
        <ReactTooltip
          id="align-right"
          className="custom-tooltip"
          place="bottom"
        />
        <ReactTooltip
          id="align-center"
          className="custom-tooltip"
          place="bottom"
        />
        <ReactTooltip
          id="align-justify"
          className="custom-tooltip"
          place="bottom"
        />
        <span className="ql-formats">
          <button
            className="btn-undo mr-2"
            id="increase"
            onClick={handleIncreaseIndent}
          >
            <IncreaseIndentSvg />
          </button>
          <button
            className="btn-undo"
            id="decrease"
            onClick={handleDecreaseIndent}
          >
            <DecreaseIndentSvg />
          </button>
        </span>
        <ReactTooltip
          anchorId="increase"
          className="custom-tooltip"
          place="bottom"
          content={"Increase Indent"}
        />
        <ReactTooltip
          anchorId="decrease"
          className="custom-tooltip"
          place="bottom"
          content={"Decrease Indent"}
        />
        <span className="ql-formats" id="page-break">
          <span
            className="d-flex ql-color fonts"
            style={{
              height: 30,
              border: "1px solid #D9D9D9",
              borderRadius: 5,
            }}
            id="page-break"
          >
      {/* Button or span to trigger the page break */}
        <span
          className="d-flex justify-content-center align-items-center"
          style={{ width: 34 }}
          onClick={() => {
            setPages((prevPages: any) => {
              const updatedPages = [...prevPages, { type: "pageBreak" }];
              console.log("New page type:", updatedPages[updatedPages.length - 1].type);
              console.log("After adding page break:", updatedPages);
              return updatedPages;
            });
          }}

        >
          <PageBreakSvg />
        </span>
          </span>
        </span>
        <ReactTooltip
          anchorId="page-break"
          className="custom-tooltip"
          place="bottom"
          content={"Page Break"}
        />
        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-8"
            data-tooltip-content="Margins"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <MarginSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                id="margins-button" // Changed ID to avoid conflict
                aria-controls={openMargins ? "margins-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMargins ? "true" : undefined}
                onClick={(e) => {
                  const scrollContainer = scrollPageRef.current;
                  const scrollY = scrollContainer
                    ? scrollContainer.scrollTop
                    : 0;
                  setScrollPosition(scrollY);
                  handleOpenMargins(e);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="margins-menu"
                anchorEl={anchorElMargins}
                open={openMargins}
                onClose={handleCloseMargins}
                MenuListProps={{
                  "aria-labelledby": "margins-button", // Updated aria-labelledby
                }}
              >
                <MenuItem
                  className="margins"
                  onClick={() =>
                    handleSelectMargins({
                      title: "Standard",
                      top: "2.54cm",
                      bottom: "2.54cm",
                      left: "2.54cm",
                      right: "2.54cm",
                    })
                  }
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          className={
                            documentPageMargins.title === "Standard"
                              ? "margins-svg-selected"
                              : "margins-svg"
                          }
                          d="M4.06628 1V17M14.395 1V17M1.11523 3.90909H17.346M1.11523 14.0909H17.346M1.79152 17H16.6697C17.0432 17 17.346 16.6744 17.346 16.2727V1.72727C17.346 1.32561 17.0432 1 16.6697 1H1.79152C1.41802 1 1.11523 1.32561 1.11523 1.72727V16.2727C1.11523 16.6744 1.41802 17 1.79152 17Z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                        fontSize: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                        className={
                          documentPageMargins.title == "Standard"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                      >
                        Standard
                      </div>
                      <div
                        className={
                          documentPageMargins.title == "Standard"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                        style={{
                          fontSize: 12,
                          position: "relative",
                          bottom: 2,
                        }}
                      >
                        Top: 2.54 cm, Bottom: 2.54 cm, Left: 2.54 cm, Right:
                        2.54 cm
                      </div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  className="margins"
                  onClick={() =>
                    handleSelectMargins({
                      title: "Narrow",
                      top: "1.27cm",
                      bottom: "1.27cm",
                      left: "1.27cm",
                      right: "1.27cm",
                    })
                  }
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          className={
                            documentPageMargins.title === "Narrow"
                              ? "margins-svg-selected"
                              : "margins-svg"
                          }
                          d="M2.80594 1V17M15.6553 1V17M1.11523 2.81818H17.346M1.11523 15.1818H17.346M1.79152 17H16.6697C17.0432 17 17.346 16.6744 17.346 16.2727V1.72727C17.346 1.32561 17.0432 1 16.6697 1H1.79152C1.41802 1 1.11523 1.32561 1.11523 1.72727V16.2727C1.11523 16.6744 1.41802 17 1.79152 17Z"
                          stroke="#7F7F7F"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                        className={
                          documentPageMargins.title == "Narrow"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                      >
                        Narrow
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          position: "relative",
                          bottom: 2,
                        }}
                        className={
                          documentPageMargins.title == "Narrow"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                      >
                        Top: 1.27 cm, Bottom: 1.27 cm, Left: 1.27 cm, Right:
                        1.27 cm{" "}
                      </div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSelectMargins({
                      title: "Moderate",
                      top: "2.54cm",
                      bottom: "2.54cm",
                      left: "1.91cm",
                      right: "1.91cm",
                    })
                  }
                  className="margins"
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          className={
                            documentPageMargins.title === "Moderate"
                              ? "margins-svg-selected"
                              : "margins-svg"
                          }
                          d="M3.14408 1V17M15.3172 1V17M1.11523 3.90909H17.346M1.11523 14.0909H17.346M1.79152 17H16.6697C17.0432 17 17.346 16.6744 17.346 16.2727V1.72727C17.346 1.32561 17.0432 1 16.6697 1H1.79152C1.41802 1 1.11523 1.32561 1.11523 1.72727V16.2727C1.11523 16.6744 1.41802 17 1.79152 17Z"
                          stroke="#7F7F7F"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                        fontSize: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "",
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                        className={
                          documentPageMargins.title == "Moderate"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                      >
                        Moderate
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          position: "relative",
                          bottom: 2,
                        }}
                        className={
                          documentPageMargins.title == "Moderate"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                      >
                        Top: 2.54 cm, Bottom: 2.54 cm, Left: 1.91 cm, Right:
                        1.91 cm
                      </div>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleSelectMargins({
                      title: "Wide",
                      top: "2.54cm",
                      bottom: "2.54cm",
                      left: "5.08cm",
                      right: "5.08cm",
                    })
                  }
                  className="margins"
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          className={
                            documentPageMargins.title === "Wide"
                              ? "margins-svg-selected"
                              : "margins-svg"
                          }
                          d="M5.51107 1V17M12.9502 1V17M1.11523 3.90909H17.346M1.11523 14.0909H17.346M1.79152 17H16.6697C17.0432 17 17.346 16.6744 17.346 16.2727V1.72727C17.346 1.32561 17.0432 1 16.6697 1H1.79152C1.41802 1 1.11523 1.32561 1.11523 1.72727V16.2727C1.11523 16.6744 1.41802 17 1.79152 17Z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className=" ml-2"
                      style={{
                        alignSelf: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          position: "relative",
                          top: 2,
                        }}
                        className={
                          documentPageMargins.title == "Wide"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                      >
                        Wide
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          position: "relative",
                          bottom: 2,
                        }}
                        className={
                          documentPageMargins.title == "Wide"
                            ? "margins-color-selected"
                            : "margins-color"
                        }
                      >
                        Top: 2.54 cm, Bottom: 2.54 cm, Left: 5.08 cm, Right:
                        5.08 cm
                      </div>
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </span>
          </a>
        </span>
        {openMargins ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-8"
            place="bottom"
          />
        )}

        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-9"
            data-tooltip-content="Orientation"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <OrientationSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                id="orientation-button"
                aria-controls={openOrientation ? "orientation-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openOrientation ? "true" : undefined}
                onClick={(e) => {
                  handleOpenOrientation(e);
                }}
              >
                <DropdownImage />
              </span>
              <Menu
                id="orientation-menu" // Updated ID to avoid conflict
                anchorEl={anchorElOrientation}
                open={openOrientation}
                onClose={handleCloseOrientation}
                MenuListProps={{
                  "aria-labelledby": "orientation-button", // Updated aria-labelledby
                }}
              >
                <MenuItem
                  onClick={() => handleSelectOrientation("potrait")}
                  className="orientation"
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="20"
                        viewBox="0 0 16 20"
                        fill="none"
                      >
                        <path
                          className={
                            documentPageSize.title !== "Landscape"
                              ? "orientation-svg-selected"
                              : "orientation-svg"
                          }
                          d="M1.77778 0C0.791111 0 0 1.04687 0 2.35252V18.8202C0 20.1141 0.791111 19.9965 1.77778 19.9965H14.2222C15.2089 19.9965 16 20.1258 16 18.8202V7.05757L10.6667 0H1.77778ZM15.1111 19.0909H0.888889V0.909091H8.88889V9.4101H15.1111V19.0909ZM9.77778 8.23384V0.909091L12.4444 4.70505L15.1111 8.23384H9.77778Z"
                        />
                      </svg>
                    </div>
                    <div
                      className={
                        documentPageSize.title !== "Landscape"
                          ? "orientation-color-selected ml-2"
                          : "orientation-color ml-2"
                      }
                      style={{
                        alignSelf: "center",
                        fontSize: "14px",
                      }}
                    >
                      Portrait
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  className="orientation"
                  onClick={() => handleSelectOrientation("landscape")}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="16"
                        viewBox="0 0 20 16"
                        fill="none"
                      >
                        <path
                          className={
                            documentPageSize.title == "Landscape"
                              ? "orientation-svg-selected"
                              : "orientation-svg"
                          }
                          d="M20 1.77778C20 0.791111 18.9531 0 17.6475 0L1.1798 0C-0.114086 0 0.00354004 0.791111 0.00354004 1.77778V14.2222C0.00354004 15.2089 -0.125849 16 1.1798 16H12.9424L20 10.6667V1.77778ZM0.90909 15.1111V0.888889L19.0909 0.888889V8.88889H10.5899V15.1111L0.90909 15.1111ZM11.7662 9.77778H19.0909L15.295 12.4444L11.7662 15.1111V9.77778Z"
                          fill="#7F7F7F"
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        alignSelf: "center",
                        fontSize: "14px",
                      }}
                      className={
                        documentPageSize.title == "Landscape"
                          ? "orientation-color-selected ml-2"
                          : "orientation-color ml-2"
                      }
                    >
                      Landscape
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </span>
          </a>
        </span>

        {openOrientation ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-9"
            place="bottom"
          />
        )}

        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-10"
            data-tooltip-content="Size"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <PageSizeSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenSize(e);
                }}
                id="openSize-button"
                aria-controls={openSize ? "openSize-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openSize ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openSize-menu"
                anchorEl={anchorElSize}
                open={openSize}
                onClose={handleCloseSize}
                MenuListProps={{
                  "aria-labelledby": "openSize-button",
                }}
              >
                {pageSizes.map((size, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => handleSelectSize(size)}
                      className="page-sizing "
                    // style={{height:39}}
                    >
                      <div className="" style={{ padding: "0 8px" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          className={
                            documentPageSize.title == size.title
                              ? "page-sizing-color-selected"
                              : "page-sizing-color"
                          }
                        >
                          {size.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                          }}
                          className={
                            documentPageSize.title == size.title
                              ? "page-sizing-color-selected"
                              : "page-sizing-color"
                          }
                        >
                          {size.desc}
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </Menu>
            </span>
          </a>
        </span>
        {openSize ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-10"
            place="bottom"
          />
        )}

        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-11"
            data-tooltip-content="Columns"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 26 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill-hover"
                    d="M5 6H10M16 6H21M5 10H10M16 10H21M5 14H10M16 14H21M5 18H10M16 18H21M2.09091 23H23.9091C24.5116 23 25 22.5116 25 21.9091V2.09091C25 1.48842 24.5116 1 23.9091 1H2.09091C1.48842 1 1 1.48842 1 2.09091V21.9091C1 22.5116 1.48842 23 2.09091 23Z"
                    stroke="#7F7F7F"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 19,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenColumns(e);
                }}
                id="openColumns-button"
                aria-controls={openColumns ? "openColumns-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openColumns ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openColumns-menu"
                anchorEl={anchorElColumns}
                open={openColumns}
                onClose={handleCloseColumns}
                MenuListProps={{
                  "aria-labelledby": "openColumns-button",
                }}
              >
                <MenuItem
                  className="columns"
                  style={
                    {
                      // width: 136,
                      // background: selectedColumn === "one" ? "#edf4fb" : "",
                    }
                  }
                  onClick={() => handleClickColumns("one")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                      >
                        <path
                          className={
                            selectedColumn == "one"
                              ? "column-svg-selected"
                              : "column-svg"
                          }
                          d="M3.33333 4.21429H14.6667M3.33333 6.35714H14.6667M3.33333 8.5H14.6667M3.33333 10.6429H14.6667M3.33333 12.7857H14.6667M3.33333 14.9286H14.6667M3.33333 17.0714H14.6667M1.72727 21H16.2727C16.6744 21 17 20.556 17 20.0083V1.99174C17 1.44402 16.6744 1 16.2727 1H1.72727C1.32561 1 1 1.44401 1 1.99173V20.0083C1 20.556 1.32561 21 1.72727 21Z"
                          stroke="#7771E8"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                      }}
                      className={
                        selectedColumn == "one"
                          ? "column-color-selected mx-2"
                          : "column-color mx-2"
                      }
                    >
                      One
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  className="columns"
                  style={
                    {
                      // width: 136,
                      // background: selectedColumn === "two" ? "#edf4fb" : "",
                    }
                  }
                  onClick={() => handleClickColumns("two")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                      >
                        <path
                          className={
                            selectedColumn == "two"
                              ? "column-svg-selected"
                              : "column-svg"
                          }
                          d="M3.33333 4.21429H8M10 4.21429H14.6667M3.33333 6.35714H8M10 6.35714H14.6667M3.33333 8.5H8M10 8.5H14.6667M3.33333 10.6429H8M10 10.6429H14.6667M3.33333 12.7857H8M3.33333 14.9286H8M3.33333 17.0714H8M10 12.7857H14.6667M10 14.9286H14.6667M10 17.0714H14.6667M1.72727 21H16.2727C16.6744 21 17 20.556 17 20.0083V1.99174C17 1.44402 16.6744 1 16.2727 1H1.72727C1.32561 1 1 1.44401 1 1.99173V20.0083C1 20.556 1.32561 21 1.72727 21Z"
                          stroke="#7F7F7F"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                      }}
                      className={
                        selectedColumn == "two"
                          ? "column-color-selected mx-2"
                          : "column-color mx-2"
                      }
                    >
                      Two
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  className="columns"
                  onClick={() => handleClickColumns("three")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                      >
                        <path
                          className={
                            selectedColumn == "three"
                              ? "column-svg-selected"
                              : "column-svg"
                          }
                          d="M7.66667 4.21429H10.3333M12 4.21429H14.6667M3.33333 4.21429H6M3.33333 6.35714H6M3.33333 8.5H6M3.33333 10.6429H6M3.33333 12.7857H6M3.33333 14.9286H6M3.33333 17.0714H6M7.66667 6.35714H10.3333M12 6.35714H14.6667M12 8.5H14.6667M7.66667 8.5H10.3333M7.66667 10.6429H10.3333M7.66667 12.7857H10.3333M7.66667 14.9286H10.3333M7.66667 17.0714H10.3333M12 10.6429H14.6667M12 12.7857H14.6667M12 14.9286H14.6667M12 17.0714H14.6667M1.72727 21H16.2727C16.6744 21 17 20.556 17 20.0083V1.99174C17 1.44402 16.6744 1 16.2727 1H1.72727C1.32561 1 1 1.44401 1 1.99173V20.0083C1 20.556 1.32561 21 1.72727 21Z"
                          stroke="#7F7F7F"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                      }}
                      className={
                        selectedColumn == "three"
                          ? "column-color-selected mx-2"
                          : "column-color mx-2"
                      }
                    >
                      Three
                    </div>
                  </div>
                </MenuItem>
                {/* <MenuItem
                  className="columns"
                  onClick={() => handleClickColumns("left")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                      >
                        <path
                          className={
                            selectedColumn == "left"
                              ? "column-svg-selected"
                              : "column-svg"
                          }
                          d="M3.33333 4.21429H6.33333M8 4.21429H14.6667M3.33333 6.35714H6.33333M8 6.35714H14.6667M3.33333 8.5H6.33333M8 8.5H14.6667M3.33333 10.6429H6.33333M8 10.6429H14.6667M3.33333 12.7857H6.33333M3.33333 14.9286H6.33333M3.33333 17.0714H6.33333M8 12.7857H14.6667M8 14.9286H14.6667M8 17.0714H14.6667M1.72727 21H16.2727C16.6744 21 17 20.556 17 20.0083V1.99174C17 1.44402 16.6744 1 16.2727 1H1.72727C1.32561 1 1 1.44401 1 1.99173V20.0083C1 20.556 1.32561 21 1.72727 21Z"
                          stroke="#7F7F7F"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                      }}
                      className={
                        selectedColumn == "left"
                          ? "column-color-selected mx-2"
                          : "column-color mx-2"
                      }
                    >
                      Left
                    </div>
                  </div>
                </MenuItem>
                <MenuItem
                  className="columns"
                  onClick={() => handleClickColumns("right")}
                >
                  <div className="d-flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                      >
                        <path
                          className={
                            selectedColumn == "right"
                              ? "column-svg-selected"
                              : "column-svg"
                          }
                          d="M3.33333 4.21429H9.66667M11.3333 4.21429H14.6667M3.33333 6.35714H9.66667M11.3333 8.5H14.6667M3.33333 8.5H9.66667M11.3333 10.6429H14.6667M3.33333 10.6429H9.66667M11.3333 12.8182H14.6667M3.33333 12.8182H9.66667M3.33333 14.9286H9.66667M3.33333 17.0714H9.66667M11.3333 6.35714H14.6667M11.3333 14.9286H14.6667M11.3333 17.0714H14.6667M1.72727 21H16.2727C16.6744 21 17 20.556 17 20.0083V1.99174C17 1.44402 16.6744 1 16.2727 1H1.72727C1.32561 1 1 1.44401 1 1.99173V20.0083C1 20.556 1.32561 21 1.72727 21Z"
                          stroke="#7F7F7F"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                      }}
                      className={
                        selectedColumn == "right"
                          ? "column-color-selected mx-2"
                          : "column-color mx-2"
                      }
                    >
                      Right
                    </div>
                  </div>
                </MenuItem> */}
              </Menu>
            </span>
          </a>
        </span>
        {openColumns ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-11"
            place="bottom"
          />
        )}

        <span className="ql-formats b-r">
          <a
            data-tooltip-id="menu-item-12"
            data-tooltip-content="Track Changes"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 34 }}
              >
                <TrackChangeSvg />
              </span>
            </span>
          </a>
        </span>
        <ReactTooltip
          className="custom-tooltip"
          id="menu-item-12"
          place="bottom"
        />

        <span className="ql-formats" style={{ position: 'relative' }}>
          <a
            onClick={() => setShowGrid((prev) => !prev)}
            style={{ cursor: 'pointer' }}
          >
            <span className="d-flex ql-color fonts" style={{ height: 30, border: "1px solid #D9D9D9", borderRadius: 5 }}>
              <span className="d-flex justify-content-center align-items-center" style={{ width: 30 }}>
                <TableSvg />
              </span>
              <span className="d-flex justify-content-center align-items-center" style={{ width: 20 }}>
                <DropdownImage />
              </span>
            </span>
          </a>
    {showGrid &&
      ReactDOM.createPortal(
        <div
          style={{
            marginTop: 200,
            marginLeft: -380,
            padding: 5,
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: 4,
            width: 'fit-content',
            zIndex: 1000,
          }}
        >
          <TableGridPicker onSelect={handleTableSizeSelect} />
        </div>,
        document.getElementById('grid-picker-container')!
      )}
        </span>

        <ReactTooltip
          className="custom-tooltip"
          id="menu-item-13"
          place="bottom"
        />

        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-14"
            data-tooltip-content="Add a link"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
                cursor: "pointer",
              }}
              id="openLink-button"
              aria-controls={openLink ? "openLink-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openLink ? "true" : undefined}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 34 }}
                onMouseDown={handleOpenLink}
              >
                <LinkSvg />
              </span>
              <Menu
                id="openLink-menu"
                anchorEl={anchorElLink}
                open={openLink}
                closeAfterTransition
                onClose={handleCloseLink}
                MenuListProps={{
                  "aria-labelledby": "openLink-button",
                }}
              >
                <div
                  style={{
                    width: 300,
                    color: "#000000",
                  }}
                >
                  <div
                    className="text-center margins-color"
                    style={{
                      borderBottom: "0.5px solid #EEEEEE",
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    Insert/Edit Link
                  </div>
                  <div className="d-flex container py-1 align-items-center margins-color">
                    <label style={{ fontSize: 14, fontWeight: 400 }}>
                      Text to Display:
                    </label>
                    <input
                      type="text"
                      onChange={handleDisplayTextChange}
                      defaultValue={displayText}
                      className="input-link"
                      style={{
                        width: 168,
                        border: "1px solid #EEE",
                        height: 30,
                        fontSize: 12,
                        marginLeft: 4,
                        padding: "0 3px",
                        outline: "none",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <div
                    className="container margins-color"
                    style={{ fontSize: 12 }}
                  >
                    Link to an existing file or web page.
                  </div>
                  <div className="d-flex container py-1 align-items-center margins-color">
                    <label style={{ fontSize: 14, fontWeight: 400 }}>
                      Address:
                    </label>
                    <input
                      value={linkUrl}
                      onChange={handleLinkUrlChange}
                      type="text"
                      className="input-link"
                      style={{
                        width: 173,
                        border: "1px solid #EEE",
                        height: 30,
                        fontSize: 12,
                        marginLeft: 4,
                        padding: "0 3px",
                        outline: "none",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <div className="d-flex container py-1 align-items-center justify-content-end">
                    <div>
                      <button
                        className="btn-cancel-link"
                        style={{
                          width: 55,
                          height: 30,
                          border: "1px solid #EEE",
                          fontSize: 12,
                          borderRadius: 8,
                          fontWeight: 400,
                        }}
                        onClick={handleCloseLink}
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        className="ml-2 btn-save-link"
                        style={{
                          width: 40,
                          height: 30,
                          border: "1px solid #EEE",
                          fontSize: 12,
                          borderRadius: 8,
                          color: "black",
                          fontWeight: 400,
                        }}
                        onClick={handleAddLink}
                        disabled={isSaving}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Menu>
            </span>
          </a>
        </span>
        {openLink ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-14"
            place="bottom"
          />
        )}

        <span className="ql-formats">
          <a
            data-tooltip-id="menu-item-picture"
            data-tooltip-content="Insert Picture"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <PictureSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenPicture(e);
                }}
                id="openPicutre-button"
                aria-controls={openPicutre ? "openPicutre-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openPicutre ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openPicutre-menu"
                anchorEl={anchorElPicture}
                open={openPicutre}
                onClose={handleClosePicture}
                MenuListProps={{
                  "aria-labelledby": "openPicutre-button",
                }}
              >
                <MenuItem onClick={handlePictureFromFile} className="media">
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="16"
                        viewBox="0 0 18 16"
                        fill="none"
                      >
                        <path
                          className="media-svg"
                          d="M13.6316 5.66667V1H1V8M7.73684 11.7333H1V8M1 8L5.21053 3.8L7.73684 6.13333"
                          stroke="#7F7F7F"
                        />
                        <ellipse
                          cx="11.1053"
                          cy="3.79997"
                          rx="0.842105"
                          ry="0.933333"
                          fill="#7F7F7F"
                        />
                        <path
                          className="media-svg"
                          d="M12.7896 12.7091V15M10.6844 15H14.8949M17.0002 11.9454C17.0002 12.3672 16.686 12.7091 16.2984 12.7091H9.28086C8.89329 12.7091 8.5791 12.3672 8.5791 11.9454V7.36361C8.5791 6.94187 8.89329 6.59998 9.28086 6.59998H16.2984C16.686 6.59998 17.0002 6.94187 17.0002 7.36361V11.9454Z"
                          stroke="#7F7F7F"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 13 }}
                      className="media-color"
                    >
                      Picture from File
                    </div>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleOpenLinkPicture} className="media">
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <path
                          className="media-svg"
                          d="M11.909 14.0909C10.6623 13.1559 10.0389 11.2857 10.0389 9.72728C10.0389 8.16884 10.6623 6.29871 11.909 5.36365M11.909 14.0909C13.1558 13.1559 13.7792 11.2857 13.7792 9.72728C13.7792 8.16884 13.1558 6.29871 11.909 5.36365M11.909 14.0909C14.319 14.0909 16.2727 12.1373 16.2727 9.72728M11.909 14.0909C9.49908 14.0909 7.54541 12.1373 7.54541 9.72728M11.909 5.36365C14.319 5.36365 16.2727 7.31731 16.2727 9.72728M11.909 5.36365C9.49908 5.36365 7.54541 7.31731 7.54541 9.72728M7.96557 7.85715H15.8525M7.96557 11.5974H15.8525M7.54541 9.72728H16.2727"
                          stroke="#7F7F7F"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          className="media-svg"
                          d="M13.3077 4.69231V1H1V7.15385M6.45455 10.4359H1V7.15385M1 7.15385L5.10256 3.46154L7.90909 5.72727"
                          stroke="#7F7F7F"
                        />
                        <ellipse
                          cx="11.2565"
                          cy="3.87178"
                          rx="0.820513"
                          ry="0.820513"
                          fill="#7F7F7F"
                        />
                      </svg>
                    </div>

                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 13 }}
                      className="media-color"
                    >
                      Online Pictures
                    </div>
                  </div>
                </MenuItem>
              </Menu>
              <Menu
                id="openLinkPicture-menu"
                anchorEl={anchorElLinkPicture}
                open={openLinkPicture}
                onClose={handleCloseLinkPicture}
                MenuListProps={{
                  "aria-labelledby": "openLinkPicture-button",
                }}
              >
                <div className="d-flex container py-1 align-items-center">
                  <label style={{ fontSize: 14, fontWeight: 550 }}>
                    Address:
                  </label>
                  <input
                    value={linkUrlImage}
                    onChange={(e) => setLinkUrlImage(e.target.value)}
                    type="text"
                    style={{
                      width: 211,
                      border: "0.5px solid #00000080",
                      height: 16,
                      fontSize: 12,
                      marginLeft: 4,
                      padding: "0 3px",
                      outline: "none",
                    }}
                  />
                </div>
                <div className="d-flex container py-1 align-items-center justify-content-end">
                  <div>
                    <button
                      className=""
                      style={{
                        width: 60,
                        height: 24,
                        border: "1px solid #00000080",
                        fontSize: 12,
                        borderRadius: 5,
                        fontWeight: 550,
                      }}
                      onClick={handleCloseLinkPicture}
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      className="ml-2"
                      style={{
                        width: 60,
                        height: 24,
                        border: "1px solid #00000080",
                        fontSize: 12,
                        borderRadius: 5,
                        background: "#174B8B",
                        color: "#fefefe",
                        fontWeight: 550,
                      }}
                      onClick={handleAddLinkPicture}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Menu>
            </span>
          </a>
        </span>
        {openPicutre ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-picture"
            place="bottom"
          />
        )}

        <span className="ql-formats b-r">
          <a
            data-tooltip-id="menu-item-15"
            data-tooltip-content="Media"
            data-tooltip-place="bottom"
          >
            <span
              className="d-flex ql-color fonts"
              style={{
                height: 30,
                border: "1px solid #D9D9D9",
                borderRadius: 5,
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center"
                style={{ width: 30 }}
              >
                <MediaSvg />
              </span>
              <span
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: 20,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  handleOpenMedia(e);
                }}
                id="openMedia-button"
                aria-controls={openMedia ? "openMedia-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMedia ? "true" : undefined}
              >
                <DropdownImage />
              </span>
              <Menu
                id="openPicutre-menu"
                anchorEl={anchorElMedia}
                open={openMedia}
                onClose={handleCloseMedia}
                MenuListProps={{
                  "aria-labelledby": "openMedia-button",
                }}
              >
                <MenuItem onClick={handleVideoFromFile} className="media">
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="none"
                      >
                        <path
                          className="media-svg"
                          d="M14 5.16667H14.5V4.66667V3.11111V2.61111H14H12H11.5V3.11111V4.66667V5.16667H12H14ZM14 8.27778H14.5V7.77778V6.22222V5.72222H14H12H11.5V6.22222V7.77778V8.27778H12H14ZM14 11.3889H14.5V10.8889V9.33333V8.83333H14H12H11.5V9.33333V10.8889V11.3889H12H14ZM4 5.16667H4.5V4.66667V3.11111V2.61111H4H2H1.5V3.11111V4.66667V5.16667H2H4ZM4 8.27778H4.5V7.77778V6.22222V5.72222H4H2H1.5V6.22222V7.77778V8.27778H2H4ZM4 11.3889H4.5V10.8889V9.33333V8.83333H4H2H1.5V9.33333V10.8889V11.3889H2H4ZM14 2.05556H14.5V1.55556V0.5H15.5V13.5H14.5V12.4444V11.9444H14H12H11.5V12.4444V13.5H4.5V12.4444V11.9444H4H2H1.5V12.4444V13.5H0.5V0.5H1.5V1.55556V2.05556H2H4H4.5V1.55556V0.5H11.5V1.55556V2.05556H12H14Z"
                          stroke="#7F7F7F"
                        />
                      </svg>
                    </div>
                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 13 }}
                      className="media-color"
                    >
                      Video from File
                    </div>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleAudioFromFile} className="media">
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="none"
                      >
                        <path
                          className="media-svg"
                          d="M3.88962 9.0225L3.7471 8.89453H3.55556H0.5V5.10547H3.55556H3.7471L3.88962 4.9775L7.5 1.73556V12.2644L3.88962 9.0225ZM14.7222 7C14.7222 4.33321 12.84 2.1071 10.2778 1.27116V0.636133C13.3312 1.50369 15.5 4.05206 15.5 7C15.5 9.94794 13.3312 12.4963 10.2778 13.3639V12.7209C12.8392 11.8859 14.7222 9.66755 14.7222 7ZM10.2778 4.65058C11.0425 5.22437 11.5 6.06988 11.5 7C11.5 7.92627 11.0407 8.77414 10.2778 9.33697V4.65058Z"
                          stroke="#7F7F7F"
                        />
                      </svg>
                    </div>

                    <div
                      style={{ position: "relative", bottom: 2, fontSize: 13 }}
                      className="media-color"
                    >
                      Audio from File
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </span>
          </a>
        </span>
        {openMedia ? null : (
          <ReactTooltip
            className="custom-tooltip"
            id="menu-item-15"
            place="bottom"
          />
        )}

        <span className="ql-formats">
          <button
            className=" btn-undo mr-2"
            id="formula"
            onClick={handleOpenFormula}
          >
            <FormulaSvg />
          </button>
          <Menu
            id="openFormula-menu"
            anchorEl={anchorElFormula}
            open={openFormula}
            closeAfterTransition
            onClose={handleCloseformula}
            MenuListProps={{
              "aria-labelledby": "openFormula-button",
            }}
          >
            <div
              style={{
                width: 300,
                color: "#000000",
              }}
            >
              <div
                className="text-center margins-color"
                style={{
                  borderBottom: "0.5px solid #EEEEEE",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                Add Formula
              </div>
              <div className="d-flex container py-1 align-items-center margins-color">
                <label style={{ fontSize: 14, fontWeight: 400 }}>Text:</label>
                <input
                  type="text"
                  onChange={handleFormulaChange}
                  defaultValue={displayFormula}
                  className="input-link"
                  style={{
                    width: "100%",
                    border: "1px solid #EEE",
                    height: 30,
                    fontSize: 12,
                    marginLeft: 4,
                    padding: "0 3px",
                    outline: "none",
                    borderRadius: 8,
                  }}
                />
              </div>
              <div className="d-flex container py-1 align-items-center justify-content-end">
                <div>
                  <button
                    className="btn-cancel-link"
                    style={{
                      width: 55,
                      height: 30,
                      border: "1px solid #EEE",
                      fontSize: 12,
                      borderRadius: 8,
                      fontWeight: 400,
                    }}
                    onClick={() => setAnchorElFormula(null)}
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <button
                    className="ml-2 btn-save-link"
                    style={{
                      width: 40,
                      height: 30,
                      border: "1px solid #EEE",
                      fontSize: 12,
                      borderRadius: 8,
                      color: "black",
                      fontWeight: 400,
                    }}
                    onClick={handleInsertFormula}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Menu>
          <button
            className=" btn-undo mr-2"
            id="code"
            onClick={handleInsertCodeBlock}
          >
            <SourceCodeSvg />
          </button>
          <button className="btn-undo" id="clean" onClick={handleClean}>
            <ClearFormattingSvg />
          </button>
        </span>

        <ReactTooltip
          anchorId="formula"
          className="custom-tooltip"
          place="bottom"
          content={"Formula"}
        />
        <ReactTooltip
          anchorId="code"
          className="custom-tooltip"
          place="bottom"
          content={"Source Code"}
        />
        <ReactTooltip
          anchorId="clean"
          className="custom-tooltip"
          place="bottom"
          content={"Clean"}
        />
      </div>
      <button onClick={scrollRight} className="scroll-left justify-flex-end">
        <ScrollRightSvg />
      </button>
      <div id="grid-picker-container"></div>

    </div>
  );
}