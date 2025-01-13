import { NextRequest ,NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";

interface ReviewData {
    review: string;
    date: string;
    rate:string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'place id is required' }, { status: 200 });
    }

    try {
        const collectionRef = collection(db, 'place_review');
        const q = query(collectionRef, where('id', '==', id));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as ReviewData),
        }));

        const sortDocs = docs.sort((a, b) => {
            const aDate = dayjs(a.date);
            const bDate = dayjs(b.date);

            return aDate.isBefore(bDate) ? 1 : -1;
        })

        return NextResponse.json(sortDocs);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
    // const placeId = formData.get('id');
    // const review = formData.get('review');
    // const rate = formData.get('rate');
    // const date = formData.get('date');

    try {
        const data = {
            id: formData.get('id'),
            review: formData.get('review'),
            rate: formData.get('rate'),
            date: formData.get('date'),
        };
    
        await addDoc(collection(db, 'place_review'), data);
    
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};