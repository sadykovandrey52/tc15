import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileCallBar from "./MobileCallBar";
import AIChatbot from "./AIChatbot";
import ScrollToTopButton from "./ScrollToTopButton";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileCallBar />
      <AIChatbot />
      <ScrollToTopButton />
    </div>
  );
}
