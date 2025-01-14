import KakaoMap from "./components/KakaoMap";
import SearchForm from "./components/SearchForm";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="w-full h-full">
      <KakaoMap />
      <SearchForm />
      <Toaster position="top-center" />
    </div>
  );
}