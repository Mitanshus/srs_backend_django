import { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { getReportsData } from "../services/report.service";
import { useAppSelector } from "./Login";
import Loader from "../components/Loader";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

interface Report {
  id: number;
  user_name: string;
  location: string;
  reservation_start_date: string;
  reservation_end_date: string;
  presence_status: string;
  seat: string;
  cabin: string;
}
const columns: GridColDef[] = [
  { field: "id", headerName: "SR.No", width: 80 },
  { field: "date", headerName: "Date", width: 140 },
  { field: "user_name", headerName: "User Name", width: 160 },
  { field: "location", headerName: "Primary Location", width: 160 },
  { field: "cabin", headerName: "Cabin", width: 140 },
  { field: "seat", headerName: "Seat No", width: 140 },
  { field: "start_time", headerName: "Booking Start Time", width: 160 },
  { field: "end_time", headerName: "Booking End Time", width: 160 },
  { field: "Confirmation_time", headerName: "Confirmation Time", width: 160 },
  {
    field: "confirmed",
    headerName: "Confirmed",
    width: 100,
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
];

const Report = () => {
  const currentDate = dayjs();
  const [selectedStartDate, setSelectedStartDate] =
    useState<dayjs.Dayjs | null>(dayjs());
  const [selectedEndDate, setSelectedEndDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [filteredRows, setFilteredRows] = useState<Report[]>([]);
  const { company_id } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);
  
  useEffect(() => {
    setIsLoading(true);
    fetchData(selectedStartDate, selectedEndDate);
  }, [selectedStartDate, selectedEndDate]);

  const fetchData = async (start_date: dayjs.Dayjs | null, end_date: dayjs.Dayjs | null) => {
    setIsLoading(true);
    try {
      const formattedStartDate = start_date ? start_date.format("YYYY-MM-DD") : "";
      const formattedEndDate = end_date ? end_date.format("YYYY-MM-DD") : "";
      const response = await getReportsData({
        company_id,
        start_date : formattedStartDate,
        end_date: formattedEndDate
      });
      console.log("report", response);

      const reportData = response.data;
      const rowdata = reportData.map((item: any, index: number) => {
        const {
          user_name,
          location,
          date,
          reservation_start_date,
          reservation_end_date,
          presence_status,
          cabin,
          seat,
          confirm_time,
        } = item;
        console.log(reservation_start_date);
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
          id: index + 1,
          user_name,
          location,
          date,
          confirmed: presence_status,
          start_time: startTime,
          end_time: endTime,
          cabin: cabin,
          seat: seat,
          Confirmation_time: confirm_time,
        };
      });
      console.log(rowdata, "//////");
      setFilteredRows(rowdata);
      setIsLoading(false);
      setIsDataAvailable(rowdata.length > 0);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleStartDateChange = (date: any) => {
    setSelectedStartDate(date);
    if (selectedEndDate && date.isAfter(selectedEndDate)) {
      setSelectedEndDate(null);
    }
  };

  const handleEndDateChange = (date: any) => {
    setSelectedEndDate(date);
    if (selectedStartDate && date.isBefore(selectedStartDate)) {
      setSelectedStartDate(null);
    }
  };

  const startDatePickerProps = {
    label: "Start Date",
    value: selectedStartDate,
    onChange: handleStartDateChange,
    format: "DD/MM/YYYY",
    maxDate: currentDate,
  };

  const endDatePickerProps = {
    label: "End Date",
    value: selectedEndDate,
    onChange: handleEndDateChange,
    format: "DD/MM/YYYY",
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          csvOptions={{ fields: columns.map((column) => column.field) }}
        />
      </GridToolbarContainer>
    );
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
            paddingTop="90px"
          >
            <Card sx={{ width: "98.9vw" }}>
              <CardContent sx={{ margin: "20px", backgroundColor: "#f0f0f0" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      flexGrow: 1,
                      marginLeft: {
                        xs: "2.2rem",
                        md: "32rem",
                        sm: "5rem",
                      },
                      fontSize: {
                        xs: "1.5rem",
                        sm: "2rem",
                        md: "2rem",
                      },
                      marginBottom: "1rem",
                    }}
                    color="primary.main"
                    variant="h4"
                  >
                    Seat Occupancy Report
                  </Typography>
                </Box>
                <Box>
                  <Box
                    sx={{
                      display: {
                        xs: "flex",
                      },
                      marginLeft: {
                        xs: "0.1rem",
                        sm: "60rem",
                        md: "60rem",
                      },
                      marginTop: {
                        xs: "1rem",
                        sm: "-4.5rem",
                        md: "-4.5rem",
                      },
                      marginBottom: "1rem",
                    }}
                  >
                    <Box sx={{ marginRight: "1rem" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker {...startDatePickerProps} />
                      </LocalizationProvider>
                    </Box>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker {...endDatePickerProps} />
                      </LocalizationProvider>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  {isDataAvailable ? (
                    <DataGrid
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      rows={filteredRows}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                          printOptions: { disableToolbarButton: true },
                        },
                      }}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                      columns={columns}
                      getRowId={(row) => row.id}
                      components={{
                        Toolbar: CustomToolbar,
                      }}
                    />
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
                        No records available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </>
  );
};

export default Report;
