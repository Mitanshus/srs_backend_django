import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Loader from "../components/Loader";
import Switch from "@mui/material/Switch";
import { green, red } from "@mui/material/colors";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  addSchedule,
  bulkAddSchedule,
  deleteSchedule,
  editSchedule,
  getAllSchedules,
  deleteOldScheduledReservations,
  checkOldScheduledReservations
} from "../services/user-auth.services";
import { useAppSelector } from "./Login";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../assets/toastify";
import { usersWithoutSchedule } from "../services/schedule.services";

const Schedule = () => {
  interface Schedule {
    id: string;
    name: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    user_id: string;
  }
  interface AddSchedule {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;

    [key: string]: boolean;
  }
  const { company_id, id: userId } = useAppSelector((state) => state.user);
  const [open, setOpen] = useState<boolean>(false);
  const [openAddSchedule, setOpenAddSchedule] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userWithoutSchedule, setUserWithoutSchedule] = useState<any[]>([]);
  const [ScheduleToDelete, setScheduleToDelete] = useState<Schedule | null>({
    id: "",
    name: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    user_id: "",
  });
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>({
    id: "",
    name: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    user_id: "",
  });
  const [addUserSchedule, setAddUserSchedule] = useState<AddSchedule>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const [hasSchedule, setHasSchedule] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [deletePermanently, setDeletePermanently] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isExistingBookings, setIsExistingBookings] = useState<boolean>(false);
  const [reservations, setReservations] = useState<number>(0);

  const columns: GridColDef[] = [
    {
      field: "Sr.No",
      headerName: "Sr.No",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      description: "name",
      headerName: "Name",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value.charAt(0).toUpperCase() + params.value.slice(1),
    },
    {
      field: "monday",
      description: "monday",
      headerName: "Monday",
      width: 120,
      headerAlign: "center",
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
      field: "tuesday",
      description: "Tuesday",
      headerName: "Tuesday",
      width: 120,
      headerAlign: "center",
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
      field: "wednesday",
      description: "Wednesday",
      headerName: "Wednesday",
      width: 120,
      headerAlign: "center",
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
      field: "thursday",
      description: "Thursday",
      headerName: "Thursday",
      width: 120,
      headerAlign: "center",
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
      field: "friday",
      description: "Friday",
      headerName: "Friday",
      width: 120,
      headerAlign: "center",
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
      field: "saturday",
      description: "Saturday",
      headerName: "Saturday",
      width: 120,
      headerAlign: "center",
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
      field: "sunday",
      description: "Sunday",
      headerName: "Sunday",
      width: 120,
      headerAlign: "center",
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
      field: "total_days",
      description: "total days of user in a week ",
      headerName: "Total Days",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <strong>{params.value}</strong> // Make the cell value bold
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

  const handleEdit = (schedule: any) => {
    setOpen(true);
    setSelectedSchedule(schedule);
  };

  const handleProceedEdit = async () => {

    if(selectedSchedule){
      const {
        monday,
        tuesday,
        wednesday,
        thursday,
        saturday,
        sunday,
        friday,
        user_id,
      } = selectedSchedule;

      const payload = {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        company_id,
        user_id,
      };

      const res = await checkOldScheduledReservations(payload);
      if(res.isBookingAvailable){
        setIsExistingBookings(res.isBookingAvailable);
        setReservations(res.existingBookings);
        setOpen(false);
        setIsEdited(true);
      } else {
        handleEditbtn();
      }
    }

  }

  const handleEditbtn = async () => {
    if (selectedSchedule) {
      const {
        monday,
        tuesday,
        wednesday,
        thursday,
        saturday,
        sunday,
        id,
        friday,
        user_id,
      } = selectedSchedule;

      const updatedData = {
        monday,
        tuesday,
        wednesday,
        thursday,
        saturday,
        sunday,
        schedule_id: id,
        company_id,
        employee_id: user_id,
        friday,
      };

      try {
        setIsLoading(true);
        let response = await editSchedule(updatedData);
        showSuccessToast(response.message);
        fetchData();
        setOpen(false);
        setIsLoading(false);
        setIsEdited(false);
      } catch (error) {
        console.error("Error updating schedule data:", error);
        setIsLoading(false);
      }
    }
  };

  const handleEditScheduleWithDeletion = async () => {
    
      if (selectedSchedule) {
        const {
          monday,
          tuesday,
          wednesday,
          thursday,
          saturday,
          sunday,
          id,
          friday,
          user_id,
        } = selectedSchedule;

        const deleteReservationsData = {
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
          company_id,
          user_id,
        };

        const updatedData = {
          monday,
          tuesday,
          wednesday,
          thursday,
          saturday,
          sunday,
          schedule_id: id,
          company_id,
          employee_id: user_id,
          friday,
        };

        try {
          setIsLoading(true);
          await deleteOldScheduledReservations(deleteReservationsData);
          await editSchedule(updatedData);
          showSuccessToast('Future bookings deleted and schedule updated successfully');
          fetchData();
          setIsLoading(false);
          setIsEdited(false);
          setOpen(false);
          setIsExistingBookings(false);
          setReservations(0);
        } catch (error) {
          console.error("Error updating schedule data:", error);
          setIsLoading(false);
        }
      }

  }

  const handleDelete = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setDeleteModalOpen(true);
  };

  const [rows, setRows] = useState<Schedule[]>([]);

  const handleModalClose = () => {
    setOpen(false);
  };
  const getusersWithoutSchedule = async () => {
    try {
      setIsLoading(false);
      const response = await usersWithoutSchedule({ company_id });
      console.log(response);
      if (response) {
        setHasSchedule(true);
        
        setUserWithoutSchedule(response.data);
      } else {
        setHasSchedule(false);
      }
    } catch (error) {
      console.log("error while retreiving data", error);
      setIsLoading(false);
    }
  };

  const handleModalOpenForAddSchedule = async () => {
    try {
      setOpenAddSchedule(true);
      getusersWithoutSchedule();
    } catch (error) {
      console.log("error while retreiving data", error);
    }
  };
  const handleModalCloseForAddSchedule = () => {
    setOpenAddSchedule(false);
  };
  const handleDeleteBtn = async () => {
    try {
      setIsLoading(true);
      if (deletePermanently === 'Delete Permanently') {
        const msg = await deleteSchedule({ schedule_id: ScheduleToDelete?.id });
        showErrorToast(msg);
        setDeleteModalOpen(false);
        setDeletePermanently('');
        fetchData();
      } else {
        showWarningToast('Delete confirmation text mismatched!');
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting user :", error);
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const scheduleResponse = await getAllSchedules(company_id);
      
      const scheduleData = scheduleResponse?.map((item: any) => {
        const {
          id,
          user_id,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
          first_name,
          last_name
        } = item;
        
        const name =
          `${first_name} ${last_name}` +
          (user_id === userId ? " (You)" : "");
        let total_days =
          monday + tuesday + wednesday + thursday + friday + saturday + sunday;
        return {
          id,
          name,
          user_id,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
          total_days,
        };
      });
      const mySchedules = scheduleData.filter(
        (item: any) => item.user_id === userId
      );
      const otherSchedules = scheduleData.filter(
        (item: any) => item.user_id !== userId
      );

      // Concatenate arrays: user's schedules on top followed by others' schedules
      const combinedSchedules = mySchedules.concat(otherSchedules);
      const finalScheduleData = combinedSchedules.map(
        (item: any, index: number) => ({
          ...item,
          "Sr.No": index + 1,
        })
      );
      setIsLoading(false);
      setRows(finalScheduleData);
    } catch (error) {
      console.log("Error fetching Schedule:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleDayChange = (day: any) => (event: any) => {
    setSelectedSchedule((prevSchedule: any) => ({
      ...prevSchedule,
      [day]: event.target.checked ? true : false,
    }));
  };
  const handleDayAddschedule = (key: any, value: any) => {
    setAddUserSchedule((prevSchedule: any) => ({
      ...prevSchedule,
      [key]: value,
    }));
  };
  const handleSaveAddSchedule = async () => {
    if (!selectedUser) {
      showWarningToast("Select a user to proceed");
      return;
    }
    const { id } = selectedUser;
    const updatedSchedule = { ...addUserSchedule, user_id: id, company_id };
    let response = await addSchedule(updatedSchedule);
    const { isError, message } = response;
    if (isError) {
      showWarningToast(message);
      setIsLoading(false);
      return;
    }
    handleModalCloseForAddSchedule();
    showSuccessToast(response.message);
    handleModalCloseForAddSchedule();
    getusersWithoutSchedule();
    fetchData();
    setOpen(false);
    setAddUserSchedule({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    });
    setSelectedUser(null);
  };
  const headers = [
    "email",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const handleDownload = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "add_schedule_bulk.xlsx");
  };
  const handleBulkUploadClick = () => {
    let input = document.createElement("input");
    input.type = "file";
    const allowedExtensions = /\.xlsx$/i;

    input.onchange = () => {
      if (input.files) {
        let files = Array.from(input.files);
        for (const file of files) {
          if (!allowedExtensions.test(file.name)) {
            showErrorToast("Invalid file format. Only XLSX files are allowed.");
            setSelectedFile(null);
          } else {
            if (
              file.type === "application/vnd.ms-excel" ||
              file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) {
              setSelectedFile(file);
              setOpenModal(true);
            } else {
              showErrorToast(
                "Invalid file format. Only XLSX files are allowed."
              );
            }
          }
        }
        // Change the button label to "Upload"
        // setUploading(true);
      }
    };

    input.click();
  };
  const handleCloseModal = () => {
    // Close the modal, reset the selected file, and clear the Excel data
    setOpenModal(false);
    setSelectedFile(null);
  };

  const handleUpload = () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event?.target?.result;
      if (arrayBuffer) {
        const formData = new FormData();
        formData.append("file", new Blob([arrayBuffer]));
        let { userCreated, message } = await bulkAddSchedule(

          formData,

          company_id

        );
        if (userCreated) {
          fetchData();
          showSuccessToast(message);
          setOpenModal(false);
          setSelectedFile(null);
        }
      } else {
        showWarningToast("Invalid file");
      }
      // Reset the button label back to "Bulk Upload"
      // setUploading(false);
    };
    reader.readAsArrayBuffer(selectedFile);
  };
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
            <Card sx={{ width: "100vw" }}>
              <CardContent sx={{ margin: "20px", backgroundColor: "#f0f0f0" }}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: {
                        xs: "column",
                        md: "row",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        flexGrow: 1,
                        marginBottom: "10px",
                        // marginLeft: rows.length > 0 ? "25rem" : "18rem",
                        marginLeft: {
                          xs: "2rem",
                          sm: "2rem",
                          md: "28rem",
                        },
                        fontSize: {
                          xs: "1.5rem",
                          sm: "2rem",
                          md: "2rem"
                        }
                      }}
                      align="center"
                      color="primary.main"
                      variant="h4"
                    >
                      Schedule
                    </Typography>
                    <Box>
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "primary.main",
                            borderRadius: "20px",
                            width: "8.5rem",
                            marginLeft: "3px",
                            marginBottom: "10px",
                            height: {
                              xs: "2.8rem",
                              sm: "2.8rem",
                              md: "2.3rem"
                            }
                          }}
                          onClick={handleModalOpenForAddSchedule}
                        >
                          Add Schedule
                        </Button>

                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "primary.main",
                            borderRadius: "20px",
                            marginBottom: "10px",
                            marginLeft: "3px",
                            width: {
                              xs: "9rem",
                              sm: "9rem",
                              md: "12rem",
                            },
                            height: {
                              xs: "2.8rem",
                              sm: "2.8rem",
                              md: "2.3rem"
                            }
                          }}
                          onClick={handleDownload}
                        >
                          Download Template
                        </Button>


                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "primary.main",
                            borderRadius: "20px",
                            marginBottom: "10px",

                            marginLeft: "3px",

                            height: {
                              xs: "2.8rem",
                              sm: "2.8rem",
                              md: "2.3rem"
                            }
                          }}
                          onClick={handleBulkUploadClick}
                        >
                          {" "}
                          Bulk Upload
                        </Button>
                        <Dialog open={openModal} onClose={handleCloseModal}>
                          <DialogTitle>Confirm Upload</DialogTitle>
                          <DialogContent>
                            <Typography>
                              Are you sure you want to upload the selected file?
                            </Typography>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseModal} color="primary">
                              Cancel
                            </Button>
                            <Button onClick={handleUpload} color="primary">
                              Upload
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    </Box>
                  </Box>
                  <Dialog open={open} onClose={handleModalClose}>
                    <DialogTitle sx={{ textAlign: "center" }}>
                      Edit Schedule
                    </DialogTitle>
                    <DialogContent sx={{ padding: "2rem 4rem" }}>
                      <Box
                        component="form"
                        sx={{
                          width: "100%",
                          maxWidth: "400px",
                          margin: "auto",
                        }}
                      >
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedSchedule?.monday || false}
                                onChange={handleDayChange("monday")}
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: selectedSchedule?.monday
                                      ? green[500]
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: selectedSchedule?.monday
                                      ? green[300]
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label="Monday"
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedSchedule?.tuesday || false}
                                onChange={handleDayChange("tuesday")}
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: selectedSchedule?.tuesday
                                      ? green[500]
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: selectedSchedule?.tuesday
                                      ? green[300]
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label="Tuesday"
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedSchedule?.wednesday || false}
                                onChange={handleDayChange("wednesday")}
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: selectedSchedule?.wednesday
                                      ? green[500]
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: selectedSchedule?.wednesday
                                      ? green[300]
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label="Wednesday"
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedSchedule?.thursday || false}
                                onChange={handleDayChange("thursday")}
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: selectedSchedule?.thursday
                                      ? green[500]
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: selectedSchedule?.thursday
                                      ? green[300]
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label="thursday"
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedSchedule?.friday || false}
                                onChange={handleDayChange("friday")}
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: selectedSchedule?.friday
                                      ? green[500]
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: selectedSchedule?.friday
                                      ? green[300]
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label="Friday"
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedSchedule?.saturday || false}
                                onChange={handleDayChange("saturday")}
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: selectedSchedule?.saturday
                                      ? green[500]
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: selectedSchedule?.saturday
                                      ? green[300]
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label="Saturday"
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={selectedSchedule?.sunday || false}
                                onChange={handleDayChange("sunday")}
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: selectedSchedule?.sunday
                                      ? green[500]
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: selectedSchedule?.sunday
                                      ? green[300]
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label="Sunday"
                          />
                        </FormGroup>
                      </Box>
                    </DialogContent>
                    <DialogActions
                      sx={{ padding: "1rem 0", justifyContent: "center" }}
                    >
                      <Button
                        sx={{
                          backgroundColor: "primary.main",
                          borderRadius: "20px",
                          width: "9rem",
                          "&:hover": {
                            boxShadow: "10",
                          },
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleProceedEdit}
                      >
                        Proceed
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={isEdited}
                    onClose={() => setIsEdited(false)}
                  >

                    <DialogTitle sx={{ textAlign: "center" }}>Manage future reservations</DialogTitle>
                    <DialogContent>
                      {isExistingBookings && (
                        <Typography>
                          You have
                          <Typography sx={{ fontFamily: 'Roboto Mono, monospace', display: 'inline', fontWeight: "bold" }}>
                            {' '}{reservations} future bookings{' '}
                          </Typography>
                            as per your current schedule, do you want them as well?
                        </Typography>
                      )
                      }
                    </DialogContent>
                    <DialogActions>
                      {isExistingBookings && (
                        <Button
                          sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "primary.main",
                            },
                          }}
                          onClick={() => handleEditbtn()}
                        >
                          Don't Delete
                        </Button>
                      )}
                      {isExistingBookings && (
                        <Button
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "red",
                            },
                          }}
                          onClick={() => handleEditScheduleWithDeletion()}
                        >
                          Delete
                        </Button>
                      )
                      }
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
                      {ScheduleToDelete && (
                        <Typography>
                          This action can not be undone. Are you sure you want to delete? Type
                          <Typography sx={{ fontFamily: 'Roboto Mono, monospace', display: 'inline', fontWeight: "bold" }}>
                            {' '}`Delete Permanently`{' '}
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
                            md: "30em",
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
                        onClick={handleDeleteBtn}
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>

                </Box>
                {rows.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      getRowId={(row) => row.id}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 50,
                          },
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "2rem",
                      textAlign: "center",
                    }}
                  >
                    <SentimentVeryDissatisfiedIcon
                      sx={{ fontSize: 100, color: "primary.main" }}
                    />
                    <Typography
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        paddingTop: "1rem",
                      }}
                      variant="h6"
                    >
                      You currently do not have any schedule yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
            <Dialog
              open={openAddSchedule}
              onClose={handleModalCloseForAddSchedule}
            >
              <DialogTitle sx={{ textAlign: "center" }}>
                {hasSchedule ? "Add Schedule" : null}
              </DialogTitle>
              <DialogContent sx={{ padding: "1rem 4rem" }}>
                <Box
                  component="form"
                  sx={{ width: "100%", maxWidth: "400px", margin: "auto" }}
                >
                  {hasSchedule ? (
                    <>
                      <Autocomplete
                        options={userWithoutSchedule}
                        getOptionLabel={(user) =>
                          user.id === userId
                            ? `${user.first_name} (You)`
                            : `${user.first_name} ${user.last_name}`
                        }
                        value={selectedUser}
                        onChange={(event, newValue) => {
                          event.preventDefault();
                          setSelectedUser(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select user"
                            variant="outlined"
                            sx={{ marginBottom: "15px", marginTop: "15px" }}
                          />
                        )}
                      />
                      <FormGroup>
                        {Object.keys(addUserSchedule).map((day) => (
                          <FormControlLabel
                            key={day}
                            control={
                              <Switch
                                checked={addUserSchedule[day]}
                                onChange={() =>
                                  handleDayAddschedule(
                                    day,
                                    !addUserSchedule[day]
                                  )
                                }
                                sx={{
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: addUserSchedule[day]
                                      ? "primary.main"
                                      : red[500],
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: addUserSchedule[day]
                                      ? "primary.main"
                                      : red[300],
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ textTransform: "capitalize" }}>
                                {day}
                              </Typography>
                            }
                          />
                        ))}
                      </FormGroup>
                    </>
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      All users have schedules.
                    </Typography>
                  )}
                </Box>
              </DialogContent>
              ;
              <DialogActions
                sx={{ padding: "1rem 0", justifyContent: "center" }}
              >
                {hasSchedule && (
                  <Button
                    sx={{
                      backgroundColor: "primary.main",
                      borderRadius: "20px",
                      width: {
                        xs: "9rem",
                        sm: "9rem",
                        md: "9rem"
                      },
                      "&:hover": {
                        boxShadow: "10",
                      },
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAddSchedule}
                  >
                    Save
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </Box>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default Schedule;
