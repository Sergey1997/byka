"use client";

import { useEffect, useState } from "react";
import { live } from "@/lib/site";
import { useBook } from "./book";
import { useSite } from "./site";

type Slot = { time: string; free: boolean };

function minskDate(offsetDays: number) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Minsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [year, month, day] = parts.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + offsetDays));
  return utc.toISOString().slice(0, 10);
}

export function Availability() {
  const site = useSite();
  const rooms = live(site.locations);
  const { open } = useBook();
  const [location, setLocation] = useState(rooms[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [source, setSource] = useState<"supabase" | "open" | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    setDate(minskDate(1));
  }, []);

  useEffect(() => {
    if (!date || !location) return;
    const controller = new AbortController();
    setError("");
    fetch(`/api/availability?location=${location}&date=${date}`, { signal: controller.signal })
      .then(async (response) => {
        const data = (await response.json()) as {
          ok: boolean;
          slots?: Slot[];
          source?: "supabase" | "open";
          error?: string;
        };
        if (!response.ok || !data.ok || !data.slots) {
          setError(data.error || "Календарь не открылся.");
          return;
        }
        setSlots(data.slots);
        setSource(data.source ?? "open");
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError("Календарь не открылся.");
      });
    return () => controller.abort();
  }, [location, date]);

  return (
    <section className="availability" id="slots">
      <div className="availability-copy">
        <p className="index">Календарь</p>
        {site.home.calendar.title ? <h2>{site.home.calendar.title}</h2> : null}
        {site.home.calendar.text ? <p>{site.home.calendar.text}</p> : null}
        <p className="fine">
          {source === "supabase"
            ? "Занятые часы читаем из базы."
            : "Пока база слотов не подключена, показываем всё рабочее окно как свободное."}
        </p>
      </div>
      <div>
        <div className="lead-row">
          <label>
            Локация
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              {rooms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Дата
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="slot-grid" aria-live="polite">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              className={slot.free ? "slot free" : "slot taken"}
              disabled={!slot.free}
              onClick={() =>
                open({
                  kind: "booking",
                  location,
                  date,
                  time: slot.time,
                  topic: rooms.find((item) => item.id === location)?.name,
                })
              }
            >
              <span>{slot.time}</span>
              <small>{slot.free ? "свободно" : "занято"}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
