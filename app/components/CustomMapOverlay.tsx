import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { categoryPlace } from '@/types/categoryData';
import axios from 'axios';

import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';
import useMapData from '../store/useMapData';

const CustomMapOverlay = () => {
    const { setShowPlaceInfo } = useDialog();
    const { setZoomLevel, setMapCenter, mapObject } = useMapData();
    const { categoryPlaceList, selectedPlace, setSelectedPlace, selectedPlaceRef, setSelectedPlacePhoto, setSelectedPlaceReview } = usePlaceData();

    const handleClickOverlay = async (place: categoryPlace) => {
        const lat = Number(place.y);
        const lng = Number(place.x);

        setMapCenter({ lat: lat, lng: lng });

        if (mapObject) {
            mapObject.setCenter(new kakao.maps.LatLng(lat, lng));
        }

        setZoomLevel(1);
        setSelectedPlace(place);
        
        await Promise.all([
            fetchPlacePhoto(place.id),
            fetchPlaceReview(place.id)
        ]).then(() => setShowPlaceInfo(true));

        if (selectedPlaceRef[place.id]) {
            selectedPlaceRef[place.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const fetchPlacePhoto = async (id: string) => {
        try {
            const response = await axios.get(`api/place-data-api?id=${id}&action=getPhoto`);
            setSelectedPlacePhoto(response.data);
        } catch (error) {
            console.log('fetchPlacePhoto Error:', error);
        }
    };

    const fetchPlaceReview = async (id: string) => {
        try {
            const response = await axios.get(`api/review-data-api?id=${id}`);
            setSelectedPlaceReview(response.data);
        } catch (error) {
            console.log('fetchPlacePhoto Error:', error);
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
                            yAnchor={0.8}
                            zIndex={selectedPlace.id === p.id ? 10 : 1}
                        >
                            <div className="cursor-pointer custom-overlay-title" onClick={() => handleClickOverlay(p)}>
                                <i className="ri-map-pin-2-fill text-red-500 text-xl"></i>
                                <div>
                                    {
                                        p.place_name.split(' ').map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))
                                    }
                                </div>
                            </div>
                        </CustomOverlayMap>
                    )
                })
            }
        </>
    )
};

export default CustomMapOverlay;