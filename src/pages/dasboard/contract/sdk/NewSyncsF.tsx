/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */

import React, { useRef, useState, useEffect } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  CustomToolbarItemModel,
} from "@syncfusion/ej2-react-documenteditor";

import * as jQueryLibrary from "jquery"; // Rename the import
const $ = jQueryLibrary;

DocumentEditorContainerComponent.Inject(Toolbar);
function NewSyncsF() {
  const editorContainerRef: any = useRef(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    file: false,
    view: false,
    signature: false,
    export: false,
    attach: false,
  });
  const [showPropertiesPane, setShowPropertiesPane] = useState(false);
  useEffect(() => {
    // Here you can place any condition or dependency to toggle the pane
    const handle = setInterval(() => {
      setShowPropertiesPane((current) => !current); // Example toggle every few seconds
    }, 5000);

    return () => clearInterval(handle);
  }, []);
  // Full list of toolbar items
  const items: any = [
    // customItem,
    "New",
    "Open",
    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "InsertEndnote",
    "InsertFootnote",
    "Separator",
    "Find",
    "Separator",
    "TrackChanges",
    "Comments",
    "Separator",
    "LocalClipboard",
    "RestrictEditing",
    "Separator",
    "FormFields",
    "UpdateFields",
  ];
  //   $(".e-toolbar-item").css("display", "none");
  //   $(".e-btn-icon").css("display", "none");
  const triggerClick = (id: string) => {
    $(`#${id}`).trigger("click");
    // $("#container_toolbar_open").parent().css("display", "block");
  };

  return (
    <div>
      <div className="flex border p-4 gap-4">
        {/* File Button and Dropdown */}
        <div className="relative">
          {openDropdowns.file && (
            <ul className="absolute left-0 mt-2 w-40 bg-red shadow-lg rounded z-10">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  triggerClick("container_toolbar_open");
                }}
              >
                Open
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Save</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Edit</li>
            </ul>
          )}
        </div>
      </div>

      <DocumentEditorContainerComponent
        ref={editorContainerRef}
        id="container"
        height="620px"
        toolbarItems={items}
        showPropertiesPane={showPropertiesPane}
      />
    </div>
  );
}
export default NewSyncsF;
