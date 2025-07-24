/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useRef, useEffect } from "react";

import DialogActions from "@mui/material/DialogActions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import logo from "@/assets/collaburater_icon.png";

import { ContractContext } from "@/context/ContractContext";

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  documentPath: any;
  setDocumentPath: (path: string) => void;
  triggerClick: () => void;
}

const SyncFesionFileDilog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  documentPath,
  setDocumentPath,
  triggerClick,
}) => {
  const fileInputRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const bubbleColors = ["#FEC85E", "#BC3D89", "green", "#00A7B1"];
  const { setDucomentName, setShowBlock, setDocumentContent } =
    useContext(ContractContext);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileName = file.name;
      console.log("Uploaded file name:", fileName);
      setDucomentName(fileName);
      const reader: any = new FileReader();
      reader.onloadend = function () {
        const base64String: any = reader.result.replace(
          "data:application/pdf;base64,",
          ""
        );
        setDocumentPath(base64String);
      };
      reader.readAsDataURL(file);
      setShowBlock("pdf");
      setDocumentContent("pdf");
      onClose();
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Dialog
            border: "1.5px dashed #174B8B", // Customizing the border to dashed
            borderRadius: "16px", // Adding border radius
          },
        }}
      >
        <DialogTitle
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // borderBottom: "1px solid black",
          }}
        >
          {/* <Typography
            variant="body1"
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            Select the type of document you are importing:
          </Typography> */}
          <Tooltip title="Close">
            <IconButton
              onClick={() => {
                onClose();
              }}
              aria-label="close"
              size="small"
              sx={{ position: "absolute", top: -1, right: 0 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: "30vh" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Center-align items horizontally in the box
              justifyContent: "center", // Center-align items vertically in the box
              // Take full width of the container
              // Margin top and bottom for spacing
              my: "1rem",
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
            />

            <div style={{ marginRight: "2rem" }}>
              <svg
                width="60"
                height="80"
                viewBox="0 0 60 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M59.9998 12.2397V77.2024C59.9998 78.7452 58.8977 80 57.5427 80H12.2852C10.9302 80 9.82812 78.7452 9.82812 77.2024V2.79763C9.82812 1.25482 10.9302 0 12.2852 0H49.2319L59.9998 12.2397Z"
                  fill="white"
                />
                <path
                  d="M18.7165 36.3692V60.1902C18.7165 61.2599 17.9577 62.1239 17.0183 62.1239H9.8457V34.4355H17.0183C17.9397 34.4355 18.7165 35.2995 18.7165 36.3692Z"
                  fill="#E5E5E5"
                />
                <path
                  d="M60.0008 12.2397V77.2024C60.0008 78.7452 58.8987 80 57.5437 80H54.0388C55.3938 80 56.4959 78.7452 56.4959 77.2024V12.2397L45.7461 0H49.2511L60.0008 12.2397Z"
                  fill="#E5E5E5"
                />
                <path
                  d="M59.9998 12.2396H51.7071C50.3521 12.2396 49.25 10.9848 49.25 9.44201V0L59.9998 12.2396Z"
                  fill="#92929D"
                />
                <path
                  d="M49.6297 18.4929H20.4878C19.5122 18.4929 18.6992 17.5878 18.6992 16.4564C18.6992 15.3456 19.4942 14.4199 20.4878 14.4199H49.6297C50.6053 14.4199 51.4183 15.325 51.4183 16.4564C51.4183 17.5878 50.6053 18.4929 49.6297 18.4929Z"
                  fill="#92929D"
                />
                <path
                  d="M49.6297 28.8816H20.4878C19.5122 28.8816 18.6992 27.9765 18.6992 26.8451C18.6992 25.7343 19.4942 24.8086 20.4878 24.8086H49.6297C50.6053 24.8086 51.4183 25.7137 51.4183 26.8451C51.4183 27.9765 50.6053 28.8816 49.6297 28.8816Z"
                  fill="#92929D"
                />
                <path
                  d="M49.6297 39.2693H20.4878C19.5122 39.2693 18.6992 38.3642 18.6992 37.2328C18.6992 36.122 19.4942 35.1963 20.4878 35.1963H49.6297C50.6053 35.1963 51.4183 36.1014 51.4183 37.2328C51.4183 38.3642 50.6053 39.2693 49.6297 39.2693Z"
                  fill="#92929D"
                />
                <path
                  d="M49.6297 49.3084H20.4878C19.5122 49.3084 18.6992 48.4033 18.6992 47.2719C18.6992 46.161 19.4942 45.2354 20.4878 45.2354H49.6297C50.6053 45.2354 51.4183 46.1405 51.4183 47.2719C51.4183 48.3827 50.6053 49.3084 49.6297 49.3084Z"
                  fill="#92929D"
                />
                <path
                  d="M49.6297 59.697H20.4878C19.5122 59.697 18.6992 58.7919 18.6992 57.6605C18.6992 56.5497 19.4942 55.624 20.4878 55.624H49.6297C50.6053 55.624 51.4183 56.5291 51.4183 57.6605C51.4183 58.7919 50.6053 59.697 49.6297 59.697Z"
                  fill="#92929D"
                />
                <path
                  d="M49.6297 70.0847H20.4878C19.5122 70.0847 18.6992 69.1796 18.6992 68.0482C18.6992 66.9374 19.4942 66.0117 20.4878 66.0117H49.6297C50.6053 66.0117 51.4183 66.9168 51.4183 68.0482C51.4183 69.1796 50.6053 70.0847 49.6297 70.0847Z"
                  fill="#92929D"
                />
                <path
                  d="M22.6197 58.3798H1.69829C0.758812 58.3798 0 57.5158 0 56.4462V32.6046C0 31.5349 0.758812 30.6709 1.69829 30.6709H22.6197C23.5592 30.6709 24.318 31.5349 24.318 32.6046V56.4256C24.3361 57.5158 23.5592 58.3798 22.6197 58.3798Z"
                  fill="#3586CB"
                />
                <path
                  d="M20.9761 56.1788H3.36088C2.56594 56.1788 1.93359 55.4383 1.93359 54.5537V34.4972C1.93359 33.592 2.584 32.8721 3.36088 32.8721H20.9761C21.771 32.8721 22.4033 33.6126 22.4033 34.4972V54.5537C22.4033 55.4588 21.7529 56.1788 20.9761 56.1788Z"
                  fill="white"
                />
                <path
                  d="M7.29747 52.2289H4.62359L3.90092 39.2281H2.58203L3.05176 36.8213H8.58021L8.09242 39.2281H6.88195L7.26135 46.7981L10.9831 39.2281H9.64616L10.1159 36.8213H14.9578L14.47 39.2281H13.2595L13.657 46.7981L17.3607 39.2281H16.0238L16.4935 36.8213H21.7509L21.2812 39.2281H20.0527L13.6931 52.2289H11.0012L10.6579 45.4405L7.29747 52.2289Z"
                  fill="#366FCA"
                />
              </svg>
            </div>

            <Button
              onClick={() => {
                setShowBlock("");
                setTimeout(() => {
                  triggerClick();
                }, 500); // Delay of 1000 milliseconds (1 second)
                onClose();
                setDocumentContent("word");
              }}
              variant="outlined"
              sx={{
                display: "table-cell",
                padding: "15px",
                pt: 2,
                height: "7vh",
                width: "60%",
                color: "black",
                justifyContent: "center",
                textTransform: "none",
                border: "1.5px dashed #174B8B",
                borderWidth: 1,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                borderRadius: "10px", // Adds rounded corners
                backgroundColor: "#fff",
                marginRight: 2, // Sets the background color to white
              }}
            >
              <div
                style={{
                  display: "table-cell",
                  textAlign: "start",
                }}
              >
                <Typography sx={{ fontSize: "13px", marginTop: "-.4rem" }}>
                  Import Word, text, RTF, doc, and docx files to continue
                  editing your document
                </Typography>
              </div>
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Center-align items horizontally in the box
              justifyContent: "center", // Center-align items vertically in the box
              // Take full width of the container
              // Margin top and bottom for spacing
            }}
          >
            <div style={{ marginRight: "2rem" }}>
              <svg
                width="60"
                height="80"
                viewBox="0 0 60 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M59.9996 12.236V77.2044C59.9996 78.744 58.7808 80 57.2867 80H7.27353C5.77943 80 4.56055 78.744 4.56055 77.2044V2.79564C4.56055 1.25601 5.77943 0 7.27353 0H48.1058L59.9996 12.236Z"
                  fill="white"
                />
                <path
                  d="M60.001 12.236V77.2044C60.001 78.744 58.7821 80 57.288 80H53.4151C54.9092 80 56.1281 78.744 56.1281 77.2044V12.236L44.2539 0H48.1268L60.001 12.236Z"
                  fill="#E5E5E5"
                />
                <path
                  d="M59.9993 12.236H50.8185C49.3244 12.236 48.1055 10.98 48.1055 9.44036V0L59.9993 12.236Z"
                  fill="#92929D"
                />
                <path
                  d="M48.5389 37.8827H16.337C15.2558 37.8827 14.3711 36.9711 14.3711 35.8569C14.3711 34.7427 15.2558 33.8311 16.337 33.8311H48.5389C49.6201 33.8311 50.5048 34.7427 50.5048 35.8569C50.5048 36.9913 49.6398 37.8827 48.5389 37.8827Z"
                  fill="#92929D"
                />
                <path
                  d="M48.5389 48.2753H16.337C15.2558 48.2753 14.3711 47.3637 14.3711 46.2495C14.3711 45.1353 15.2558 44.2236 16.337 44.2236H48.5389C49.6201 44.2236 50.5048 45.1353 50.5048 46.2495C50.5048 47.3839 49.6398 48.2753 48.5389 48.2753Z"
                  fill="#92929D"
                />
                <path
                  d="M48.5389 58.6679H16.337C15.2558 58.6679 14.3711 57.7562 14.3711 56.642C14.3711 55.5278 15.2558 54.6162 16.337 54.6162H48.5389C49.6201 54.6162 50.5048 55.5278 50.5048 56.642C50.5048 57.7765 49.6398 58.6679 48.5389 58.6679Z"
                  fill="#92929D"
                />
                <path
                  d="M27.2281 27.3486H0V15.9837C0 15.1329 0.668405 14.4238 1.51375 14.4238H27.2281C28.0537 14.4238 28.7418 15.1126 28.7418 15.9837V25.7887C28.7418 26.6396 28.0734 27.3486 27.2281 27.3486Z"
                  fill="#F55B4B"
                />
                <path
                  d="M28.7418 25.5861V25.7887C28.7418 26.6396 28.0734 27.3486 27.2281 27.3486H0V15.9837C0 15.1329 0.668405 14.4238 1.51375 14.4238H2.28047V18.4755C2.28047 22.4056 5.36697 25.6064 9.20053 25.6064H28.7418V25.5861Z"
                  fill="#DD4E43"
                />
                <path
                  d="M0 27.3486L4.56094 32.6968V27.3486H0Z"
                  fill="#DB1B1B"
                />
                <path
                  d="M7.37246 23.3386V24.6959H3.26367V23.3386H4.26629V18.0106H3.26367V16.6533H7.37246C8.33576 16.6533 9.06315 16.8762 9.59395 17.3421C10.1248 17.808 10.3803 18.4361 10.3803 19.2059C10.3803 19.6515 10.282 20.0567 10.1051 20.4214C9.92816 20.786 9.69225 21.0696 9.39736 21.252C9.10247 21.4545 8.78792 21.5761 8.4144 21.6571C8.04087 21.7382 7.58871 21.7584 7.03825 21.7584H6.2912V23.3183H7.37246V23.3386ZM6.2912 20.4214H6.58609C7.27416 20.4214 7.72632 20.2998 7.92292 20.077C8.11951 19.8541 8.21781 19.5503 8.21781 19.2059C8.21781 18.9223 8.13916 18.6589 8.00155 18.4563C7.86393 18.2537 7.70667 18.1322 7.52973 18.0714C7.3528 18.0309 7.05791 17.9904 6.64507 17.9904H6.27154V20.4214H6.2912Z"
                  fill="white"
                />
                <path
                  d="M10.8516 24.6959V23.3386H12.0311V18.0106H10.8516V16.6533H14.5475C15.3339 16.6533 15.9433 16.6938 16.4348 16.7951C16.9066 16.8964 17.3588 17.1193 17.7913 17.4434C18.2238 17.7878 18.5777 18.2335 18.8332 18.8007C19.0888 19.3679 19.2264 19.9959 19.2264 20.6847C19.2264 21.252 19.1281 21.7787 18.9512 22.2851C18.7742 22.7916 18.5383 23.1967 18.2631 23.5209C17.9879 23.8248 17.6733 24.0881 17.2801 24.2704C16.9066 24.4528 16.5527 24.5743 16.2382 24.6351C15.9237 24.6959 15.4322 24.7161 14.7638 24.7161H10.8516V24.6959ZM14.0757 23.3386H14.5672C15.1569 23.3386 15.6288 23.2575 15.9826 23.0955C16.3365 22.9334 16.6117 22.6498 16.8083 22.2649C17.0246 21.8597 17.1229 21.3532 17.1229 20.705C17.1229 20.0972 17.0246 19.5705 16.8083 19.1451C16.5921 18.7197 16.3168 18.4158 15.9433 18.2537C15.5894 18.0917 15.1176 18.0106 14.5672 18.0106H14.0757V23.3386Z"
                  fill="white"
                />
                <path
                  d="M20.1309 24.6959V23.3386H21.2514V18.0106H20.1309V16.6533H27.1296V19.1451H25.6354V18.0309H23.296V19.8946H24.9867V21.252H23.296V23.3386H24.4952V24.6959H20.1309Z"
                  fill="white"
                />
                <path
                  d="M24.2393 31.1167H4.58008V27.3486H27.3258V27.9564C27.3062 29.6986 25.93 31.1167 24.2393 31.1167Z"
                  fill="#E5E5E5"
                />
              </svg>
            </div>

            <Button
              onClick={() => {
                fileInputRef.current && fileInputRef.current.click();
              }}
              variant="outlined"
              sx={{
                display: "table-cell",
                padding: "15px",
                pt: 2,
                height: "7vh",
                width: "60%",
                color: "black",
                justifyContent: "center",
                textTransform: "none",
                border: "1.5px dashed #174B8B",
                borderWidth: 1,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow to give depth like a card
                borderRadius: "10px", // Adds rounded corners
                backgroundColor: "#fff",
                marginRight: 2, // Sets the background color to white
              }}
            >
              <div
                style={{
                  display: "table-cell",
                  textAlign: "start",
                }}
              >
                <Typography sx={{ fontSize: "13px", marginTop: "-.4rem" }}>
                  Import PDF document, add recipients and send it for
                  e-signatures
                </Typography>
              </div>
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SyncFesionFileDilog;
