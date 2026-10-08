"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { leadKindLabel, type LeadKind, type LocationId } from "@/lib/content";
import { live } from "@/lib/site";
import { useSite } from "./site";

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
    <button type="button" className={className ?? "btn"} onClick={() => open(draft)}>
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

async function postBook(payload: Record<string, string>) {
  const response = await fetch("/api/book", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (response.ok) return { ok: true as const };
  return { ok: false as const, error: data.error };
}

export function LeadForm({ preset }: { preset: Draft }) {
  const site = useSite();
  const rooms = live(site.locations);
  const baseId = useId();
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const busy = useRef(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setNote(null);
    setPending(true);
    const node = event.currentTarget;
    const payload = Object.fromEntries(new FormData(node).entries()) as Record<string, string>;
    payload.page = window.location.pathname;
    try {
      const data = await postBook(payload);
      if (!data.ok) {
        setNote({
          ok: false,
          text: data.error || "Не получилось отправить. Попробуйте ещё раз.",
        });
        return;
      }
      setNote({ ok: true, text: "Заявка отправлена. Мы ответим вам сами." });
      node.reset();
    } catch {
      setNote({
        ok: false,
        text: "Не получилось отправить. Попробуйте ещё раз.",
      });
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <form className="lead" onSubmit={onSubmit}>
      <input type="hidden" name="kind" value={preset.kind ?? "booking"} />
      <label className="hp">
        Сайт
        <input name="hp_field" tabIndex={-1} autoComplete="off" />
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
      <label>
        Локация
        <select name="location" defaultValue={preset.location ?? ""}>
          <option value="">Не выбрана</option>
          {rooms.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Тема
        <input name="topic" defaultValue={preset.topic ?? ""} maxLength={120} id={`${baseId}-topic`} />
      </label>
      <label>
        Сообщение
        <textarea name="message" rows={4} maxLength={2000} />
      </label>
      <p className="fine">Телефон или Telegram — одно из двух обязательно.</p>
      {note ? (
        <p className={note.ok ? "form-ok" : "form-error"} role={note.ok ? "status" : "alert"}>
          {note.text.split(site.studio.telegramHandle).map((part, index) =>
            index === 0 ? (
              part
            ) : (
              <span key={`${part}-${index}`}>
                <a href={site.studio.telegram}>{site.studio.telegramHandle}</a>
                {part}
              </span>
            ),
          )}
        </p>
      ) : null}
      <button className="btn btn-solid" type="submit" disabled={pending}>
        {pending ? "Отправляем" : "Отправить заявку"}
      </button>
    </form>
  );
}
