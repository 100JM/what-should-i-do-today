import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import { categoryPlace } from '@/types/categoryData';

import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';
import useMapData from '../store/useMapData';

import { fetchPlacePhoto, fetchPlaceReview } from '../hooks/usePlaceService';

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
        
        setShowPlaceInfo(true);

        await Promise.all([
            fetchPlacePhotos(place.id),
            fetchPlaceReviews(place.id)
        ]);

        if (selectedPlaceRef[place.id]) {
            selectedPlaceRef[place.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const fetchPlacePhotos = async (id: string) => {
        try {
            const response = await fetchPlacePhoto(id);
            setSelectedPlacePhoto(response);
        } catch (error) {
            console.log('fetchPlacePhoto Error:', error);
        }
    };

    const fetchPlaceReviews = async (id: string) => {
        try {
            const response = await fetchPlaceReview(id);
            setSelectedPlaceReview(response);
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