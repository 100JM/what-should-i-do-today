import Image from 'next/image';
import { ChangeEvent, useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import axios from 'axios';
import dayjs from 'dayjs';

import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';
import { resizeImg } from '../utils/resizeImg';

import Loading from './Loading';
import PlaceReview from './PlaceReview';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import useUserData from '../store/useUserData';

import loadingImg from "../assets/images/icon-32x32.png";

const PlaceInfoDialog = () => {
    const { loading, error } = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
        libraries: ['services'],
    }) as unknown as { loading: boolean; error: ErrorEvent | undefined };

    const { showPlaceInfo, setShowPlaceInfo, showToatst, setShowLogin, showLoading, setShowLoading } = useDialog();
    const { selectedPlace, resetSelectedPlace, selectedPlacePhoto, setSelectedPlacePhoto } = usePlaceData();
    const { myPlace } = useUserData();
    const { setMyPlace } = useUserData();
    const { data: session } = useSession();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLParagraphElement>(null);

    const [dialogLoading, setDialogLoading] = useState<boolean>(false);

    useEffect(() => {
        if (showPlaceInfo) {
            setDialogLoading(true);

            const timer = setTimeout(() => {
                setDialogLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [showPlaceInfo]);

    const handleClosePlaceInfoDialog = () => {
        resetSelectedPlace();
        setShowPlaceInfo(false)
    };

    const handleClickFileInput = () => {
        ((fileInputRef.current) as HTMLInputElement).click();
    };

    const fetchPlacePhoto = async (id: string) => {
        try {
            const response = await axios.get(`api/place-data-api?id=${id}&action=getPhoto`);
            setSelectedPlacePhoto(response.data);
        } catch (error) {
            console.log('fetchPlacePhoto Error:', error);
        }
    };

    const hadleCheckLogin = (e: React.MouseEvent<HTMLInputElement>) => {
        if (!session?.userId) {
            e.preventDefault();
            setShowLogin(true);
        } else {
            return;
        }
    };

    const handleUploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            const isNotImg = fileList.find((f) => {
                return !f.type.includes('image');
            });

            if (isNotImg) {
                showToatst('이미지 파일만 선택해주세요.', { type: 'error' });
                return;
            } else {
                setShowLoading(true);

                const resizeList = await Promise.all(
                    fileList.map(async (f) => await resizeImg(f, `${selectedPlace.id}_${f.name}_${dayjs().format('HH:mm:ss')}`))
                );

                const formData = new FormData();

                formData.append('id', selectedPlace.id);
                formData.append('action', 'photo');
                if (session?.userId) formData.append('userId', session.userId);

                resizeList.forEach((rf) => {
                    formData.append(`file[]`, rf.file);
                    formData.append(`width[]`, rf.width.toString());
                    formData.append(`height[]`, rf.height.toString());
                });

                try {
                    const addPhotoResponse = await axios.post('api/place-data-api', formData);

                    if (addPhotoResponse.status === 200) {
                        fetchPlacePhoto(selectedPlace.id);
                    }
                } catch (error) {
                    console.log('fetch add photo Error:', error);
                } finally {
                    setShowLoading(false);
                }

            }
        }
    };

    const handleDeletePhoto = async (docId: string) => {
        if (confirm('해당 사진을 삭제하시겠습니까?')) {
            try {
                const deletePhotoResponse = await axios.delete('api/place-data-api', {
                    data: { docId, action: 'deletePhoto' }
                });

                if (deletePhotoResponse.status === 200) {
                    fetchPlacePhoto(selectedPlace.id);
                    showToatst('삭제되었습니다.', { type: 'success' });
                }
            } catch (error) {
                console.log('fetch delete photo Error:', error);
                showToatst('오류가 발생했습니다.\n새로고침 후 다시 시도해주세요요.', { type: 'error' });
            }
        } else {
            return;
        }
    };

    const handleCopyAddress = (text: string | undefined) => {
        if (text) {
            navigator.clipboard.writeText(text).then(() => showToatst('주소가 복사되었습니다.', { type: 'success' })).catch(() => showToatst('일시적인 오류가 발생했습니다.', { type: 'error' }));
        }
    };

    const handleSaveMyPlace = async () => {
        if (!session?.userId) {
            setShowLogin(true);
            return;
        }

        const formData = new FormData();
        setShowLoading(true);

        if (!myPlace.find((mp) => mp.placeId === selectedPlace.id)) {
            formData.append('userId', session.userId);
            formData.append('placeId', selectedPlace.id);
            formData.append('placeName', selectedPlace.place_name);
            formData.append('address', selectedPlace.address_name);
            formData.append('roadAddress', selectedPlace.road_address_name);
            formData.append('category', selectedPlace.category_name);
            formData.append('x', selectedPlace.x);
            formData.append('y', selectedPlace.y);
            formData.append('action', 'myPlace');

            try {
                const saveMyPlaceResponse = await axios.post('api/place-data-api', formData);

                if (saveMyPlaceResponse.status === 200) {
                    if (session?.userId) {
                        try {
                            const response = await axios.get(`api/place-data-api?userId=${session.userId}&action=getMyPlace`);

                            setMyPlace(response.data);
                        } catch (error) {
                            console.log('fetch my place Error:', error);
                        }
                    }
                }
            } catch (error) {
                console.log('fetch save my place Error:', error);
                showToatst('오류가 발생했습니다.\n새로고침 후 다시 시도해주세요요.', { type: 'error' });
            } finally {
                setShowLoading(false);
            }
        } else {
            const docId = myPlace.find((mp) => mp.placeId === selectedPlace.id)?.docId;

            try {
                const saveMyPlaceResponse = await axios.delete('api/place-data-api', {
                    data: { docId, action: 'deleteMyPlace' }
                });

                if (saveMyPlaceResponse.status === 200) {
                    if (session?.userId) {
                        try {
                            const response = await axios.get(`api/place-data-api?userId=${session.userId}&action=getMyPlace`);

                            setMyPlace(response.data);
                        } catch (error) {
                            console.log('fetch my place Error:', error);
                        }
                    }
                }
            } catch (error) {
                console.log('fetch delete my place Error:', error);
                showToatst('오류가 발생했습니다.\n새로고침 후 다시 시도해주세요요.', { type: 'error' });
            } finally {
                setShowLoading(false);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading map: {error.message}</div>;

    return (
        <Dialog
            open={showPlaceInfo}
            maxWidth="lg"
            fullWidth={true}
        >
            <DialogTitle className="flex justify-between items-center border-b">
                <div>
                    <p className="text-xs">{selectedPlace.category_name}</p>
                    <p className="text-[#2391ff] text-xl xxs:text-2xl">{selectedPlace.place_name}</p>
                    <p
                        className="text-sm text-[#868e96] cursor-pointer"
                        ref={addressRef}
                        onClick={() => handleCopyAddress(addressRef.current?.innerText)}
                    >
                        {selectedPlace.road_address_name ? selectedPlace.road_address_name : selectedPlace.address_name}
                        <i className="ri-file-copy-2-line"></i>
                    </p>
                </div>
                <div className="grid gap-y-1">
                    <button className="text-2xl text-[#2391ff]" onClick={handleSaveMyPlace}>
                        {myPlace.find((mp) => mp.placeId === selectedPlace.id) ?
                            <i className="ri-bookmark-fill"></i>
                            :
                            <i className="ri-bookmark-line"></i>
                        }
                    </button>
                    <button className="text-2xl" onClick={handleClosePlaceInfoDialog}>
                        <i className="ri-close-large-fill"></i>
                    </button>
                </div>
            </DialogTitle>
            {!dialogLoading ?
                <>
                    <DialogContent className="border-b">
                        <div className="mt-5">
                            {
                                selectedPlacePhoto.length > 0 ?
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            multiple
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleUploadPhoto(e)}
                                            onClick={(e: React.MouseEvent<HTMLInputElement>) => hadleCheckLogin(e)}
                                        />
                                        <div className="flex">
                                            <button className="w-[35%] h-52 mr-4 bg-gray-200 rounded-md text-gray-500 text-xs" onClick={handleClickFileInput}>
                                                <p>사진 업로드</p>
                                                <i className="ri-image-add-fill"></i>
                                            </button>
                                            <div className="flex w-[65%] h-52 overflow-x-auto place-img-div">
                                                <Gallery>
                                                    {selectedPlacePhoto.map((p) => {
                                                        return (
                                                            <Item
                                                                original={p.photo}
                                                                thumbnail={p.photo}
                                                                width={p.width}
                                                                height={p.height}
                                                                key={p.docId}
                                                            >
                                                                {({ ref, open }) => (
                                                                    <div className="relative flex-none place-img w-[35%] h-[100%]">
                                                                        <Image
                                                                            ref={ref}
                                                                            onClick={open}
                                                                            src={p.photo}
                                                                            alt={p.name}
                                                                            fill
                                                                            style={{ objectFit: 'cover' }}
                                                                            className="rounded-md cursor-pointer"
                                                                        />
                                                                        {session?.userId === p.userId &&
                                                                            <i className="ri-close-fill absolute top-1 right-2 text-[#2391ff] text-with-stroke cursor-pointer" onClick={() => handleDeletePhoto(p.docId)}></i>
                                                                        }
                                                                    </div>
                                                                )}
                                                            </Item>
                                                        )
                                                    })}
                                                </Gallery>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            multiple
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleUploadPhoto(e)}
                                            onClick={(e: React.MouseEvent<HTMLInputElement>) => hadleCheckLogin(e)}
                                        />
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
                            <PlaceReview />
                        </div>
                    </DialogContent>
                </>
                :
                <DialogContent>
                    <div className="flex justify-center items-center h-[560px]">
                        <Image src={loadingImg} alt="loading_img" width={32} height={32} className="animate-spin" />
                    </div>
                </DialogContent>
            }
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
            {showLoading && <Loading />}
        </Dialog>
    )
};

export default PlaceInfoDialog;