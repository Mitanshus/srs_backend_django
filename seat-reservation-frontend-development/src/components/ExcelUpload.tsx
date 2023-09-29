// import { Box, Button, Link, TextField } from "@mui/material";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useState } from "react";
// import {
//   showErrorToast,
//   showSuccessToast,
//   showWarningToast,
// } from "../assets/toastify";
// import { bulkUpload } from "../services/user-auth.services";
// const headers = [
//   "first_name",
//   "last_name",
//   "email",
//   "primary_location",
//   "role",
//   "company",
// ];
// const ExcelUpload = () => {
//   const [error, setError] = useState<Boolean>(true);
//   const [selectedFile, setSelectedFile] = useState<any>(null);

//   const handleFileChange = (event: any) => {
//     const file = event.target.files[0];
//     console.log(file)
//     const allowedExtensions = /(\.xlsx)$/i;
//     if (file && !allowedExtensions.test(file.name)) {
//       showErrorToast("Invalid file format. Only XLSX files are allowed.");
//       setSelectedFile(null);
//       setError(true);
//     } else {
//       if (
//         file &&
//         (file.type === "application/vnd.ms-excel" ||
//           file.type ===
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
//       ) {
//         setSelectedFile(file);
//         setError(false);
//       } else {
//         setError(true);
//       }
//     }
//   };
//   const handleDownload = () => {
//     const worksheet = XLSX.utils.aoa_to_sheet([headers]);

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//     const excelBuffer = XLSX.write(workbook, {
//       type: "array",
//       bookType: "xlsx",
//     });

//     const data = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(data, "add_users_bulk.xlsx");
//   };
//   const handleUpload = () => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const arrayBuffer = event?.target?.result;
//       if (arrayBuffer) {
//         const formData = new FormData();
//         formData.append("file", new Blob([arrayBuffer]));
//         let { userCreated, message } = await bulkUpload(formData);
//         if (userCreated) {
//           showSuccessToast(message);
//         }
//       } else {
//         showWarningToast("Invalid file");
//       }
//     };
//     reader.readAsArrayBuffer(selectedFile);
//   };

//   return (
//     <Box sx={{ m: 1, p: 1 }}>
//       <Link
//         onClick={handleDownload}
//         sx={{ "&:hover": { cursor: "pointer" }, m: 1 }}
//       >
//         {" "}
//         Click here to download sample template
//       </Link>
//       <Box sx={{ }}>
//         <TextField
//           sx={{ m: 1 }}
//           size="small"
//           color="success"
//           type="file"
//           inputProps={{
//             accept: ".xls,.xlsx",
//           }}
//           onChange={handleFileChange}
//         />
//         <Box sx={{display:"flex",justifyContent:"center",marginTop:"0.1rem"}}>
//           {error ? (
//             <Button
//               variant="contained"
//               onClick={handleUpload}
//               disabled
//               size="small"
//               color="success"
//               sx={{ m: 1 }}
//             >
//               Upload
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               onClick={handleUpload}
//               size="small"
//               color="success"
//               // sx={{ m: 2 }}
//             >
//               Upload
//             </Button>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ExcelUpload;
