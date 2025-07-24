/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

const CustomTextEditor: React.FC = () => {
  const [editorData, setEditorData] = useState<string>("");

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };

  return <div></div>;
};

export default CustomTextEditor;
