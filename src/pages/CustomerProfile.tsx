import React, { useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  TextField,
  Button,
  Box,
  Avatar,
  FormHelperText,
} from "@mui/material";

import { Dayjs } from "dayjs";

type FormData = {
  size: string;
  quantity: string;
  detail: string;
  deliveryDate: Dayjs | null;
  image: File | null;
};

const CustomerProfile: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [imagePreview, setImagePreview] = useState<string>(
    "/default-avatar.jpg"
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type.match("image.*")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      // Handle error for invalid file type
      console.error("Invalid file type selected.");
    }
  };

  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <Avatar
            alt="Profile Image"
            src={imagePreview}
            sx={{ width: 100, height: 100, mb: 1, cursor: "pointer" }}
            onClick={handleAvatarClick}
          />
        </Box>

        <Controller
          name="size"
          control={control}
          rules={{ required: "Size is required" }}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Size"
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.size}
            />
          )}
        />
        {errors.size && (
          <FormHelperText error>{errors.size.message}</FormHelperText>
        )}

        <Controller
          name="quantity"
          control={control}
          rules={{ required: "Quantity is required" }}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Quantity"
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.quantity}
            />
          )}
        />
        {errors.quantity && (
          <FormHelperText error>{errors.quantity.message}</FormHelperText>
        )}

        <Controller
          name="detail"
          control={control}
          rules={{ required: "Detail is required" }}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Detail"
              fullWidth
              margin="normal"
              size="small"
              multiline
              error={!!errors.detail}
            />
          )}
        />
        {errors.detail && (
          <FormHelperText error>{errors.detail.message}</FormHelperText>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            textTransform: "none",
            fontSize: "16px",
            backgroundColor: "#155BE5",
            color: "white",
            "&:hover": {
              backgroundColor: "#134DAB", // Slightly darker shade for hover effect, change as needed
            },
          }}
          size="small"
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default CustomerProfile;
