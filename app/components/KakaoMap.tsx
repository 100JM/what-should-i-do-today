'use client';

import { useEffect } from 'react';
import axios from 'axios';

import useMapData from '../store/useMapData';
import usePlaceData from '../store/usePlaceData';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import CustomMapOverlay from './CustomMapOverlay';

const KakaoMap = () => {

    const { mapCenter, setMapCenter, zoomLevel } = useMapData();
    const { setCategoryPlaceList } = usePlaceData();

    const { loading, error } = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
        libraries: ['services'],
    }) as unknown as { loading: boolean; error: ErrorEvent | undefined };

    const fetchCategory = async (x:number, y:number) => {
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

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((geo) => {
                setMapCenter({ lat: geo.coords.latitude, lng: geo.coords.longitude });
                fetchCategory(geo.coords.longitude, geo.coords.latitude);
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
        <Map
            center={{ lat: (mapCenter.lat ? mapCenter.lat : 37.5665), lng: (mapCenter.lng ? mapCenter.lng : 126.9780) }}
            style={{ height: '100%' }}
            level={Number(zoomLevel)}
            draggable={true}
        >
            <MapMarker position={{ lat: (mapCenter.lat ? mapCenter.lat : 37.5665), lng: (mapCenter.lng ? mapCenter.lng : 126.9780) }} />
            <CustomMapOverlay />
        </Map>
    )
}

export default KakaoMap;