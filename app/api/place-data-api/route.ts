import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'place id is required' }, { status: 200 });
    }

    try {
        const collectionRef = collection(db, 'place_photo');
        const q = query(collectionRef, where('id', '==', id));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(docs);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
    const placeId = formData.get('id');
    const files = formData.getAll('file[]');

    const uploadImg = async (file: File) => {
        const storageRef = ref(storage, `placeImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    try {
        const uploadPromises = files.map(async (f) => {
            if (f instanceof File) {
                const data = {
                    id: placeId,
                    name: f.name,
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
};