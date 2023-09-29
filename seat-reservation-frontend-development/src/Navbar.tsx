import React from "react";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../src/images/home-logo1.png";
import { useAppSelector } from "./pages/Login";
import { clearToken, setIsLoggedIn } from "./store/features/AuthSlice";
import { clearUserData } from "./store/features/UserSlice";

import MenuIcon from "@mui/icons-material/Menu";
interface LinkType {
  path: string;
  title: string;
  enums?: string[];
}

const LINK_ITEMS: LinkType[] = [
  { path: "/dashboard", title: "Home", enums: ["admin", "superadmin", "user"] }, // both
  { path: "/all-users", title: "Users", enums: ["admin", "superadmin"] }, // admin only
  { path: "/all-schedule", title: "Schedule", enums: ["admin", "superadmin"] }, // admin only
  { path: "/cabins", title: "Cabins", enums: ["admin", "superadmin"] }, // admin only
  { path: "/location", title: "Location", enums: ["superadmin"] }, // admin  only
  { path: "/user-schedule", title: "Schedule", enums: ["user"] }, //user only
  { path: "/reports", title: "Reports", enums: ["admin", "superadmin","user"] },
];

const filterPaths = (pathArray: LinkType[], role: string) => {
  return pathArray.filter((item) => {
    if (item.enums) {
      if (item.enums.includes(role)) {
        return true;
      }
      if (role === "admin" && item.enums.includes("users")) {
        return true;
      }
    }
    return false;
  });
};

const Navbar: React.FC = () => {
  const {
    role_name: role,
    first_name,
    last_name,
  } = useAppSelector((state: any) => state.user);
  console.log(role);
  const filteredPaths = filterPaths(LINK_ITEMS, role);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeHeader, setActiveHeader] = React.useState<string | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleLogoutDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogoutDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // await userLogout();
      localStorage.clear();
      toast.success("Logged out successfully" || "An unknown error occurred", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(setIsLoggedIn(false));
      dispatch(clearToken());
      dispatch(clearUserData());
      navigate("/");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };
  const handleLogoClick = () => {
    // Replace '/dashboard' with the actual path to your dashboard page
    setActiveHeader("Home");
    navigate("/dashboard");
  };

  const handleHeaderClick = (headerText: string) => {
    setActiveHeader(headerText === activeHeader ? null : headerText);
  };

  const handleProfileItemClick = () => {
    handleLogoutDropdownClose(); // Close the popover
    navigate("/profile"); // Navigate to the profile page
    setActiveHeader(null);
  };
  const [openNav, setOpenNav] = React.useState(false);

  const toggleDrawer = () => {
    setOpenNav(!openNav);
  };
  const [profileOpen, setProfileOpen] = React.useState(false);
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "white" }}>
      <Toolbar
        sx={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {isMobile ? (
          <>
            <IconButton
              size="large"
              color="inherit"
              aria-label="logo"
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={handleLogoClick}
            >
              <img src={Logo} alt="Logo" style={{ height: "40px" }} />
            </IconButton>
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Drawer open={openNav} anchor="right" onClose={toggleDrawer}>
              <List>
                {filteredPaths.map((item) => (
                  <ListItem
                    key={item.path}
                    button
                    component="a"
                    href={item.path}
                  >
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
                <ListItem button onClick={() => setProfileOpen(!profileOpen)}>
                  <ListItemText primary="Settings" />
                </ListItem>
                {profileOpen && (
                  <Box>
                    <ListItem button onClick={handleProfileItemClick}>
                      <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </Box>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 1,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={handleLogoClick}
            >
              <img src={Logo} alt="Logo" style={{ height: "40px" }} />
            </IconButton>

            <Box sx={{ marginLeft: "auto", "& > *": { mx: 2 } }}>
              {filteredPaths.map(({ path, title }) => (
                <Button
                  key={title}
                  component={NavLink}
                  to={path}
                  className={`header-link ${
                    activeHeader === title ? "active" : ""
                  }`}
                  style={{
                    textTransform: "none",
                    backgroundColor: "transparent",
                    fontSize: "0.96em",
                  }}
                  onClick={() => handleHeaderClick(title)}
                >
                  {title}
                </Button>
              ))}
              <Button
                id="profile-button"
                aria-controls="profile-menu"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleLogoutDropdownOpen}
                style={{
                  color: "#008037",
                  textTransform: "none",
                  backgroundColor: "transparent",
                  fontSize: "0.96rem",
                  fontWeight: activeHeader === "Profile" ? "bold" : "normal",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "500",
                    backgroundColor: "#008037",
                    color: "white",
                    borderRadius: "0.5rem",
                    paddingLeft: "0.9rem",
                    paddingRight: "0.9rem",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                  }}
                >
                  {first_name}{" "}
                  {last_name.charAt(0).toUpperCase() + last_name.slice(1)}
                </Typography>
                {/* <Link title={"Profile"} key={"profile"} /> */}
              </Button>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleLogoutDropdownClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleProfileItemClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Popover>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
