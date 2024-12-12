import { create } from "zustand";

interface useMapInterface {
    mapCenter: {
        lat: number | undefined,
        lng: number | undefined
    };
    setMapCenter: (center: {lat: number, lng:number}) => void;
    zoomLevel: Number;
    setZoomLevel: (level: Number) => void;
}

const useMapData = create<useMapInterface>((set) => ({
    mapCenter: {
        lat: undefined,
        lng: undefined
    },
    setMapCenter: (center: {lat: number, lng:number}) => set({ mapCenter: center }),
    zoomLevel: 5,
    setZoomLevel: (level :Number) => set({ zoomLevel: level }),
}));

export default useMapData;