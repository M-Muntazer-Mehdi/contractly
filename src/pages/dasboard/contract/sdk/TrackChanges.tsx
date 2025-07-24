import React, { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ContractContext } from "@/context/ContractContext";

const options = [
  "Accept All Insertion By User",
  "Accept All Rejection By User",
];
const TrackChanges = (props:any) => {
  const {rejectChange} = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;

  const { trackChanges, setTrackChanges } = useContext(ContractContext);

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        background: "#fefefe",
        minHeight: "100%",
      }}
    >
      <div className="py-2">
        <h5 className="container">Changes</h5>
        <div
          className="toolbar py-2 d-flex container"
          style={{
            border: "1px solid #e0e0e0",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <span style={{ fontSize: 17, color: "#b2b2b2" }}>User:</span>
          <select
            className="form-select"
            style={{
              width: "37%",
              border: "none",
            }}
          >
            <option selected>All</option>
            <option value="1">One</option>
            <option value="2">Two</option>
          </select>
          <span style={{ fontSize: 17, color: "#b2b2b2" }}>View:</span>
          <select
            className="form-select"
            style={{
              width: "37%",
              border: "none",
            }}
          >
            <option selected>All</option>
            <option value="1">Inserted</option>
            <option value="2">Deleted</option>
          </select>
          <div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  // width: '20ch',
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={handleClose}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
        {trackChanges?.map((e: any, index: number) => {
          return (
            <div
              key={index}
              className="container py-2"
              style={{
                borderBottom: "1px solid #d8d8d8",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center">
                    <div
                      className="icon"
                      style={{
                        height: 35,
                        width: 35,
                        borderRadius: "50%",
                        background: "#b5082e",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      {e?.user
                        ?.split(" ")
                        .map((e: any) => e.charAt(0))
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <h6 className="pt-2 px-2">{e.user}</h6>
                    </div>
                  </div>
                  <div className="time pt-2">
                    <p style={{ color: "#b1b1b1", fontSize: 14 }}>
                      {new Date(e.date).toLocaleString()}
                    </p>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: e.changes }}
                    style={{
                      width: "100%",
                      wordWrap: "break-word", 
                      overflowWrap: "break-word",
                      boxSizing: "border-box",
                      whiteSpace:"pre-wrap"
                    }}
                  />
                </div>
                <div
                  className={
                    e.action === "INSERTED" ? "text-success" : "text-danger"
                  }
                >
                  {e.action}
                </div>
              </div>
              <div className="row py-2">
                <div>
                  <button className="btn btn-primary">Accept</button>
                  <span className="px-2">
                    <button className="btn btn-danger" onClick={()=>{
                      rejectChange(e)
                    }}>Reject</button>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TrackChanges;
