import usePlaceData from "../store/usePlaceData"

import Rating from '@mui/material/Rating';

const PlaceReview = () => {
    const { selectedPlaceReview } = usePlaceData();

    return (
        <div className="w-full overflow-y-auto h-80 lg:w-1/2 lg:ml-2">
            <div>
                <h3 className="text-gray-500">장소에 대한 의견을 남겨주세요.</h3>
                <Rating name="size-medium" defaultValue={5} />
                <div className="w-full flex items-center border-b">
                    <input type="text" className="focus:outline-none w-[calc(100%-24px)]" />
                    <i className="ri-edit-2-line w-6 text-center text-lg cursor-pointer text-[#2391ff]"></i>
                </div>
            </div>
            {selectedPlaceReview.length > 0 ?
                <div className="h-[calc(100%-84px)] py-2 flex flex-col gap-2 overflow-y-auto">
                    {selectedPlaceReview.map((r) =>
                        <div key={`${r.id}_${r.review}`} className="shadow border rounded-md p-2 xs:flex xs:items-center xs:gap-x-2">
                            <Rating name="size-medium" defaultValue={Number(r.rate)} readOnly />
                            <div>
                                <p className="text-sm">{r.review}</p>
                                <p className="text-xs">{r.date}</p>
                            </div>
                        </div>
                    )}
                </div>
                :
                <div className="h-[calc(100%-80px)] flex justify-center items-center">
                    <span>기록된 리뷰가 없습니다🥲</span>
                </div>
            }
        </div>
    )
};

export default PlaceReview;