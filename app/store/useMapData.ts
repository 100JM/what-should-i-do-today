import { create } from "zustand";

interface useMapInterface {
    mapCenter: {
        lat: number | undefined,
        lng: number | undefined
    };
    setMapCenter: (center: {lat: number, lng:number}) => void;
}

const useMapData = create<useMapInterface>((set) => ({
    mapCenter: {
        lat: undefined,
        lng: undefined
    },
    setMapCenter: (center: {lat: number, lng:number}) => set({ mapCenter: center }),
}));

export default useMapData;