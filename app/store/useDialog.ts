import { create } from "zustand";

interface useDialogInterface {
    showPlaceInfo: boolean;
    setShowPlaceInfo: (isShow: boolean) => void;
}

const useDialog = create<useDialogInterface>((set) => ({
    showPlaceInfo: false,
    setShowPlaceInfo: (isShow: boolean) => set({ showPlaceInfo: isShow }),
}));

export default useDialog;