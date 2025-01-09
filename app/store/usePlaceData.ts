import { create } from "zustand";
import { categoryPlace } from "@/types/categoryData";

interface usePlaceDataInterface {
    categoryPlaceList: Array<categoryPlace>;
    setCategoryPlaceList: (data: Array<categoryPlace>) => void;
    selectedPlace: categoryPlace;
    setSelectedPlace: (place: categoryPlace) => void;
    resetSelectedPlace: () => void;
    selectedPlacePhoto: Array<{
        id: string,
        name: string,
        photo: string
    }>;
    setSelectedPlacePhoto: (photo: Array<{
        id: string,
        name: string,
        photo: string
    }>) => void;
    selectedPlaceRef: Record<string, HTMLDivElement | null>;
    setSelectedPlaceRef: (key: string, ref: HTMLDivElement | null) => void;
    resetSelectedPlaceRef: () => void;
    listTitle: string;
    setListTitle: (title: string) => void;
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
    resetSelectedPlace: () => set({ selectedPlace: {
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
    }}),
    selectedPlacePhoto: [],
    setSelectedPlacePhoto: (photo: Array<{
        id: string,
        name: string,
        photo: string
    }>) => set({ selectedPlacePhoto: photo}),
    selectedPlaceRef: {},
    setSelectedPlaceRef: (key: string, ref: HTMLDivElement | null) => set((state) => ({ selectedPlaceRef: { ...state.selectedPlaceRef, [key]: ref } })),
    resetSelectedPlaceRef: () => set({ selectedPlaceRef: {} }),
    listTitle: '',
    setListTitle: (title: string) => set({ listTitle: title }),
}));

export default usePlaceData;