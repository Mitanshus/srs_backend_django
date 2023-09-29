import axios from "axios";
import { showWarningToast } from "../assets/toastify";

var URL = import.meta.env.VITE_REACT_API_URL;

export const getReportsData = async (data: any) => {
    //const token = localStorage.getItem("token");

    const { company_id, start_date, end_date } = data;
    try {
        const response = await axios.get(
            `${URL}booking/presence-report?start_date=${start_date}&end_date=${end_date}&company_id=${company_id}`,
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