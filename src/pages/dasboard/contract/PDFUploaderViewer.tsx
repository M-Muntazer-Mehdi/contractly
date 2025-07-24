/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  Annotation,
  TextSearch,
  FormDesigner,
  FormFields,
  PageOrganizer,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";

const PDFUploaderViewer = ({ documentPath }: any) => {
  function documentLoaded() {
    const containerElement: any = document.getElementById("container");

    if (
      containerElement &&
      containerElement.ej2_instances &&
      containerElement.ej2_instances.length > 0
    ) {
      // const viewer = containerElement.ej2_instances[0];
      // Now you can use 'viewer' safely here
      // viewer.formDesignerModule.addFormField("Textbox", {
      //   name: "First Name",
      //   bounds: { X: 336, Y: 230, Width: 150, Height: 24 },
      // });
      // viewer.formDesignerModule.addFormField("Textbox", {
      //   name: "Middle Name",
      //   bounds: { X: 338, Y: 279, Width: 150, Height: 24 },
      // });
      // viewer.formDesignerModule.addFormField("RadioButton", {
      //   bounds: { X: 338, Y: 310, Width: 18, Height: 18 },
      //   name: "Gender",
      //   isSelected: false,
      // });
      // viewer.formDesignerModule.addFormField("CheckBox", {
      //   name: "Text Message",
      //   bounds: { X: 56, Y: 304, Width: 20, Height: 20 },
      //   isChecked: false,
      // });
      // viewer.formDesignerModule.addFormField("SignatureField", {
      //   name: "Sign",
      //   bounds: { X: 338, Y: 343, Width: 200, Height: 43 },
      // });
      // viewer.formDesignerModule.updateFormField(
      //   viewer.formFieldCollections[0],
      //   {
      //     backgroundColor: "red",
      //   }
      // );
    }
  }

  return (
    <div style={{ backgroundColor: "white" }}>
      {documentPath && (
        <div className="control-section" style={{ backgroundColor: "#fff" }}>
          {/* Render the PDF Viewer */}

          <PdfViewerComponent
            id="container"
            documentPath={documentPath}
            resourceUrl="https://cdn.syncfusion.com/ej2/25.1.35/dist/ej2-pdfviewer-lib"
            documentLoad={documentLoaded}
            height="685px"
          >
            <Inject
              services={[
                Magnification,
                Navigation,
                Annotation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
                FormDesigner,
                FormFields,
                PageOrganizer,
              ]}
            />
          </PdfViewerComponent>
        </div>
      )}
    </div>
  );
};
export default PDFUploaderViewer;
