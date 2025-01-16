import { Timestamp } from "firebase/firestore";

export interface reviews {
    docId: string;
    id: string;
    userId: string;
    review: string;
    createdAt: Timestamp;
    date: string;
    rate: string;
}

export interface placePhoto {
    docId: string;
    id: string;
    userId: string;
    name: string;
    photo: string;
    width: string;
    height: string;
}

export interface savedPlace {
    docId: string;
    placeId: string;
    address: string;
    roadAddress: string;
    category: string;
}