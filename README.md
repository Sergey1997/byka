# BYKA

Сайт студии записи подкастов в Минске: Чернышевского 10а, кабинет 504.

## Локально

```bash
npm install
npm run dev
```

Сайт откроется на [http://localhost:3000](http://localhost:3000).

Заявки уходят в Telegram и в Supabase, если заданы переменные из `.env.example`. Без них форма честно ответит, что отправить некуда, и оставит ссылку на [@byka_kropka_by](https://t.me/byka_kropka_by).

## База

SQL лежит в `supabase/migrations/20261007133000_leads.sql`. Таблицы `leads` и `slot_blocks` закрыты от анонимного ключа: пишет только сервер с `SUPABASE_SERVICE_ROLE_KEY`.

Занятый час добавляется строкой в `slot_blocks` (`location`, `slot_date`, `slot_time`). Локации: `razgovor`, `stol`, `noch`.

## Проверка

```bash
npm test
npm run build
```
