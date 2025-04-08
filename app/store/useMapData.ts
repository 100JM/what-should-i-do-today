import { create } from "zustand";

interface useMapInterface {
    mapCenter: {
        lat: number | undefined,
        lng: number | undefined
    };
    setMapCenter: (center: {lat: number, lng:number}) => void;
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
    myLocation: {
        lat: number | undefined,
        lng: number | undefined
    };
    setMyLocation: (center: {lat: number, lng:number}) => void;
    mapObject: kakao.maps.Map | undefined;
    setMapObject: (map: kakao.maps.Map) => void;
    showReSearchBtn: boolean;
    setShowReSearchBtn: (isShow: boolean) => void;
}

const useMapData = create<useMapInterface>((set) => ({
    mapCenter: {
        lat: undefined,
        lng: undefined
    },
    setMapCenter: (center: {lat: number, lng:number}) => set({ mapCenter: center }),
    zoomLevel: 5,
    setZoomLevel: (level :number) => set({ zoomLevel: level }),
    myLocation: {
        lat: undefined,
        lng: undefined
    },
    setMyLocation: (center: {lat: number, lng:number}) => set({ myLocation: center }),
    mapObject: undefined,
    setMapObject: (map: kakao.maps.Map) => set({ mapObject: map }),
    showReSearchBtn: false,
    setShowReSearchBtn: (isShow: boolean) => set({ showReSearchBtn: isShow }),
}));

export default useMapData;