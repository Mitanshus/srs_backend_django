import axios from "axios";
import { showErrorToast, showWarningToast } from "../assets/toastify";

var URL = 'http://localhost:8000/';


export const usersWithoutSchedule = async ({ company_id }: { company_id: string }) => {
    //const token = localStorage.getItem("token");
    try {
        const response = await axios.get(
            `http://localhost:8000/userschedule/viewnonschedule/?company_id=${company_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ////Authorization: token,: token,: token,
                },
            }
        );
        
        
        return await response.data;

    } catch (error: any) {
        console.log("Error while sending link", error);
        showErrorToast(error.response.data.message);
    }
}

export const addSchedule = async (data: any) => {
    //const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${URL}admin/addSchedule`, data, {
            headers: {
                "Content-Type": "application/json",
                //////Authorization: token,: token,: token,: token,
            },
        });
        return await response.data;
    } catch (error: any) {
        console.log("Error editing schedule data:", error);
        showWarningToast(error.response.data.message);
        throw error;
    }
};

export const checkScheduleRestriction = async ({ email }: any) => {
    //const token = localStorage.getItem("token");
    try {
        const response = await axios.get(
            `${URL}user/isschedulerestricted/?email=${email}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ////Authorization: token,: token,: token,
                },
            }
        );
        return await response.data.payload;
    } catch (error: any) {
        console.log("Error while checking", error);
        showErrorToast(error.response.data.message);
    }
}