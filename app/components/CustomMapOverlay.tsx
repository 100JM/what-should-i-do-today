import { useState } from 'react';

import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import usePlaceData from '../store/usePlaceData';

const CustomMapOverlay = () => {
    const { categoryPlaceList, selectedPlace, setSelectedPlace } = usePlaceData();
    const [showPlaceInfo, setShowPlaceInfo] = useState<boolean>(false);

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
                            <div className="customOverlay bg-white p-3 rounded-lg shadow cursor-pointer hover:shadow-md">
                                <p className={`text-xs text-[#3788d8] font-semibold ${p.id === selectedPlace.id ? 'underline underline-offset-4' : ''}`}>
                                    {p.place_name}
                                    {/* <i className="ri-external-link-line"></i> */}
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