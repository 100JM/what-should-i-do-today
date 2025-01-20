import { create } from "zustand";
import toast, { ToastOptions } from "react-hot-toast";

interface CustomToastOptions extends ToastOptions {
    type?: 'success' | 'error' | 'loading' | 'default';
}

interface useDialogInterface {
    showPlaceInfo: boolean;
    setShowPlaceInfo: (isShow: boolean) => void;
    showLogin: boolean;
    setShowLogin: (isShow: boolean) => void;
    showToatst: (msg: string, option: CustomToastOptions) => void;
    showLoading: boolean;
    setShowLoading: (isShow: boolean) => void;
}

const useDialog = create<useDialogInterface>((set) => ({
    showPlaceInfo: false,
    setShowPlaceInfo: (isShow: boolean) => set({ showPlaceInfo: isShow }),
    showLogin: false,
    setShowLogin: (isShow: boolean) => set({ showLogin: isShow }),
    showToatst: (msg: string, option: CustomToastOptions) => { toast(msg, option); },
    showLoading: false,
    setShowLoading: (isShow: boolean) => set({ showLoading: isShow }),
}));

export default useDialog;