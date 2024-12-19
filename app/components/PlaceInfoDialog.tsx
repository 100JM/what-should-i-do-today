import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'

import Link from 'next/link';
import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';

const PlaceInfoDialog = () => {
    const { loading, error } = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
        libraries: ['services'],
    }) as unknown as { loading: boolean; error: ErrorEvent | undefined };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;

    const { showPlaceInfo, setShowPlaceInfo } = useDialog();
    const { selectedPlace, resetSelectedPlace } = usePlaceData();

    const handleClosePlaceInfoDialog = () => {
        setShowPlaceInfo(false)
        resetSelectedPlace();
    };

    return (
        <Dialog
            open={showPlaceInfo}
            onClose={() => setShowPlaceInfo(false)}
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle className="flex justify-between items-center border-b">
                <div>
                    <p className="text-2xl text-[#2391ff]">{selectedPlace.place_name}</p>
                    <p className="text-sm text-[#868e96]">{selectedPlace.address_name}<i className="ri-file-copy-2-line"></i></p>
                </div>
                <div>
                    <button className="text-2xl" onClick={handleClosePlaceInfoDialog}>
                        <i className="ri-close-large-fill"></i>
                    </button>
                </div>
            </DialogTitle>
            <DialogContent className="border-b">
                <div className="place-info pt-5 flex justify-center">
                    <div className="w-full lg:w-1/2 lg:mr-2">
                        <Map
                            center={{ lat: Number(selectedPlace.y), lng: Number(selectedPlace.x) }}
                            className="w-full h-40 rounded-md shadow-lg shadow-gray-300"
                            level={2}
                            zoomable={false}
                            draggable={false}
                        >
                            <MapMarker position={{ lat: Number(selectedPlace.y), lng: Number(selectedPlace.x) }} />
                        </Map>
                    </div>
                    <div className="w-full lg:w-1/2 lg:ml-2">
                        <p className="mb-2 text-sm">
                            <span>{selectedPlace.category_name}</span>
                        </p>
                        <Link href={selectedPlace.place_url} target="_blank" className="p-2 bg-[#2391ff] rounded-md text-white">
                            <span>카카오 지도에서 자세히 보기</span>
                            <i className="ri-external-link-line"></i>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default PlaceInfoDialog;