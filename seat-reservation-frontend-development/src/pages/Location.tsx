import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useAppSelector } from "./Login";
import {
  deleteLocation,
  editLocation,
  getAllLocations,
  addLocation,
  checkDelLocation
} from "../services/user-auth.services";
import Loader from "../components/Loader";
import { showErrorToast, showSuccessToast, showWarningToast } from "../assets/toastify";

interface Location {
  id: string;
  name: string;
  code: string;
  minDays: number;
  maxDays: number;
  time: number;
  maxPreBooking: number;
  maxDuration: number;
  is_schedule_restricted: boolean;
}
const Location = () => {
  const { company_id } = useAppSelector((state) => state.user);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [location, setLocation] = useState<Location>({
    id: '',
    name: "",
    code: "",
    minDays: 0,
    maxDays: 0,
    time: 0,
    maxPreBooking: 0,
    maxDuration: 0,
    is_schedule_restricted: true,
  });
  const [originalLocation, setOriginalLocation] = useState<Location | null>(
    null
  );
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warningMsg, setWarningMsg] = useState<string>('');
  const [isAssosiated, setIsAssosiated] = useState<boolean>(false);
  const [deletePermanently, setDeletePermanently] = useState<string>('');

  const columns: GridColDef[] = [
    {
      field: "Sr.No",
      headerName: "Sr.No",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      description: "Name of the location",
      headerName: "Name",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "code",
      description: "Code",
      headerName: "Code",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "minDays",
      description:
        "Minimum no. of days in a week for employees to be in office",
      headerName: "Minimum Days",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "maxDays",
      description:
        "Maximum no. of days in a week for employees to be in office",
      headerName: "Maximum Days",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "maxPreBooking",
      description: "Maximum pre-booking period in (Days)",
      headerName: "Pre Booking Period",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "maxDuration",
      description: "Maximum duration of booking in (Days)",
      headerName: "Max Duration",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "is_schedule_restricted",
      headerName: "Enforce Schedule",
      description: "Enforce schedule restriction for booking",
      width: 200,
      align: "center",
      renderCell: (params) => (
        <>
          {params.value === true ? (
            <CheckCircleOutlineIcon color="primary" />
          ) : (
            <CancelIcon color="error" />
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row)}
            color="primary"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (location: any) => {
    setOpen(true);
    setEditMode(true);
    setLocation(location);
    setOriginalLocation(location);
  };

  const handleDelete = async (location: Location) => {
    setLocationToDelete(location);
    const checkDelete = await checkDelLocation(location?.id);
    if (checkDelete?.existingAssociations) {
      setIsAssosiated(true);
      setWarningMsg(checkDelete?.warningMsg);
    }
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deletePermanently === 'Delete Permanently') {
        const msg = await deleteLocation(locationToDelete?.id);
        showErrorToast(msg);
        setDeleteModalOpen(false);
        setIsAssosiated(false);
        setWarningMsg('');
        setDeletePermanently('');
        fetchData();
      } else {
        showWarningToast('Delete confirmation text mismatched!');
      }
    } catch (error) {
      console.error("Error deleting user :", error);
      setIsLoading(false);
    }
  };
  const [rows, setRows] = useState<Location[]>([]);

  const handleModalClose = () => {
    setOpen(false);
    setEditMode(false);
    setLocation({
      id: '',
      name: "",
      code: "",
      minDays: 0,
      maxDays: 0,
      time: 0,
      maxPreBooking: 0,
      maxDuration: 0,
      is_schedule_restricted: true,
    });
    setOriginalLocation(null);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const locationResponse = await getAllLocations({ company_id });
      const locationData = locationResponse.map((item: any, index: number) => {
        const {
          id,
          name,
          code,
          min_days,
          max_days,
          max_prebooking,
          max_duration,
          is_schedule_restricted,
        } = item;
        return {
          "Sr.No": index + 1,
          id,
          name,
          code,
          minDays: min_days || 0,
          maxDays: max_days || 0,
          maxPreBooking: max_prebooking || 0,
          maxDuration: max_duration || 0,
          is_schedule_restricted: is_schedule_restricted || false,
        };
      });
      setIsLoading(false);
      setRows(locationData);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };
  const handleModalOpen = () => {
    setOpen(true);
    setEditMode(false); // Set editMode to false
    setLocation({
      id: '',
      name: "",
      code: "",
      minDays: 0,
      maxDays: 0,
      time: 0,
      maxPreBooking: 0,
      maxDuration: 0,
      is_schedule_restricted: true,
    }); // Reset location state
  };

  const handleEditBtn = async () => {
    if (editMode && location && originalLocation) {
      let updatedFields: Partial<{
        location_id: string;
        name: string;
        code: string;
        min_days: number | null;
        max_days: number | null;
        max_prebooking: number | null;
        max_duration: number | null;
        is_schedule_restricted: boolean | null;
      }> = {};

      if (location.name !== originalLocation?.name) {
        updatedFields.name = location.name;
      }

      if (location.code !== originalLocation?.code) {
        updatedFields.code = location.code;
      }

      if (location.minDays !== originalLocation?.minDays) {
        updatedFields.min_days = location.minDays;
      }

      if (location?.maxDays !== originalLocation?.maxDays) {
        updatedFields.max_days = location?.maxDays;
      }

      if (location?.maxPreBooking !== originalLocation?.maxPreBooking) {
        updatedFields.max_prebooking = location?.maxPreBooking;
      }
      if (location?.maxDuration !== originalLocation?.maxDuration) {
        updatedFields.max_duration = location?.maxDuration;
      }
      if (
        location?.is_schedule_restricted !==
        originalLocation?.is_schedule_restricted
      ) {
        updatedFields.is_schedule_restricted = location?.is_schedule_restricted;
      }
      if (Object.keys(updatedFields).length > 0) {
        const updatedData = {
          company_id,
          location_id: location.id,
          ...updatedFields,
        };
        console.log(updatedData, "updated data edit");
        // return;
        try {
          setIsLoading(true);
          let response = await editLocation(updatedData);
          showSuccessToast(response.message);
          handleModalClose();
          fetchData();
          setIsLoading(false);
        } catch (error) {
          console.error("Error updating user data:", error);
          setIsLoading(false);
        }
      } else {
        toast.warn("Please fill any one field to update the data", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      if (
        !location.name ||
        !location.code ||
        !location.minDays ||
        !location.maxDays ||
        !location.maxPreBooking ||
        !location.maxDuration
      ) {
        toast.warn("Please fill all fields to update the data", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      try {
        const locationDatas = {
          name: location.name,
          code: location.code,
          company_id,
          min_days: location.minDays,
          max_days: location.maxDays,
          max_prebooking: location.maxPreBooking,
          max_duration: location.maxDuration,
          is_schedule_restricted: location.is_schedule_restricted,
        };
        if (locationDatas.min_days < 1) {
          showWarningToast("Minimum days should be greater than 0");
          return;
        }
        if (locationDatas.max_days < 1) {
          showWarningToast("Maximum days should be greater than 0");
          return;
        }
        setIsLoading(true);
        let response = await addLocation(locationDatas);
        showSuccessToast(response.message);
        handleModalClose();
        fetchData();
        setLocation(location);
        setIsLoading(false);
      } catch (error) {
        console.error("Error updating location data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    setError("");
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // if (name == "minDays" && Number(value) < 1) {
    //   setError("Minimum days should be greater than 0");
    //   return;
    // } else {
    //   setError("");
    // }
    // else if(name=="maxDays" && Number(Value)){
    // }
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ paddingTop: "90px" }}
          >
            <Card sx={{ width: "98.9vw" }}>
              <CardContent sx={{ margin: "20px", backgroundColor: "#f0f0f0" }}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        flexGrow: 1,
                        marginBottom: "10px",
                        fontSize: {
                          xs: "1.5rem",
                          sm: "2rem",
                          md: "2rem",
                        },
                      }}
                      align="center"
                      color="primary.main"
                      variant="h4"
                    >
                      Location
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "primary.main",
                        borderRadius: "20px",
                        width: "9rem",
                        marginLeft: "auto",
                        marginBottom: "20px",
                      }}
                      onClick={handleModalOpen}
                    >
                      Add Location
                    </Button>
                  </Box>

                  <Dialog open={open} onClose={handleModalClose}>
                    <DialogTitle sx={{ textAlign: "center" }}>
                      {editMode ? "Edit Location" : "Add Location"}
                    </DialogTitle>
                    <DialogContent>
                      <Box component="form" sx={{  width: {
                            xs: "15rem",
                            sm: "25rem",
                            md: "25rem",
                          },
                           margin: "1vw" }}>
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Name"
                          variant="outlined"
                          type="text"
                          value={location?.name || ""}
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                          name="name"
                          onChange={handleChange}
                        />
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Code"
                          variant="outlined"
                          type="text"
                          value={location?.code || ""}
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                          name="code"
                          onChange={handleChange}
                        />
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Minimum Days(Week)"
                          variant="outlined"
                          type="number"
                          value={location?.minDays || ""}
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                          name="minDays"
                          onChange={handleChange}
                        />
                        {error && (
                          <Typography variant="caption" color="error">
                            {error}
                          </Typography>
                        )}
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Maximum Days(Week)"
                          variant="outlined"
                          type="number"
                          value={location?.maxDays || ""}
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                          name="maxDays"
                          onChange={handleChange}
                        />
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Pre-Booking Time(Max days)"
                          variant="outlined"
                          type="number"
                          value={location?.maxPreBooking || ""}
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                          name="maxPreBooking"
                          onChange={handleChange}
                        />
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Max Duration"
                          variant="outlined"
                          type="number"
                          value={location?.maxDuration || ""}
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                          name="maxDuration"
                          onChange={handleChange}
                        />
                        <Autocomplete
                          options={["Enable", "Disable"]}
                          value={
                            location.is_schedule_restricted
                              ? "Enabled"
                              : "Disabled"
                          }
                          onChange={(event, newValue) => {
                            event.preventDefault();
                            console.log(newValue, "***");
                            if (newValue === "Enable") {
                              setLocation((prevLocation) => ({
                                ...prevLocation,
                                is_schedule_restricted: true,
                              }));
                            } else if (newValue === "Disable") {
                              setLocation((prevLocation) => ({
                                ...prevLocation,
                                is_schedule_restricted: false,
                              }));
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Enforce Schedule Bookings"
                              variant="outlined"
                            />
                          )}
                        />
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Box>
                        <Button
                          sx={{
                            backgroundColor: "primary.main",
                            borderRadius: "20px",
                            width: "9rem",
                            margin: "1vw",
                            "&:hover": {
                              boxShadow: "10",
                            },
                          }}
                          type="submit"
                          variant="contained"
                          color="primary"
                          onClick={handleEditBtn}
                        >
                          Save
                        </Button>
                      </Box>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <HighlightOffIcon
                        sx={{
                          fontSize: 35,
                          color: "red",
                          marginLeft: "5px",
                        }}
                      />
                      <DialogTitle
                        sx={{
                          textAlign: "left",
                          flexGrow: 1,
                          marginLeft: "-20px",
                        }}
                      >
                        Confirm Deletion
                      </DialogTitle>
                    </Box>
                    <DialogContent>
                      {locationToDelete && (

                        isAssosiated ? (
                          <Typography>
                            This cabin has
                            <Typography sx={{ display: 'inline', fontWeight: "bold" }}>
                              {' '}{warningMsg}.{' '}
                            </Typography>
                            All cabins and reservations will be deleted. This action can not be undone. Are you sure you want to delete? Type
                            <Typography sx={{ fontFamily: 'Roboto Mono, monospace', display: 'inline', fontWeight: "bold" }}>
                              {' '}`Delete Permanently`{' '}
                            </Typography>
                            to proceed.
                          </Typography>
                        ) : (
                          <Typography>
                            This action can not be undone. Are you sure you want to delete? Type
                            <Typography sx={{ fontFamily: 'Roboto Mono, monospace', display: 'inline', fontWeight: "bold" }}>
                              {' '}`Delete Permanently`{' '}
                            </Typography>
                            to proceed.
                          </Typography>
                        )

                      )}

                      <TextField
                        sx={{
                          marginTop: "2rem",
                          width: "30rem",
                        }}
                        label="Delete Permanently"
                        value={deletePermanently}
                        onChange={(e) => setDeletePermanently(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        sx={{
                          backgroundColor: "secondary.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "secondary.main",
                          },
                        }}
                        onClick={() => setDeleteModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        sx={{
                          backgroundColor: "red",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "red",
                          },
                        }}
                        onClick={() => handleConfirmDelete()}
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DataGrid
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 50,
                        },
                      },
                    }}
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          <ToastContainer />
        </>
      )
      }
    </>
  );
};

export default Location;
