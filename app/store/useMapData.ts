import { create } from "zustand";

interface useMapInterface {
    mapCenter: {
        lat: number | undefined,
        lng: number | undefined
    };
    setMapCenter: (center: {lat: number, lng:number}) => void;
    zoomLevel: Number;
    setZoomLevel: (level: Number) => void;
    myLocation: {
        lat: number | undefined,
        lng: number | undefined
    };
    setMyLocation: (center: {lat: number, lng:number}) => void;
}

const useMapData = create<useMapInterface>((set) => ({
    mapCenter: {
        lat: undefined,
        lng: undefined
    },
    setMapCenter: (center: {lat: number, lng:number}) => set({ mapCenter: center }),
    zoomLevel: 5,
    setZoomLevel: (level :Number) => set({ zoomLevel: level }),
    myLocation: {
        lat: undefined,
        lng: undefined
    },
    setMyLocation: (center: {lat: number, lng:number}) => set({ myLocation: center }),
}));

export default useMapData;