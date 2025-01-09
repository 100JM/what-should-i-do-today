import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'place id is required' }, { status: 200 });
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'place_photo'));
        const docs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        const selectedDocs = docs.filter((d) => {
            return d.id === id;
        });

        return NextResponse.json(selectedDocs);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};