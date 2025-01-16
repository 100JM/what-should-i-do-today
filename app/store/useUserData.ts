import { create } from "zustand";
import { savedPlace } from "@/types/placeData";

interface UseUserDataInterface {
    myPlace: Array<savedPlace>;
    setMyPlace: (list: Array<savedPlace>) => void;
}

const useUserData  = create<UseUserDataInterface>((set) => ({
    myPlace: [],
    setMyPlace: (list: Array<savedPlace>) => set({ myPlace: list }),
}));

export default useUserData;