import axios from "axios";


export const fetchPlacePhoto = async (id: string) => {
    try {
        const response = await axios.get(`api/place-data-api?id=${id}&action=getPhoto`);
        return response.data;
    } catch (error) {
        console.log('fetchPlacePhoto Error:', error);
    }
};

export const fetchPlaceReview = async (id: string) => {
    try {
        const response = await axios.get(`api/review-data-api?id=${id}`);
        return response.data;
    } catch (error) {
        console.log('fetchPlacePhoto Error:', error);
    }
};