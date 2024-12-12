import { CustomOverlayMap } from 'react-kakao-maps-sdk'
import usePlaceData from '../store/usePlaceData';

const CustomMapOverlay = () => {
    const { categoryPlaceList } = usePlaceData();

    return (
        <>
            {categoryPlaceList.length > 0 &&
                categoryPlaceList.map((p) => {
                    return (
                        <CustomOverlayMap
                            key={p.id}
                            position={{
                                lat: Number(p.y),
                                lng: Number(p.x),
                            }}
                            xAnchor={0.5}
                            yAnchor={1.0}
                        >
                            <div className="customOverlay bg-white p-2 rounded-lg shadow cursor-pointer hover:shadow-md">
                                <p className="text-xs text-[#3788d8] font-semibold">{p.place_name}</p>
                            </div>
                        </CustomOverlayMap>
                    )
                })
            }
        </>
    )
};

export default CustomMapOverlay;