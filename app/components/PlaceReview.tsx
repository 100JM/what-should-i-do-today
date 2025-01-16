import { useState, useRef } from "react";
import usePlaceData from "../store/usePlaceData"
import { useSession } from "next-auth/react";

import Rating from '@mui/material/Rating';
import useDialog from "../store/useDialog";
import dayjs from "dayjs";
import axios from "axios";

const PlaceReview = () => {
    const [reviewRate, setReviewRate] = useState<string>('5');
    const { selectedPlaceReview, selectedPlace, setSelectedPlaceReview } = usePlaceData();
    const { showToatst } = useDialog();
    const reviewInputRef = useRef<HTMLInputElement>(null);
    const { data: session } = useSession()

    const handleChangeRate = (value: string) => {
        setReviewRate(value);
    };

    const handleReviewBtn = async () => {
        const reviewInputValue = reviewInputRef.current?.value;

        reviewInputRef.current?.blur();

        if (!reviewInputValue) {
            showToatst('리뷰 내용을 작성해주세요.', { type: 'error' });
            reviewInputRef.current?.focus();
            return;
        }

        try {
            const formData = new FormData();
            const nowDate = dayjs().format('YYYY-MM-DD');

            formData.append('id', selectedPlace.id);
            formData.append('review', reviewInputValue);
            formData.append('rate', reviewRate);
            formData.append('date', nowDate);
            formData.append('action', 'add');
            if (session?.userId) formData.append('userId', session.userId);
            const response = await axios.post('api/review-data-api', formData);

            if (response.status === 200) {
                try {
                    reviewInputRef.current.value = '';
                    const response = await axios.get(`api/review-data-api?id=${selectedPlace.id}`);
                    setSelectedPlaceReview(response.data);
                    showToatst('리뷰가 등록되었습니다.', { type: 'success' });
                    setReviewRate('5');
                } catch (error) {
                    console.log('fetch review Error:', error);
                    showToatst('리뷰를 불러오는데 실패했습니다.\n새로고침 후 다시 시도해주세요.', { type: 'error' });
                }
            }

        } catch (error) {
            console.log('add review Error', error);
            showToatst('리뷰 등록에 실패했습니다.\n새로고침 후 다시 시도해주세요.', { type: 'error' });
        }
    };

    const handleDeleteReview = async (docId: string) => {
        if (confirm('리뷰를 삭제하시겠습니까?')) {
            try {
                const formData = new FormData();

                formData.append('docId', docId);
                formData.append('action', 'delete');

                const deleteResponse = await axios.post('api/review-data-api', formData);

                if (deleteResponse.status === 200) {
                    try {
                        const response = await axios.get(`api/review-data-api?id=${selectedPlace.id}`);
                        setSelectedPlaceReview(response.data);
                        showToatst('리뷰가 삭제되었습니다.', { type: 'success' });
                    } catch (error) {
                        console.log('fetch review Error:', error);
                        showToatst('리뷰를 불러오는데 실패했습니다.\n새로고침 후 다시 시도해주세요.', { type: 'error' });
                    }
                }
            } catch (error) {
                console.log('delete review Error', error);
                showToatst('리뷰 삭제에 실패했습니다.\n새로고침 후 다시 시도해주세요.', { type: 'error' });
            }
        } else {
            return;
        }
    };

    return (
        <div className="w-full overflow-y-auto h-80 lg:w-1/2 lg:ml-2">
            <div>
                <h3 className="text-gray-500">장소에 대한 의견을 남겨주세요.</h3>
                <Rating name="size-small" size="small" defaultValue={5} value={Number(reviewRate)} onChange={(e) => handleChangeRate((e.target as HTMLInputElement).value)} />
                <div className="w-full flex items-center border-b">
                    <input
                        type="text"
                        className="focus:outline-none w-[calc(100%-24px)]"
                        ref={reviewInputRef}
                        onKeyUp={(key) => {
                            if (key.key === 'Enter') {
                                handleReviewBtn();
                            }
                        }}
                    />
                    <i className="ri-edit-2-line w-6 text-center text-lg cursor-pointer text-[#2391ff]" onClick={handleReviewBtn}></i>
                </div>
            </div>
            {selectedPlaceReview.length > 0 ?
                <div className="h-[calc(100%-84px)] py-2 flex flex-col gap-2 overflow-y-auto">
                    {selectedPlaceReview.map((r) =>
                        <div key={r.docId} className="shadow border rounded-md p-2 xs:flex xs:items-center xs:gap-x-2">
                            <Rating name="size-small" size="small" defaultValue={Number(r.rate)} readOnly />
                            <div>
                                <p className="text-sm">{r.review}</p>
                                <p className="text-xs">
                                    {r.date}
                                    {r.userId === session?.userId &&
                                        <button className="ml-2 text-[#2391ff]" onClick={() => handleDeleteReview(r.docId)}>삭제</button>
                                    }
                                </p>
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