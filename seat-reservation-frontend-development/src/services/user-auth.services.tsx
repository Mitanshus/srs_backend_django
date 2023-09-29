import axios from "axios";
import { toast } from "react-toastify";
import {
	showErrorToast,
	showSuccessToast,
	showWarningToast,
} from "../assets/toastify";
interface userDataType {
	email: string;
	password: string;
}
var URL = "http://localhost:8000/";

export const userLogin = async (userData: userDataType) => {
	try {
		const response = await axios.post(`${URL}user/login/`, userData);
		const data = await response.data;
		return data;
	} catch (error: any) {
		// Specify the type as 'any'
		if (error.response?.data?.message === undefined) {
			toast.warning(
				"Server is down please wait" || "An unknown error occurred",
				{
					position: "top-left",
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				}
			);
			return;
		}
		console.log("Error while logging:", error.response?.data?.message);
		toast.warning(
			"Invalid Username or Password" || "An unknown error occurred",
			{
				position: "top-left",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			}
		);
	}
};

// user logout

export const userLogout = async () => {
	//const token = localStorage.getItem("token");
	try {
		let response = await axios.post(
			`${URL}user/logout`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);
		toast.success(response?.data || "An unknown error occurred", {
			position: "top-left",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});
		localStorage.clear();
		// navigate("/")

		return await response.data;
	} catch (error: any) {
		console.log("Error while logout", error);
		showWarningToast(error.response.data.message);
	}
};

// Check user's set password

export const checkUserSetPassword = async ({ token }: { token: string }) => {
	try {
		const response = await axios.post(`${URL}user/checksetPassword`, {
			token: token,
		});
		return await response.data;
	} catch (error: any) {
		console.log("Error while checking");
		showWarningToast(error.response.data.message);
		throw error;
	}
};

export const getAllUsers = async ({ company_id }: { company_id: string }) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.get(
			`${URL}user/viewallusers/?company_id=${company_id}`,
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);
		console.log(response);
		const { data } = await response.data;
		return data;
	} catch (error: any) {
		console.log("Error fetching users:", error);
		// showWarningToast(error.response.data.message);
		throw error;
	}
};

// get all Roles

export const getAllRoles = async () => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.get(`${URL}role`, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		const { data } = await response.data;
		return data;
	} catch (error: any) {
		console.log("Error fetching roles:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

//get all location
export const getAllLocations = async ({
	company_id,
}: {
	company_id: string;
}) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.get(`${URL}location/company/${company_id}/`, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		const { data } = await response.data;
		return data;
	} catch (error: any) {
		console.log("Error fetching locations:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// edit user Detail

export const editUserData = async (userData: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.patch(`${URL}admin/editEmployee`, userData, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		console.log("Error editing users:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// add new user

export const addUser = async (user: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.post(`${URL}admin/addEmployee`, user, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		// showWarningToast(error.response.data.message);
		console.log("Error adding new  users:", error);

		let errMsg = {
			isError: true,
			message: error.response.data.message,
		};
		return errMsg;
	}
};

// Check delete user

export const checkDeluser = async (employee_id: string) => {
	//const token = localStorage.getItem("token");

	try {
		const res = await axios.get(
			`${URL}admin/checkDelEmployee?employee_id=${employee_id}`,
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);

		const data = await res.data;
		return data;
	} catch (error: any) {
		console.log("Error checking delete employee", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// delete user

export const deletUser = async (employee_id: string | null) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.delete(`${URL}admin/deleteEmployee`, {
			data: { employee_id: employee_id },
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		showWarningToast(error.response.data.message);
		console.log("Error deleting users:", error);
		throw error;
	}
};

// edit user options

export const editUserOptions = async (user: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.patch(
			`${URL}admin/editEmployeeOptions`,
			user,
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);
		return await response.data;
	} catch (error: any) {
		console.log("Error editing users options:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// Check Delete location

export const checkDelLocation = async (location_id: string) => {
	//const token = localStorage.getItem("token");

	try {
		const res = await axios.get(
			`${URL}location/checkDelLocation?location_id=${location_id}`,
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);

		const data = await res.data;
		return data;
	} catch (error: any) {
		console.log("Error checking delete location", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// delete a location

export const deleteLocation = async (location_id: string | undefined) => {
	//const token = localStorage.getItem("token");
	console.log("location id", location_id);

	try {
		const response = await axios.delete(`${URL}location/delete`, {
			data: { location_id: location_id },
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});

		return response.data.message;
	} catch (error: any) {
		console.log("Error deleting location", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// edit a location

export const editLocation = async (data: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.patch(`${URL}location/edit`, data, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		console.log("Error editing location data:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

//add location
export const addLocation = async (location: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.post(`${URL}location/add`, location, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		console.log("Error adding new  location:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// get all schedules

export const getAllSchedules = async (company_id: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.get(
			`${URL}user/getAllSchedule?company_id=${company_id}`,
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);
		const { data } = await response.data;
		return data;
	} catch (error: any) {
		console.log("Error fetching Schedules:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// add a schedule
export const addSchedule = async (data: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.post(`${URL}user/addSchedule`, data, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		showSuccessToast(response.data.message);
		return await response.data;
	} catch (error: any) {
		console.log("Error editing schedule data:", error);
		// showWarningToast(error.response.data.message);
		let errMsg = {
			isError: true,
			message: error.response.data.message,
		};
		return errMsg;
	}
};

//edit a schedule
export const editSchedule = async (data: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.patch(`${URL}user/editSchedule`, data, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		console.log("Error editing users:", error);
		showWarningToast(error.response.data.message);
	}
};

//delete a schedule
export const deleteSchedule = async (data: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.delete(`${URL}user/deleteSchedule`, {
			data,
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data.message;
	} catch (error: any) {
		console.log("Error deleting schedule:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// Check edit schdule
export const checkOldScheduledReservations = async (data: any) => {
	//const token = localStorage.getItem("token");
	const {
		monday,
		tuesday,
		wednesday,
		thursday,
		friday,
		saturday,
		sunday,
		company_id,
		user_id,
	} = data;
	try {
		const response = await axios.get(
			`${URL}booking/get-old-scheduled-bookings/?user_id=${user_id}&company_id=${company_id}&monday=${monday}&tuesday=${tuesday}&wednesday=${wednesday}&thursday=${thursday}&friday=${friday}&saturday=${saturday}&sunday=${sunday}`,
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);
		return await response.data;
	} catch (error: any) {
		console.log("Error deleting old schduled reservations:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// Delete old scheduled reservations
export const deleteOldScheduledReservations = async (data: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.delete(
			`${URL}booking/delete-old-scheduled-bookings/`,
			{
				data,
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);
		return await response.data.message;
	} catch (error: any) {
		console.log("Error deleting old schduled reservations:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

//get user schedule
export const getAllUserSchedules = async (company_id: any, user_id: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.get(
			`${URL}user/getSchedule?company_id=${company_id}&user_id=${user_id}`,
			{
				headers: {
					"Content-Type": "application/json",
					// //Authorization: token,: token,
				},
			}
		);
		const data = await response.data;
		return data;
	} catch (error: any) {
		console.log("Error fetching Schedules:", error.response.data);
		if (error.response.data.isFound == false) {
			return error.response.data;
		}
	}
};

// set password

export const setUserPassword = async ({
	password,
	temp_token,
}: {
	password: string;
	temp_token: string | null;
}) => {
	try {
		const response = await axios.patch(
			`${URL}user/setPassword`,
			{ password },
			{
				headers: {
					temp_token,
				},
			}
		);
		const data = await response.data;
		return data;
	} catch (error: any) {
		console.log("Error setting the password:", error);
		showWarningToast(error.response.data.message);
		throw error;
	}
};

// send email to set password (forgot password)

export const forgotPassword = async ({ email }: { email: string }) => {
	try {
		let response = await axios.post(`${URL}user/forgotPassword`, { email });

		return await response.data;
	} catch (error: any) {
		console.log("Error while sending link", error);
		showErrorToast(error.response.data.message);
	}
};

// Forgot password

export const setForgotPassword = async ({
	password,
	temp_token,
}: {
	password: string;
	temp_token: string | null;
}) => {
	try {
		const response = await axios.post(`${URL}user/setForgotPassword`, {
			password,
			temp_token,
		});
		const data = await response.data;
		return data;
	} catch (error: any) {
		console.log("Error setting the password:", error);
		showErrorToast(error.response.data.message);
		throw error;
	}
};

//Check forgot password
export const checkForgotPassword = async ({ token }: { token: string }) => {
	try {
		const response = await axios.post(`${URL}user/checkForgotPassword`, {
			temp_token: token,
		});
		return await response.data;
	} catch (error) {
		console.log("Error while checking");
		showErrorToast(error);
		throw error;
	}
};

// get profile

export const getProfile = async ({ id }: { id: string }) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.get(`${URL}user/getProfile?id=${id}`, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		showErrorToast(error.response.data.message);
	}
};

// change password

export const changePassword = async (data: any) => {
	//const token = localStorage.getItem("token");
	try {
		const response = await axios.post(`${URL}user/changePassword`, data, {
			headers: {
				"Content-Type": "application/json",
				// //Authorization: token,: token,
			},
		});
		return await response.data;
	} catch (error: any) {
		showErrorToast(error.response.data.message);
	}
};

// add multiple users through excel

export const bulkUpload = async (formData: any, company_id: string) => {
	try {
		const response = await axios.post(
			`${URL}admin/bulkUserCreate?company_id=${company_id}`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return await response.data;
	} catch (error: any) {
		console.error("Error uploading bulk data:", error);
		showErrorToast(error.response.data.message);
	}
};
export const bulkAddSchedule = async (formData: any, company_id: string) => {
	try {
		const response = await axios.post(
			`${URL}admin/bulkAddSchedule?company_id=${company_id}`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return await response.data;
	} catch (error: any) {
		console.error("Error uploading bulk data:", error);
		showErrorToast(error.response.data.message);
	}
};
