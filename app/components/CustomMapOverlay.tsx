import { useState } from 'react';

import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { categoryPlace } from '@/types/categoryData';

import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';
import useMapData from '../store/useMapData';

const CustomMapOverlay = () => {
    const { setShowPlaceInfo } = useDialog();
    const { setZoomLevel, setMapCenter } = useMapData();
    const { categoryPlaceList, selectedPlace, setSelectedPlace, selectedPlaceRef } = usePlaceData();

    const handleClickOverlay = (place: categoryPlace) => {
        setMapCenter({lat: Number(place.y), lng: Number(place.x)});
        setZoomLevel(1);
        setSelectedPlace(place);
        setShowPlaceInfo(true);

        if (selectedPlaceRef[place.id]) {
            selectedPlaceRef[place.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <>
            {categoryPlaceList.length > 0 &&
                categoryPlaceList.map((p) => {
                    return (
                        <CustomOverlayMap
                            key={p.id}
                            position={{
                                lat: Number(p.y),
                                lng: Number(p.x),
                            }}
                            xAnchor={0.5}
                            yAnchor={1.5}
                        >
                            <div className="customOverlay bg-white p-3 rounded-lg shadow cursor-pointer hover:shadow-md" onClick={() => handleClickOverlay(p)}>
                                <p className={`text-xs text-[#3788d8] font-semibold ${p.id === selectedPlace.id ? 'underline underline-offset-4' : ''} hover:underline underline-offset-4`}>
                                    {p.place_name}
                                </p>
                            </div>
                        </CustomOverlayMap>
                    )
                })
            }
        </>
    )
};

export default CustomMapOverlay;