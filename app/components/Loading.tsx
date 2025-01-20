import Image from "next/image";
import loadingImg from "../assets/images/icon-32x32.png";

const Loading = () => {
    return (
        <div className="w-full h-full absolute top-0 z-[999] flex justify-center items-center">
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
            <Image src={loadingImg} alt="loading_img" width={32} height={32} className="animate-spin" />
        </div>
    )
};

export default Loading;