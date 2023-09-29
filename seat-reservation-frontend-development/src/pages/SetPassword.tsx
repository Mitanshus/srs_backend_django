import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, Typography, Tooltip, Grid } from "@mui/material";
import Logo from "../images/home-logo1.png";
import {
  checkUserSetPassword,
  setUserPassword,
} from "../services/user-auth.services";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Result } from "antd";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

const SetPassword = () => {
  let navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isactivated, setIsActivated] = useState<boolean>(false);
  const [settedPassword, setSettedPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\#])[A-Za-z\d@$!%*?&\#]{8,}$/;
     if (!regex.test(password)) {
      setPasswordError("Password must be strong");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setPasswordError("");
    const { message } = await setUserPassword({ password, temp_token: token });
    if (message === "Password set successfully") {
      setSettedPassword(true);
    }
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
    navigate("/");
  };

  const validateUser = async (data: any) => {
    try {
      const response = await checkUserSetPassword(data);
      setIsActivated(response.isPasswordSet);
    } catch (error) {
      console.log("error while validating", error);
    }
  };
  
  useEffect(() => {
    validateUser({ token });
  }, []);

  return (
    <>
      {isactivated ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box
            sx={{
              width: "80%",
              padding: "1rem",
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            <Result
              status="error"
              title="Link Expired."
              subTitle="This password change link is expired for security reasons."
              // extra={[
              //   <Button key="buy" onClick={handleClick}>
              //     Dashboard
              //   </Button>,
              // ]}
            />
          </Box>
        </Box>
      ) : settedPassword ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box
            sx={{
              width: "80%",
              padding: "1rem",
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            <Result
              status="success"
              title="Password setted successfully."
              subTitle="Close this window and try to login."
              // extra={[
              //   <Button key="buy" onClick={handleClick}>
              //     Dashboard
              //   </Button>,
              // ]}
            />
          </Box>
        </Box>
      ) : (
        <>
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
                  md:"100vh"
                }
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                width="50%"
              />
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
                  md:"100vh"
                }
              }}
            >
              <Box component="form" onSubmit={handleLogin}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    height: {
                      xs: "10vh",
                    },
                    marginTop: {
                      xs: "-10rem",
                      sm: "1rem",
                      md: "1rem"
                    }
                  }}
                  align="center"
                  color="primary.main"
                  variant="h4"
                  gutterBottom
                >
                  {" "}
                  Set Password
                </Typography>
                <Tooltip
                  title={
                    "Password must contain at least 8 characters, one uppercase letter, lowercase letter, number, and special character."
                  }
                  placement="right-end"
                  arrow
                >
                  <TextField
                    required
                    InputProps={{ sx: { borderRadius: 5},
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
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"} // Toggle visibility based on state
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(passwordError)}
                    helperText={passwordError}
                    fullWidth
                    style={{ marginBottom: "1rem" }}
                  />
                </Tooltip>

                <TextField
                  required
                  InputProps={{ sx: { borderRadius: 5 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                  label="Confirm Password"
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  style={{ marginBottom: "1rem" }}
                />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "primary.main",
                      borderRadius: "20px",
                      width: {
                        xs: "25vh",
                        sm: "10vw",
                        md:"10vw"
                      },
                      marginBottom: {
                        xs: "0.1rem"
                      },
                      "&:hover": {
                        boxShadow: "10",
                      },
                    }}
                  >
                    Set Password
                  </Button>
                </Box>
              </Box>
            </Box>
            </Grid>
      </Grid>
        </>
      )}
    </>
  );
};

export default SetPassword;
