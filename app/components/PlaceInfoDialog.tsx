import { useRef } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'

import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Rating from '@mui/material/Rating';

const PlaceInfoDialog = () => {
    const { loading, error } = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
        libraries: ['services'],
    }) as unknown as { loading: boolean; error: ErrorEvent | undefined };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;

    const { showPlaceInfo, setShowPlaceInfo } = useDialog();
    const { selectedPlace, resetSelectedPlace } = usePlaceData();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClosePlaceInfoDialog = () => {
        setShowPlaceInfo(false)
        resetSelectedPlace();
    };

    const handleClickFileInput = () => {
        ((fileInputRef.current) as HTMLInputElement).click();
    };

    return (
        <Dialog
            open={showPlaceInfo}
            onClose={() => setShowPlaceInfo(false)}
            maxWidth="lg"
            fullWidth={true}
        >
            <DialogTitle className="flex justify-between items-center border-b">
                <div>
                    <p className="text-xs">{selectedPlace.category_name}</p>
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
                <div className="mt-5">
                    <div>
                        <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} />
                        <button className="w-full h-40 bg-gray-200 rounded-md text-gray-500" onClick={handleClickFileInput}>
                            <p>장소와 연관된 사진을 업로드할 수 있어요.</p>
                            <i className="ri-image-add-fill"></i>
                        </button>
                    </div>
                </div>
                <div className="place-info mt-5 flex justify-center">
                    <div className="w-full mb-6 lg:w-1/2 lg:mr-2 lg:mb-0">
                        <Map
                            center={{ lat: Number(selectedPlace.y), lng: Number(selectedPlace.x) }}
                            className="w-full h-80 rounded-md shadow-lg shadow-gray-300"
                            level={2}
                            zoomable={false}
                            draggable={false}
                        >
                            <MapMarker position={{ lat: Number(selectedPlace.y), lng: Number(selectedPlace.x) }} />
                        </Map>
                    </div>
                    <div className="w-full overflow-y-auto h-80 lg:w-1/2 lg:ml-2">
                        <div>
                            <h3 className="text-gray-500">장소에 대한 의견을 남겨주세요.</h3>
                            <Rating name="size-medium" defaultValue={5} />
                            <div>
                                <input type="text" className="border-b focus:outline-none w-full" />
                            </div>
                        </div>
                        <div className="h-[calc(100%-80px)] flex justify-center items-center">
                            <span>기록된 리뷰가 없습니다🥲</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <a href={selectedPlace.place_url} target="_blank" className="bg-[#2391ff] rounded-md text-white p-2 w-1/2 mr-1 text-center">
                    <span>카카오 지도에서 보기</span>
                    <i className="ri-external-link-line ml-2"></i>
                </a>
                <a href={`https://map.kakao.com/link/roadview/${selectedPlace.id}`} target="_blank" className="bg-[#2391ff] rounded-md text-white p-2 w-1/2 ml-1 text-center">
                    <span>로드뷰 바로가기</span>
                    <i className="ri-road-map-line ml-2"></i>
                </a>
            </DialogActions>
        </Dialog>
    )
};

export default PlaceInfoDialog;