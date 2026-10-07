"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import {
  leadKindLabel,
  locations,
  slotTimes,
  studio,
  type LeadKind,
  type LocationId,
} from "@/lib/content";

export type Draft = {
  kind?: LeadKind;
  location?: LocationId | "";
  date?: string;
  time?: string;
  topic?: string;
};

type OpenDraft = Draft & { token: number };

type BookApi = {
  draft: OpenDraft | null;
  open: (draft?: Draft) => void;
  close: () => void;
};

const BookContext = createContext<BookApi | null>(null);

export function useBook() {
  const value = useContext(BookContext);
  if (!value) throw new Error("BookProvider missing");
  return value;
}

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OpenDraft | null>(null);
  return (
    <BookContext.Provider
      value={{
        draft,
        open: (next = { kind: "booking" }) => setDraft({ ...next, token: Date.now() }),
        close: () => setDraft(null),
      }}
    >
      {children}
      <BookDialog />
    </BookContext.Provider>
  );
}

export function BookButton({
  children,
  draft,
  className,
}: {
  children: React.ReactNode;
  draft?: Draft;
  className?: string;
}) {
  const { open } = useBook();
  return (
    <button type="button" className={className ?? "btn btn-yellow"} onClick={() => open(draft)}>
      {children}
    </button>
  );
}

function BookDialog() {
  const { draft, close } = useBook();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (draft && !node.open) node.showModal();
    if (!draft && node.open) node.close();
  }, [draft]);

  return (
    <dialog
      ref={ref}
      className="sheet-dialog"
      onClose={close}
      aria-labelledby="book-title"
    >
      <div className="sheet-dialog-bar">
        <p id="book-title">{draft?.kind ? leadKindLabel[draft.kind] : "Заявка"}</p>
        <button type="button" className="text-btn" onClick={close}>
          Закрыть
        </button>
      </div>
      {draft ? <LeadForm key={draft.token} preset={draft} /> : null}
    </dialog>
  );
}

export function LeadForm({ preset }: { preset: Draft }) {
  const baseId = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDone("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload = {
        ...Object.fromEntries(form.entries()),
        page: window.location.pathname,
      };
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        stored?: boolean;
        telegram?: boolean;
      };
      if (!response.ok || !data.ok) {
        setError(data.error || "Не отправилось.");
        return;
      }
      if (data.telegram && data.stored) {
        setDone("Заявка в Telegram и в базе. Ответим туда же.");
      } else if (data.telegram) {
        setDone("Заявка ушла в Telegram. Ответим там.");
      } else {
        setDone("Заявку записали. Если ответа нет день — напишите в Telegram.");
      }
      event.currentTarget.reset();
    } catch {
      setError("Сеть не ответила. Напишите в Telegram.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="lead" onSubmit={onSubmit}>
      <input type="hidden" name="kind" value={preset.kind ?? "booking"} />
      <label className="hp">
        Компания
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <label>
        Имя
        <input name="name" required minLength={2} maxLength={80} autoComplete="name" />
      </label>
      <div className="lead-row">
        <label>
          Телефон
          <input name="phone" inputMode="tel" autoComplete="tel" placeholder="+375" maxLength={32} />
        </label>
        <label>
          Telegram
          <input name="telegram" placeholder="@username" maxLength={64} />
        </label>
      </div>
      <div className="lead-row">
        <label>
          Локация
          <select name="location" defaultValue={preset.location ?? ""}>
            <option value="">Не выбрана</option>
            {locations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.index} {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Дата
          <input type="date" name="date" defaultValue={preset.date ?? ""} />
        </label>
        <label>
          Время
          <select name="time" defaultValue={preset.time ?? ""}>
            <option value="">Любое</option>
            {slotTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Тема
        <input name="topic" defaultValue={preset.topic ?? ""} maxLength={120} id={`${baseId}-topic`} />
      </label>
      <label>
        Сообщение
        <textarea name="message" rows={4} maxLength={2000} />
      </label>
      <p className="fine">Телефон или Telegram — одно из двух обязательно. Слот подтверждаем ответом, календарь сам его не держит.</p>
      {error ? (
        <p className="form-error" role="alert">
          {error}{" "}
          <a href={studio.telegram}>Написать {studio.telegramHandle}</a>
        </p>
      ) : null}
      {done ? <p className="form-ok">{done}</p> : null}
      <button className="btn btn-black" type="submit" disabled={pending}>
        {pending ? "Отправляем" : "Отправить заявку"}
      </button>
    </form>
  );
}

export function MinskClock() {
  const [value, setValue] = useState("");
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("ru-BY", {
        timeZone: "Europe/Minsk",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date());
    setValue(format());
    const id = window.setInterval(() => setValue(format()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="clock">{value || "––:––:––"}</span>;
}
