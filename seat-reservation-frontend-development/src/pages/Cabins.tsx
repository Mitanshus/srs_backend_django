import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  addCabin,
  cabinDataType,
  getCabins,
  editCabin,
  CabinDataWithId,
  checkDelCabin,
  deleteCabin,
} from "../services/cabin.services";
import {
  getSeatDataByStatus,
  getCheckPermanentReservation,
  getConfirmPermanentReservation,
} from "../services/permanentseat.service";
import { getAllLocations } from "../services/user-auth.services";
import { useAppSelector } from "./Login";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../assets/toastify";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Container } from "@mui/joy";
import ChairIcon from "@mui/icons-material/Chair";

interface Cabin {
  id: string;
  location_id: string;
  name: string;
  code: string;
  Seats: any[];
}

interface Location {
  id: string;
  name: string;
}

const Cabins = () => {
  const { location : locationData, company_id } = useAppSelector(
    (state) => state.user
  );
    console.log( useAppSelector(
      (state) => state.user));
    
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [location, setLocation] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | any>(
    locationData || localStorage.getItem('location')
  );
  const [selectedCabinData, setSelectedCabinData] = useState<Cabin | null>(
    null
  );
  const [numberOfSeats, setNumberOfSeats] = useState<number | null>();
  const [cabinToDelete, setCabinToDelete] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const [openBlockModal, setOpenBlockModal] = useState<boolean>(false);
  const [selectedCabin, setSelectedCabin] = useState<any[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const openConfirmModal = () => setConfirmModalOpen(true);
  const [isSeatSelectedBtn, setIsSeatSelectedBtn] = useState<boolean>(true);
  const [isexistingBookings, setIsExistingBookings] = useState<any>({
    isexistingBookings: false,
    message: "",
  });
  const [warningMsg, setWarningMsg] = useState<string>("");
  const [isAssosiated, setIsAssosiated] = useState<boolean>(false);
  const [deletePermanently, setDeletePermanently] = useState<string>("");

  const fetchData = async (location_id: string) => {
    try {
      setIsLoading(true);
      console.log(location_id);
      
      const cabins = await getCabins(location_id);
      const sortCabins = cabins?.sort((a: any, b: any) =>
        a.code.localeCompare(b.code)
      );

      const locations = await getAllLocations({
        company_id,
      });
      console.log(locations);
      
      setLocation(locations);
      setCabins(sortCabins);

      setIsLoading(false);
    } catch (error) {
      console.log("Error getting cabins data from fetchData:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load cabin data from DB when the component mounts
    setIsLoading(true);
    fetchData(selectedLocation?.id);
    if (editMode && selectedCabinData) {
      setNumberOfSeats(selectedCabinData.Seats.length);
    } else {
      setNumberOfSeats(1);
    }
    setCabinToDelete("");
    setIsLoading(false);
  }, [selectedCabinData, editMode]);

  const handleModalOpen = () => {
    setOpen(true);
    // setSelectedLocation(null);
    setEditMode(false);
    setSelectedCabinData(null);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleEdit = (cabinId: string) => {
    const cabinToEdit = cabins.find((cabin) => cabin.id === cabinId);
    if (cabinToEdit) {
      setOpen(true);
      setEditMode(true);

      setSelectedCabinData(cabinToEdit);
    }
  };
  const handleDelete = async (cabin: Cabin) => {
    setCabinToDelete(cabin.id);
    const checkDelete = await checkDelCabin(cabin.id);
    if (checkDelete?.existingAssociations) {
      setIsAssosiated(true);
      setWarningMsg(checkDelete?.warningMsg);
    }
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (deletePermanently === "Delete Permanently") {
      const msg = await deleteCabin(cabinToDelete);
      showErrorToast(msg);
      setDeleteModalOpen(false);
      setIsAssosiated(false);
      setWarningMsg("");
      setDeletePermanently("");
      fetchData(selectedLocation.id);
    } else {
      showWarningToast("Delete confirmation text mismatched!");
    }
  };

  const handleSaveCabin = async () => {
    if (selectedCabinData) {
      if (editMode) {
        if (numberOfSeats === 0) {
          toast.error("Number of seats cannot be zero", {
            position: "top-left",
            autoClose: 2000,
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
          setIsLoading(true);
          const editCabinData: CabinDataWithId = {
            cabin_id: selectedCabinData.id,
            name: selectedCabinData.name,
            seats: numberOfSeats,
          };
          const res = await editCabin(editCabinData);

          toast.success(res, {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Error updating cabin data:", error);
          setIsLoading(false);
        }
      } else {
        const newCabin: cabinDataType = {
          location_id: selectedLocation.id,
          name: selectedCabinData.name,
          code: selectedCabinData.code,
          seats: numberOfSeats || 1,
        };

        try {
          setIsLoading(true);
          const addCabinRes = await addCabin(newCabin);

          showSuccessToast(addCabinRes.message);
          setIsLoading(false);
        } catch (error) {
          console.error("Error updating cabin data:", error);
          setIsLoading(false);
        }
      }
      fetchData(selectedLocation.id);
      setNumberOfSeats(1);
      setOpen(false);
    }
  };

  const increaseSeat = () => {
    if (editMode && selectedCabinData) {
      setSelectedCabinData((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            Seats: [...prevState.Seats, { id: prevState.Seats.length + 1 }],
          };
        }
        return prevState;
      });
    } else {
      setNumberOfSeats((prevCount) => (prevCount ? prevCount + 1 : 1)); // Add a default value of 1
    }
  };

  const decreaseSeat = () => {
    if (editMode && selectedCabinData) {
      setSelectedCabinData((prevState) => {
        if (prevState && prevState.Seats.length > 0) {
          const updatedSeats = prevState.Seats.slice(0, -1);
          return {
            ...prevState,
            Seats: updatedSeats,
          };
        }
        return prevState;
      });
    } else {
      setNumberOfSeats((prevCount) =>
        prevCount ? Math.max(1, prevCount - 1) : 1
      ); // Add a default value of 1
    }
  };

  const handleBlockModalClose = () => {
    setIsExistingBookings({
      isexistingBookings: false,
      message: "",
    });
    setIsSeatSelectedBtn(true);
    setOpenBlockModal(false);
  };

  const handleCheckPermanentSeat = async () => {
    try {
      let cabin_id;
      const formattedData = selectedCabin.map((item) => {
        const { id, seatStatus, cabin_id: cabinId } = item;
        cabin_id = cabinId;
        return {
          seat_id: id,
          reserved: seatStatus,
        };
      });
      const response = await getCheckPermanentReservation({
        cabin_id,
        seats: formattedData,
      });
      if (response.existingBookings) {
        setIsExistingBookings({
          isexistingBookings: response.existingBookings,
          message: response.message,
        });
      }
      openConfirmModal();
    } catch (error) {
      console.log("Error while checking permanent seat:", error);
    }
  };

  const handleBlockSeats = async (cabinId: string) => {
    try {
      setIsLoading(true);
      const response = await getSeatDataByStatus({ cabin_id: cabinId });
      const seatData = response?.data.data;
      console.log(seatData);
      const formattedData = seatData.map((item: any) => {
        const { id, cabin_id, code, status } = item;
        const seatStatus = status == "RESERVED" ? true : false;
        return {
          id,
          seatStatus,
          cabin_id,
          code,
          noOfSeats: 4,
        };
      });
      setSelectedCabin(formattedData);
      setOpenBlockModal(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching seat data:", error);
      setIsLoading(false);
    }
  };
  const changeSeatColor = (status: boolean, code: string) => {
    setIsSeatSelectedBtn(false);
    const formattedData = selectedCabin.map((item) => {
      if (item.code == code) {
        item.seatStatus = !status;
        return item;
      }
      return item;
    });
    setSelectedCabin(formattedData);
  };

  const closeConfirmModal = () => setConfirmModalOpen(false);

  const handleConfirmSelection = async () => {
    try {
      let cabin_id;
      const formattedData = selectedCabin.map((item) => {
        const { id, seatStatus, cabin_id: cabinId } = item;
        cabin_id = cabinId;
        return {
          seat_id: id,
          reserved: seatStatus,
        };
      });
      const response = await getConfirmPermanentReservation({
        cabin_id,
        seats: formattedData,
      });
      setIsExistingBookings({
        isexistingBookings: false,
        message: "",
      });
      console.log("response", response);
      showSuccessToast(response.message);
      handleBlockModalClose();
      closeConfirmModal();
    } catch (error) {
      console.log(error);
    }
  };
console.log(selectedLocation);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              paddingTop: "90px",
            }}
          >
            <Card
              sx={{
                width: {
                  xs: "100vw",
                  sm: "97vw",
                  md: "100vw",
                },
              }}
            >
              <CardContent
                sx={{
                  margin: "20px",
                  backgroundColor: "#f0f0f0",
                  height: "auto",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column", 
                      sm: "row", 
                    },
                    alignItems: {
                     
                      sm: "flex-start", 
                    },
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      marginBottom: { sm: "0", xs: "15px" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        textAlign: {
                          xs: "center", 
                         
                        },
                        fontSize: {
                          xs: "1.5rem",
                          sm: "2rem",
                          md: "2rem",
                        },
                      }}
                      color="primary.main"
                      variant="h4"
                    >
                      Cabins
                    </Typography>
                    <Autocomplete
                      defaultValue={selectedLocation}
                      options={location}
                      getOptionLabel={(option) => option.name}
                      value={selectedLocation}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      onChange={(event, newValue) => {
                        event.preventDefault();
                        setSelectedLocation(newValue);
                        fetchData(newValue.id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          variant="outlined"
                          // fullWidth
                          sx={{
                            marginTop: {
                              xs: "-0.5rem",
                              sm: "-3rem",
                            },
                            width: {
                              // xs: "50vw",
                              sm: "15vw",
                              md: "15vw",
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "primary.main",
                      borderRadius: "20px",
                      marginTop: { xs: "0", sm: "0" }, // Adjust margin for mobile view
                      width: {
                        xs: "9rem", // Make the button full width on mobile
                        sm: "9rem",
                        md: "9rem",
                      },
                    }}
                    onClick={handleModalOpen}
                  >
                    Add Cabin
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginLeft: "0.2rem",
                    marginRight: "-6rem",
                    marginBottom: "5rem",

                  }}
                >
                  {cabins?.map((cabin) => (
                    <Box
                      key={cabin.id}
                      sx={{
                        width: {
                          xs: "80%",
                          md: "29%",
                          sm: "39.98%",
                        },
                        height: "90px",
                        marginBottom: "20px",
                        marginRight: "3.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Card
                        sx={{
                          flexGrow: 1,
                          paddingLeft: "10px",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "left",
                          boxShadow: "0px 4px 0px #008037",
                        }}
                      >
                        <HomeWorkIcon
                          sx={{
                            height: {
                              xs: "10vw",
                              sm: "3vw",
                              md: "3vw",
                            },
                            width: {
                              xs: "5vw",
                              sm: "3vw",
                              md: "3vw",
                            },
                            color: "primary.main",
                            marginLeft: "10px",
                          }}
                        />
                        <Typography
                          sx={{
                            marginLeft: "20px",
                          }}
                        >
                          {cabin.name} - {cabin.code} <br />
                          {cabin.Seats.length} Seater
                        </Typography>
                      </Card>
                      <Tooltip title="Add/Delete Seats">
                        <IconButton
                          sx={{
                            marginRight: "-0.5rem",
                          }}
                          onClick={() => handleEdit(cabin.id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Permanent Reserved seats">
                        <IconButton
                          sx={{
                            marginRight: "-0.5rem",
                          }}
                          onClick={() => handleBlockSeats(cabin.id)}
                          color="primary"
                          aria-label="settings"
                        >
                          <ShieldOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        sx={{
                          marginRight: "-0.5rem",
                        }}
                        onClick={() => handleDelete(cabin)}
                        color="primary"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                <Dialog open={openBlockModal} onClose={handleBlockModalClose}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "350px",
                      height: selectedCabin.length > 2 ? "370" : "450",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <DialogContent sx={{ marginTop: "-10px" }}>
                      <DialogTitle sx={{ textAlign: "center" }}>
                        Reserved Seat
                      </DialogTitle>
                      {selectedCabin && (
                        <>
                          <Container>
                            <Grid sx={{ width: "fit-content" }} container>
                              {selectedCabin.map((seat: any, index: any) => (
                                <>
                                  <Grid
                                    item
                                    key={index}
                                    xs={4}
                                    sm={4}
                                    md={4}
                                    sx={{
                                      fontSize:
                                        selectedCabin.length < 2
                                          ? "600%"
                                          : "500%",
                                      margin:
                                        selectedCabin.length < 2
                                          ? "1.5rem 0.8rem 1rem 2.7rem"
                                          : "0rem 0.5rem 0rem 1.4rem",
                                      color: seat.seatStatus
                                        ? "#088F8F"
                                        : "grey",
                                      cursor: "pointer",
                                      width: "100px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexDirection: "column",
                                    }}
                                    onClick={() =>
                                      changeSeatColor(
                                        seat.seatStatus,
                                        seat.code
                                      )
                                    }
                                    // onClick={() => handleSeatClick(index, seat)}
                                  >
                                    <ChairIcon sx={{ fontSize: "60%" }} />
                                    <Typography
                                      variant="body1"
                                      align="center"
                                      color="black"
                                    >
                                      {seat.code}
                                    </Typography>
                                  </Grid>
                                </>
                              ))}
                            </Grid>
                          </Container>
                        </>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Box>
                        <Button
                          sx={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          onClick={handleBlockModalClose}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          sx={{
                            marginLeft: "30px",
                            marginBottom: "20px",
                            width: "100px",
                            "&:hover": {
                              color: "white",
                              backgroundColor: "#008037",
                            },
                          }}
                          variant="outlined"
                          color="primary"
                          onClick={handleCheckPermanentSeat}
                          disabled={isSeatSelectedBtn} // Enable the button when at least one seat is selected
                        >
                          Save
                        </Button>
                      </Box>
                    </DialogActions>
                  </Box>
                </Dialog>

                <Dialog
                  open={confirmModalOpen}
                  onClose={() => setConfirmModalOpen(false)}
                >
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogContent>
                    <Typography>
                      {isexistingBookings.isexistingBookings ? (
                        <span>
                          {/* <InfoIcon
                              sx={{
                                marginRight: "0.5rem",
                                color: "#f8c620",
                              }}
                            /> */}
                          <span style={{ color: "#f8c620" }}>
                            {isexistingBookings.message}
                          </span>
                          <br />
                          Are you sure you want to confirm your selection?
                        </span>
                      ) : (
                        "Are you sure you want to confirm your selection?"
                      )}
                    </Typography>
                  </DialogContent>

                  <DialogActions>
                    <Button
                      onClick={() => setConfirmModalOpen(false)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection} color="primary">
                      Confirm
                    </Button>
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
                      {" "}
                      Confirm Deletion
                    </DialogTitle>
                  </Box>
                  <DialogContent>
                    {isAssosiated ? (
                      <Typography>
                        This cabin has
                        <Typography
                          sx={{ display: "inline", fontWeight: "bold" }}
                        >
                          {" "}
                          {warningMsg}.{" "}
                        </Typography>
                        All reservations will be deleted. This action can not be
                        undone. Are you sure you want to delete? Type
                        <Typography
                          sx={{
                            fontFamily: "Roboto Mono, monospace",
                            display: "inline",
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          `Delete Permanently`{" "}
                        </Typography>
                        to proceed.
                      </Typography>
                    ) : (
                      <Typography>
                        This action can not be undone. Are you sure you want to
                        delete? Type
                        <Typography
                          sx={{
                            fontFamily: "Roboto Mono, monospace",
                            display: "inline",
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          `Delete Permanently`{" "}
                        </Typography>
                        to proceed.
                      </Typography>
                    )}

                    <TextField
                      sx={{
                        marginTop: "2rem",
                        width: {
                          xs: "16.5rem",
                          sm: "30rem",
                          md: "30rem",
                        },
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
                      onClick={() => {
                        setDeleteModalOpen(false);
                        setIsAssosiated(false),
                          setWarningMsg(""),
                          setDeletePermanently("");
                      }}
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

                <Dialog open={open} onClose={handleModalClose}>
                  <DialogTitle sx={{ textAlign: "center" }}>
                    {" "}
                    {editMode ? "Edit Cabin" : "Add Cabin"}
                  </DialogTitle>
                  <DialogContent>
                    <Box
                      component="form"
                      sx={{
                        width: {
                          xs: "15rem",
                          sm: "25rem",
                          md: "25rem",
                        },
                        margin: "1vw",
                      }}
                    >
                      <TextField
                        required
                        InputProps={{ sx: { borderRadius: 5 } }}
                        label="Name"
                        variant="outlined"
                        type="text"
                        value={selectedCabinData?.name || ""}
                        onChange={(e) =>
                          setSelectedCabinData((prevState) => ({
                            ...(prevState as Cabin),
                            name: e.target.value.slice(0, 25),
                          }))
                        }
                        fullWidth
                        style={{ marginBottom: "1rem" }}
                      />
                      <TextField
                        required
                        InputProps={{ sx: { borderRadius: 5 } }}
                        label="Code"
                        variant="outlined"
                        type="text"
                        disabled={editMode}
                        value={selectedCabinData?.code || ""}
                        onChange={(e) =>
                          setSelectedCabinData((prevState) => ({
                            ...(prevState as Cabin),
                            code: e.target.value,
                          }))
                        }
                        fullWidth
                        style={{ marginBottom: "1rem" }}
                      />
                      <Typography>No. of Seats</Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            border: "2px solid grey",
                            borderRadius: "20px",
                            marginTop: "15px",
                            backgroundColor: "white",
                          }}
                        >
                          <IconButton
                            color="primary"
                            aria-label="remove"
                            onClick={decreaseSeat}
                          >
                            <RemoveIcon sx={{ marginTop: "0.3rem" }} />
                          </IconButton>

                          {/* {editMode
                        ? selectedCabinData?.Seats.length
                        : numberOfSeats} */}
                          <TextField
                            variant="standard"
                            sx={{
                              width: "2.52rem",
                              height: "2.5rem",
                              marginLeft: "1.5rem",
                              marginTop: "0.5rem",
                            }}
                            InputProps={{ disableUnderline: true }}
                            value={
                              editMode
                                ? selectedCabinData?.Seats.length
                                : numberOfSeats
                            }
                            onChange={(e) => {
                              if (editMode && selectedCabinData) {
                                const newValue = parseInt(e.target.value);
                                if (!isNaN(newValue)) {
                                  const newSeats: { id: number }[] = new Array(
                                    newValue
                                  );
                                  setSelectedCabinData((prevState) => ({
                                    ...(prevState as Cabin),
                                    Seats: newSeats,
                                  }));
                                } else {
                                  setSelectedCabinData((prevState) => ({
                                    ...(prevState as Cabin),
                                    Seats: [],
                                  }));
                                }
                              } else {
                                const newValue = parseInt(e.target.value);
                                if (!isNaN(newValue)) {
                                  setNumberOfSeats(Math.max(1, newValue));
                                } else {
                                  setNumberOfSeats(null);
                                }
                              }
                            }}
                          />

                          <IconButton
                            onClick={increaseSeat}
                            color="primary"
                            aria-label="increase"
                          >
                            <AddIcon sx={{ marginTop: "0.2rem" }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Box>
                      <Button
                        sx={{
                          backgroundColor: "primary.main",
                          borderRadius: "20px",
                          width: {
                            xs: "30vw",
                            sm: "10vw",
                            md: "10vw",
                          },
                          margin: "1vw",
                          "&:hover": {
                            boxShadow: "10",
                          },
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSaveCabin}
                      >
                        {editMode ? "Save" : "Add Cabin"}
                      </Button>
                    </Box>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </>
  );
};

export default Cabins;
