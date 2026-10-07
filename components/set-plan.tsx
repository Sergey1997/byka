import type { LocationId } from "@/lib/content";

const labels: Record<LocationId, string> = {
  razgovor: "Схема сетапа «Разговор»: два кресла, камера спереди и сбоку",
  stol: "Схема сетапа «Стол»: стол на четверых, экран и три камеры",
  noch: "Схема сетапа «Ночь»: тёмный фон и боковой свет",
};

export function SetPlan({ id }: { id: LocationId }) {
  return (
    <svg className="plan" viewBox="0 0 360 220" role="img" aria-label={labels[id]}>
      <rect x="10" y="10" width="340" height="200" fill={id === "noch" ? "#141414" : "#f6f1e4"} stroke="currentColor" strokeWidth="2" />
      <text x="22" y="32" fill="currentColor" fontSize="12">
        каб. 504
      </text>
      {id === "razgovor" ? <Talk /> : null}
      {id === "stol" ? <Table /> : null}
      {id === "noch" ? <Night /> : null}
    </svg>
  );
}

function Cam({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="28" height="16" fill="#ffd000" stroke="#111" />
      <polygon points="28,3 40,0 40,16 28,13" fill="#111" />
      <text x="0" y="30" fontSize="11" fill="currentColor">
        {label}
      </text>
    </g>
  );
}

function Talk() {
  return (
    <g fill="none" stroke="#111" strokeWidth="2">
      <rect x="150" y="78" width="36" height="48" fill="#ffd000" />
      <rect x="210" y="78" width="36" height="48" fill="#ffd000" />
      <path d="M168 78 v-16 h-8" />
      <path d="M228 78 v-16 h8" />
      <Cam x={70} y={92} label="фронт" />
      <Cam x={300} y={120} label="бок" />
    </g>
  );
}

function Table() {
  return (
    <g fill="none" stroke="#111" strokeWidth="2">
      <rect x="90" y="80" width="180" height="48" fill="#efe7d6" />
      <rect x="250" y="28" width="70" height="40" fill="#111" />
      <text x="258" y="52" fill="#ffd000" stroke="none" fontSize="11">
        логотип
      </text>
      <Cam x={24} y={96} label="фронт" />
      <Cam x={150} y={156} label="центр" />
      <Cam x={300} y={96} label="бок" />
    </g>
  );
}

function Night() {
  return (
    <g>
      <ellipse cx="180" cy="110" rx="70" ry="46" fill="#ffd000" opacity="0.9" />
      <rect x="162" y="88" width="36" height="48" fill="#111" />
      <Cam x={40} y={120} label="бок" />
      <text x="250" y="180" fill="#ffd000" fontSize="12">
        ключ Amaran
      </text>
    </g>
  );
}
