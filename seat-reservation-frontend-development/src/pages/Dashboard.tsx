import {
  useState,
  useEffect
} from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { toast } from "react-toastify";
import BackHandIcon from "@mui/icons-material/BackHand";
import SquareIcon from "@mui/icons-material/Square";
import dayjs from "dayjs";
import {
  Button,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Autocomplete,
  TextField,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChairIcon from "@mui/icons-material/Chair";
import InfoIcon from "@mui/icons-material/Info";
import { useAppSelector } from "./Login";

import {
  bookSeat,
  cancelBooking,
  checkAvailability,
  confirmSeat,
  currentAvailableSeats,
  getAllBookings,
  getOccupiedStatus,
  scheduledBookingCheckAvailability,
  createScheduledBooking,
  getDashboardBooking,
} from "../services/booking.services";

import {
  getAllLocations,
  getAllUserSchedules,
  getAllUsers,
} from "../services/user-auth.services";
import { Container } from "@mui/joy";
import { showSuccessToast, showWarningToast } from "../assets/toastify";
import { checkScheduleRestriction } from "../services/schedule.services";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import { MobileTimePicker } from "@mui/x-date-pickers";
// import { KeyboardReturnRounded } from "@mui/icons-material";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface DateRange {
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
}
interface Seat {
  id: string;
  status: string;
  cabin_id: string;
  code: string;
  isBooked: boolean;
  isReserved: boolean;
}

interface CabinBooking {
  id: string;
  cabinName: string;
  cabinCode: string;
  noOfSeats: number;
  seatsAvailable: number;
  seats: Seat[];
}

const DashBoard = () => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [availableCabinData, setAvailabeCabinData] = useState<
    CabinBooking[] | null
  >(null);
  const [checkAvail, setCheckAvail] = useState<boolean>(false);
  const [mybookings, setMyBookings] = useState<any[]>([]);
  interface Location {
    id: string;
    name: string;
  }

  interface User {
    id: string;
    first_name: string;
    last_name: string;
  }

  interface SeatBooking {
    reservation_start_date: string;
    reservation_end_date: string;
    start_date: string;
    User: {
      first_name: string;
      last_name: string;
    };
  }

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [occupiedModal, setOccupiedModal] = useState<boolean>(false);
  const [bookingModal, setBookingModal] = useState<boolean>(false);
  const [selectedCabin, setSelectedCabin] = useState<any | null>(null);
  const [selectedCabinSeatDetail, setselectedCabinSeatDetail] = useState<any[]>(
    []
  );
  const [selectedLocation, setselectedlocation] = useState<any>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState<number | null>(
    null
  );
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [cabinToCancel, setCabinToCancel] = useState(null);
  const [seatBookedDetails, setSeatBookedDetails] = useState<SeatBooking[]>([]);
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [cabinDetails, setCabinDetails] = useState<
    { cabinName: string; code: string }[]
  >([]);
  const [timeRange, setTimeRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });
  const [currentseats, setCurrentSeats] = useState<any[] | null>(null);
  const { primary_location, id, first_name, last_name, email } = useAppSelector(
    (state) => state.user
  );
  const [scheduleFound, setScheduleFound] = useState<boolean>(false);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [userSchedule, setUserSchedule] = useState<{
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    [key: string]: boolean;
  }>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [is_schedule_restricted, setIs_Schedule_Restricted] =
    useState<boolean>(false);

  const handleStartDateChange = (date: any | null) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD"); // Format date as "YYYY-MM-DD"
      setTimeRange((prev) => ({ ...prev, startDate: formattedDate }));
    } else {
      // Date was cleared
      setTimeRange((prev) => ({ ...prev, startDate: null }));
    }
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD"); // Format date as "YYYY-MM-DD"
      setTimeRange((prev) => ({ ...prev, endDate: formattedDate }));
    } else {
      // Date was cleared
      setTimeRange((prev) => ({ ...prev, endDate: null }));
    }
    setSelectedEndDate(date);
  };

  const startDatePickerProps = {
    label: "Start Date",
    value: selectedStartDate,
    onChange: handleStartDateChange,
    disablePast: true,
    format: "DD/MM/YYYY",
  };

  const endDatePickerProps = {
    label: "End Date",
    value: selectedEndDate,
    disablePast: true,
    format: "DD/MM/YYYY",
    onChange: handleEndDateChange,
    shouldDisableDate: (date: any) => {
      if (!selectedStartDate) {
        // Disable all dates if no start date is selected
        return true;
      }
      return dayjs(date).isBefore(dayjs(selectedStartDate), "day");
    },
  };
  const isValidTimeFormat = (time: any) => {
    // Define a regular expression pattern for valid time in "HH:mm" format
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    // Test if the time matches the pattern
    return timePattern.test(time);
  };
  const handleTimeChange = (time: Date | null, type: string) => {
    if (time) {
      const formattedTime = dayjs(time).format("HH:mm"); // Format time as "HH:mm";
      setTimeRange((prev) => ({ ...prev, [type]: formattedTime }));
    } else {
      // Time was cleared
      setTimeRange((prev) => ({ ...prev, [type]: null }));
    }
  };
  const isDateAfterToday = (date: any) => {
    const currentDate = dayjs();
    return (
      dayjs(date).isAfter(currentDate, "day") ||
      dayjs(date).isSame(currentDate, "day")
    );
  };
  const handleCheckAvailable = async () => {
    setSelectedTab(0);
    if (is_schedule_restricted && !scheduleFound) {
      showWarningToast("Create a schedule to book a seat");
      return;
    }
    let startDateTime = `${timeRange.startDate} ${timeRange.startTime}`;
    let endDateTime = `${timeRange.endDate} ${timeRange.endTime}`;
    // return;
    let locationToAdd;
    if (selectedLocation) {
      locationToAdd = selectedLocation.id;
    } else {
      locationToAdd = primary_location;
    }

    let updateid;
    if (selectedUser) {
      updateid = selectedUser.id;
    } else {
      updateid = id;
    }

    let Data = {
      user_id: updateid,
      start_date: startDateTime,
      end_date: endDateTime,
      company_id,
      location_id: locationToAdd,
    };
    const showToast = (message: string) => {
      toast.warn(message, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    };
    if (timeRange.startDate === null || timeRange.endDate === null) {
      showToast("Select Date to proceed");
      return;
    }

    if (timeRange.startTime === null || timeRange.endTime === null) {
      showToast("Select Time to proceed");
      return;
    }
    if (
      !isDateAfterToday(timeRange.startDate) &&
      !isDateAfterToday(timeRange.endDate) &&
      !isDateAfterToday(timeRange.startTime) &&
      !isDateAfterToday(timeRange.endTime)
    ) {
      showWarningToast("Invalid Date and Time");
      return;
    }
    if (
      !isDateAfterToday(timeRange.startDate) ||
      !isDateAfterToday(timeRange.endDate)
    ) {
      showWarningToast("Invalid Date");
      return;
    }
    if (
      !isValidTimeFormat(timeRange.startTime) ||
      !isValidTimeFormat(timeRange.endTime)
    ) {
      return showWarningToast("Invalid Time");
    }
    try {
      let response;
      if (is_schedule_restricted) {
        setIsLoader(true);
        response = await scheduledBookingCheckAvailability(Data);
      } else {
        setIsLoader(true);
        response = await checkAvailability(Data);
      }
      setCheckAvail(true);
      setIsLoader(false);
      const formattedData = response.map((item: any) => {
        let seatsAvailable = item.Seats.filter(
          (seat: Seat) => !seat.isBooked && !seat.isReserved
        );
        seatsAvailable = seatsAvailable.length;
        return {
          cabinName: item.Cabin.name,
          cabinCode: item.Cabin.code,
          noOfSeats: item.Seats.length,
          seatsAvailable,
          id: item.Cabin.id,
          seats: [...item.Seats],
        };
      });
      setAvailabeCabinData(formattedData);
      setIsLoader(false);
    } catch (error) {
      console.log("Error fetching cabin", error);
      setIsLoader(false);
    }
  };
  const [locations, setLocations] = useState<Location[]>([]);
  const [allusers, setAllUsers] = useState<User[]>([]); // Declare and initialize allusers
  const loggedInUser = useAppSelector((state) => state.user);

  const {
    company_id,
    location,
    role_name: role,
  } = useAppSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<any | null>({
    id,
    first_name,
    last_name,
    primary_location,
    email,
  });
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isFound, setIsFound] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setIsLoader(true);
      const locationData = await getAllLocations({
        company_id,
      });
      console.log(locationData)
      // Extract the location names from locationData
      const fetchLocation = locationData.map((item: any) => {
        const { name, id } = item;
        return {
          name,
          id,
        };
      });
      setIsLoader(false);

      setLocations(fetchLocation);
      setIsLoader(true);
      // if (role !== "admin" && role !== "superadmin" && role !== "user") {
      // let userData=[];
      const { data, isFound } = await getAllUserSchedules(
        company_id,
        selectedUser.id
      );
      setScheduleFound(isFound);
      const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
        data;
      const scheduledata = {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      };
      setUserSchedule(scheduledata);
      let userData = await getAllUsers({ company_id });
      const rowdata = userData.map((item: any) => {
        const { id, first_name, last_name, primary_location, email } = item;
        return {
          id,
          first_name,
          last_name,
          primary_location,
          email,
        };
      });
      setAllUsers(rowdata);
      // }
      setIsLoader(false);
    } catch (error) {
      console.log("Error fetching location:", error);
      setIsLoader(false);
    }
  };

  const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setSelectedTab(newValue);
  };

  const calculateSeatsInRows = (noOfSeats: number, seatsPerRow: number) => {
    const rows: number[][] = [];
    for (let i = 0; i < noOfSeats; i += seatsPerRow) {
      const row = Array.from(
        { length: Math.min(seatsPerRow, noOfSeats - i) },
        (_, index) => i + index
      );
      rows.push(row);
    }
    return rows;
  };
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedSeatIndex(null);
  };

  const handleOccupiedModalOpen = () => {
    setOccupiedModal(true);
    setIsPulsing((prev) => !prev);
  };

  const handleOccupiedModalClose = () => {
    setOccupiedModal(false);
    setIsPulsing((prev) => !prev);
  };
  const handleBookNow = (cabin: CabinBooking) => {
    setSelectedCabin(cabin);
    setselectedCabinSeatDetail(cabin.seats);
    handleModalOpen();
  };
  const confirmOccupiedSeat = async () => {
    try {
      setIsLoader(true);
      let response = await confirmSeat({ user_id: id });
      showSuccessToast(response.message);
      checkOcuupiedStatus();
      handleOccupiedModalClose();
      setIsLoader(false);
    } catch (error) {
      console.log("Error confirming seat", error);
      setIsLoader(false);
    }
  };
  const handleBookSeat = async () => {
    let startDateTime = `${timeRange.startDate} ${timeRange.startTime}`;
    let endDateTime = `${timeRange.endDate} ${timeRange.endTime}`;

    let updateid;
    if (selectedUser) {
      updateid = selectedUser.id;
    } else {
      updateid = id;
    }
    const bookingDetail = {
      company_id,
      user_id: updateid,
      seat_id: selectedSeatId,
      start_date: startDateTime,
      end_date: endDateTime,
    };
    try {
      setIsLoader(true);
      let response;
      if (is_schedule_restricted) {
        response = await createScheduledBooking(bookingDetail);
        clearAvailableData();
      } else {
        response = await bookSeat(bookingDetail);
      }
      if (response.booking.status == "BOOKED") {
        clearAvailableData();
      }
      setOpenModal(false);

      setSelectedSeatIndex(null);
      getbooking();
      getCurrentAvailableSeats();
      setIsLoader(false);
    } catch (error) {
      console.log("error adding seats", error);
      setIsLoader(false);
    }
  };

  const formatted_Datas = {
    company_id,
    location_id: primary_location,
    user_id: id,
  };
  function formatDateToDefault(dateTimeString: any) {
    const dateObj = new Date(dateTimeString);

    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = dateObj.toLocaleString("en-us", { month: "long" });
    const year = dateObj.getUTCFullYear();

    let hours = dateObj.getUTCHours();
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    const meridiem = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours %= 12;
    hours = hours || 12; // 12 AM should be displayed as 12, not 0

    const formattedTime = `${hours}:${minutes} ${meridiem}`;

    const formattedDateTime = `${day}-${month}-${year} ${formattedTime}`;
    return formattedDateTime;
  }
  async function getbooking() {
    setIsLoader(true);
    let { data: bookingData } = await getAllBookings(formatted_Datas);
    // return;
    const timeZoneMs = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    let currentDate = new Date(); // Current date and time
    currentDate = new Date(currentDate.getTime() + timeZoneMs)
    
    // Filter bookings for the current date
    const currentDayBookings = bookingData.filter((booking: any) => {
      const startDate = new Date(booking.reservation_start_date);
      const endDate = new Date(booking.reservation_end_date);

      // Compare the year, month, and day of both start and end dates
      return (
        booking.status !== "CANCELLED" &&
        ((startDate >= currentDate &&
          startDate < new Date(currentDate.getTime() + 86400000)) ||
          (endDate >= currentDate &&
            endDate < new Date(currentDate.getTime() + 86400000)))
      );
    });

    currentDayBookings.sort(
      (a: any, b: any) =>
        (new Date(a.reservation_start_date) as any) -
        (new Date(b.reservation_start_date) as any)
    );
    let UserbookingsData = bookingData.map((booking: any) => {
      // Destructure properties from each object
      let startDate = new Date(booking.reservation_start_date);
      startDate = new Date(startDate.getTime() + timeZoneMs);
      
      const {
        Seat: {
          code,
          Cabin: { name: cabinName },
        },
        status,
        reservation_start_date,
        reservation_end_date,
        id,
        user_id,
      } = booking;
      // Format the reservation start and end dates
      const formattedStartDate = formatDate(
        formatDateToDefault(reservation_start_date)
      );
      const formattedEndDate = formatDate(
        formatDateToDefault(reservation_end_date)
      );
      return {
        booking_id: id,
        user_id,
        seat_name: code,
        cabin_name: cabinName,
        status: status,
        timings: `${formattedStartDate} - ${formattedEndDate}`,
        startDate,
        currentDate,
      };
    });
    console.log("user bookings", UserbookingsData);

    setMyBookings(UserbookingsData);
    setIsLoader(false);
  }
  function formatDate(inputDateString: any) {
    // Split the input date string by '-' to extract day, month, and year
    const parts = inputDateString.split("-");
    const day = parts[0];
    const monthFullName = parts[1];
    const yearAndTime = parts[2];

    // Create a mapping of full month names to their abbreviations
    const monthAbbreviations: Record<string, string> = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
    };

    // Get the abbreviation from the mapping
    const monthAbbreviation = monthAbbreviations[monthFullName];

    // Combine the parts to form the formatted date string
    const formattedDateString = `${day}-${monthAbbreviation}-${yearAndTime}`;

    return formattedDateString;
  }

  const getCurrentAvailableSeats = async () => {
    let locationToSelect;
    if (selectedLocation === null) {
      locationToSelect = primary_location;
    } else {
      locationToSelect = selectedLocation.id;
    }
    try {
      setIsLoader(true);
      let response = await currentAvailableSeats({
        company_id,
        location_id: locationToSelect,
      });
      const formattedData = response.map((item: any) => {
        let seatsAvailable = item.Seats.filter((seat: Seat) => !seat.isBooked);
        seatsAvailable = seatsAvailable.length;
        return {
          cabinName: item.Cabin.name,
          cabinCode: item.Cabin.code,
          noOfSeats: item.Seats.length,
          seatsAvailable,
          id: item.Cabin.id,
          seats: [...item.Seats],
        };
      });
      setCurrentSeats(formattedData);
      setIsLoader(false);
    } catch (error) {
      console.log("error getting current available seats", error);
    }
  };
  const clearAvailableData = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setTimeRange({
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
    });
    setAvailabeCabinData(null);
    setCheckAvail(false);
  };

  const checkOcuupiedStatus = async () => {
    try {
      setIsLoader(true);
      let response = await getOccupiedStatus({ user_id: id });
      if (response?.isFound == false) {
        setIsFound(true);
        return;
      }
      setIsFound(false);
      const { isPresent } = response;
      setIsDisable(isPresent);
      setIsLoader(false);
    } catch (error) {
      console.log("error while checking status", error);
      setIsLoader(false);
    }
  };
  const checkschedulerestriction = async () => {
    try {
      setIsLoader(true);
      const { is_schedule_restricted } = await checkScheduleRestriction({
        email: selectedUser.email,
      });
      console.log(is_schedule_restricted, "******");
      setIs_Schedule_Restricted(is_schedule_restricted);
      setIsLoader(false);
    } catch (error) {
      console.log("error while checking", error);
      setIsLoader(false);
    }
  };

  const handleCancelBookingModal = (cabin: any) => {
    setCabinToCancel(cabin);
  };

  const handleCancelBookingModalClose = () => {
    setCabinToCancel(null);
  };

  const handleCancelBooking = async () => {
    if (cabinToCancel) {
      let { booking_id, user_id } = cabinToCancel;
      try {
        setIsLoader(true);
        await cancelBooking({ booking_id, user_id });
        getbooking();
        getCurrentAvailableSeats();
        setIsLoader(false);
        handleCancelBookingModalClose();
      } catch (error) {
        console.log(error);
        setIsLoader(false);
      }
    }
  };

  const handleDateFormat = () => {
    const dateObj = new Date();

    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = dateObj.toLocaleString("en-ud", { month: "short" });
    const year = dateObj.getUTCFullYear();

    return day + ", " + month + " " + year;
  };

  const handleBookingModalOpen = async (
    seat: Seat,
    cabinName: string,
    code: string,
    status: string
  ) => {
    if (status === "RESERVED") {
      setIsReserved(true);
      setBookingModal(true);
      setCabinDetails([{ cabinName, code }]);
      
      return
    }
    setBookingModal(true);
    setCabinDetails([{ cabinName, code }]);

    try {
      const response = await getDashboardBooking(seat.id);
      const seatBookingData = response.data;
      const rowdata = seatBookingData.map((item: any) => {
        const {
          reservation_start_date,
          reservation_end_date,
          User: { first_name, last_name },
        } = item;

        const startDateTime = new Date(reservation_start_date);

        const startHours = startDateTime.getUTCHours();
        const startMinutes = String(startDateTime.getUTCMinutes()).padStart(
          2,
          "0"
        );
        const startAmOrPm = startHours >= 12 ? "PM" : "AM";
        const startHoursFormat = String(startHours % 12 || 12).padStart(2, "0");

        const endDateTime = new Date(reservation_end_date);

        const endHours = endDateTime.getUTCHours();
        const endMinutes = String(endDateTime.getUTCMinutes()).padStart(2, "0");
        const endAmOrPm = endHours >= 12 ? "PM" : "AM";
        const endHoursFormat = String(endHours % 12 || 12).padStart(2, "0");

        const startTime = `${startHoursFormat}:${startMinutes} ${startAmOrPm}`;
        const endTime = `${endHoursFormat}:${endMinutes} ${endAmOrPm}`;
        return {
          reservation_start_date: startTime,
          reservation_end_date: endTime,
          User: { first_name, last_name },
        };
      });

      setSeatBookedDetails(rowdata);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookingModalClose = () => {
    setIsReserved(false);
    setBookingModal(false);
  };

  useEffect(() => {
    getbooking();
    fetchData();
    getCurrentAvailableSeats();
    checkOcuupiedStatus();
    checkschedulerestriction();
  }, [selectedLocation, selectedUser]);

  return (
    <>
      <Box
        sx={{
          width: {
            xs: "96vw",
            sm: "98.5vw",
            md: "98.5vw"
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "40%",
              md: "40%"
            },
            flexGrow: 1,
            marginRight: "30px",
            marginLeft: "30px",
          }}
        >
          <Card>
            <CardContent sx={{ height: "290px"}}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {/* Location Field */}
                <Autocomplete
                  defaultValue={location}
                  options={locations}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  // value={location}
                  onChange={(_, newValue) => {
                    // event.preventDefault();
                    setselectedlocation(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location"
                      variant="outlined"
                      sx={{
                         width: {
                        xs: "13.8rem",
                        sm: "16rem",
                        md: "16rem"
                      } 
                    }}
                    />
                  )}
                />
                {/* "Check Availability" Button */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "20px", 
                  width: {
                    xs: "43vw",
                    sm: "15vw",
                    md: "15vw"
                  },
                   height: {
                    xs: "3rem",
                    sm: "3rem",
                    md: "3rem"
                   }
                   }}
                  onClick={handleCheckAvailable}
                >
                  Check Availability
                </Button>
              </Box>
              <Box
                sx={{ border: "1px solid white", margin: "2px 0px -10px 10px" }}
              >
                {is_schedule_restricted && !scheduleFound && (
                  <Typography variant="body2" color="error">
                    Create a schedule to book a seat.
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    {is_schedule_restricted ? (
                      <DatePicker
                        {...startDatePickerProps}
                        shouldDisableDate={(date) => {
                          const dayName = dayjs(date)
                            .format("dddd")
                            .toLowerCase();
                          if (!scheduleFound) {
                            return true; // Disable all dates if no user schedule is found
                          }
                          return !userSchedule[dayName];
                        }}
                      />
                    ) : (
                      <DatePicker {...startDatePickerProps} />
                    )}
                  </DemoContainer>

                  <Box sx={{ width: "20px" }} />
                  <DemoContainer components={["DatePicker"]}>
                    {is_schedule_restricted ? (
                      <DatePicker
                        {...endDatePickerProps}
                        shouldDisableDate={(date) => {
                          const dayName = dayjs(date)
                            .format("dddd")
                            .toLowerCase();
                          return !userSchedule[dayName];
                        }}
                      />
                    ) : (
                      <DatePicker {...endDatePickerProps} />
                    )}
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <MobileTimePicker
                      sx={{ 
                        width: {
                        xs: "220px",
                        sm: "250px",
                        md: "250px"
                      }}}
                      label="Start Time"
                      value={
                        timeRange.startTime
                          ? dayjs(timeRange.startTime, "HH:mm").toDate()
                          : null
                      }
                      onChange={(time) => handleTimeChange(time, "startTime")}
                    />
                  </DemoContainer>
                  <Box/>
                  <DemoContainer components={["TimePicker"]}>
                    <MobileTimePicker
                     sx={{ width: {
                      xs: "220px",
                      sm: "250px",
                      md: "250px"
                    }}}
                      label="End Time"
                      value={
                        timeRange.endTime
                          ? dayjs(timeRange.endTime, "HH:mm").toDate()
                          : null
                      }
                      onChange={(time) => handleTimeChange(time, "endTime")}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {role === "superadmin" || role === "admin" ? (
                  <Autocomplete
                    options={allusers}
                    getOptionLabel={(option) =>
                      `${option.first_name} ${option.last_name}`
                    }
                    value={selectedUser}
                    defaultValue={loggedInUser}
                    onChange={(event, newValue) => {
                      event.preventDefault();
                      setSelectedUser(newValue);
                      checkschedulerestriction();
                      fetchData();
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Users"
                        variant="outlined"
                        sx={{   width: {
                          xs: "13.8rem",
                          sm: "16rem",
                          md: "16rem"
                        },
                         marginTop: "10px" }}
                      />
                    )}
                  />
                ) : null}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            marginTop: {
              xs: "2rem",
              sm: "0rem",
              md: "0rem"
            },
            width: {
              xs: "100%",
              sm: "60%",
              md: "60%"
            },
            marginRight: {
              xs: "0px",
              sm: "60px",
              md: "60px",
            },
            marginLeft: {
              xs: "0px",
              sm: "10px",
              md: "10px",
            },
            borderBottom: "1px solid #ccc",
          }}
        >
          <Card>
            <CardContent sx={{ height: "30px", }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
                TabIndicatorProps={{ style: { display: "none" } }}
              >
                <Tab label="Available Seats" id="tab-0" />
                <Tab label="My Bookings" id="tab-1" />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: {
                      xs: "0rem",
                      sm: "14rem",
                      md: "14rem"
                    }
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: isDisable
                        ? "#D22B2B"
                        : isFound
                        ? "#d3d3d3"
                        : "primary.main",
                      fontWeight: "400",
                      width: {
                        xs: "100%",
                        sm :"12.5rem",
                        md: "12.5rem" },
                      height: "2.5rem",
                      borderRadius: "1rem",
                      boxShadow: "1px 2px 9px #848884",
                      "&:hover": {
                        backgroundColor: isDisable ? "#D22B2B" : "primary.main",
                      },
                    }}
                    disabled={isFound || isDisable}
                    onClick={handleOccupiedModalOpen}
                    style={{
                      color: isDisable
                        ? "white"
                        : isFound
                        ? "#ac9ea0"
                        : "white",
                      animation:
                        !isPulsing && !isDisable && !isFound
                          ? "pulse 1.5s infinite"
                          : "none",
                    }}
                  >
                    <BackHandIcon
                      style={{
                        color: "white",
                        marginRight: "0.4rem",
                        marginLeft: "-0.1rem",
                      }}
                    />
                    {isDisable ? "Confirmed" : "Confirm Presence"}
                  </Button>
                </Box>
              </Tabs>
            </CardContent>
          </Card>
          <Dialog open={occupiedModal} onClose={handleOccupiedModalOpen}>
            <DialogTitle sx={{ textAlign: "center" }}>Confirmation</DialogTitle>
            <DialogContent>
              Kindly confirm that you have occupied the seat
            </DialogContent>
            <DialogActions>
              <Box sx={{ flexGrow: 1 }} />
              <Box>
                <Button
                  sx={{
                    margin: "0 3rem 1rem",
                  }}
                  variant="outlined"
                  onClick={() => {
                    handleOccupiedModalClose();
                  }}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    margin: "0 4.8rem 1rem -1.5rem",

                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#008037",
                    },
                  }}
                  onClick={confirmOccupiedSeat}
                  variant="outlined"
                  color="primary"
                >
                  Confirm
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
          <Card>
            <CardContent
              sx={{ height: "220px", display: "flex", overflowX: {
                xs: "hidden",
                sm: "auto",
                md: "auto"
              },
            }}
            >
              <TabPanel value={selectedTab} index={0}>
                <Box sx={{ marginRight: "20px" }}>
                  {checkAvail ? (
                    availableCabinData?.map((cabin) => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                          flexDirection: {
                            xs: "column",
                            sm: "row",
                            md: "row"
                          },
                          width: "100%", 
                          marginLeft: {
                            xs: "-5rem",
                            sm: "8rem",
                            md: "1rem"
                          }

                        }}
                        key={cabin.cabinCode}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarMonthIcon
                            sx={{ fontSize: "40px" }}
                            color="primary"
                          />
                          <Typography sx={{margin:  "0px 20px 10px 20px"
                         }}>
                            {cabin.cabinName} | {cabin.cabinCode} <br />
                            {cabin.noOfSeats} Seater | {cabin.seatsAvailable}{" "}
                            Seat Available
                          </Typography>
                        </Box>
                        <Button
                          sx={{ width: "8rem",
                          marginTop: {
                            xs: "-2.2rem"
                          },
                            marginLeft: {
                              xs: "25rem",
                              sm: "20rem",
                              md: "20rem",
                            },
                            marginRight: {
                              xs: "-1.8rem",
                              sm: "0.5rem"
                            }
                             }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleBookNow(cabin)}
                          disabled={cabin.seatsAvailable === 0}
                        >
                          Book Now
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Typography>
                      Select date and time to show available cabins.
                    </Typography>
                  )}
                </Box>
              </TabPanel>

              <Dialog open={openModal} onClose={handleModalClose}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "350px",
                    height: selectedCabinSeatDetail.length > 2 ? "370" : "450",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <DialogContent sx={{ marginTop: "-10px" }}>
                    <DialogTitle>Select Seat for booking</DialogTitle>
                    {selectedCabin && (
                      <>
                        <Container>
                          <Grid
                            sx={{ width: "fit-content" }}
                            container
                            justifyContent={
                              selectedCabinSeatDetail.length === 1
                                ? "center"
                                : "flex-start"
                            }
                          >
                            {selectedCabinSeatDetail.map((seat, index) => (
                              <>
                                <Grid
                                  item
                                  key={index}
                                  xs={4}
                                  sm={4}
                                  md={4}
                                  sx={{
                                    fontSize:
                                      selectedCabin.noOfSeats < 3
                                        ? "600%"
                                        : "500%",
                                    margin:
                                      selectedCabin.noOfSeats < 2
                                        ? "3rem 1rem 0.5rem 3.5rem"
                                        : "0rem 0.5rem 0rem 1.4rem",
                                    color:
                                      seat.isBooked && seat.isReserved
                                        ? "#088F8F"
                                        : seat.isBooked
                                        ? "#D22B2B"
                                        : seat.isReserved
                                        ? "#088F8F"
                                        : index === selectedSeatIndex
                                        ? "primary.main"
                                        : "#848884",

                                    cursor: seat.isBooked
                                      ? "not-allowed"
                                      : seat.isReserved
                                      ? "not-allowed"
                                      : "pointer",
                                    width: "100px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                  }}
                                  onClick={() => {
                                    if (!seat.isBooked) {
                                      setSelectedSeatIndex(index);
                                      setSelectedSeatId(seat.id);
                                    }
                                  }}
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
                      <Box
                        sx={{
                          display: "flex",
                          marginBottom: "1.2rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          {is_schedule_restricted ? (
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                              color="#f8c620"
                            >
                              <InfoIcon
                                sx={{
                                  marginRight: "0.5rem",
                                  color: "#f8c620",
                                }}
                              />
                              Booking will be made only on scheduled days.
                            </Typography>
                          ) : null}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          sx={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          onClick={handleModalClose}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          sx={{
                            marginLeft: "30px",
                            marginBottom: "20px",
                            backgroundColor: "#008037",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#008037",
                            },
                            "&:disabled": {
                              backgroundColor: "white",
                              color: "white",
                            },
                          }}
                          variant="outlined"
                          color="primary"
                          onClick={handleBookSeat}
                          disabled={
                            selectedSeatIndex === null ||
                            selectedCabinSeatDetail[selectedSeatIndex]
                              .isBooked ||
                            selectedCabinSeatDetail[selectedSeatIndex]
                              .isReserved ||
                            (selectedCabinSeatDetail[selectedSeatIndex]
                              .isReserved &&
                              selectedCabinSeatDetail[selectedSeatIndex]
                                .isBooked)
                          }
                        >
                          Confirm
                        </Button>
                      </Box>
                    </Box>
                  </DialogActions>
                </Box>
              </Dialog>

              <TabPanel value={selectedTab} index={1}>
                {mybookings.length !== 0 ? (
                  mybookings.map((cabin, index) => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                          md: "row"
                        },
                        width: {
                          xs: "70%",
                          sm: "100%",
                          md: "100%"
                        }
                      }}
                      key={index}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarMonthIcon
                          sx={{ fontSize: "40px",
                           marginBottom: {
                            xs: "10px",
                            sm: "20px",
                            md: "20px"
                           } }}
                          color="primary"
                        />
                        <Typography sx={{ margin: {
                          xs: "0px 1px 10px 10px",
                          sm: "0px 20px 10px 20px",
                          md: "0px 20px 10px 20px"
                        } }}>
                          {cabin.cabin_name} | {cabin.seat_name} <br />
                          {cabin.timings}
                        </Typography>
                      </Box>

                      {cabin.status == "BOOKED" ? (
                        <Button
                          sx={{ marginLeft: {
                            xs: "25rem",
                            sm: "11rem",
                            md: "11rem"
                          }, 
                        marginTop: {
                          xs: "-4rem",
                          sm: "-1rem"
                        }
                        }}
                          variant="contained"
                          color="primary"
                          disabled={cabin.startDate < cabin.currentDate}
                          onClick={() => handleCancelBookingModal(cabin)}
                        >
                          CANCEL
                        </Button>
                      ) : (
                        <Typography sx={{ marginLeft: {
                          xs: "25rem",
                        sm: "9rem" ,
                        md: "9rem"
                        },
                        marginTop: {
                          xs: "-3.5rem"
                        }
                        }}>
                          CANCELLED
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box>
                    <Typography>You have no upcoming bookings.</Typography>
                  </Box>
                )}
              </TabPanel>

              <Dialog
                open={Boolean(cabinToCancel)}
                onClose={handleCancelBookingModal}
              >
                <DialogTitle sx={{ textAlign: "center" }}>
                  Confirmation
                </DialogTitle>
                <DialogContent>
                  Are you sure you want to cancel this reservation?
                </DialogContent>
                <DialogActions>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box>
                    <Button
                      sx={{
                        margin: "0 3rem 1rem",
                      }}
                      variant="outlined"
                      onClick={handleCancelBookingModalClose}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{
                        margin: "0 4.8rem 1rem -1.5rem",

                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#008037",
                        },
                      }}
                      onClick={handleCancelBooking}
                      variant="outlined"
                      color="primary"
                    >
                      Confirm
                    </Button>
                  </Box>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {isLoader ? (
        <Box
          style={{
            position: "fixed",
            top: "80%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "primary.main",
                fontSize: "1.2rem",
                fontWeight: "500",
                textAlign: "center",
                marginTop: "2rem",
              }}
              id="currentSeatStatus"
            >
              Current Seat Status
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  textAlign: "center",
                  marginRight: "20px",
                }}
              >
                <SquareIcon
                  style={{
                    color: "#D22B2B",
                    fontSize: "20px",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#D22B2B",
                    fontSize: "1rem",
                    marginLeft: "5px",
                  }}
                >
                  Booked
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  textAlign: "center",
                  marginRight: "20px",
                }}
              >
                <SquareIcon
                  style={{
                    color: "#088F8F",
                    fontSize: "20px",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#088F8F",
                    fontSize: "1rem",
                    marginLeft: "5px",
                  }}
                >
                  Reserved
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  textAlign: "center",
                }}
              >
                <SquareIcon
                  style={{
                    color: "#848884",
                    fontSize: "20px",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#848884",
                    fontSize: "1rem",
                    marginLeft: "5px",
                  }}
                >
                  Available
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              flexGrow: 1,
              marginTop: "30px",
              height: "auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              overflowY: "hidden",
              marginBottom: "7rem",
            }}
          >
            {currentseats?.map((cabin) => (
              <Card
                key={cabin.cabinCode}
                sx={{
                  width: {
                    xs: "80%",
                    sm: "20%",
                    md: "20%"
                  },
                  margin: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      marginLeft: "-1rem",
                      marginRight: "-1rem",
                      marginTop: "-1rem",
                      backgroundColor: "#b3d9b3",
                      // width: "100%",
                      padding: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#333333",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        fontWeight: "500",
                      }}
                    >
                      {cabin.cabinName}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                    justifyContent="center"
                  >
                    {calculateSeatsInRows(cabin.noOfSeats, 2).map(
                      (rowSeats, rowIndex) => (
                        <Box
                          key={rowIndex}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "20px",
                          }}
                        >
                          {rowSeats.map((seatIndex) => (
                            <Tooltip
                              key={seatIndex}
                              title={"Click to check bookings"}
                              arrow
                            >
                              <ChairIcon
                                key={seatIndex}
                                sx={{
                                  fontSize:
                                    cabin.noOfSeats < 3 ? "350%" : "200%",
                                  margin:
                                    cabin.noOfSeats === 2
                                      ? "0px 1rem 0px 0.5rem"
                                      : cabin.noOfSeats < 7
                                      ? "0rem 1.4rem 0rem 1rem"
                                      : "0px 10px 0px 10px",
                                  color:
                                    cabin.seats[seatIndex].isReserved &&
                                    cabin.seats[seatIndex].isBooked
                                      ? "#088F8F"
                                      : cabin.seats[seatIndex].isBooked
                                      ? "#D22B2B"
                                      : cabin.seats[seatIndex].isReserved
                                      ? "#088F8F"
                                      : "#848884",
                                }}
                                onClick={() =>
                                  handleBookingModalOpen(
                                    cabin.seats[seatIndex],
                                    cabin.cabinName,
                                    cabin.seats[seatIndex].code,
                                    cabin.seats[seatIndex].status
                                  )
                                }
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}

            <Dialog open={bookingModal} onClose={handleBookingModalClose}>
              <DialogContent>
                <Paper elevation={3}>
                  <Box
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      padding: "15px",
                      display: "flex",
                      alignItems: "center",
                      width: "35rem",
                      marginLeft: "-1.5rem",
                      marginRight: "-1.5rem",
                      marginTop: "-1.5rem",
                      justifyContent: "space-between",
                    }}
                  >
                    {cabinDetails.map((row: any) => (
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {row.cabinName} {row.code} - {handleDateFormat()}
                      </Typography>
                    ))}
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={handleBookingModalClose}
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Paper>
                {
                  isReserved ? (
                    <Box
                    sx={{
                      marginTop: "5rem",
                      textAlign: "center",
                      marginBottom: "5rem",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      This seat is reserved by admin
                    </Typography>
                  </Box>
                  ) : seatBookedDetails.length > 0 ? (
                    <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Booked By
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Start Time
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight="bold">
                              End Time
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {seatBookedDetails.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {row.User.first_name} {row.User.last_name}
                            </TableCell>
                            <TableCell>{row.reservation_start_date}</TableCell>
                            <TableCell>{row.reservation_end_date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  ) : (
                    <Box
                    sx={{
                      marginTop: "5rem",
                      textAlign: "center",
                      marginBottom: "5rem",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      No bookings found for the selected seat
                    </Typography>
                  </Box>
                  )
                }
              </DialogContent>
            </Dialog>
          </Box>
        </>
      )}
    </>
  );
};

export default DashBoard;
