import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PlanDialog from "@/pages/dasboard/billing/PlanDialog";
import CancelSubsriotionDialog from "@/pages/dasboard/billing/CancelSubsriotionDialog";
import LicencesDialog from "@/pages/dasboard/billing/LicencesDialog";
import logo from "../../../assets/visa.png";
import OwnerDialog from "@/pages/dasboard/billing/OwnerDialog";
import InvoiceDialog from "@/pages/dasboard/billing/InvoiceDialog";

const CardsSubscription: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);
  const handleOwnerOpenDialog = () => setIsOwnerDialogOpen(true);
  const handleOwnerCloseDialog = () => setIsOwnerDialogOpen(false);

  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const handleInvoiceOpenDialog = () => setIsInvoiceDialogOpen(true);
  const handleInvoiceCloseDialog = () => setIsInvoiceDialogOpen(false);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const handleCancelOpenDialog = () => setIsCancelDialogOpen(true);
  const handleCancelCloseDialog = () => setIsCancelDialogOpen(false);

  const [isLicencesDialogOpen, setIsLicencesDialogOpen] = useState(false);
  const [isReduce, setIsReduce] = useState(false);
  const handleLicencesOpenDialog = () => {
    setIsLicencesDialogOpen(true);
    setIsReduce(false);
  };
  const handleReducelicencesOpenDialog = () => {
    setIsLicencesDialogOpen(true);
    setIsReduce(true);
  };
  const handleLicencesCloseDialog = () => setIsLicencesDialogOpen(false);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Card 1 */}
        <Card
          style={{
            flex: 1,
            margin: "2.5rem",
            borderRadius: "12px",
            height: "210px",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Current plan
            </Typography>

            <Typography variant="body1" gutterBottom>
              Business
            </Typography>
            <Typography variant="body1" paragraph>
              Date 1
            </Typography>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button
                variant="text"
                onClick={handleOpenDialog}
                sx={{ textTransform: "none" }}
              >
                Change plan
              </Button>
              <Button
                variant="text"
                onClick={handleCancelOpenDialog}
                sx={{ textTransform: "none" }}
              >
                Cancel subscription{" "}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card
          style={{
            flex: 1,
            margin: "2.5rem",
            borderRadius: "12px",
            height: "210px",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              User Licences
            </Typography>

            <Typography variant="body1" gutterBottom>
              5 user licences in your plan
            </Typography>
            <Typography variant="body1" paragraph>
              0 licences remaining
            </Typography>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button
                variant="text"
                onClick={handleLicencesOpenDialog}
                sx={{ textTransform: "none" }}
              >
                Add user licences
              </Button>
              <Button
                variant="text"
                onClick={handleReducelicencesOpenDialog}
                sx={{ textTransform: "none" }}
              >
                Reduce user licences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card
          style={{
            flex: 1,
            margin: "2.5rem",
            borderRadius: "12px",
            height: "210px",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Payment info{" "}
            </Typography>
            <img
              src={logo}
              alt="Logo"
              style={{
                maxWidth: isMobile ? "150px" : "350px",
                marginTop: "5px",
                height: isMobile ? "150px" : "40px",
                marginBottom: "5px",
              }}
            />
            <Typography variant="body1" gutterBottom>
              Visa ending in 1234
            </Typography>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button variant="text" sx={{ textTransform: "none" }}>
                {" "}
                Edit payment info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Card 1 */}
        <Card
          style={{
            flex: 1,
            margin: "2.5rem",
            borderRadius: "12px",
            height: "210px",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Billing owner
            </Typography>
            <Typography variant="body1" paragraph>
              Pankaj Kumar Singh
            </Typography>
            <Typography variant="body1" paragraph>
              pankaj.singh@contractnsign.com
            </Typography>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button
                variant="text"
                onClick={handleOwnerOpenDialog}
                sx={{ textTransform: "none" }}
              >
                Change billing owner
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card
          style={{
            flex: 1,
            margin: "2.5rem",
            borderRadius: "12px",
            height: "210px",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Invoices
            </Typography>
            <Typography variant="body1">
              <strong>Business</strong>
            </Typography>
            <Typography variant="body1">
              <strong>$120</strong> / Month
            </Typography>
            <Button variant="text" sx={{ textTransform: "none" }}>
              Switch to an annual subscription
            </Button>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button variant="text" sx={{ textTransform: "none" }}>
                View latest invoice
              </Button>
              <Button
                variant="text"
                onClick={handleInvoiceOpenDialog}
                sx={{ textTransform: "none" }}
              >
                View invoice history
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card
          style={{
            flex: 1,
            margin: "2.5rem",
            borderRadius: "12px",
            height: "210px",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Billing support
            </Typography>
            <Typography variant="body1" paragraph sx={{ height: "75px" }}>
              For help and support with your billing questions, contact our
              billing team.
            </Typography>

            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Button variant="text" sx={{ textTransform: "none" }}>
                Contact support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <PlanDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />

      <OwnerDialog
        isOpen={isOwnerDialogOpen}
        onClose={handleOwnerCloseDialog}
      />
      <InvoiceDialog
        isOpen={isInvoiceDialogOpen}
        onClose={handleInvoiceCloseDialog}
      />
      <CancelSubsriotionDialog
        isOpen={isCancelDialogOpen}
        onClose={handleCancelCloseDialog}
      />
      <LicencesDialog
        isOpen={isLicencesDialogOpen}
        isReduce={isReduce}
        onClose={handleLicencesCloseDialog}
      />
    </>
  );
};

export default CardsSubscription;
