/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { getBranchByid, getUserId } from "@/service/api/apiMethods";
import { Button, Grid, TextareaAutosize } from "@mui/material";
interface DetailDialogProps {
  open: boolean;
  data: any; // Replace 'any' with the type of your data
  onClose: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ open, data, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [data, setData] = useState<any>({});
  // const listData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const data = await getUserId(id);
  //     console.log(data);

  //     setData(data.user);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // React.useEffect(() => {
  //   if (id) listData();
  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id]);
  console.log(data, "data user");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ alignItems: "center" }}
    >
      <DialogTitle>
        {" "}
        <strong>Details</strong>
      </DialogTitle>
      <DialogContent sx={{ maxHeight: "300px" }}>
        <Grid item xs={12} sm={7}>
          <TextareaAutosize
            value={data || "Default Text"}
            placeholder="Enter description"
            minRows={4} // Adjust the number of rows as needed
            style={{
              width: "100%",
              fontSize: "16px",
              // color: "#9A9A9A",
              // border: "1px solid #ced4da",
              borderRadius: "4px",
              // padding: "10px",
              // margin: "10px",
            }}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailDialog;
