import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const x = request.nextUrl.searchParams.get('x');
    const y = request.nextUrl.searchParams.get('y');
    const keyword = request.nextUrl.searchParams.get('keyword');

    if (!x || !y) {
        return NextResponse.json({ error: 'xy is required' }, { status: 200 });
    }

    const kakaoKeywordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?x=${x}&y=${y}&query=${keyword}&sort=accuracy`;

    const response = await axios.get(kakaoKeywordUrl, {
        headers: {
            Authorization: `KakaoAK ${process.env.NEXT_KAKAO_REST_API_KEY}`
        }
    });
    console.log(response.data.meta.same_name); //selected_region를 좌표로 변환?
    if (response.status === 200) {
        return NextResponse.json(response.data.documents);
    } else {
        return NextResponse.json({ error: response.statusText }, { status: response.status });
    }
};