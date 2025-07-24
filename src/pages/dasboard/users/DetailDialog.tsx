/* eslint-disable @typescript-eslint/no-explicit-any */
// DetailDialog.tsx
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { getBranchByid, getUserId } from "@/service/api/apiMethods";

interface DetailDialogProps {
  open: boolean;
  id: any; // Replace 'any' with the type of your data
  onClose: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ open, id, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getUserId(id);
      console.log(data);

      setData(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
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
        <strong>User Details</strong>
      </DialogTitle>
      <DialogContent>
        <p>
          <strong>Email:</strong> {data?.det}
        </p>
        {/* <p>
          <strong>First Name:</strong> {data?.firstName} */}
        {/* </p>
        <p>
          <strong>LastName:</strong> {data?.lastName}
        </p>
        <p>
          <strong>Mobile:</strong> {data?.mobile}
        </p>
        <p>
          <strong>Landline:</strong> {data?.landline}
        </p>
        <p>
          <strong>Created By:</strong> {data?.createdByName}
        </p> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailDialog;
