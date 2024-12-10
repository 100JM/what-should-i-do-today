'use client';

import { useEffect } from 'react';
import useMapData from '../store/useMapData';
import { Map, MapMarker, ZoomControl, useKakaoLoader } from 'react-kakao-maps-sdk'

const KakaoMap = () => {

    const { mapCenter, setMapCenter } = useMapData();

    const { loading, error } = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
        libraries: ['services'],
    }) as unknown as { loading: boolean; error: ErrorEvent | undefined };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((geo) => {
                setMapCenter({ lat: geo.coords.latitude, lng: geo.coords.longitude });
            },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                {
                    enableHighAccuracy: true
                })
        }
    }, [mapCenter]);

    return (
        <Map
            center={{ lat: (mapCenter.lat ? mapCenter.lat : 37.5665), lng: (mapCenter.lng ? mapCenter.lng : 126.9780) }}
            style={{ height: '100%' }}
            level={5}
            draggable={true}
        >
            {/* <MapMarker position={{ lat: mapCenter.lat, lng: mapCenter.lng }} /> */}
            {/* <ZoomControl position={'TOPRIGHT'} /> */}
        </Map>
    )
}

export default KakaoMap;