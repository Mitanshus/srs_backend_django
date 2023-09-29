import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "react-toastify/dist/ReactToastify.css";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RectangleIcon from "@mui/icons-material/Rectangle";
import Switch from "@mui/material/Switch";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { red } from "@mui/material/colors";
import { useAppSelector } from "./Login";
import {
  addSchedule,
  editSchedule,
  getAllUserSchedules,
} from "../services/user-auth.services";
import { showSuccessToast, showWarningToast } from "../assets/toastify";

interface Schedule {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;

  [key: string]: boolean;
}

const UserSchedule = () => {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  const [addUserSchedule, setAddUserSchedule] = useState<Schedule>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [open, setOpen] = useState<boolean>(false);
  const { company_id, id } = useAppSelector((state) => state.user);
  const [schedule_id, setSchedule_id] = useState<string | null>(null);
  const [isBookingAvailable, setIsBookingAvailabe] = useState<boolean>(false);
  const [openDeleteSchedule, setOpenDeleteSchedule] = useState<boolean>(false);
  const handleModalOpen = () => {
    setOpen(true);
    setAddUserSchedule({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    });
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleSaveSchedule = async () => {
    const updatedSchedule = { ...addUserSchedule, user_id: id, company_id };
    let response = await addSchedule(updatedSchedule);
    const { isError, message } = response;
    if (isError) {
      showWarningToast(message);
      return;
    }
    console.log(response);
    fetchData();
    setOpen(false);
  };

  const fetchData = async () => {
    try {
      const {
        data: {
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
          id: schedule_id,
        },
        isFound,
      } = await getAllUserSchedules(company_id, id);
      if (isFound) {
        setSchedule_id(schedule_id);
        setSelectedSchedule({
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
        });
      } else {
      }
    } catch (error) {
      console.log("Error fetching Schedule:", error);
    }
  };

  const handleEditbtn = async () => {
    const updatedData = {
      ...selectedSchedule,
      company_id,
      employee_id: id,
      schedule_id,
    };
    try {
      let { message } = await editSchedule(updatedData);
      setIsBookingAvailabe(true);
      showSuccessToast(message);
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating schedule data:", error);
    }
  };

  const handleDayChange = (key: any, value: any) => {
    setAddUserSchedule((prevSchedule: any) => ({
      ...prevSchedule,
      [key]: value,
    }));
  };
  const handleDayChangeEdit = (key: any, value: any) => {
    setSelectedSchedule((prevSchedule: any) => ({
      ...prevSchedule,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {selectedSchedule ? (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ paddingTop: "90px" }}
          >
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                marginLeft: {
                  xs: "10rem",
                  sm: "40rem",
                },
                textAlign: "center",
                width: "100%",
              }}
              variant="h4"
            >
              My Schedule
            </Typography>

            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: "20px",
                  width: "9rem",
                  marginLeft: {
                    xs: "1rem",
                    sm: "30rem",
                    md: "30rem",
                  },
                  // marginBottom: "10px",
                }}
                onClick={handleModalOpen}
              >
                Edit Schedule
              </Button>
            </Box>
          </Box>
          {Object.keys(selectedSchedule).map((day, index) => (
            <Box
              key={day}
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translate(-50%, -50%)",
                left: `${10 + index * 13}%`, // Adjust the left value for proper alignment
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  textTransform: "capitalize",
                  color: "primary.main",
                  fontWeight: "bold",
                  fontSize: {
                    xs: "0.6rem",
                    sm: "1rem",
                    md: "1rem",
                  },
                }}
              >
                {day}
              </Typography>
              <CalendarMonthOutlinedIcon
                sx={{
                  color: selectedSchedule[day] ? "primary.main" : "#848884",
                  fontSize: {
                    xs: "3rem",
                    sm: "5rem",
                    md: "5rem",
                  },
                }}
              />
            </Box>
          ))}
          <Dialog open={open} onClose={handleModalClose}>
            <DialogTitle sx={{ textAlign: "center" }}>
              Edit Schedule
            </DialogTitle>
            <DialogContent sx={{ padding: "2rem 4rem" }}>
              <Box
                component="form"
                sx={{ width: "100%", maxWidth: "400px", margin: "auto" }}
              >
                {Object.keys(selectedSchedule).map((day) => (
                  <FormGroup key={day}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedSchedule[day]}
                          onChange={() =>
                            handleDayChangeEdit(day, !selectedSchedule[day])
                          }
                          sx={{
                            "& .MuiSwitch-thumb": {
                              backgroundColor: selectedSchedule[day]
                                ? "primary.main"
                                : red[500],
                            },
                            "& .MuiSwitch-track": {
                              backgroundColor: selectedSchedule[day]
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
                  </FormGroup>
                ))}
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "1rem 0", justifyContent: "center" }}>
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
                onClick={handleEditbtn}
              >
                Proceed
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={isBookingAvailable}
            onClose={() => setIsBookingAvailabe(false)}
          >
            <DialogTitle sx={{ textAlign: "center" }}>Confirmation</DialogTitle>
            <DialogContent>
              <Typography>
                Bookings are confirmed for selected schedule.Want to continue
                <Typography
                  sx={{
                    fontFamily: "Roboto Mono, monospace",
                    display: "inline",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  `This process cannot be undone`{" "}
                </Typography>
              </Typography>
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
                onClick={() => setIsBookingAvailabe(false)}
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
                onClick={() => setOpenDeleteSchedule(true)}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDeleteSchedule}
            onClose={() => setOpenDeleteSchedule(false)}
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
              <Typography>
                Do you want to proceed without deleting bookings?
              </Typography>
              <TextField
                sx={{
                  marginTop: "2rem",
                  width: {
                    xs: "24.5rem",
                    sm: "30rem",
                    md: "30em",
                  },
                }}
                label="Delete Permanently"
                // value={deletePermanently}
                // onChange={(e) => setDeletePermanently(e.target.value)}
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
                onClick={() => setOpenDeleteSchedule(false)}
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
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Box
            sx={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RectangleIcon
              sx={{
                color: "primary.main",
                fontSize: "40px",
                marginBottom: "140px",
              }}
            />
            <Typography
              sx={{
                marginLeft: "10px",
                marginBottom: "140px",
                marginRight: "100px",
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              On-site
            </Typography>

            <RectangleIcon
              sx={{ color: "#848884", fontSize: "40px", marginBottom: "140px" }}
            />
            <Typography
              sx={{
                marginLeft: "10px",
                marginBottom: "140px",
                marginRight: "100px",
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              Off-site
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "5rem",
              textAlign: "center",
            }}
          >
            <SentimentVeryDissatisfiedIcon
              sx={{ fontSize: 100, color: "primary.main", marginLeft: "5rem" }}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ paddingTop: "10px" }}
          >
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                textAlign: "center",
                marginLeft: "35vw",
              }}
              variant="h6"
            >
              You currently do not have any schedule yet.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "20px",
                marginTop: "-10rem",
                marginLeft: "22vw",
              }}
              onClick={handleModalOpen}
            >
              Add Schedule
            </Button>
          </Box>

          <Dialog open={open} onClose={handleModalClose}>
            <DialogTitle sx={{ textAlign: "center" }}>Add Schedule</DialogTitle>
            <DialogContent sx={{ padding: "2rem 4rem" }}>
              <Box
                component="form"
                sx={{ width: "100%", maxWidth: "400px", margin: "auto" }}
              >
                <FormGroup>
                  {Object.keys(addUserSchedule).map((day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Switch
                          checked={addUserSchedule[day]}
                          onChange={() =>
                            handleDayChange(day, !addUserSchedule[day])
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
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "1rem 0", justifyContent: "center" }}>
              <Button
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: "20px",
                  width: "10vw",
                  "&:hover": {
                    boxShadow: "10",
                  },
                }}
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSaveSchedule}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default UserSchedule;
