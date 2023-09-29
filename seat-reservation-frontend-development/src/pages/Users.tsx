import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  DialogTitle,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  addUser,
  bulkUpload,
  deletUser,
  editUserData,
  editUserOptions,
  getAllLocations,
  getAllRoles,
  getAllUsers,
  checkDeluser,
} from "../services/user-auth.services";
import { useAppSelector } from "./Login";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken, setIsLoggedIn } from "../store/features/AuthSlice";
import { clearUserData } from "../store/features/UserSlice";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../assets/toastify";
// import ExcelUpload from "../components/ExcelUpload";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  location: string;
}
interface Role {
  id: number;
  label: string;
}
interface Location {
  id: number;
  label: string;
}

const Users = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [openOptionsForm, setOptionForm] = useState<boolean>(false);
  const [userIdToDelete, setuserIdToDelete] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [originalUserData, setoriginalUserData] = useState<User | null>(null);
  const [originalLocation, setOriginalLocation] = useState<Location | null>(
    null
  );
  const [originalRole, setOriginalRole] = useState<Role | null>(null);
  const [role, setRole] = useState<Role[]>([]);
  const [location, setLocation] = useState<Location[]>([]);
  const [userOptionData, setUserOptionData] = useState<{
    id: number;
    min_days: number | null;
    max_days: number | null;
    is_schedule_restricted: string | null;
  }>({ id: 0, min_days: null, max_days: null, is_schedule_restricted: null });

  const [OriginalOptionData, setOriginalOptionData] = useState<{
    id: number;
    min_days: number;
    max_days: number;
    is_schedule_restricted: boolean | null;
  } | null>(null);
  const [warningMsg, setWarningMsg] = useState<string>("");
  const [isAssosiated, setIsAssosiated] = useState<boolean>(false);
  const [deletePermanently, setDeletePermanently] = useState<string>("");

  const { company_id, id } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const headers = [
    "first_name",
    "last_name",
    "email",
    "primary_location",
    "role",
  ];
  const columns: GridColDef[] = [
    {
      field: "Sr.No",
      headerName: "Sr.No",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "location",
      headerName: "Primary Location",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color="primary"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log(params.row, "/*/*/*");
              handleOptionEdit(params.row);
            }}
            color="primary"
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const [rows, setRows] = useState<User[]>([]);

  const handleModalOpen = () => {
    setSelectedUser(null); // Reset to initial value
    setoriginalUserData(null);
    setSelectedRole(null); // Reset to initial value
    setSelectedLocation(null); // Reset to initial value
    setEditMode(false);
    setOpen(true); // Open the modal
  };
  const handleModalClose = () => {
    setSelectedUser(null); // Reset to initial value
    setoriginalUserData(null);
    setOpen(false);
    setEditMode(false);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user); // Store the selected user data
    setoriginalUserData(user); // store the originalUserData user data
    setOriginalRole({ id: user.role_id, label: user.role });
    setOriginalLocation({ id: user.location_id, label: user.location });
    setEditMode(true); // Set the editMode to true
    setSelectedRole({ id: user.role_id, label: user.role }); // Set the selected role based on the user's role
    setSelectedLocation({ id: user.location_id, label: user.location }); // set the selected location based on the user's location
    setOpen(true); // Open the modal
  };
  const handleOptionEdit = async (data: any) => {
    const { id, min_days, max_days, is_schedule_restricted } = data;
    setUserOptionData({ id, min_days, max_days, is_schedule_restricted });
    setOriginalOptionData({ id, min_days, max_days, is_schedule_restricted });
    handleUserParams();
  };
  const handleUserParams = () => {
    setOptionForm(true);
    setShowForm(false);
  };
  const handleOptionsForm = () => {
    setOptionForm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      if (deletePermanently === "Delete Permanently") {
        var { message, isDelete } = await deletUser(userIdToDelete);
        showErrorToast(message);
        setDeleteModalOpen(false);
        setIsAssosiated(false);
        setWarningMsg("");
        setDeletePermanently("");
        fetchData();
      } else {
        showWarningToast("Delete confirmation text mismatched!");
      }

      if (userIdToDelete == id && isDelete) {
        localStorage.clear();
        dispatch(setIsLoggedIn(false));
        dispatch(clearToken());
        dispatch(clearUserData());
        setDeleteModalOpen(false);
        navigate("/");
      };
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting user :", error);
    }
  };

  const handleDelete = async (id: string) => {
    setuserIdToDelete(id);
    const checkDelete = await checkDeluser(id);
    if (checkDelete?.existingAssociations) {
      setIsAssosiated(true);
      setWarningMsg(checkDelete?.warningMsg);
    }
    setDeleteModalOpen(true);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const userData = await getAllUsers({ company_id });
      const rowdata = userData.map((item: any, index: number) => {
        const {
          id,
          first_name,
          last_name,
          email,
          Role,
          Location,
          role_id,
          primary_location,
          min_days,
          max_days,
          is_schedule_restricted,
        } = item;
        return {
          id,
          "Sr.No": index + 1,
          first_name,
          last_name,
          email,
          role: Role?.name,
          location: Location?.name,
          role_id,
          location_id: primary_location,
          min_days,
          max_days,
          is_schedule_restricted,
        };
      });
      setIsLoading(false);
      console.log(rowdata, "==============");
      setRows(rowdata);
      const roleResponse = await getAllRoles();
      const roleData = roleResponse.map((item: any) => {
        const { id, name } = item;
        return {
          id,
          label: name,
        };
      });
      setRole(roleData);
      setIsLoading(true);
      const locationResponse = await getAllLocations({ company_id });
      const locationData = locationResponse.map((item: any) => {
        const { id, name } = item;
        return {
          id,
          label: name,
        };
      });
      setIsLoading(false);
      setLocation(locationData);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && selectedUser && originalUserData) {
      let updatedFields: Partial<{
        first_name: string;
        last_name: string;
        email: string;
        role_id: number | undefined; // Change the type to number | undefined
        primary_location: number | undefined; // Change the type to number | undefined
      }> = {};

      if (selectedUser.first_name !== originalUserData.first_name) {
        updatedFields.first_name = selectedUser.first_name;
      }

      if (selectedUser.last_name !== originalUserData.last_name) {
        updatedFields.last_name = selectedUser.last_name;
      }

      if (selectedUser.email !== originalUserData.email) {
        updatedFields.email = selectedUser.email;
      }

      if (selectedRole?.id !== originalRole?.id) {
        updatedFields.role_id = selectedRole?.id;
      }

      if (selectedLocation?.id !== originalLocation?.id) {
        updatedFields.primary_location = selectedLocation?.id;
      }

      if (Object.keys(updatedFields).length > 0) {
        const updatedData = {
          employee_id: selectedUser.id,
          ...updatedFields,
          company_id,
        };

        try {
          setIsLoading(true);
          const response = await editUserData(updatedData);
          showSuccessToast(response.message);
          handleModalClose();
          fetchData();
          setIsLoading(false);
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      } else {
        toast.warn("Please fill any one field to update the data", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      try {
        const userData = {
          ...selectedUser,
          role_id: selectedRole?.id,
          primary_location: selectedLocation?.id,
          added_by: id,
          company_id,
        };

        if (
          !selectedUser?.email ||
          !selectedUser?.first_name ||
          !selectedUser?.last_name ||
          !selectedLocation?.id ||
          !selectedRole?.id
        ) {
          showWarningToast("Please fill all fields to add the user");
          return;
        }
        setIsLoading(true);
        let response = await addUser(userData);
        const { isError, message } = response;
        if (isError) {
          showWarningToast(message);
          setIsLoading(false);
          return;
        }
        showSuccessToast(response.message);
        handleModalClose();
        fetchData();
        setIsLoading(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const handleOptionEditBtn = async () => {
    if (userOptionData && OriginalOptionData) {
      let updatedFields: Partial<{
        min_days: number | null;
        max_days: number | null;
        is_schedule_restricted: string | null;
      }> = {};
      if (userOptionData.min_days !== OriginalOptionData?.min_days) {
        updatedFields.min_days = userOptionData.min_days;
      }

      if (userOptionData?.max_days !== OriginalOptionData?.max_days) {
        updatedFields.max_days = userOptionData?.max_days;
      }
      if (
        userOptionData?.is_schedule_restricted !==
        OriginalOptionData?.is_schedule_restricted
      ) {
        updatedFields.is_schedule_restricted =
          userOptionData.is_schedule_restricted;
      }

      if (Object.keys(updatedFields).length > 0) {
        const updatedData = {
          company_id,
          employee_id: userOptionData.id,
          ...updatedFields,
        };
        try {
          setIsLoading(false);
          let response = await editUserOptions(updatedData);
          showSuccessToast(response.message);
          handleOptionsForm();
          fetchData();
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      } else {
        toast.warn("Please fill any one field to update the data", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "add_users_bulk.xlsx");
  };
  useEffect(() => {
    fetchData();
  }, []);
  function handleChange(e: any) {
    const { name, value } = e.target;
    setUserOptionData({ ...userOptionData, [name]: value });
  }
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const handleBulkUploadClick = () => {
    let input = document.createElement("input");
    input.type = "file";
    const allowedExtensions = /\.xlsx$/i;

    input.onchange = () => {
      if (input.files) {
        let files = Array.from(input.files);
        for (const file of files) {
          if (!allowedExtensions.test(file.name)) {
            showErrorToast("Invalid file format. Only XLSX files are allowed.");
            setSelectedFile(null);
          } else {
            if (
              file.type === "application/vnd.ms-excel" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) {
              setSelectedFile(file);
              setOpenModal(true);
            } else {
              showErrorToast(
                "Invalid file format. Only XLSX files are allowed."
              );
            }
          }
        }
        // Change the button label to "Upload"
        // setUploading(true);
      }
    };

    input.click();
  };
  const handleCloseModal = () => {
    // Close the modal, reset the selected file, and clear the Excel data
    setOpenModal(false);
    setSelectedFile(null);
  };
  const handleUpload = () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event?.target?.result;
      if (arrayBuffer) {
        const formData = new FormData();
        formData.append("file", new Blob([arrayBuffer]));
        let { userCreated, message } = await bulkUpload(formData, company_id);
        if (userCreated) {
          fetchData();
          showSuccessToast(message);
          setOpenModal(false);
          setSelectedFile(null);
        }
      } else {
        showWarningToast("Invalid file");
      }
      // Reset the button label back to "Bulk Upload"
      // setUploading(false);
    };
    reader.readAsArrayBuffer(selectedFile);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ paddingTop: "90px" }}
          >
            <Card sx={{ width: "98.9vw" }}>
              <CardContent sx={{ margin: "20px", backgroundColor: "#f0f0f0" }}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: {
                        xs: "column",
                        md: "row",
                      },
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          flexGrow: 1,
                          marginLeft: {
                            md: "40rem",
                            sm: "5rem",
                          },
                          fontSize: {
                            xs: "1.5rem",
                            sm: "2rem",
                            md: "2rem",
                          },
                          marginBottom: "1rem",
                        }}
                        align="center"
                        color="primary.main"
                        variant="h4"
                      >
                        All Users
                      </Typography>
                    </Box>

                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "primary.main",
                          borderRadius: "20px",
                          marginBottom: "10px",
                          height: {
                            xs: "2rem",
                            sm: "2.3rem",
                            md: "2.3rem",
                          },
                        }}
                        onClick={handleModalOpen}
                      >
                        Add User
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "primary.main",
                          borderRadius: "20px",
                          marginBottom: "10px",
                          marginLeft: "5px",
                          height: {
                            xs: "2rem",
                            sm: "2.3rem",
                            md: "2.3rem",
                          },
                        }}
                        onClick={handleDownload}
                      >
                        Download Template
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "primary.main",
                          borderRadius: "20px",
                          marginBottom: "10px",
                          marginLeft: "5px",
                          height: {
                            xs: "2rem",
                            sm: "2.3rem",
                            md: "2.3rem",
                          },
                        }}
                        onClick={handleBulkUploadClick}
                      >
                        {" "}
                        Bulk Upload
                      </Button>
                      <Dialog open={openModal} onClose={handleCloseModal}>
                        <DialogTitle>Confirm Upload</DialogTitle>
                        <DialogContent>
                          <Typography>
                            Are you sure you want to upload the selected file?
                          </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseModal} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={handleUpload} color="primary">
                            Upload
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  </Box>

                  <Dialog open={open} onClose={handleModalClose}>
                    <DialogTitle sx={{ textAlign: "center" }}>
                      {editMode ? "Edit User" : "Add User"}
                    </DialogTitle>
                    <DialogContent>
                      <Box
                        component="form"
                        sx={{
                          width: {
                            xs: "15rem",
                            sm: "25rem",
                            md: "25rem",
                          },
                          margin: "1vw",
                        }}
                      >
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="First Name"
                          value={selectedUser?.first_name || ""}
                          onChange={(e) =>
                            setSelectedUser((prevUser) => ({
                              ...(prevUser as User),
                              first_name: e.target.value,
                            }))
                          }
                          variant="outlined"
                          type="text"
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                        />
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Last Name"
                          value={selectedUser?.last_name || ""}
                          onChange={(e) =>
                            setSelectedUser((prevUser) => ({
                              ...(prevUser as User),
                              last_name: e.target.value,
                            }))
                          }
                          variant="outlined"
                          type="text"
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                        />
                        <TextField
                          required
                          InputProps={{ sx: { borderRadius: 5 } }}
                          label="Email"
                          value={selectedUser?.email || ""}
                          onChange={(e) =>
                            setSelectedUser((prevUser) => ({
                              ...(prevUser as User),
                              email: e.target.value,
                            }))
                          }
                          variant="outlined"
                          type="email"
                          fullWidth
                          style={{ marginBottom: "1rem" }}
                          disabled={editMode}
                        />
                        <Autocomplete
                          options={role}
                          getOptionLabel={(option) =>
                            capitalizeFirstLetter(option.label)
                          }
                          value={selectedRole}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onChange={(
                            _: React.SyntheticEvent<Element, Event>,
                            newValue
                          ) => {
                            setSelectedRole(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Role"
                              variant="outlined"
                              sx={{ marginBottom: "15px" }}
                            />
                          )}
                        />
                        <Autocomplete
                          options={location}
                          getOptionLabel={(option) => option.label}
                          value={selectedLocation}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onChange={(
                            _: React.SyntheticEvent<Element, Event>,
                            newValue
                          ) => setSelectedLocation(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Primary Location"
                              variant="outlined"
                            />
                          )}
                        />
                        {/* <Divider textAlign="center" sx={{ m: 2 }}>
                          OR
                        </Divider> */}
                        {/* <Box> */}
                        {/* <FileUploadComponent /> */}
                        {/* <ExcelUpload /> */}
                        {/* </Box> */}
                        <Box></Box>
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
                          onClick={handleSubmit}
                        >
                          {editMode ? "Save" : "Add User"}
                        </Button>
                      </Box>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <HighlightOffIcon
                        sx={{
                          fontSize: 35,
                          color: "red",
                          marginLeft: "5px",
                        }}
                      />
                      <DialogTitle
                        sx={{
                          textAlign: "left",
                          flexGrow: 1,
                          marginLeft: "-20px",
                        }}
                      >
                        Confirm Deletion
                      </DialogTitle>
                    </Box>
                    <DialogContent>
                      {isAssosiated ? (
                        <Typography>
                          This cabin has
                          <Typography
                            sx={{ display: "inline", fontWeight: "bold" }}
                          >
                            {" "}
                            {warningMsg}.{" "}
                          </Typography>
                          All reservations will be deleted. This action can not
                          be undone. Are you sure you want to delete? Type
                          <Typography
                            sx={{
                              fontFamily: "Roboto Mono, monospace",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            `Delete Permanently`{" "}
                          </Typography>
                          to proceed.
                        </Typography>
                      ) : (
                        <Typography>
                          This action can not be undone. Are you sure you want
                          to delete? Type
                          <Typography
                            sx={{
                              fontFamily: "Roboto Mono, monospace",
                              display: "inline",
                              fontWeight: "bold",
                            }}
                          >
                            {" "}
                            `Delete Permanently`{" "}
                          </Typography>
                          to proceed.
                        </Typography>
                      )}

                      <TextField
                        sx={{
                          marginTop: "2rem",
                          width: {
                            xs: "16.5rem",
                            sm : "30rem",
                            md: "30rem",
                          },
                        }}
                        label="Delete Permanently"
                        value={deletePermanently}
                        onChange={(e) => setDeletePermanently(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        sx={{
                          backgroundColor: "secondary.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "secondary.main",
                          },
                        }}
                        onClick={() => setDeleteModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        sx={{
                          backgroundColor: "red",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "red",
                          },
                        }}
                        onClick={() => handleConfirmDelete()}
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {!showForm && (
                    <Box
                      sx={{
                        marginTop: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Dialog
                        open={openOptionsForm}
                        onClose={handleOptionsForm}
                      >
                        <DialogTitle sx={{ textAlign: "center" }}>
                          Options
                        </DialogTitle>
                        <DialogContent>
                          <Box
                            component="form"
                            sx={{     width: {
                              xs: "16rem",
                              sm: "25rem",
                              md: "25rem"
                            },
                              margin: "1vw" }}
                          >
                            <TextField
                              required
                              InputProps={{ sx: { borderRadius: 5 } }}
                              label="Min Days"
                              variant="outlined"
                              type="number"
                              fullWidth
                              value={userOptionData?.min_days || ""}
                              style={{ marginBottom: "1rem" }}
                              name="min_days"
                              onChange={handleChange}
                            />
                            <TextField
                              required
                              InputProps={{ sx: { borderRadius: 5 } }}
                              label="Max Days"
                              variant="outlined"
                              type="number"
                              fullWidth
                              value={userOptionData?.max_days || ""}
                              style={{ marginBottom: "1rem" }}
                              name="max_days"
                              onChange={handleChange}
                            />
                            <Autocomplete
                              options={["Enable", "Disable", "Not Set"]}
                              value={
                                userOptionData.is_schedule_restricted ===
                                "NOTSET"
                                  ? "Not Set"
                                  : userOptionData.is_schedule_restricted ===
                                    "TRUE"
                                  ? "Enabled"
                                  : "Disabled"
                              }
                              onChange={(event, newValue) => {
                                event.preventDefault();
                                console.log(newValue, "***");
                                if (newValue === "Enable") {
                                  setUserOptionData((prevOptionData) => ({
                                    ...prevOptionData,
                                    is_schedule_restricted: "TRUE",
                                  }));
                                } else if (newValue === "Disable") {
                                  setUserOptionData((prevOptionData) => ({
                                    ...prevOptionData,
                                    is_schedule_restricted: "FALSE",
                                  }));
                                } else if (newValue === "Not Set") {
                                  setUserOptionData((prevOptionData) => ({
                                    ...prevOptionData,
                                    is_schedule_restricted: "NOTSET",
                                  }));
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Enforce Scheduled Bookings"
                                  variant="outlined"
                                />
                              )}
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
                              onClick={handleOptionEditBtn}
                            >
                              Save
                            </Button>
                          </Box>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  )}
                </Box>
                <Box>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 50,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    // autoHeight
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default Users;
