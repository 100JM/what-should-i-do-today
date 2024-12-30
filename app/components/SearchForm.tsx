'use client';

import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { categoryPlace } from "@/types/categoryData";
import useMapData from "../store/useMapData";
import usePlaceData from "../store/usePlaceData";
import CategoryButton from "./CategoryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faAngleLeft, faAngleDown, faMapLocationDot } from "@fortawesome/free-solid-svg-icons"
import Skeleton from '@mui/material/Skeleton';

const SearchForm = () => {
    const [showSearchForm, setShowSearchForm] = useState<boolean>(true);
    const [regionName, setRegionName] = useState<string>('');
    const [clickedButton, setClickedButton] = useState<string>('');

    const { setZoomLevel, myLocation, setMapCenter, mapObject } = useMapData();
    const { categoryPlaceList, selectedPlace, setSelectedPlace, selectedPlaceRef, setSelectedPlaceRef, listTitle, setListTitle, resetSelectedPlaceRef, resetSelectedPlace, setCategoryPlaceList } = usePlaceData();

    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleClickCateBtn = (code: string) => {
        setClickedButton(code);
    };

    const fetchAddress = async () => {
        try {
            if (myLocation.lat && myLocation.lng) {
                const response = await axios.get(`api/kakao-georegion-api?x=${myLocation.lng}&y=${myLocation.lat}`);
                setRegionName(response.data.address_name);
            }
        } catch (error) {
            console.log('fetchAddress Error:', error);
        }
    };

    const handleClickPlace = (place: categoryPlace) => {
        setMapCenter({ lat: Number(place.y), lng: Number(place.x) });
        setZoomLevel(1);
        setSelectedPlace(place);

        if (selectedPlaceRef[place.id]) {
            selectedPlaceRef[place.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSearchKeyword = async () => {
        resetSelectedPlace();
        resetSelectedPlaceRef();
        setClickedButton('');

        try {
            if (searchInputRef.current?.value) {

                const keywordResponse = await axios.get(`api/kakao-keyword-api?x=${myLocation.lng}&y=${myLocation.lat}&keyword=${searchInputRef.current.value}`);

                setCategoryPlaceList(keywordResponse.data.documents);
                setListTitle(`${searchInputRef.current.value} 검색 결과`);

                if (keywordResponse.data.selected_region) {
                    setMapCenter({ lat: Number(keywordResponse.data.selected_region.y), lng: Number(keywordResponse.data.selected_region.x) });
                    mapObject?.setCenter(new kakao.maps.LatLng(Number(keywordResponse.data.selected_region.y), Number(keywordResponse.data.selected_region.x)));
                    setZoomLevel(5);
                }

            }
        } catch (error) {
            console.log('fetchKeywordSearch Error:', error);
        }
    };

    useEffect(() => {
        fetchAddress();
    }, [myLocation]);
    console.log(categoryPlaceList);
    return (
        <>
            {!showSearchForm &&
                <div className="top-6 left-6 z-50 absolute">
                    <button className="bg-[#2391ff] rounded-xl w-[50px] h-[50px] flex justify-center items-center hover:bg-[#007fff]" onClick={() => setShowSearchForm(true)}>
                        <i className="ri-menu-search-line text-white text-2xl"></i>
                    </button>
                </div>
            }
            <div className={`z-50 fixed bg-white shadow-2xl rounded-tr-2xl rounded-br-2xl transform transition-transform duration-500 ${showSearchForm ? "lg:translate-x-0 lg:translate-y-0 translate-y-0" : "lg:-translate-x-full lg:translate-y-0 translate-y-full"} lg:top-0 lg:left-0 lg:w-[420px] lg:h-full top-auto bottom-0 w-full h-[45%]`}>
                <button
                    className={`hidden lg:block absolute top-[calc(50%-40px)] left-full bg-white h-10 w-7 shadow-2xl rounded-tr-md rounded-br-md border transform transition-opacity duration-500 ${showSearchForm ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setShowSearchForm(false)}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button
                    className={`lg:hidden absolute bottom-full left-[calc(50%-20px)] bg-white w-10 h-6 shadow-2xl rounded-tr-md rounded-tl-md border transform transition-opacity duration-500 ${showSearchForm ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setShowSearchForm(false)}
                >
                    <FontAwesomeIcon icon={faAngleDown} />
                </button>
                <div className="w-full h-full p-4 flex flex-col">
                    <div className="w-full py-2 px-4 border-2 border-[#2391ff] rounded-3xl">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#2391ff] cursor-pointer" onClick={handleSearchKeyword} />
                        <input 
                            className="w-[90%] p-1 outline-none"
                            type="text"
                            placeholder="카테고리, 키워드로 검색"
                            ref={searchInputRef}
                            onKeyUp={(key) => {
                                if (key.key === 'Enter') {
                                    handleSearchKeyword();
                                }
                            }} 
                        />
                    </div>
                    <div className="w-[90%] mt-4 flex flex-wrap gap-3">
                        <CategoryButton clickedButton={clickedButton} handleClickCateBtn={handleClickCateBtn} searchInputRef={searchInputRef} />
                    </div>
                    {regionName ?
                        <div className="mt-4 text-lg font-semibold">
                            <i className="ri-map-pin-2-line pr-1"></i>
                            <span>내 위치 - {regionName}</span>
                        </div>
                        :
                        <Skeleton variant="text" sx={{ marginTop: "16px", borderRadius: "8px", fontSize: "1.25rem" }} />
                    }
                    <div className="mt-4 relative">
                        {listTitle ?
                            <span className="near-recommend">{listTitle}</span>
                            :
                            <Skeleton variant="rectangular" sx={{ borderRadius: "8px" }} height={24} />
                        }
                    </div>
                    {categoryPlaceList.length > 0 ?
                        <div className="mt-4 w-full overflow-y-auto custom-scroll-container grid grid-cols-1 gap-4">
                            {categoryPlaceList.map((cp) => {
                                return (
                                    <div
                                        key={cp.id}
                                        className={`border rounded-xl p-4 cursor-pointer hover:border-[#2391ff] ${cp.id === selectedPlace.id ? 'border-[#2391ff]' : ''}`}
                                        onClick={() => handleClickPlace(cp)}
                                        ref={(el) => {
                                            if (el && selectedPlaceRef[cp.id] !== el) {
                                                setSelectedPlaceRef(cp.id, el);
                                            }
                                        }}
                                    >
                                        <p className="text-xs mb-2 text-[#868e96]">{cp.category_name}</p>
                                        <p>
                                            {cp.place_name}
                                            {cp.category_group_name && <small>({cp.category_group_name})</small>}
                                        </p>
                                        <p className="text-sm">{cp.address_name}</p>
                                        <p className="mt-2 text-sm">
                                            <FontAwesomeIcon icon={faMapLocationDot} className="text-[#2391ff] text-lg mr-2" />
                                            현재 위치에서 {cp.distance}m
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <div className="mt-4 w-full overflow-y-hidden custom-scroll-container grid grid-cols-1 gap-4">
                            {Array.from({ length: 15 }, (_, i) => {
                                return (
                                    <Skeleton key={i} variant="rectangular" sx={{ borderRadius: "12px", paddingRight: "4px" }} height={120} />
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </>
    )
};

export default SearchForm;