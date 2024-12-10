import { categoryList } from "../utils/categoryList";

const CategoryButton = () => {
    return (
        <>
            {categoryList.map((c) => {
                return (
                    <button key={c.icon} className="py-1 px-2 shadow-md shadow-gray-400 border rounded-3xl group">
                        <i className={`${c.icon} ${c.color} p-0`}></i>
                        <span className="group-hover:text-[#2391ff] ml-1 text-sm">{c.text}</span>
                    </button>
                )
            })}
        </>
    )
};

export default CategoryButton;