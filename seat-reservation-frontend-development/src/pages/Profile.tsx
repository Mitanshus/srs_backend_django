import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { changePassword, getProfile } from "../services/user-auth.services";
import { useAppSelector } from "./Login";
import { showErrorToast, showSuccessToast } from "../assets/toastify";
import Loader from "../components/Loader";

const Profile = () => {
  const { id } = useAppSelector((state) => state.user);
  const [profileData, setProfileData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    location: string;
    min_days: number;
    max_days: number;
    role: string;
  } | null>({
    first_name: "",
    last_name: "",
    email: "",
    location: "",
    min_days: 0,
    max_days: 0,
    role: "",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(true); // Open the modal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(oldPassword, "==", newPassword, "==", confirmPassword);
    if (!oldPassword || !newPassword || !confirmPassword) {
      showErrorToast("Please fill all password fields");
      return;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(newPassword)) {
      setPasswordError("Password must be strong");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    let response = await changePassword({ id, oldPassword, newPassword });
    showSuccessToast(response.message);
    setPasswordError("");
    handleModalClose();
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      let profileData = await getProfile({ id });
      setProfileData(profileData);
      console.log(profileData);
      setIsLoading(false);
    } catch (error) {
      console.log("error while fetching profile data", error);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ 
          width: {
          xs: "100vw",
          sm: "70vw",
          md: "70vw"
        },
         marginLeft: {
          xs: "-7.5rem",
          sm: "13rem",
          md: "13rem"
         }, 
         marginTop: "5rem" }}>
          <Box
            sx={{
              // margin: "20px",
              marginRight: {
                xs: "-12.1rem",
                sm: "10rem",
                md: "-1rem"
              },
              backgroundColor: "#f0f0f0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", }}>
              <IconButton>
                <AccountCircleIcon
                  sx={{ fontSize: "400%", color: "primary.main" }}
                />
              </IconButton>
            </Box>
            <Typography
              sx={{ color: "primary.main", fontWeight: "bold" }}
              variant="h5"
              gutterBottom
            >
              {profileData?.first_name + " " + profileData?.last_name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
              <Typography
                color={"#007300"}
                fontWeight={"bold"}
                sx={{ width: "14rem" }}
              >
                First Name :
              </Typography>{" "}
              <TextField
                fullWidth
                variant="standard"
                inputProps={{ readOnly: true }}
                size="small"
                color="success"
                value={profileData?.first_name}
                sx={{ width: "32rem" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
              <Typography
                color={"#007300"}
                fontWeight={"bold"}
                sx={{ width: "14rem" }}
              >
                Last Name :
              </Typography>{" "}
              <TextField
                fullWidth
                variant="standard"
                inputProps={{ readOnly: true }}
                size="small"
                color="success"
                value={profileData?.last_name}
                sx={{ width: "32rem" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
              <Typography
                color={"#007300"}
                fontWeight={"bold"}
                sx={{ width: "14rem" }}
              >
                Role :
              </Typography>{" "}
              <TextField
                fullWidth
                variant="standard"
                inputProps={{ readOnly: true }}
                size="small"
                color="success"
                value={profileData?.role}
                sx={{ width: "32rem" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
              <Typography
                color={"#007300"}
                fontWeight={"bold"}
                sx={{ width: "14rem" }}
              >
                Email :
              </Typography>{" "}
              <TextField
                fullWidth
                variant="standard"
                inputProps={{ readOnly: true }}
                size="small"
                color="success"
                value={profileData?.email}
                sx={{ width: "30rem" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
              <Typography
                color={"#007300"}
                fontWeight={"bold"}
                sx={{ width: "14rem" }}
              >
                Primary Location :
              </Typography>{" "}
              <TextField
                fullWidth
                variant="standard"
                inputProps={{ readOnly: true }}
                size="small"
                color="success"
                value={profileData?.location}
                sx={{ width: "28rem" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
              <Typography
                color={"#007300"}
                fontWeight={"bold"}
                sx={{ width: "22rem",
                
              }}
              >
                Minimum Days(Week) :
              </Typography>{" "}
              <TextField
                fullWidth
                variant="standard"
                inputProps={{ readOnly: true }}
                size="small"
                color="success"
                value={profileData?.min_days}
                sx={{ width: "30rem" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
              <Typography
                color={"#007300"}
                fontWeight={"bold"}
                sx={{ width: "22rem" }}
              >
                Maximum Days(Week) :
              </Typography>{" "}
              <TextField
                fullWidth
                variant="standard"
                inputProps={{ readOnly: true }}
                size="small"
                color="success"
                value={profileData?.min_days}
                sx={{ width: "30rem" }}
              />
            </Box>
            <Box sx={{ m: 2, display: "flex", alignItems: "center" }}>
              {" "}
              <Button
                sx={{
                  alignSelf: "center",
                  marginLeft: "0.5rem",
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                  marginBottom: {
                    xs: "6rem",
                    sm: "1rem",
                    md: "1rem"
                  }
                }}
                onClick={handleModalOpen}
              >
                Change Password
              </Button>
            </Box>

            <Dialog open={open} onClose={handleModalClose}>
              <DialogTitle sx={{ textAlign: "center" }}>
                Change Password
              </DialogTitle>
              <DialogContent>
                <Box component="form" sx={{
                  width: {
                    xs: "22rem",
                    sm: "25rem",
                    md: "25rem"
                  },
                   margin: "1vw" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignitems: "center",
                      m: 2,
                    }}
                  >
                    <Typography
                      color={"#007300"}
                      fontWeight={"bold"}
                      sx={{ width: "14rem" }}
                    >
                      Old Password :
                    </Typography>
                    <TextField
                      autoFocus
                      type={showOldPassword ? "text" : "password"}
                      name="old_password"
                      variant="standard"
                      size="small"
                      color="success"
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      InputProps={{
                        inputProps: { tabIndex: 0 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowOldPassword(!showOldPassword)
                              }
                              edge="end"
                            >
                              {showOldPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: "16rem" }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignitems: "center",
                      m: 2,
                    }}
                  >
                    <Typography
                      color={"#007300"}
                      fontWeight={"bold"}
                      sx={{ width: "14rem" }}
                    >
                      New Password :
                    </Typography>
                    <Tooltip
                      title={
                        "Password must contain at least 8 characters, one uppercase letter, lowercase letter, number, and special character."
                      }
                      placement="right-end"
                      arrow
                    >
                      <TextField
                        autoFocus
                        type={showNewPassword ? "text" : "password"}
                        name="old_password"
                        variant="standard"
                        size="small"
                        color="success"
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                        InputProps={{
                          inputProps: { tabIndex: 0 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                                edge="end"
                              >
                                {showNewPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ width: "16rem" }}
                      />
                    </Tooltip>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignitems: "center",
                      m: 2,
                    }}
                  >
                    <Typography
                      color={"#007300"}
                      fontWeight={"bold"}
                      sx={{ width: "14rem" }}
                    >
                      Confirm Password :
                    </Typography>
                    <TextField
                      autoFocus
                      type={showConfirmPassword ? "text" : "password"}
                      name="old_password"
                      variant="standard"
                      size="small"
                      color="success"
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputProps={{
                        inputProps: { tabIndex: 0 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: "16rem" }}
                    />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Box>
                  <Button
                    sx={{
                      borderRadius: "2rem",
                      width: "6rem",
                      margin: "1vw",
                      "&:hover": {
                        boxShadow: "10",
                      },
                    }}
                    type="submit"
                    variant="outlined"
                    color="primary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "primary.main",
                      borderRadius: "2rem",
                      width: "6rem",
                      "&:hover": {
                        boxShadow: "10",
                      },
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Confirm
                  </Button>
                </Box>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Profile;
