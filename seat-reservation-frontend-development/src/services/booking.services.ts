import axios from "axios";
import { toast } from "react-toastify";
import { showSuccessToast, showWarningToast } from "../assets/toastify";

var URL = 'http://127.0.0.1:8000/';

export const checkAvailability = async (data: any) => {
    const { company_id, location_id, start_date, end_date } = data;
    //const token = localStorage.getItem('token');
    try {
        const response = await axios.get(
            `${URL}reservation/avail-seats/${company_id}/${location_id}/${start_date}/${end_date}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: token,: token,
                },
            }
        );
        return response.data.data;
    } catch (error: any) {
        // Handle error here
        console.error(error);
        showWarningToast(error.response.data.message);
        throw error;
    }
};

export const bookSeat = async (data: any) => {
    //const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${URL}booking/create`, data, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: token,: token,
            },
        });
        toast.success(response?.data.message || "An unknown error occurred", {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        return await response.data;
    } catch (error: any) {
        console.log("Error booking seat:", error);
        showWarningToast(error.response.data.message);
        throw error;
    }
}


export const getAllBookings = async (data: any) => {
    //const token = localStorage.getItem("token");

    const { company_id, location_id, user_id } = data;
    try {
        const response = await axios.get(
            `${URL}booking/?company_id=${company_id}&location_id=${location_id}&user_id=${user_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: token,: token,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.log("Error booking seat:", error);
        showWarningToast(error.response.data.message);
    }
}
// delete all bookings
export const cancelBooking = async (bookingData: any) => {
    //const token = localStorage.getItem("token");
    try {
        const response = await axios.patch(`${URL}booking/cancel`, bookingData, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: token,: token,
            },
        });
        toast.success(response?.data.message || "An unknown error occurred", {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        return await response.data;
    } catch (error : any) {
        console.log("Error editing users:", error);
        showWarningToast(error.response.data.message);
        throw error;
    }
};

// current available seats

export const currentAvailableSeats = async (data: any) => {
    const { company_id, location_id } = data;
    //const token = localStorage.getItem('token');
    try {
        const response = await axios.get(
            `${URL}reservation/dashboardbookings/?company_id=${company_id}&location_id=${location_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: token,: token,
                },
            }
        );
        return response.data.data;
    } catch (error : any) {
        // Handle error here
        console.error(error);
        showWarningToast(error.response.data.message);
        throw error;
    }
}

export const getOccupiedStatus = async (data: any) => {
    //const token = localStorage.getItem('token');
    try {

        const response = await axios.post(`${URL}booking/confirm-presence`, data, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: token,: token,
            },
        });
        return await response.data;
    } catch (error:any) {
        console.error(error);
        return error?.response.data
    }
}

export const confirmSeat = async (data: any) => {
    //const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${URL}booking/confirm-seat`, data, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: token,: token,
            },
        });
        return await response.data;
    } catch (error:any) {
        console.error(error);
        return error?.response.data
    }
}

export const scheduledBookingCheckAvailability = async (data: any) => {
    const { user_id, company_id, location_id, start_date, end_date } = data;
    //const token = localStorage.getItem('token');
    try {
        const response = await axios.get(
            `${URL}booking/scheduled-bookings-avail-seats/${user_id}/${company_id}/${location_id}/${start_date}/${end_date}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: token,: token,
                },
            }
        );
        
        return response.data.data;
    } catch (error: any) {
        // Handle error here
        console.error(error);
        showWarningToast(error.response.data.message);
        throw error;
    }
};

export const createScheduledBooking = async (data: any) => {
    //const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${URL}booking/create-scheduled-booking`, data, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: token,: token,
            },
        });
        showSuccessToast(response?.data.message);
        return await response.data;
    } catch (error: any) {
        console.log("Error booking seat:", error);
        showWarningToast(error.response.data.message);
        throw error;
    }
}


export const getDashboardBooking = async (seat_id: any) => {
    //const token = localStorage.getItem("token");

    try {
        const response = await axios.get(
            `${URL}reservation/dashboard-bookings/?seat_id=${seat_id}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: token,: token,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        showWarningToast(error.response.data.message);
    }
}