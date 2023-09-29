import { useState,useEffect } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, Typography, Tooltip } from "@mui/material";
import Logo from "../images/home-logo1.png";
import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
import { Result } from "antd";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";
import { checkForgotPassword, setForgotPassword } from "../services/user-auth.services";
import { showSuccessToast } from "../assets/toastify";

const ForgotPassword = () => {
    let navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);
    const token : string | any = queryParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isSet, setIsSet] = useState<boolean>(false);

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();

        const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\#])[A-Za-z\d@$!%*?&\#]{8,}$/;
        if (!regex.test(password)) {
            setPasswordError("Password must be strong");
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError("Passwords doesn't match");
            return;
        }
        setPasswordError("");
        const { message } = await setForgotPassword({ password, temp_token: token });
        if (message === "Password set successfully") {
            setIsSet(true);
        }
        showSuccessToast(message);

        navigate("/");
    };

    const validateForgotPasswordLink = async (token: string) => {
        try {
            const response = await checkForgotPassword({token});
            setIsSet(response.isSet);
        } catch (error) {
            console.log("error while validating", error);
        }
    };

    useEffect(() => {
        validateForgotPasswordLink(token);
    }, []);

    return (
        <>
            {
                isSet ? (
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
                ) : (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    height: "100vh",
                                    width: "100vw"
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: "#C1EDD6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "40%",
                                    }}
                                >
                                    <img
                                        src={Logo}
                                        alt="Logo"
                                        style={{ maxWidth: "50%", maxHeight: "20%" }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "60%",
                                    }}
                                >
                                    <Box component="form" onSubmit={handleForgot}>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                marginBottom: '6vh'
                                            }}
                                            align="center"
                                            color="primary.main"
                                            variant="h4"
                                            gutterBottom
                                        >
                                            {" "}
                                            Forgot Password
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
                                            InputProps={{
                                                sx: {
                                                    borderRadius: 5,
                                                    marginBottom: '4vh'
                                                },
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
                                                    width: "8vw",
                                                    "&:hover": {
                                                        boxShadow: "10",
                                                    },
                                                }}
                                            >
                                                Submit
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box >
                        </>
                    )
            }
        </>
    )
}

export default ForgotPassword