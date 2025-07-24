import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { ContractContext } from "@/context/ContractContext";
import { useContext, useRef, useState } from "react";
export default function EditorFooter(props: any) {
  const { width, setEditorZoom ,editorZoom} = props;
  const context = useContext(ContractContext);
  const {pages,currentPage} = context;

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


  const zoomOptions = [
    "200%",
    "175%",
    "150%",
    "125%",
    "100%",
    "75%",
    "50%",
    "25%",
  ];
  const handleZoomChange = (event: SelectChangeEvent<HTMLElement>) => {
    // const val = event.target.value;
    setEditorZoom(event.target.value);
  };

  const [menuTop, setMenuTop] = useState('616px'); // Initial top value as string
  const selectRef = useRef<any>(null);

  // console.log(menuTop);

  const handleOpen = (event:any) => {
      // Get the current top position of the select
      const popper = event.currentTarget.nextElementSibling; // The Popper follows the Select
      // console.log(popper)
      if (popper) {
          const rect = popper.getBoundingClientRect();
          const currentTop = rect.top;

          // Subtract 30px from the current top position
          const newTop = `${currentTop - 290}px`;

          // Set the adjusted top position
          setMenuTop(newTop);
      }
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        background: "rgb(234 233 233)",
        height: "44px",
        width: `${width}px`,
        border: "1px solid rgb(234 233 233)",
      }}
    >
      <div
        className="d-flex px-2 align-items-center justify-content-between"
        style={{ height: "100%" }}
      >
        <div className="pages font" style={{ fontSize: 14 }}>
          <span className="mx-2">Page</span>
          <span
            style={{
              height: 20,
              width: 22,
              background: "white",
              border: "1px solid rgb(234 233 233)",
            }}
            className="px-1 mr-2"
          >
            {currentPage+1}
          </span>
          <span className="mr-2">of</span>
          <span>{pages.length}</span>
        </div>
        <div>
            <span className="ql-formats">
              <Select
                style={{
                  width: "93px",
                  height: 30,
                  borderColor: "#D9D9D9",
                  borderRadius: 5,
                  color: "#626469",
                }}
                className="ql-size select-comps"
                IconComponent={SelectDropdownImage2}
                onChange={handleZoomChange}
                value={editorZoom}
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
                  "&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root": {
                    fill: "#7771e8 !important",
                  },
                  ".MuiSvgIcon-root": {
                    fill: "#7F7F7F !important",
                  },
                  fontSize: "13px",
                }}
                onOpen={handleOpen}
                ref={selectRef}
                MenuProps={{
                    PaperProps: {
                        sx: {
                          top: menuTop + ' !important',
                        }
                    }
                }}
              >
                {zoomOptions.map((val,index)=>{
                  return (
                    <MenuItem
                    style={{
                      color: "#7F7F7F",
                      fontSize: "13px",
                    }}
                    key={index}
                    className={
                      editorZoom === val
                        ? `selected-font select-fonts `
                        : ` select-fonts`
                    }
                    value={val}
                    >
                    {val}
                  </MenuItem>
                  )
                })} 
              </Select>
            </span>
            
        </div>
      </div>
    </div>
  );
}
