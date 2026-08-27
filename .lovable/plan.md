# Tech Center 15 — SEO-сайт премиального автосервиса

Многостраничный сайт-воронка с генерацией всех страниц услуг из единого источника данных. Каждая услуга — отдельный лендинг с уникальным SEO, формой и CTA.

## 1. Архитектура данных (создаётся первой)

**`src/data/services.ts`** — единый источник правды:
- `company` — реквизиты (имя, телефон, телефон-plain, telegram, адрес, режим)
- `categories[]` — 5 категорий (suspension, steering, driveshaft, engine, maintenance), каждая со списком `services[]`
- Каждая `service`: id, slug, name, h1, seoTitle, seoDesc, priceFrom, duration, warranty, freq, symptoms[], process[], faq[], related[]
- `makes[]` — toyota, kia (h1, описание, список релевантных услуг)
- `blogPosts[]` — 5 статей (slug, h1, excerpt, content-блоки, relatedServices[])

Все страницы рендерятся из этого файла. Никакого хардкода контента в компонентах.

## 2. Роутинг

`src/App.tsx` — React Router v6 с маршрутами, генерируемыми из `services.ts`:

```text
/                                           Home
/services                                   AllServices
/services/:categorySlug                     CategoryPage      (×5)
/services/:categorySlug/:serviceSlug        ServicePage       (×17)
/makes/:makeSlug                            MakePage          (×2)
/blog                                       BlogIndex
/blog/:postSlug                             BlogPost          (×5)
/contacts                                   Contacts
*                                           NotFound
```

Итого ~32 уникальных URL — каждый из ТЗ обязателен и реализован отдельной страницей (никаких якорей-замен).

## 3. Дизайн-система

`tailwind.config.ts` + `index.css` расширяются:
- Цвета: bg-base #08090F, bg-surface #0F1117, bg-surface2 #181C26, border #2A3040, gold #F0A500, gold-light #FFB800, text-primary/secondary/muted, success/error/warning
- Шрифты через Google Fonts: Bebas Neue (H1/H2 uppercase), Oswald (H3), Inter (body/UI)
- Утилиты: `.text-gold`, `.bg-surface`, glassmorphism для header, scanline/grid keyframes, marquee, fade-in/scale-in, hover-lift, pulse-gold
- Тёмный фон обязателен везде. Никакого белого.

## 4. Глобальные компоненты (`src/components/`)

- **Header** — фикс, glass, лого «TECH CENTER **15**» (15 — золотым), nav с dropdown «Услуги» (категории + популярное), телефон/Telegram/CTA «Записаться» справа. Бургер на мобильном.
- **Footer** — 4 колонки (бренд, услуги, информация, контакты), один на всех страницах.
- **MobileCallBar** — sticky bottom «Позвонить» только на мобильных.
- **SEO** — компонент управления `<title>`, `<meta>`, JSON-LD (LocalBusiness, AutoRepair, Service, FAQPage, BreadcrumbList).
- **Breadcrumbs**, **Marquee** (embla), **TrustBadges**, **StatsCounters** (react-countup), **ProcessSteps**, **PriceTable**, **FAQ** (accordion), **ReviewsSlider** (embla), **ContactCTA**, **LeadForm** (имя/телефон/марка/год/проблема/согласие → toast «Заявка принята! Перезвоним в течение 15 минут»), **ServiceCard**, **CategoryCard**, **RelatedServices**, **GalleryPlaceholder** (тёмная CSS-заглушка с иконкой Lucide когда нет фото), **HeroBg** (анимированная сетка + scanline + виньетка).
- **AIChatbot** — floating gold pulse кнопка (правый низ, над MobileCallBar на мобильном). Логика по ключевым словам (стук/подвеска → сайлентблоки/амортизаторы; не заводится → стартер/генератор; масло/ТО; рулевое; ГРМ; цена → «нужна диагностика»; адрес → реквизиты). Под каждым ответом кнопки «Позвонить» и «Telegram». Без диагнозов, без точных цен, всегда ведёт к контакту.

## 5. Шаблоны страниц

**Главная** (`pages/Home.tsx`):
Hero 100vh (анимированный фон, H1 «РЕМОНТ АВТОМОБИЛЕЙ **ЛЮБОЙ** СЛОЖНОСТИ» с золотым словом, подзаголовок, 2 CTA, 4 trust-бейджа) → Marquee → 6 категорий-карточек (5 категорий услуг + «Ремонт по маркам») → Stats counters (2000+/10/12/98%) → Популярные услуги (топ-6 по freq) → «Как мы работаем» (5 шагов) → Reviews slider (5 отзывов под конкретные услуги) → Адрес-блок с кнопкой «Построить маршрут» (Яндекс.Карты deep-link) → CTA перед footer.

**CategoryPage** (`pages/CategoryPage.tsx`) — рендер из `services.ts` по slug:
Hero (заглушка + breadcrumbs + H1 + описание + CTA) → сетка дочерних услуг (карточки с ценой/сроком/гарантией) → блок симптомов категории → таблица стоимости → CTA на диагностику → SEO-текст 300–500 слов в accordion «Читать подробнее».

**ServicePage** (`pages/ServicePage.tsx`) — отдельный лендинг каждой из 17 услуг:
Hero (заглушка/фото, breadcrumbs, тег категории, H1 «… в Москве», подзаголовок-боль, бейджи гарантия/срок/цена, CTA + телефон) → Симптомы 2×3 → «Что будет, если тянуть» (риски) → «Как мы работаем» (5 шагов) → Таблица стоимости с пометкой про запчасти → Галерея (заглушки) → FAQ (4–6 Q/A) → Связанные услуги (3 карточки) → LeadForm.

**MakePage** (`pages/MakePage.tsx`) — Toyota/Kia: H1 «Ремонт {Make} в Москве», описание, сетка релевантных услуг, отзывы, CTA, форма.

**BlogIndex / BlogPost** — список и статья со связанными услугами в боковом блоке/после контента.

**Contacts** — реквизиты, как добраться, кнопки Позвонить/Telegram/Маршрут, embed-карта (статичная заглушка/iframe Яндекс.Карт).

## 6. SEO

- React Helmet-async (или нативный effect) для title/description/OG/JSON-LD на каждой странице
- LocalBusiness + AutoRepair JSON-LD на главной/контактах
- Service JSON-LD на каждой service page
- FAQPage JSON-LD где есть FAQ
- BreadcrumbList JSON-LD на всех вложенных
- `public/robots.txt` + `public/sitemap.xml` (генерируется один раз из списка слугов)
- canonical, lang="ru"

## 7. Перелинковка

- Услуги подвески ссылаются друг на друга через `related[]`
- Рулевое ↔ развал-схождение
- ГРМ ↔ диагностика
- ТО ↔ масло ↔ тормоза ↔ диагностика
- Каждая блог-статья → релевантные services
- Marquee и «Популярные услуги» на главной → service pages

## 8. Технические детали

Зависимости: `framer-motion`, `react-router-dom`, `react-countup`, `embla-carousel-react`, `react-helmet-async`. `lucide-react` и `sonner` уже есть.

Производительность: lazy-load роутов через `React.lazy`, изображения как лёгкие CSS-заглушки (без тяжёлых hero-фото), шрифты через `display=swap`, анимации только transform/opacity.

Адаптив: 320–1920px, проверка на отсутствие горизонтального скролла, mobile-first утилиты Tailwind.

Телефон везде: `tel:+79152799090`. Telegram: `https://t.me/techcenter15`. Маршрут: `https://yandex.ru/maps/?text=…`.

## Чеклист готовности

- [x] 5 category + 17 service + 2 make + 5 blog + home + all-services + contacts = все URL из ТЗ
- [x] Уникальные H1/Title/Description/FAQ/CTA/Form на каждой service page
- [x] Header/Footer/MobileCallBar/Chatbot на всех страницах
- [x] Тёмный фон, золотые акценты, Bebas/Oswald/Inter
- [x] JSON-LD, breadcrumbs, sitemap, robots
- [x] Никаких якорей вместо страниц, никаких объединений услуг
