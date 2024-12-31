'use client';

import { useEffect } from 'react';
import axios from 'axios';

import useMapData from '../store/useMapData';
import usePlaceData from '../store/usePlaceData';
import useDialog from '../store/useDialog';

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import CustomMapOverlay from './CustomMapOverlay';
import PlaceInfoDialog from './PlaceInfoDialog';

const KakaoMap = () => {
    const { showPlaceInfo } = useDialog();
    const { mapCenter, setMapCenter, zoomLevel, setZoomLevel, myLocation, setMyLocation, mapObject, setMapObject } = useMapData();
    const { setCategoryPlaceList, resetSelectedPlaceRef, setListTitle } = usePlaceData();

    const { loading, error } = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
        libraries: ['services'],
    }) as unknown as { loading: boolean; error: ErrorEvent | undefined };

    const fetchCategory = async (x: number, y: number) => {
        resetSelectedPlaceRef();

        try {
            if (x && y) {
                const categoryResponse = await axios.get(`api/kakao-category-api?x=${x}&y=${y}&&category_group_code=AT4`);
                setCategoryPlaceList(categoryResponse.data);
            }
        } catch (error) {
            console.log('fetchCategory Error:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;

    const handleClickLocationBtn = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((geo) => {
                setMyLocation({ lat: geo.coords.latitude, lng: geo.coords.longitude });
                setMapCenter({ lat: geo.coords.latitude, lng: geo.coords.longitude });

                if (mapObject) {
                    mapObject.setCenter(new kakao.maps.LatLng(geo.coords.latitude, geo.coords.longitude));
                }

                setZoomLevel(5);
            },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                {
                    enableHighAccuracy: true
                })
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((geo) => {
                setMyLocation({ lat: geo.coords.latitude, lng: geo.coords.longitude });
                setMapCenter({ lat: geo.coords.latitude, lng: geo.coords.longitude });
                fetchCategory(geo.coords.longitude, geo.coords.latitude);
                setListTitle('주변 추천 리스트');
            },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                {
                    enableHighAccuracy: true
                })
        }
    }, []);

    return (
        <>
            <Map
                center={{ lat: (mapCenter.lat ? mapCenter.lat : 37.5665), lng: (mapCenter.lng ? mapCenter.lng : 126.9780) }}
                style={{ height: '100%' }}
                level={Number(zoomLevel)}
                draggable={true}
                onZoomChanged={(map) => {
                    const newZoomLevel = map.getLevel();
                    if (newZoomLevel !== zoomLevel) {
                        setZoomLevel(newZoomLevel);
                    }
                }}
                onCreate={(map) => {
                    if (!mapObject) {
                        setMapObject(map);
                    }
                }}
            >
                <MapMarker position={{ lat: (myLocation.lat ? myLocation.lat : 37.5665), lng: (myLocation.lng ? myLocation.lng : 126.9780) }} />
                <CustomMapOverlay />
                <button 
                    className="absolute top-6 lg:top-auto lg:bottom-6 right-6 z-[11] bg-white w-9 h-9 rounded border shadow-md text-[#2391ff] text-lg flex justify-center items-center"
                    onClick={handleClickLocationBtn}
                >
                    <i className="ri-crosshair-2-line"></i>
                </button>
            </Map>
            {showPlaceInfo && <PlaceInfoDialog />}
        </>
    )
}

export default KakaoMap;