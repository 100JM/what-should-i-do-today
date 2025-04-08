const ReSearchButton = () => {
    return (
        <div className="z-[11] absolute bottom-4 left-1/2 -translate-x-1/2">
            <button className="bg-[#2391ff] rounded-full px-4 py-3 text-center text-white hover:bg-[#007fff]">
                <i className="ri-arrow-go-forward-fill mr-1"></i>
                <span>현 지도에서 다시 검색</span>
            </button>
        </div>
    )
};

export default ReSearchButton;