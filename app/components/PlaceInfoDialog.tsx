import Image from 'next/image';
import { ChangeEvent, useRef, useEffect } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import axios from 'axios';
import dayjs from 'dayjs';

import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';
import { resizeImg } from '../utils/resizeImg';

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

    const { showPlaceInfo, setShowPlaceInfo, showToatst } = useDialog();
    const { selectedPlace, resetSelectedPlace, selectedPlacePhoto, setSelectedPlacePhoto } = usePlaceData();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLParagraphElement>(null);

    const handleClosePlaceInfoDialog = () => {
        setShowPlaceInfo(false)
        resetSelectedPlace();
        setSelectedPlacePhoto([]);
    };

    const handleClickFileInput = () => {
        ((fileInputRef.current) as HTMLInputElement).click();
    };

    const fetchPlacePhoto = async (id: string) => {
        try {
            const response = await axios.get(`api/get-placephoto-api?id=${id}`);
            // const photoArray = response.data.map((r: {id: string, name: string, photo: string}) => r);
            setSelectedPlacePhoto(response.data);
        } catch (error) {
            console.log('fetchPlacePhoto Error:', error);
        }
    };

    const handleUploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            console.log(fileList);
            const isNotImg = fileList.find((f) => {
                return !f.type.includes('image');
            });

            if (isNotImg) {
                alert('이미지 파일만 선택해주세요.');
                return;
            } else {
                const resizeList = await Promise.all(
                    fileList.map(async (f, i) => await resizeImg(f, `${selectedPlace.id}_${f.name}_${dayjs().format('HH:mm:ss')}`))
                );

                const formData = new FormData();

                formData.append('id', selectedPlace.id);
                resizeList.forEach((rf) => {
                    formData.append(`file[]`, rf);
                });

                try {
                    await axios.post('/api/add-placephoto-api', formData);

                    fetchPlacePhoto(selectedPlace.id);

                } catch (error) {
                    console.log('fetch add photo Error:', error);
                }

            }
        }
    };

    useEffect(() => {
        if (selectedPlace?.id) {
            fetchPlacePhoto(selectedPlace.id);
        }
    }, [selectedPlace]);

    const handleCopyAddress = (text: string | undefined) => {
        if (text) {
            navigator.clipboard.writeText(text).then(() => showToatst('주소가 복사되었습니다.', { type: 'success' })).catch(() => showToatst('일시적인 오류가 발생했습니다.', { type: 'error' }));
        }
    };

    return (
        <Dialog
            open={showPlaceInfo}
            onClose={handleClosePlaceInfoDialog}
            maxWidth="lg"
            fullWidth={true}
        >
            <DialogTitle className="flex justify-between items-center border-b">
                <div>
                    <p className="text-xs">{selectedPlace.category_name}</p>
                    <p className="text-[#2391ff] text-xl xxs:text-2xl">{selectedPlace.place_name}</p>
                    <p className="text-sm text-[#868e96] cursor-pointer" ref={addressRef} onClick={() => handleCopyAddress(addressRef.current?.innerText)}>{selectedPlace.road_address_name ? selectedPlace.road_address_name : selectedPlace.address_name}<i className="ri-file-copy-2-line"></i></p>
                </div>
                <div>
                    <button className="text-2xl" onClick={handleClosePlaceInfoDialog}>
                        <i className="ri-close-large-fill"></i>
                    </button>
                </div>
            </DialogTitle>
            <DialogContent className="border-b">
                <div className="mt-5">
                    {selectedPlacePhoto.length > 0 ?
                        <div>
                            <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} multiple onChange={(e: ChangeEvent<HTMLInputElement>) => handleUploadPhoto(e)} />
                            <div className="flex">
                                <button className="w-1/3 h-52 mr-4 bg-gray-200 rounded-md text-gray-500 text-xs" onClick={handleClickFileInput}>
                                    <p>사진 업로드</p>
                                    <i className="ri-image-add-fill"></i>
                                </button>
                                <div className="flex w-2/3 h-52 overflow-x-auto place-img-div">
                                    {selectedPlacePhoto.map((p) => {
                                        return (
                                            <Image
                                                key={p.name}
                                                src={p.photo}
                                                alt={p.name}
                                                layout="responsive"
                                                width={16}
                                                height={9}
                                                className="rounded-md place-img"
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} multiple onChange={(e: ChangeEvent<HTMLInputElement>) => handleUploadPhoto(e)} />
                            <button className="w-full h-52 bg-gray-200 rounded-md text-gray-500 text-xs xxs:text-base" onClick={handleClickFileInput}>
                                <p>장소와 연관된 사진을 업로드할 수 있어요.</p>
                                <i className="ri-image-add-fill"></i>
                            </button>
                        </div>
                    }
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
                <a href={selectedPlace.place_url} target="_blank" className="bg-[#2391ff] rounded-md text-white p-2 w-1/2 mr-1 text-center text-[10px] xs:text-base xxs:text-xs">
                    <span>카카오 지도에서 보기</span>
                    <i className="ri-external-link-line ml-2"></i>
                </a>
                <a href={`https://map.kakao.com/link/roadview/${selectedPlace.id}`} target="_blank" className="bg-[#2391ff] rounded-md text-white p-2 w-1/2 ml-1 text-center text-[10px] xs:text-base xxs:text-xs">
                    <span>로드뷰 바로가기</span>
                    <i className="ri-road-map-line ml-2"></i>
                </a>
            </DialogActions>
        </Dialog>
    )
};

export default PlaceInfoDialog;