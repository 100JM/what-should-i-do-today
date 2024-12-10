import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

interface RegionInterface {
    address_name: string;
    code: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    region_type: string;
    x: number;
    y: number;
}

export async function GET(request: NextRequest): Promise<NextResponse> {

    const x = request.nextUrl.searchParams.get('x');
    const y = request.nextUrl.searchParams.get('y');

    if (!x || !y) {
        return NextResponse.json({ error: 'xy is required' }, { status: 200 });
    }

    const kakaoGeoUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`; 
    const response = await axios.get(kakaoGeoUrl, {
        headers: {
            Authorization: `KakaoAK ${process.env.NEXT_KAKAO_REST_API_KEY}`,
        }
    });

    if (response.status === 200) {
        const addressName = response.data.documents.find((i: RegionInterface) => {
            return i.region_type === 'B'
        });

        return NextResponse.json(addressName);

    } else {
        return NextResponse.json({ error: response.statusText }, { status: response.status });
    }
};