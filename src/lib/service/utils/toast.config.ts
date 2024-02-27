import { ToastOptions, toast } from "react-toastify";

export interface ToastData {
  message: string;
  type: "info" | "success" | "warning" | "error" | "default";
  redirectTo?: string;
}

export default function toastAlert(data: ToastData, config?: ToastOptions) {
  return toast(data.message, {
    type: data.type,
    ...config,
  });
}
