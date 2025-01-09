import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
    const placeId = formData.get('id');
    const files = formData.getAll('file[]');

    console.log(files);

    const uploadImg = async (file: File) => {
        const storageRef = ref(storage, `images/${file.name}`);
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