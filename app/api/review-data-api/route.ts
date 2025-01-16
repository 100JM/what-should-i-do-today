import { NextRequest ,NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp, serverTimestamp, deleteDoc, doc } from "firebase/firestore";

interface ReviewData {
    id:string;
    userId: string;
    review: string;
    date: string;
    rate:string;
    createdAt: Timestamp;
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
            docId: doc.id,
            ...(doc.data() as ReviewData),
        }));

        const sortDocs = docs.sort((a, b) => {
            const aDate = a.createdAt.toDate().getTime();
            const bDate = b.createdAt.toDate().getTime();

            return bDate - aDate;
        })

        return NextResponse.json(sortDocs);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
    const action = formData.get('action');

    if (action === 'add') {
        try {
            const reviewData = Object.fromEntries(formData.entries());
            const data = Object.assign(reviewData, { createdAt: serverTimestamp() });
    
            await addDoc(collection(db, 'place_review'), data);
        
            return NextResponse.json({ status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    } else {
        const docId = formData.get('docId');

        if (typeof docId !== 'string' || !docId) {
            return NextResponse.json({ error: 'doc id is required' }, { status: 200 });
        }

        try {
            const docRef = doc(db, 'place_review', docId);
            await deleteDoc(docRef);

            return NextResponse.json({ status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }
};