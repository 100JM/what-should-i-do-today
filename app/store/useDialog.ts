import { create } from "zustand";
import toast, { ToastOptions } from "react-hot-toast";

interface CustomToastOptions extends ToastOptions {
    type?: 'success' | 'error' | 'loading' | 'default';
}

interface useDialogInterface {
    showPlaceInfo: boolean;
    setShowPlaceInfo: (isShow: boolean) => void;
    showToatst: (msg: string, option: CustomToastOptions) => void;
}

const useDialog = create<useDialogInterface>((set) => ({
    showPlaceInfo: false,
    setShowPlaceInfo: (isShow: boolean) => set({ showPlaceInfo: isShow }),
    showToatst: (msg: string, option: CustomToastOptions) => { toast(msg, option); },
}));

export default useDialog;