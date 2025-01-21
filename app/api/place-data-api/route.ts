import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/firebaseConfig";
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface placePhoto {
    id: string;
    userId: string;
    name: string;
    photo: string;
    width: string;
    height: string;
    createdAt: Timestamp;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'getPhoto') {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'place id is required' }, { status: 200 });
        }

        try {
            const collectionRef = collection(db, 'place_photo');
            const q = query(collectionRef, where('id', '==', id));
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map(doc => ({
                docId: doc.id,
                ...(doc.data() as placePhoto),
            }));
    
            const sortDocs = docs.sort((a, b) => {
                const aDate = a.createdAt.toDate().getTime();
                const bDate = b.createdAt.toDate().getTime();
    
                return bDate - aDate;
            });
    
            return NextResponse.json(sortDocs);
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    } else {
        try {
            const userId = request.nextUrl.searchParams.get('userId');

            const collectionRef = collection(db, 'my_place');
            const q = query(collectionRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map(doc => ({
                docId: doc.id,
                ...doc.data(),
            }));

            return NextResponse.json(docs);
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
    const action = formData.get('action');

    if (action === 'photo') {
        const placeId = formData.get('id');
        const files = formData.getAll('file[]');
        const widths = formData.getAll('width[]');
        const heights = formData.getAll('height[]');
        const userId = formData.get('userId');

        const uploadImg = async (file: File) => {
            const storageRef = ref(storage, `placeImages/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        };

        try {
            const uploadPromises = files.map(async (f, i) => {
                if (f instanceof File) {
                    const data = {
                        id: placeId,
                        userId: userId,
                        name: f.name,
                        width: widths[i],
                        height: heights[i],
                        createdAt: serverTimestamp()
                    };

                    const photo = await uploadImg(f);
                    const docData = { ...data, photo };
                    return await addDoc(collection(db, 'place_photo'), docData);
                }
            });

            await Promise.all(uploadPromises);

            return NextResponse.json({ status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    } else {
        const placeId = formData.get('placeId');
        const placeName = formData.get('placeName');
        const address = formData.get('address');
        const roadAddress = formData.get('roadAddress');
        const category = formData.get('category');
        const userId = formData.get('userId');
        const x = formData.get('x');
        const y = formData.get('y');

        const data = {
            placeId: placeId,
            placeName: placeName,
            address: address,
            roadAddress: roadAddress,
            category: category,
            userId: userId,
            x: x,
            y: y
        };

        try {
            await addDoc(collection(db, 'my_place'), data);

            return NextResponse.json({ status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }
};

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const { docId, action } = body;

    if (typeof docId !== 'string' || !docId) {
        return NextResponse.json({ error: 'doc id is required' }, { status: 200 });
    }

    if (action === 'deletePhoto') {
        try {
            const docRef = doc(db, 'place_photo', docId);
            await deleteDoc(docRef);

            return NextResponse.json({ status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    } else {
        try {
            const docRef = doc(db, 'my_place', docId);
            await deleteDoc(docRef);

            return NextResponse.json({ status: 200 });
        } catch (error) {
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }
};