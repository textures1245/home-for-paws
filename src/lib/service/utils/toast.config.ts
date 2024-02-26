import { ToastOptions, toast } from "react-toastify";

export type ToastData = {
  message: string;
  type: "info" | "success" | "warning" | "error" | "default";
};

export default function toastAlert(data: ToastData, config?: ToastOptions) {
  return toast(data.message, {
    type: data.type,
    ...config,
  });
}
