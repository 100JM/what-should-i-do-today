import axios from "axios";

import usePlaceData from "../store/usePlaceData";
import useMapData from "../store/useMapData";
import { categoryList } from "../utils/categoryList";

const CategoryButton = () => {
    const { setCategoryPlaceList, resetSelectedPlaceRef } = usePlaceData();
    const { mapCenter } = useMapData();

    const fetchCategory = async (code: string) => {
        resetSelectedPlaceRef();

        try {
            if (mapCenter) {
                const categoryResponse = await axios.get(`api/kakao-category-api?x=${mapCenter.lng}&y=${mapCenter.lat}&&category_group_code=${code}`);
                setCategoryPlaceList(categoryResponse.data);
            }
        } catch (error) {
            console.log('fetchCategory Error:', error);
        }
    };

    const handleClickCategoryBtn = (keyword: string) => {
        if (keyword !== '인기 장소' && keyword !== '맛집') {
            fetchCategory(keyword);
        }
    };

    return (
        <>
            {categoryList.map((c) => {
                return (
                    <button key={c.icon} className="py-1 px-2 shadow-md shadow-gray-400 border rounded-3xl group" onClick={() => handleClickCategoryBtn(c.code)}>
                        <i className={`${c.icon} ${c.color} p-0`}></i>
                        <span className="group-hover:text-[#2391ff] ml-1 text-sm">{c.text}</span>
                    </button>
                )
            })}
        </>
    )
};

export default CategoryButton;