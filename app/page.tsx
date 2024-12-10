import KakaoMap from "./components/KakaoMap";
import SearchForm from "./components/SearchForm";

export default function Home() {
  return (
    <div className="w-full h-full">
      <KakaoMap />
      <SearchForm />
    </div>
  );
}