import { toast } from "react-toastify";

export const showSuccessToast = (message: any) => {
        toast.success(message || "An unknown error occurred", {
            position: "top-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
};

export const showWarningToast = (message: any) => {
    toast.warning(message || "An unknown error occurred", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

export const showErrorToast = (message: any) => {
    toast.error(message || "An unknown error occurred", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};
