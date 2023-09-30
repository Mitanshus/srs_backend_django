//import statements
import {
	Button,
	TextField,
	Typography,
	Link,
	DialogTitle,
	Dialog,
	DialogContent,
	DialogActions,
	Grid,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../images/home-logo1.png";
import { forgotPassword, userLogin } from "../services/user-auth.services";
import { setIsLoggedIn, setToken } from "../store/features/AuthSlice";
import { setUserDetail } from "../store/features/UserSlice";
import type { AppDispatch, RootState } from "../store/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import isEmail from "validator/lib/isEmail";
import { showSuccessToast, showWarningToast } from "../assets/toastify";

// import {}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export interface LoginFormData {
	email: string;
	password: string;
}

const Login = () => {
	const [userData, setuserData] = useState<LoginFormData>({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [openForgotPassModal, setOpenForgotPassModal] =
		useState<boolean>(false);
	const [forgotemail, setForgotEmail] = useState<string>("");
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const login = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			let userdata = await userLogin(userData);
			console.log(userdata);

			if (userdata) {
				let { token = "logged in", message, data } = userdata;
				toast.success(message, {
					position: "top-left",
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				});
				dispatch(
					setUserDetail({
						id: userdata.data?.id,
						first_name: userdata.data?.first_name,
						last_name: userdata.data?.last_name,
						email: userdata.data?.email,
						primary_location: userdata.data?.primary_location,
						role_id: userdata.data?.role_id,
						company_id: userdata.data?.company_id,
						role_name: userdata.data?.role_name,
						location: userdata.data?.location,
					})
				);
				dispatch(setToken("loggedIn"));
				dispatch(setIsLoggedIn(true));
				localStorage.setItem("userData", JSON.stringify(data));
				localStorage.setItem("token", token);
				localStorage.setItem('location',data.location)
				navigate("/dashboard");
			}
		} catch (error) {
			console.log("Login failed:", error);
		}
	};
	const sendEmail = async () => {
		try {
			if (!forgotemail) {
				showWarningToast("Enter email to proceed");
			} else if (!isEmail(forgotemail)) {
				showWarningToast("Enter a valid email address to proceed");
			} else {
				const { message } = await forgotPassword({ email: forgotemail });
				showSuccessToast(message);
				setOpenForgotPassModal(false);
			}
		} catch (error) {
			console.log("error while sending link", error);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Grid container>
				<Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
					<Box
						sx={{
							backgroundColor: "#C1EDD6",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: {
								xs: "20vh",
								sm: "100vh",
								md: "100vh",
							},
						}}
						className="login-logo"
					>
						<img src={Logo} alt="Logo" width="50%" />
					</Box>
				</Grid>
				<Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: {
								xs: "80vh",
								sm: "100vh",
								md: "100vh",
							},
						}}
					>
						<Box component="form" onSubmit={login}>
							<Typography
								sx={{
									fontWeight: "bold",
									height: {
										xs: "10vh",
									},
								}}
								align="center"
								color="primary.main"
								variant="h4"
								component="h2"
								gutterBottom
							>
								Log In
							</Typography>
							<TextField
								onChange={(e: any) => {
									setuserData((prev) => {
										return { ...prev, email: e.target.value };
									});
								}}
								required
								InputProps={{ sx: { borderRadius: 5 } }}
								label="Email"
								variant="outlined"
								name="email"
								fullWidth
								style={{ marginBottom: "1rem" }}
							/>
							<TextField
								onChange={(e: any) => {
									setuserData((prev) => {
										return { ...prev, password: e.target.value };
									});
								}}
								required
								InputProps={{
									sx: { borderRadius: 5 },
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => setShowPassword(!showPassword)}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
								type={showPassword ? "text" : "password"}
								label="Password"
								variant="outlined"
								fullWidth
								name="password"
								style={{ marginBottom: "1rem" }}
							/>

							<Dialog
								open={openForgotPassModal}
								onClose={() => setOpenForgotPassModal(false)}
							>
								<DialogTitle sx={{ textAlign: "center" }}>
									{"Forgot Password"}
								</DialogTitle>
								<DialogContent>
									<Box component="form" sx={{ width: 370, margin: "1vw" }}>
										<TextField
											required
											InputProps={{ sx: { borderRadius: 5 } }}
											label="Please enter your registered email"
											variant="outlined"
											type="email"
											fullWidth
											style={{ marginBottom: "-1rem" }}
											name="email"
											onChange={(e) => {
												setForgotEmail(e.target.value);
											}}
										/>
									</Box>
								</DialogContent>
								<DialogActions>
									<Box>
										<Button
											sx={{
												backgroundColor: "primary.main",
												borderRadius: "20px",
												width: "9rem",
												margin: "1vw",
												"&:hover": {
													boxShadow: "10",
												},
											}}
											type="submit"
											variant="contained"
											color="primary"
											onClick={sendEmail}
										>
											Submit
										</Button>
									</Box>
								</DialogActions>
							</Dialog>

							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									marginBottom: "1rem",
								}}
							>
								<Link
									href="#"
									onClick={() => setOpenForgotPassModal(true)}
									sx={{ color: "primary.main", textDecoration: "none" }}
								>
									<Typography>Forgot Password ?</Typography>
								</Link>
							</Box>

							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									size="large"
									sx={{
										backgroundColor: "primary.main",
										borderRadius: "20px",
										"&:hover": {
											boxShadow: "10",
										},
										width: "9rem",
									}}
								>
									Login
								</Button>
							</Box>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};

export default Login;
