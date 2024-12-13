import { create } from "zustand";
import { categoryPlace } from "@/types/categoryData";

interface usePlaceDataInterface {
    categoryPlaceList: Array<categoryPlace>;
    setCategoryPlaceList: (data: Array<categoryPlace>) => void;
    selectedPlace: categoryPlace;
    setSelectedPlace: (place: categoryPlace) => void;
}

const usePlaceData = create<usePlaceDataInterface>((set) => ({
    categoryPlaceList: [],
    setCategoryPlaceList: (data: Array<categoryPlace>) => set({ categoryPlaceList: data }),
    selectedPlace: {
        id: '',
        place_name: '',
        category_name: '',
        category_group_code: '',
        category_group_name: '',
        phone: '',
        address_name: '',
        road_address_name: '',
        x: '',
        y: '',
        place_url: '',
        distance: '',
    },
    setSelectedPlace: (place: categoryPlace) => set({ selectedPlace: place }),
}));

export default usePlaceData;