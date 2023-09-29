import { ReactNode } from "react";
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Navbar from "../Navbar";
import {
	Cabins,
	DashBoard,
	Location,
	Login,
	PageNotFound,
	Schedule,
	SetPassword,
	UserSchedule,
	Users,
	Profile,
	Report,
} from "../pages";
import { useAppSelector } from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Footer from "../components/Footer";

interface ShowNavbarProps {
	component: ReactNode;
}

const AppRouter = () => {
	const { isLoggedIn } = useAppSelector((state) => state.auth);
	const role = "superadmin";
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						!isLoggedIn ? <Login /> : <ShowNavbar component={<DashBoard />} />
					}
				/>
				<Route path="/set-password" element={<SetPassword />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route
					path="/all-users"
					element={<ShowNavbar component={<Users />} />}
				/>
				<Route
					path="/location"
					element={
						<PrivateRoutes>
							{role === "superadmin" ? (
								<ShowNavbar component={<Location />} />
							) : (
								<Navigate to="/dashboard" />
							)}
						</PrivateRoutes>
					}
				/>
				<Route path="/cabins" element={<ShowNavbar component={<Cabins />} />} />
				<Route
					path="/dashboard"
					element={<ShowNavbar component={<DashBoard />} />}
				/>
				<Route
					path="/all-schedule"
					element={
						<PrivateRoutes>
							<ShowNavbar component={<Schedule />} />
						</PrivateRoutes>
					}
				/>
				<Route
					path="/user-schedule"
					element={<ShowNavbar component={<UserSchedule />} />}
				/>
				<Route
					path="/profile"
					element={
						<PrivateRoutes>
							<ShowNavbar component={<Profile />} />
						</PrivateRoutes>
					}
				/>
				<Route
					path="/reports"
					element={
						<PrivateRoutes>
							<ShowNavbar component={<Report />} />
						</PrivateRoutes>
					}
				/>
				<Route path="*" element={<PageNotFound />} />{" "}
			</Routes>
		</Router>
	);
};

const ShowNavbar = ({ component }: ShowNavbarProps) => {
	const { isLoggedIn } = useAppSelector((state) => state.auth);
	return (
		<>
			{isLoggedIn && component}
			<Navbar />
			<Footer />
		</>
	);
};

const PrivateRoutes = ({ children }: { children: ReactNode }) => {
	const { isLoggedIn } = useAppSelector((state) => state.auth);
	return isLoggedIn ? children : <Navigate to="/" />;
};

export default AppRouter;
