import { create } from "zustand";
import { categoryPlace } from "@/types/categoryData";

interface usePlaceDataInterface {
    categoryPlaceList: Array<categoryPlace>;
    setCategoryPlaceList: (data: Array<categoryPlace>) => void;
    // selectedPlace: categoryPlace;
    // setSelectedPlace: (place: categoryPlace) => void;
}

const usePlaceData = create<usePlaceDataInterface>((set) => ({
    categoryPlaceList: [],
    setCategoryPlaceList: (data: Array<categoryPlace>) => set({ categoryPlaceList: data }),
    // selectedPlace: 
}));

export default usePlaceData;