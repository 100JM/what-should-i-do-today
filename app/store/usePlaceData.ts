import { create } from "zustand";
import { categoryPlace } from "@/types/categoryData";
import { reviews, placePhoto } from "@/types/placeData";

interface usePlaceDataInterface {
    categoryPlaceList: Array<categoryPlace>;
    setCategoryPlaceList: (data: Array<categoryPlace>) => void;
    selectedPlace: categoryPlace;
    setSelectedPlace: (place: categoryPlace) => void;
    resetSelectedPlace: () => void;
    selectedPlacePhoto: Array<placePhoto>;
    setSelectedPlacePhoto: (photo: Array<placePhoto>) => void;
    selectedPlaceRef: Record<string, HTMLDivElement | null>;
    setSelectedPlaceRef: (key: string, ref: HTMLDivElement | null) => void;
    resetSelectedPlaceRef: () => void;
    listTitle: string;
    setListTitle: (title: string) => void;
    selectedPlaceReview: Array<reviews>;
    setSelectedPlaceReview: (reviews: Array<reviews>) => void;
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
    setSelectedPlacePhoto: (photo: Array<placePhoto>) => set({ selectedPlacePhoto: photo}),
    selectedPlaceRef: {},
    setSelectedPlaceRef: (key: string, ref: HTMLDivElement | null) => set((state) => ({ selectedPlaceRef: { ...state.selectedPlaceRef, [key]: ref } })),
    resetSelectedPlaceRef: () => set({ selectedPlaceRef: {} }),
    listTitle: '',
    setListTitle: (title: string) => set({ listTitle: title }),
    selectedPlaceReview: [],
    setSelectedPlaceReview: (reviews: Array<reviews>) => set({ selectedPlaceReview: reviews }),
}));

export default usePlaceData;