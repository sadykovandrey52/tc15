import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO title="404 — страница не найдена | Tech Center 15" description="Страница не найдена" canonical="/404" />
      <section className="container-x py-32 text-center">
        <div className="font-display text-9xl text-gold">404</div>
        <h1 className="font-display text-3xl md:text-4xl uppercase mt-4">Страница не найдена</h1>
        <p className="text-muted-foreground mt-3">Возможно, она была удалена или перемещена.</p>
        <Link to="/" className="btn-gold mt-8 inline-flex">На главную</Link>
      </section>
    </>
  );
}
