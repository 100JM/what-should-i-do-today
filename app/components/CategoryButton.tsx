import { useState } from "react";
import axios from "axios";

import usePlaceData from "../store/usePlaceData";
import useMapData from "../store/useMapData";
import { categoryList } from "../utils/categoryList";

const CategoryButton = () => {
    const [clickedButton, setClickedButton] = useState<string>('');
    const { setCategoryPlaceList, resetSelectedPlaceRef } = usePlaceData();
    const { mapCenter } = useMapData();

    const fetchCategory = async (code: string) => {
        resetSelectedPlaceRef();

        try {
            if (mapCenter) {
                const categoryResponse = await axios.get(`api/kakao-category-api?x=${mapCenter.lng}&y=${mapCenter.lat}&&category_group_code=${code}`);
                setCategoryPlaceList(categoryResponse.data);
                setClickedButton(code);
            }
        } catch (error) {
            console.log('fetchCategory Error:', error);
        }
    };

    const handleClickCategoryBtn = (code: string) => {
        if (code !== '인기 장소' && code !== '맛집') {
            fetchCategory(code);
        }
    };

    return (
        <>
            {categoryList.map((c) => {
                return (
                    <button key={c.icon} className={`py-1 px-2 shadow-md shadow-gray-400 border rounded-3xl group ${clickedButton === c.code ? "text-[#3788d8]" : ""}`} onClick={() => handleClickCategoryBtn(c.code)}>
                        <i className={`${c.icon} ${c.color} p-0`}></i>
                        <span className="group-hover:text-[#2391ff] ml-1 text-sm">{c.text}</span>
                    </button>
                )
            })}
        </>
    )
};

export default CategoryButton;