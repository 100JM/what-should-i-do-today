import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const x = request.nextUrl.searchParams.get('x');
    const y = request.nextUrl.searchParams.get('y');
    const code = request.nextUrl.searchParams.get('category_group_code');
    const rect = request.nextUrl.searchParams.get('rect');

    if (!x || !y) {
        return NextResponse.json({ error: 'xy is required' }, { status: 200 });
    }

    const kakaoCategoryUrl = (!rect 
        ? `https://dapi.kakao.com/v2/local/search/category.json?x=${x}&y=${y}&radius=20000&category_group_code=${code}&sort=distance`
        : `https://dapi.kakao.com/v2/local/search/category.json?x=${x}&y=${y}&rect=${rect}&category_group_code=${code}&sort=accuracy`
    );

    const response = await axios.get(kakaoCategoryUrl, {
        headers: {
            Authorization: `KakaoAK ${process.env.NEXT_KAKAO_REST_API_KEY}`
        }
    });

    if (response.status === 200) {
        return NextResponse.json(response.data.documents);
    } else {
        return NextResponse.json({ error: response.statusText }, { status: response.status });
    }
};