import KakaoMap from "./components/KakaoMap";
import SearchForm from "./components/SearchForm";
import LoginDialog from "./components/LoginDialog";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "./components/nextAuth/SessionProviderWrapper";

export default function Home() {
  return (
    <div className="w-full h-full">
      <SessionProviderWrapper>
        <KakaoMap />
        <SearchForm />
        <LoginDialog />
        <Toaster position="top-center" />
      </SessionProviderWrapper>
    </div>
  );
}