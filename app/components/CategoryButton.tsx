import axios from "axios";

import usePlaceData from "../store/usePlaceData";
import useMapData from "../store/useMapData";
import { categoryList } from "../utils/categoryList";
import { RefObject } from "react";

interface CategoryButtonInterface {
    clickedButton: string;
    handleClickCateBtn: (code: string) => void;
    searchInputRef: RefObject<HTMLInputElement>;
}

const CategoryButton: React.FC<CategoryButtonInterface> = ({ clickedButton, handleClickCateBtn, searchInputRef }) => {
    const { setCategoryPlaceList, resetSelectedPlaceRef, resetSelectedPlace, setListTitle } = usePlaceData();
    const { mapCenter, mapObject, setZoomLevel } = useMapData();

    const fetchCategory = async (code: string, text: string) => {
        resetSelectedPlace();
        resetSelectedPlaceRef();

        if (searchInputRef.current?.value) {
            searchInputRef.current.value = '';
        }

        try {
            if (mapCenter && mapObject) {
                const southWest = mapObject.getBounds().getSouthWest();
                const northEast = mapObject.getBounds().getNorthEast();
                const rect = `${southWest.getLng()},${southWest.getLat()},${northEast.getLng()},${northEast.getLat()}`;
                const categoryResponse = await axios.get(`api/kakao-category-api?x=${mapObject.getCenter().getLng()}&y=${mapObject.getCenter().getLat()}&category_group_code=${code}&rect=${rect}`);
                setCategoryPlaceList(categoryResponse.data);
                handleClickCateBtn(code);
                setListTitle(`주변 ${text} 리스트`);
            }
        } catch (error) {
            console.log('fetchCategory Error:', error);
        }
    };

    const fetchCategoryToKeyword = async (code: string, text: string) => {
        resetSelectedPlace();
        resetSelectedPlaceRef();

        if (searchInputRef.current?.value) {
            searchInputRef.current.value = '';
        }

        try {
            if (mapObject) {
                const keywordResponse = await axios.get(`api/kakao-keyword-api?x=${mapObject.getCenter().getLng()}&y=${mapObject.getCenter().getLat()}&keyword=${code}`);
                setCategoryPlaceList(keywordResponse.data.documents);
                handleClickCateBtn(code);
                setListTitle(`주변 ${text} 리스트`);

                if (code === '명소') {
                    setZoomLevel(7);
                }

            }
        } catch (error) {
            console.log('fetchCategoryToKeyword Error:', error);
        }
    }

    const handleClickCategoryBtn = (code: string, text: string) => {
        if (code !== '명소' && code !== '맛집') {
            fetchCategory(code, text);
        } else {
            fetchCategoryToKeyword(code, text);
        }
    };

    return (
        <div className="sm:w-[90%] sm:mt-4 flex flex-nowrap sm:flex-wrap sm:gap-3 sm:overflow-x-visible overflow-x-scroll scrollbar-hide py-6 sm:py-0 justify-start sm:justify-normal items-center">
            {categoryList.map((c) => {
                return (
                    <button key={c.icon} className={`whitespace-nowrap mx-1 text-[10px] sm:mx-0 sm:text-sm py-1 px-2 shadow-md shadow-gray-400 border rounded-3xl group ${clickedButton === c.code ? "text-[#3788d8]" : ""}`} onClick={() => handleClickCategoryBtn(c.code, c.text)}>
                        <i className={`${c.icon} ${c.color} p-0`}></i>
                        <span className="group-hover:text-[#2391ff] ml-1">{c.text}</span>
                    </button>
                )
            })}
        </div>
    )
};

export default CategoryButton;