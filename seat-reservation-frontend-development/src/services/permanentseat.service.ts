import axios from "axios";
import { showWarningToast } from "../assets/toastify";

var URL = import.meta.env.VITE_REACT_API_URL;

export const getSeatDataByStatus = async (data: any) => {
    //const token = localStorage.getItem("token");

    const { cabin_id } = data;
    console.log('data==', data)
    try {
        const response = await axios.get(
            `${URL}booking/seat-data?cabin_id=${cabin_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //Authorization: token,: token,
                },
            }
        );
        const data = await response;
        console.log('====', data)
        return data;
    } catch (error: any) {
        console.log(error);
        
        showWarningToast(error.response.data.message);
    }
}

export const getCheckPermanentReservation = async (data: any) => {
    //const token = localStorage.getItem('token');
    try {
console.log('data', data)
        const response = await axios.patch(`${URL}booking/check-permanent-reservation`, data, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: token,: token,
            },
        });
        console.log('response1234', response.data);
        return await response.data;
    } catch (error:any) {
        console.error(error);
        return error?.response.data
    }
}

export const getConfirmPermanentReservation = async (data: any) => {
    //const token = localStorage.getItem('token');
    try {
        console.log('===data', data)

        const response = await axios.patch(`${URL}booking/permanent-reservation`, data, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: token,: token,
            },
        });
        console.log('responseconfirm', response)
        return await response.data;
    } catch (error:any) {
        console.error(error);
        return error?.response.data
    }
}