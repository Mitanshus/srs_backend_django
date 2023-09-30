import axios from "axios";

import { showWarningToast } from "../assets/toastify";

var URL = "http://localhost:8000/";

export interface cabinDataType {
  location_id: string;
  name: string;
  code: string;
  seats: number | any;
}

export interface CabinDataWithId {
  cabin_id: string;
  name: string;
  seats: number | any;
}

export const getCabins = async (location_id: string) => {
  //const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `http://localhost:8000/cabin/viewallcabin/?location_id=${location_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          //Authorization: token,: token
        },
      }
    );

    const { data } = await res.data;

    return data;
  } catch (error: any) {
    console.log("Error fetching cabins", error);
    showWarningToast(error.response.data.message);
  }
};

export const addCabin = async (cabinData: cabinDataType) => {
  //const token = localStorage.getItem("token");
  try {
    const res = await axios.post(`${URL}cabin/create/`, cabinData, {
      headers: {
        "Content-Type": "application/json",
        //Authorization: token,: token,
      },
    });
    const data = await res.data;
    return data;
  } catch (error: any) {
    console.log("Error adding cabin", error);
    showWarningToast(error.response.data.message);
  }
};

export const editCabin = async (cabinData: CabinDataWithId | any) => {
  //const token = localStorage.getItem("token");
  try {
    const res = await axios.patch(`${URL}admin/editCabin`, cabinData, {
      headers: {
        "Content-Type": "application/json",
        //Authorization: token,: token,
      },
    });
    const msg = await res.data.message;
    return msg;
  } catch (error: any) {
    console.log("Error adding cabin", error);
    showWarningToast(error.response.data.message);
    throw error;
  }
};

export const checkDelCabin = async (cabin_id: string) => {
  //const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${URL}admin/checkDelCabin?cabin_id=${cabin_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          //Authorization: token,: token,
        },
      }
    );

    const data = await res.data;
    return data;
  } catch (error: any) {
    console.log("Error checking delete cabin", error);
    showWarningToast(error.response.data.message);
    throw error;
  }
};

export const deleteCabin = async (cabin_id: string) => {
  //const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(`${URL}admin/deleteCabin`, {
      data: { cabin_id: cabin_id },
      headers: {
        "Content-Type": "application/json",
        //Authorization: token,: token,
      },
    });

    const msg = await res.data.message;
    return msg;
  } catch (error: any) {
    console.log("Error deleting cabin", error);
    showWarningToast(error.response.data.message);
    throw error;
  }
};
