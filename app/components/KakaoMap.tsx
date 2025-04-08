'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import useMapData from '../store/useMapData';
import usePlaceData from '../store/usePlaceData';
import useDialog from '../store/useDialog';
import useUserData from '../store/useUserData';

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import CustomMapOverlay from './CustomMapOverlay';
import PlaceInfoDialog from './PlaceInfoDialog';
import ReSearchButton from './ReSearchButton';

const KakaoMap = () => {
    const { showPlaceInfo, setShowLogin } = useDialog();
    const { mapCenter, setMapCenter, zoomLevel, setZoomLevel, myLocation, setMyLocation, mapObject, setMapObject, showReSearchBtn } = useMapData();
    const { setCategoryPlaceList, resetSelectedPlaceRef, setListTitle } = usePlaceData();
    const { setMyPlace } = useUserData();
    const { data: session, status } = useSession();

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

    const handleGetMyPlace = async () => {
        if (session?.userId) {
            try {
                const response = await axios.get(`api/place-data-api?userId=${session.userId}&action=getMyPlace`);

                setMyPlace(response.data);
            } catch (error) {
                console.log('fetch my place Error:', error);
            }
        }
    };

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

    const initMapEvt = () => {
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
    };

    useEffect(() => {
        initMapEvt();
    }, []);

    useEffect(() => {
        handleGetMyPlace();
    }, [session]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;

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
                    // setShowReSearchBtn(true);
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
                    className="absolute top-[68px] right-4 z-[11] bg-white w-9 h-9 rounded border shadow-md text-[#2391ff] text-lg flex justify-center items-center"
                    onClick={handleClickLocationBtn}
                >
                    <i className="ri-crosshair-2-line"></i>
                </button>
                {status !== 'loading' &&
                    <button
                        className="absolute top-4 right-4 z-[11] bg-white w-9 h-9 rounded border shadow-md text-[#2391ff] text-lg flex justify-center items-center"
                        onClick={() => setShowLogin(true)}
                    >
                        {session?.userId ?
                            <i className="ri-user-line"></i>
                            :
                            <i className="ri-login-circle-line"></i>
                        }
                    </button>
                }
                {showReSearchBtn && <ReSearchButton />}
            </Map>
            {showPlaceInfo && <PlaceInfoDialog />}
        </>
    )
}

export default KakaoMap;