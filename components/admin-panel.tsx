"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { genreLabel, leadKindLabel, type LeadKind, type ProjectGenre } from "@/lib/content";
import type { Site } from "@/lib/site";

const kinds = Object.keys(leadKindLabel) as LeadKind[];
const genres = Object.keys(genreLabel) as ProjectGenre[];
const pages = [
  { key: "prices", href: "/prices", label: "Стоимость" },
  { key: "studio", href: "/studio", label: "О студии" },
  { key: "projects", href: "/projects", label: "Проекты" },
  { key: "collab", href: "/collab", label: "Сотрудничество" },
  { key: "contacts", href: "/contacts", label: "Контакты" },
] as const;

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user: form.get("user"), pass: form.get("pass") }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    setPending(false);
    if (!response.ok || !data.ok) {
      setError(data.error || "Не вошло.");
      return;
    }
    router.refresh();
  }

  return (
    <main className="admin-gate">
      <form className="admin-card" onSubmit={onSubmit}>
        <h1>Админ</h1>
        <label>
          Логин
          <input name="user" autoComplete="username" required />
        </label>
        <label>
          Пароль
          <input name="pass" type="password" autoComplete="current-password" required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn btn-solid" type="submit" disabled={pending}>
          {pending ? "Входим" : "Войти"}
        </button>
      </form>
    </main>
  );
}

export function AdminPanel({ initial }: { initial: Site }) {
  const router = useRouter();
  const [site, setSite] = useState(initial);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function patch(next: Site) {
    setSite(next);
    setMessage("");
  }

  async function save() {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; site?: Site };
      if (!response.ok || !data.ok) throw new Error(data.error || "Не сохранилось.");
      if (data.site) setSite(data.site);
      setMessage("Сохранено. Обновите сайт, чтобы увидеть изменения.");
      router.refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="admin">
      <header className="admin-bar">
        <h1>Админ</h1>
        <div>
          <button className="btn btn-solid" type="button" onClick={save} disabled={pending}>
            {pending ? "Сохраняем" : "Сохранить"}
          </button>
          <button className="text-btn" type="button" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>
      {message ? <p className={message.startsWith("Сохранено") ? "form-ok" : "form-error"}>{message}</p> : null}

      <details open className="admin-block">
        <summary>Секции на главной</summary>
        <p className="fine">Выключите — блок исчезнет с главной. Текст внутри можно стереть, тогда он тоже не показывается.</p>
        <Toggle label="Герой" value={site.home.hero.on} onChange={(on) => patch({ ...site, home: { ...site.home, hero: { ...site.home.hero, on } } })} />
        <Field label="Заголовок героя" value={site.home.hero.title} multiline onChange={(title) => patch({ ...site, home: { ...site.home, hero: { ...site.home.hero, title } } })} />
        <Field label="Подзаголовок" value={site.home.hero.line} onChange={(line) => patch({ ...site, home: { ...site.home, hero: { ...site.home.hero, line } } })} />
        <Field label="Кнопка" value={site.home.hero.button} onChange={(button) => patch({ ...site, home: { ...site.home, hero: { ...site.home.hero, button } } })} />
        <Toggle label="Интерьер" value={site.home.rooms.on} onChange={(on) => patch({ ...site, home: { ...site.home, rooms: { ...site.home.rooms, on } } })} />
        <Field label="Заголовок интерьера" value={site.home.rooms.title} onChange={(title) => patch({ ...site, home: { ...site.home, rooms: { ...site.home.rooms, title } } })} />
        <Field label="Текст интерьера" value={site.home.rooms.lede} multiline onChange={(lede) => patch({ ...site, home: { ...site.home, rooms: { ...site.home.rooms, lede } } })} />
        <Toggle label="Услуги на главной" value={site.home.prices.on} onChange={(on) => patch({ ...site, home: { ...site.home, prices: { ...site.home.prices, on } } })} />
        <Field label="Заголовок услуг" value={site.home.prices.title} onChange={(title) => patch({ ...site, home: { ...site.home, prices: { ...site.home.prices, title } } })} />
        <Field label="Текст услуг" value={site.home.prices.lede} onChange={(lede) => patch({ ...site, home: { ...site.home, prices: { ...site.home.prices, lede } } })} />
        <Toggle label="Проекты на главной" value={site.home.projects.on} onChange={(on) => patch({ ...site, home: { ...site.home, projects: { ...site.home.projects, on } } })} />
        <Field label="Заголовок проектов" value={site.home.projects.title} onChange={(title) => patch({ ...site, home: { ...site.home, projects: { ...site.home.projects, title } } })} />
        <Field label="Текст проектов" value={site.home.projects.lede} onChange={(lede) => patch({ ...site, home: { ...site.home, projects: { ...site.home.projects, lede } } })} />
        <Toggle label="О студии на главной" value={site.home.about.on} onChange={(on) => patch({ ...site, home: { ...site.home, about: { ...site.home.about, on } } })} />
        <Field label="Заголовок о студии" value={site.home.about.title} onChange={(title) => patch({ ...site, home: { ...site.home, about: { ...site.home.about, title } } })} />
        <Toggle label="Календарь" value={site.home.calendar.on} onChange={(on) => patch({ ...site, home: { ...site.home, calendar: { ...site.home.calendar, on } } })} />
        <Field label="Заголовок календаря" value={site.home.calendar.title} onChange={(title) => patch({ ...site, home: { ...site.home, calendar: { ...site.home.calendar, title } } })} />
        <Field label="Текст календаря" value={site.home.calendar.text} multiline onChange={(text) => patch({ ...site, home: { ...site.home, calendar: { ...site.home.calendar, text } } })} />
      </details>

      <details className="admin-block">
        <summary>Страницы в меню</summary>
        {pages.map((page) => (
          <div key={page.key} className="admin-row">
            <Toggle
              label={page.label}
              value={site.pages[page.key].on}
              onChange={(on) =>
                patch({
                  ...site,
                  pages: { ...site.pages, [page.key]: { ...site.pages[page.key], on } },
                  nav: site.nav.map((item) => (item.href === page.href ? { ...item, on } : item)),
                })
              }
            />
            <Field
              label="Заголовок"
              value={site.pages[page.key].title}
              onChange={(title) => patch({ ...site, pages: { ...site.pages, [page.key]: { ...site.pages[page.key], title } } })}
            />
            <Field
              label="Текст сверху"
              value={site.pages[page.key].lede}
              multiline
              onChange={(lede) => patch({ ...site, pages: { ...site.pages, [page.key]: { ...site.pages[page.key], lede } } })}
            />
          </div>
        ))}
        <Field
          label="Примечание в прайсе"
          value={site.pages.prices.note}
          multiline
          onChange={(note) => patch({ ...site, pages: { ...site.pages, prices: { ...site.pages.prices, note } } })}
        />
        <Field
          label="Заголовок «между дублями»"
          value={site.pages.studio.comfortTitle}
          onChange={(comfortTitle) =>
            patch({ ...site, pages: { ...site.pages, studio: { ...site.pages.studio, comfortTitle } } })
          }
        />
        <Field
          label="Заголовок формы в контактах"
          value={site.pages.contacts.writeTitle}
          onChange={(writeTitle) =>
            patch({ ...site, pages: { ...site.pages, contacts: { ...site.pages.contacts, writeTitle } } })
          }
        />
        <Field
          label="Подпись формы"
          value={site.pages.contacts.writeLede}
          onChange={(writeLede) =>
            patch({ ...site, pages: { ...site.pages, contacts: { ...site.pages.contacts, writeLede } } })
          }
        />
        <Field
          label="Заметка про телефон"
          value={site.pages.contacts.phoneNote}
          multiline
          onChange={(phoneNote) =>
            patch({ ...site, pages: { ...site.pages, contacts: { ...site.pages.contacts, phoneNote } } })
          }
        />
      </details>

      <details className="admin-block">
        <summary>Студия и логотип</summary>
        <PhotoField label="Логотип" value={site.studio.logo} onChange={(logo) => patch({ ...site, studio: { ...site.studio, logo } })} />
        {(
          [
            ["name", "Название"],
            ["line", "Строка"],
            ["city", "Город"],
            ["address", "Адрес"],
            ["room", "Кабинет"],
            ["district", "Район"],
            ["telegram", "Telegram URL"],
            ["telegramHandle", "Telegram"],
            ["instagram", "Instagram"],
            ["youtube", "YouTube"],
            ["altcoin", "ALTCOIN"],
            ["hours", "Часы"],
          ] as const
        ).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={String(site.studio[key])}
            onChange={(value) => patch({ ...site, studio: { ...site.studio, [key]: value } })}
          />
        ))}
      </details>

      <details className="admin-block">
        <summary>Локации и фото</summary>
        {site.locations.map((item, index) => (
          <div className="admin-row" key={item.id}>
            <Toggle
              label={item.name || "Локация"}
              value={item.on}
              onChange={(on) => patch({ ...site, locations: site.locations.map((row, i) => (i === index ? { ...row, on } : row)) })}
            />
            <Field
              label="Название"
              value={item.name}
              onChange={(name) => patch({ ...site, locations: site.locations.map((row, i) => (i === index ? { ...row, name } : row)) })}
            />
            <Field
              label="Гости"
              value={item.guests}
              onChange={(guests) => patch({ ...site, locations: site.locations.map((row, i) => (i === index ? { ...row, guests } : row)) })}
            />
            <Field
              label="Камеры"
              value={item.cameras}
              onChange={(cameras) => patch({ ...site, locations: site.locations.map((row, i) => (i === index ? { ...row, cameras } : row)) })}
            />
            <Field
              label="Описание"
              value={item.text}
              multiline
              onChange={(text) => patch({ ...site, locations: site.locations.map((row, i) => (i === index ? { ...row, text } : row)) })}
            />
            <PhotoField
              label="Фото"
              value={item.photo}
              onChange={(photo) => patch({ ...site, locations: site.locations.map((row, i) => (i === index ? { ...row, photo } : row)) })}
            />
            <button className="text-btn" type="button" onClick={() => patch({ ...site, locations: site.locations.filter((_, i) => i !== index) })}>
              Удалить локацию
            </button>
          </div>
        ))}
        <button
          className="btn"
          type="button"
          onClick={() =>
            patch({
              ...site,
              locations: [
                ...site.locations,
                { id: `room-${Date.now()}`, name: "Новая", guests: "", cameras: "", text: "", photo: "", on: true },
              ],
            })
          }
        >
          Добавить локацию
        </button>
      </details>

      <details className="admin-block">
        <summary>Цены</summary>
        <Field label="От" value={site.prices.from} onChange={(from) => patch({ ...site, prices: { ...site.prices, from } })} />
        <Field label="Единица" value={site.prices.unit} onChange={(unit) => patch({ ...site, prices: { ...site.prices, unit } })} />
        {site.prices.groups.map((group, g) => (
          <div className="admin-row" key={`g-${g}`}>
            <Field
              label="Группа"
              value={group.title}
              onChange={(title) =>
                patch({
                  ...site,
                  prices: {
                    ...site.prices,
                    groups: site.prices.groups.map((row, i) => (i === g ? { ...row, title } : row)),
                  },
                })
              }
            />
            {group.rows.map((row, r) => (
              <div className="admin-triple" key={`${g}-${r}`}>
                <Field
                  label="Позиция"
                  value={row.name}
                  onChange={(name) => patch({ ...site, prices: { ...site.prices, groups: editRow(site.prices.groups, g, r, { ...row, name }) } })}
                />
                <Field
                  label="Ед."
                  value={row.unit}
                  onChange={(unit) => patch({ ...site, prices: { ...site.prices, groups: editRow(site.prices.groups, g, r, { ...row, unit }) } })}
                />
                <Field
                  label="BYN"
                  value={row.price}
                  onChange={(price) => patch({ ...site, prices: { ...site.prices, groups: editRow(site.prices.groups, g, r, { ...row, price }) } })}
                />
                <button
                  className="text-btn"
                  type="button"
                  onClick={() =>
                    patch({
                      ...site,
                      prices: {
                        ...site.prices,
                        groups: site.prices.groups.map((item, i) =>
                          i === g ? { ...item, rows: item.rows.filter((_, j) => j !== r) } : item,
                        ),
                      },
                    })
                  }
                >
                  Удалить
                </button>
              </div>
            ))}
            <button
              className="btn"
              type="button"
              onClick={() =>
                patch({
                  ...site,
                  prices: {
                    ...site.prices,
                    groups: site.prices.groups.map((item, i) =>
                      i === g ? { ...item, rows: [...item.rows, { name: "", unit: "час", price: "" }] } : item,
                    ),
                  },
                })
              }
            >
              Строка в группу
            </button>
            <button
              className="text-btn"
              type="button"
              onClick={() => patch({ ...site, prices: { ...site.prices, groups: site.prices.groups.filter((_, i) => i !== g) } })}
            >
              Удалить группу
            </button>
          </div>
        ))}
        <button
          className="btn"
          type="button"
          onClick={() => patch({ ...site, prices: { ...site.prices, groups: [...site.prices.groups, { title: "Новая группа", rows: [] }] } })}
        >
          Добавить группу
        </button>
      </details>

      <ListBlock
        title="Оборудование"
        items={site.gear}
        onChange={(gear) => patch({ ...site, gear })}
        empty={{ title: "", text: "", on: true }}
        fields={["title", "text"]}
      />
      <ListBlock
        title="Комфорт"
        items={site.comfort}
        onChange={(comfort) => patch({ ...site, comfort })}
        empty={{ text: "", on: true }}
        fields={["text"]}
      />

      <details className="admin-block">
        <summary>Проекты</summary>
        {site.projects.map((item, index) => (
          <div className="admin-row" key={`${item.youtubeId}-${index}`}>
            <Toggle
              label={item.title || "Выпуск"}
              value={item.on}
              onChange={(on) => patch({ ...site, projects: site.projects.map((row, i) => (i === index ? { ...row, on } : row)) })}
            />
            <Field
              label="YouTube id"
              value={item.youtubeId}
              onChange={(youtubeId) => patch({ ...site, projects: site.projects.map((row, i) => (i === index ? { ...row, youtubeId } : row)) })}
            />
            <Field
              label="Название"
              value={item.title}
              onChange={(title) => patch({ ...site, projects: site.projects.map((row, i) => (i === index ? { ...row, title } : row)) })}
            />
            <label>
              Жанр
              <select
                value={item.genre}
                onChange={(event) =>
                  patch({
                    ...site,
                    projects: site.projects.map((row, i) => (i === index ? { ...row, genre: event.target.value as ProjectGenre } : row)),
                  })
                }
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genreLabel[genre]}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Канал"
              value={item.channel}
              onChange={(channel) => patch({ ...site, projects: site.projects.map((row, i) => (i === index ? { ...row, channel } : row)) })}
            />
            <button className="text-btn" type="button" onClick={() => patch({ ...site, projects: site.projects.filter((_, i) => i !== index) })}>
              Удалить выпуск
            </button>
          </div>
        ))}
        <button
          className="btn"
          type="button"
          onClick={() =>
            patch({
              ...site,
              projects: [...site.projects, { youtubeId: "", title: "", genre: "business", channel: "BYKA", on: true }],
            })
          }
        >
          Добавить выпуск
        </button>
      </details>

      <details className="admin-block">
        <summary>Сотрудничество</summary>
        {site.collab.map((item, index) => (
          <div className="admin-row" key={`${item.kind}-${index}`}>
            <Toggle
              label={item.title || "Формат"}
              value={item.on}
              onChange={(on) => patch({ ...site, collab: site.collab.map((row, i) => (i === index ? { ...row, on } : row)) })}
            />
            <label>
              Тип заявки
              <select
                value={item.kind}
                onChange={(event) =>
                  patch({
                    ...site,
                    collab: site.collab.map((row, i) => (i === index ? { ...row, kind: event.target.value as LeadKind } : row)),
                  })
                }
              >
                {kinds.map((kind) => (
                  <option key={kind} value={kind}>
                    {leadKindLabel[kind]}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Название"
              value={item.title}
              onChange={(title) => patch({ ...site, collab: site.collab.map((row, i) => (i === index ? { ...row, title } : row)) })}
            />
            <Field
              label="Текст"
              value={item.text}
              multiline
              onChange={(text) => patch({ ...site, collab: site.collab.map((row, i) => (i === index ? { ...row, text } : row)) })}
            />
            <button className="text-btn" type="button" onClick={() => patch({ ...site, collab: site.collab.filter((_, i) => i !== index) })}>
              Удалить
            </button>
          </div>
        ))}
        <button
          className="btn"
          type="button"
          onClick={() => patch({ ...site, collab: [...site.collab, { kind: "ads", title: "", text: "", on: true }] })}
        >
          Добавить формат
        </button>
      </details>

      <ListBlock
        title="FAQ"
        items={site.faq}
        onChange={(faq) => patch({ ...site, faq })}
        empty={{ q: "", a: "", on: true }}
        fields={["q", "a"]}
      />
      <ListBlock
        title="Как добраться"
        items={site.route}
        onChange={(route) => patch({ ...site, route })}
        empty={{ text: "", on: true }}
        fields={["text"]}
      />
    </main>
  );
}

function editRow(
  groups: Site["prices"]["groups"],
  g: number,
  r: number,
  row: Site["prices"]["groups"][number]["rows"][number],
) {
  return groups.map((group, i) =>
    i === g ? { ...group, rows: group.rows.map((item, j) => (j === r ? row : item)) } : group,
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label>
      {label}
      {multiline ? (
        <textarea value={value} rows={3} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function PhotoField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/photo", { method: "POST", body });
    const data = (await response.json()) as { ok?: boolean; url?: string; error?: string };
    if (!response.ok || !data.url) {
      setError(data.error || "Фото не загрузилось.");
      return;
    }
    onChange(data.url);
  }

  return (
    <div className="admin-photo">
      <Field label={`${label} (ссылка)`} value={value} onChange={onChange} />
      <label>
        Заменить файл
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(event.target.files?.[0])} />
      </label>
      {value ? <img src={value} alt="" /> : null}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}

function ListBlock<T extends { on: boolean } & Record<string, string | boolean>>({
  title,
  items,
  onChange,
  empty,
  fields,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  fields: (keyof T & string)[];
}) {
  return (
    <details className="admin-block">
      <summary>{title}</summary>
      {items.map((item, index) => (
        <div className="admin-row" key={`${title}-${index}`}>
          <Toggle label="Показывать" value={item.on} onChange={(on) => onChange(items.map((row, i) => (i === index ? { ...row, on } : row)))} />
          {fields.map((field) => (
            <Field
              key={field}
              label={field}
              value={String(item[field] ?? "")}
              multiline={field === "text" || field === "a"}
              onChange={(value) => onChange(items.map((row, i) => (i === index ? { ...row, [field]: value } : row)))}
            />
          ))}
          <button className="text-btn" type="button" onClick={() => onChange(items.filter((_, i) => i !== index))}>
            Удалить
          </button>
        </div>
      ))}
      <button className="btn" type="button" onClick={() => onChange([...items, { ...empty }])}>
        Добавить
      </button>
    </details>
  );
}
