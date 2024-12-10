'use client';

import { useEffect, useState } from "react";
import axios from "axios";

import useMapData from "../store/useMapData";
import CategoryButton from "./CategoryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"

const SearchForm = () => {
    const [showSearchForm, setShowSearchForm] = useState<boolean>(false);
    const { mapCenter } = useMapData();

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                if (mapCenter.lat && mapCenter.lng) {
                    const response = await axios.get(`api/kakao-georegion-api?x=${mapCenter.lng}&y=${mapCenter.lat}`);
                    console.log(response.data.address_name);
                }
            } catch (error) {
                console.log("fetchAddress Error:", error);
            }
        }

        fetchAddress();
    }, [mapCenter]);

    return (
        <>
            {!showSearchForm &&
                <div className="top-6 left-6 z-50 absolute">
                    <button className="bg-[#2391ff] rounded-xl p-3 flex justify-center items-center hover:bg-[#007fff]" onClick={() => setShowSearchForm(true)}>
                        <i className="ri-menu-search-line text-white text-2xl"></i>
                    </button>
                </div>
            }
            <div className={`top-0 left-0 z-50 fixed bg-white w-1/6 h-full shadow-2xl rounded-tr-2xl rounded-br-2xl transform transition-transform duration-500 ${showSearchForm ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="float-end mr-3 mt-1">
                    <button onClick={() => setShowSearchForm(false)}>
                        <FontAwesomeIcon icon={faXmark} className="text-[#708090]" />
                    </button>
                </div>
                <div className="w-full px-4 mt-8">
                    <div className="w-full py-2 px-4 border-2 border-[#2391ff] rounded-3xl">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#2391ff]" />
                        <input className="w-[90%] py-1 px-2 outline-none" type="text" placeholder="카테고리, 키워드로 검색" />
                    </div>
                    <div className="w-[90%] mt-2 flex flex-wrap gap-3">
                        <CategoryButton />
                    </div>
                </div>
            </div>
        </>
    )
};

export default SearchForm;