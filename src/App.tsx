import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

// Авто-ретрай для динамических импортов: если Vite/деплой выкатил новые
// хэши чанков, старая вкладка получает "Failed to fetch dynamically imported
// module". Делаем одну попытку hard-reload, чтобы подтянуть свежий manifest.
function lazyWithRetry<T extends { default: React.ComponentType<unknown> }>(
  factory: () => Promise<T>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      const key = "lov:chunk-reloaded";
      const msg = String((err as Error)?.message || err);
      const isChunkErr = /dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(msg);
      if (isChunkErr && typeof window !== "undefined" && !sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
        return new Promise<T>(() => {});
      }
      throw err;
    }
  });
}

const AllServices = lazyWithRetry(() => import("./pages/AllServices"));
const CategoryPage = lazyWithRetry(() => import("./pages/CategoryPage"));
const ServicePage = lazyWithRetry(() => import("./pages/ServicePage"));
const MakesIndex = lazyWithRetry(() => import("./pages/MakesIndex"));
const MakePage = lazyWithRetry(() => import("./pages/MakePage"));
const BlogIndex = lazyWithRetry(() => import("./pages/BlogIndex"));
const BlogPost = lazyWithRetry(() => import("./pages/BlogPost"));
const Contacts = lazyWithRetry(() => import("./pages/Contacts"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="container-x py-24 text-center text-muted-foreground">Загрузка…</div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Sonner position="top-right" richColors closeButton />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<AllServices />} />
                <Route path="/services/:categorySlug" element={<CategoryPage />} />
                <Route path="/services/:categorySlug/:serviceSlug" element={<ServicePage />} />
                <Route path="/makes" element={<MakesIndex />} />
                <Route path="/makes/:makeSlug" element={<MakePage />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:postSlug" element={<BlogPost />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
