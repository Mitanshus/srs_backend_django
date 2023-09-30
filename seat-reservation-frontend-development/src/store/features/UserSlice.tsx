import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	primary_location: string;
	role_id: string;
	company_id: string;
	role_name: string;
	location: {
		id: string;
		name: string;
	};
}

// Check if user data exists in localStorage
const localStorageUserData = localStorage.getItem("userData");
const initialState: UserState = localStorageUserData
	? JSON.parse(localStorageUserData)
	: {
			id: "",
			first_name: "",
			last_name: "",
			email: "",
			primary_location: "",
			role_id: "",
			company_id: "",
			role_name: "",
			location : {
				id : "",
				name : ""
			}
	  };

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserDetail: (state, action: PayloadAction<UserState>) => {
			const updatedUser = localStorageUserData
				? { ...state, ...JSON.parse(localStorageUserData), ...action.payload }
				: { ...state, ...action.payload };

			localStorage.setItem("userData", JSON.stringify(updatedUser));
			console.log(action.payload);

			return updatedUser;
		},
		clearUserData: () => {
			localStorage.removeItem("userData");
			return {
				id: "",
				first_name: "",
				last_name: "",
				email: "",
				primary_location: "",
				role_id: "",
				company_id: "",
				role_name: "",
				location: {
					id: "",
					name: "",
				},
			};
		},
	},
});
export const { setUserDetail, clearUserData } = userSlice.actions;
export default userSlice.reducer;
