# Tech Center 15

Премиальный автосервис на Каширском шоссе — SEO-система посадочных страниц.

## Архитектура

Все страницы услуг и марок генерируются из `src/data/services.ts` (single source of truth).

- `/` — главная
- `/services`, `/services/:category`, `/services/:category/:service` — услуги
- `/makes`, `/makes/:slug` — марки авто (32 марки)
- `/blog`, `/blog/:slug` — блог
- `/contacts` — контакты

## Утилиты

- `src/utils/utm.ts` — сохранение и получение UTM-меток
- `src/utils/analytics.ts` — отправка событий в `window.dataLayer`
- `src/utils/leadSubmit.ts` — отправка лидов в CRM (см. `src/config/integrations.ts`)
- `src/utils/seoValidation.ts` — проверка title/description/h1/slug/FAQ в dev-режиме

## Lighthouse — целевые метрики

```bash
npx lighthouse https://your-preview-url --view
```

Цели:
- Performance: 90+
- SEO: 95+
- Accessibility: 90+
- Best Practices: 90+
- LCP < 2.5s · CLS < 0.1 · INP < 200ms

Реализовано: route-based code splitting (`React.lazy`), lazy-loaded карты и iframe, валидация SEO-данных в dev, JSON-LD (LocalBusiness, Service, FAQPage, BreadcrumbList, CollectionPage, ItemList) на всех ключевых маршрутах.

## CRM / лиды

Заполните `src/config/integrations.ts`:

```ts
export const INTEGRATIONS = {
  crmWebhookUrl: "https://...", // POST JSON
};
```

Если URL пустой — форма работает в режиме «prepared» и подсказывает позвонить или написать в Telegram.
