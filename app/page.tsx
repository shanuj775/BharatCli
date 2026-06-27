"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Bookmark,
  BrainCircuit,
  ChevronDown,
  CloudRain,
  Command,
  Download,
  Droplets,
  Expand,
  Flame,
  Gauge,
  Globe2,
  Layers3,
  Leaf,
  LocateFixed,
  MapPin,
  Moon,
  Radio,
  RefreshCcw,
  Satellite,
  Search,
  Share2,
  ShieldAlert,
  SlidersHorizontal,
  Sun,
  Thermometer,
  Waves,
  Wind,
  Zap
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";

const layers = ["Temperature", "Rainfall", "Wind", "AQI", "Flood", "Cyclone", "Wildfire", "Soil Moisture", "Reservoirs"];
const timeline = ["Today", "Tomorrow", "3 Days", "7 Days", "30 Days"];

const states = ["India", "Maharashtra", "Tamil Nadu", "Odisha", "Assam", "Gujarat", "Delhi NCR", "Kerala"];
const districts = ["All Districts", "Mumbai", "Chennai", "Bhubaneswar", "Guwahati", "Ahmedabad", "New Delhi", "Kochi"];

const chartData = [
  { t: "00", temp: 28, rain: 22, aqi: 92, flood: 18, cyclone: 20, reservoir: 73, energy: 61, carbon: 48, crop: 82 },
  { t: "04", temp: 27, rain: 34, aqi: 88, flood: 21, cyclone: 24, reservoir: 74, energy: 58, carbon: 50, crop: 80 },
  { t: "08", temp: 31, rain: 45, aqi: 110, flood: 33, cyclone: 29, reservoir: 75, energy: 68, carbon: 56, crop: 78 },
  { t: "12", temp: 35, rain: 68, aqi: 126, flood: 48, cyclone: 41, reservoir: 77, energy: 79, carbon: 62, crop: 74 },
  { t: "16", temp: 36, rain: 72, aqi: 118, flood: 53, cyclone: 47, reservoir: 79, energy: 84, carbon: 66, crop: 72 },
  { t: "20", temp: 32, rain: 51, aqi: 104, flood: 39, cyclone: 34, reservoir: 78, energy: 71, carbon: 59, crop: 76 }
];

const kpis = [
  { name: "Predicted Rainfall", value: "186 mm", delta: "+18%", confidence: 94, status: "Watch", icon: CloudRain, color: "#00E5FF" },
  { name: "Temperature", value: "34.2 C", delta: "+2.1 C", confidence: 91, status: "High", icon: Thermometer, color: "#FF9F1C" },
  { name: "Humidity", value: "78%", delta: "+6%", confidence: 89, status: "Stable", icon: Droplets, color: "#00D084" },
  { name: "Wind Speed", value: "42 km/h", delta: "+11%", confidence: 87, status: "Gusts", icon: Wind, color: "#8B5CF6" },
  { name: "PM2.5", value: "86 ug/m3", delta: "-4%", confidence: 82, status: "Poor", icon: Activity, color: "#FFD60A" },
  { name: "Flood Risk", value: "63%", delta: "+21%", confidence: 93, status: "Alert", icon: Waves, color: "#FF4D4F" },
  { name: "Heatwave Index", value: "7.8", delta: "+0.8", confidence: 90, status: "Severe", icon: Sun, color: "#FF9F1C" },
  { name: "Cyclone Alert", value: "Cat 2", delta: "+1", confidence: 78, status: "Track", icon: Radio, color: "#00E5FF" },
  { name: "Reservoir Capacity", value: "74%", delta: "+3%", confidence: 96, status: "Normal", icon: Gauge, color: "#00D084" },
  { name: "Soil Moisture", value: "41%", delta: "-9%", confidence: 84, status: "Dry", icon: Leaf, color: "#FFD60A" },
  { name: "Crop Stress", value: "Moderate", delta: "+12%", confidence: 86, status: "Observe", icon: ShieldAlert, color: "#FF9F1C" },
  { name: "Energy Demand", value: "171 GW", delta: "+7%", confidence: 88, status: "Peak", icon: Zap, color: "#8B5CF6" },
  { name: "Lightning Risk", value: "High", delta: "+16%", confidence: 83, status: "Warning", icon: AlertTriangle, color: "#FF4D4F" }
];

const alerts = [
  { title: "Flood Warning", place: "Brahmaputra basin", severity: "Red", time: "08:42 UTC", icon: Waves },
  { title: "Cyclone Warning", place: "Bay of Bengal track", severity: "Orange", time: "08:35 UTC", icon: Radio },
  { title: "Heatwave Alert", place: "Delhi NCR", severity: "Orange", time: "08:18 UTC", icon: Sun },
  { title: "Air Quality Alert", place: "Indo-Gangetic plain", severity: "Yellow", time: "07:55 UTC", icon: Activity },
  { title: "Wildfire Alert", place: "Uttarakhand ridge", severity: "Red", time: "07:41 UTC", icon: Flame },
  { title: "Heavy Rain Alert", place: "Konkan coast", severity: "Orange", time: "07:20 UTC", icon: CloudRain }
];

const cities = [
  { name: "Mumbai", x: "20.8%", y: "56.4%", temp: "31 C", rain: "211 mm", aqi: 74 },
  { name: "Delhi", x: "33.6%", y: "24.3%", temp: "39 C", rain: "18 mm", aqi: 168 },
  { name: "Chennai", x: "43.2%", y: "76.4%", temp: "34 C", rain: "94 mm", aqi: 82 },
  { name: "Kolkata", x: "67.8%", y: "44.8%", temp: "33 C", rain: "156 mm", aqi: 109 },
  { name: "Guwahati", x: "78.0%", y: "32.9%", temp: "29 C", rain: "228 mm", aqi: 58 },
  { name: "Ahmedabad", x: "19.9%", y: "43.3%", temp: "38 C", rain: "27 mm", aqi: 121 }
];

type GeoPoint = [number, number];

const indiaOutline: GeoPoint[] = [
  [68.1, 23.6], [68.6, 24.6], [69.7, 24.2], [70.6, 24.8], [71.7, 24.5], [72.8, 25.3], [73.8, 24.7],
  [74.7, 26.1], [74.1, 27.2], [74.9, 29.2], [73.9, 30.7], [74.8, 31.7], [76.0, 32.2], [77.1, 32.9],
  [78.4, 34.0], [79.5, 33.2], [80.6, 32.5], [80.4, 31.1], [81.2, 30.1], [82.1, 30.4], [83.8, 28.9],
  [85.2, 28.3], [86.6, 27.9], [88.1, 27.9], [88.9, 26.8], [90.5, 26.8], [91.9, 27.7], [93.5, 27.6],
  [95.2, 27.0], [96.3, 28.0], [97.3, 27.1], [96.8, 25.8], [95.6, 24.8], [94.8, 23.8], [93.6, 24.2],
  [92.8, 23.5], [92.2, 22.2], [91.1, 22.1], [90.2, 21.7], [89.1, 22.0], [88.1, 21.6], [87.8, 20.7],
  [86.8, 20.0], [86.0, 19.1], [85.1, 19.2], [84.0, 18.3], [83.0, 17.6], [82.2, 16.6], [81.2, 16.2],
  [80.2, 15.6], [80.0, 14.5], [79.3, 13.5], [79.9, 12.4], [79.3, 11.2], [78.3, 10.4], [77.2, 8.4],
  [76.3, 8.2], [75.5, 9.6], [74.8, 11.0], [74.2, 12.4], [73.7, 14.0], [73.2, 15.2], [72.9, 16.8],
  [72.6, 18.1], [72.9, 19.1], [72.6, 20.3], [71.8, 21.0], [70.8, 21.4], [69.7, 22.1], [68.6, 22.8]
];

const stateLines: GeoPoint[][] = [
  [[69.4, 23.3], [72.7, 23.2], [75.4, 24.0], [78.6, 24.2], [81.0, 23.7], [84.0, 24.1], [88.5, 24.0]],
  [[72.5, 20.6], [75.2, 21.1], [78.8, 20.5], [82.2, 20.0], [86.1, 20.1]],
  [[74.0, 16.0], [76.4, 16.8], [79.1, 16.0], [81.6, 16.5]],
  [[76.8, 31.5], [77.4, 28.7], [77.0, 26.1], [77.4, 23.4], [77.8, 20.9], [77.7, 18.0], [77.4, 14.0], [76.8, 10.2]],
  [[88.2, 26.3], [90.7, 25.6], [93.2, 25.4], [95.6, 26.2]],
  [[88.3, 22.7], [90.1, 24.1], [91.5, 26.4]]
];

const riverLines: GeoPoint[][] = [
  [[77.8, 30.9], [78.5, 29.4], [79.8, 28.3], [81.0, 26.8], [83.0, 25.4], [85.2, 25.1], [87.2, 24.0], [88.4, 22.7]],
  [[73.8, 22.5], [75.5, 21.8], [77.5, 21.1], [79.6, 20.7], [81.9, 20.1], [84.6, 19.4]],
  [[75.6, 18.7], [77.2, 17.7], [79.2, 16.5], [81.0, 16.1]],
  [[91.6, 27.4], [92.8, 26.6], [94.1, 26.2], [95.2, 25.8]]
];

const islandPoints: GeoPoint[] = [
  [72.6, 10.6], [72.8, 11.2], [73.0, 10.1], [92.8, 13.3], [92.9, 12.2], [93.0, 11.1], [93.3, 9.5], [93.8, 7.4]
];

type City = (typeof cities)[number];

function useClock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const update = () => setNow(new Date().toUTCString().slice(17, 25));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Home() {
  const [activeLayer, setActiveLayer] = useState("Rainfall");
  const [activeTime, setActiveTime] = useState("Today");
  const [selectedCity, setSelectedCity] = useState<City | null>(cities[0]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const clock = useClock();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const risk = useMemo(() => (activeLayer === "Cyclone" ? 78 : activeLayer === "Flood" ? 72 : activeLayer === "AQI" ? 66 : 59), [activeLayer]);

  const runSimulation = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 1600);
  };

  return (
    <main className={cls("min-h-screen bg-obsidian text-slate-100", highContrast && "contrast-more", reducedMotion && "motion-reduce-all")}>
      <Navigation clock={clock} live={live} setLive={setLive} highContrast={highContrast} setHighContrast={setHighContrast} />

      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5 px-4 pb-8 pt-4 xl:px-6">
        <section className="grid gap-5 2xl:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            <HeroMap
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
              activeTime={activeTime}
              setActiveTime={setActiveTime}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              reducedMotion={reducedMotion}
            />
            <KpiGrid />
          </div>
          <aside className="space-y-5">
            <Copilot risk={risk} running={running} activeLayer={activeLayer} />
            <Simulator runSimulation={runSimulation} running={running} />
          </aside>
        </section>

        <section className="grid gap-5 xl:grid-cols-[380px_1fr_360px]">
          <RiskDashboard risk={risk} />
          <Analytics activeLayer={activeLayer} running={running} />
          <AlertsCenter />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <DigitalTwin activeLayer={activeLayer} />
          <CityDrawer city={selectedCity} />
        </section>
      </div>

      <FloatingActions setCommandOpen={setCommandOpen} setReducedMotion={setReducedMotion} reducedMotion={reducedMotion} />
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} setActiveLayer={setActiveLayer} />
    </main>
  );
}

function Navigation({
  clock,
  live,
  setLive,
  highContrast,
  setHighContrast
}: {
  clock: string;
  live: boolean;
  setLive: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
}) {
  return (
    <nav className="sticky top-0 z-40 border-b border-cyan/10 bg-[#070B14]/85 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1800px] items-center gap-3">
        <div className="flex min-w-fit items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan/30 bg-cyan/10 shadow-glow">
            <Satellite className="h-5 w-5 text-cyan" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-[0.26em] text-white md:text-base">BHARAT CLIMATE TWIN</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">National climate intelligence grid</p>
          </div>
          <span className="rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-1 text-xs font-semibold text-emerald">v2.0 AI</span>
        </div>

        <div className="hidden flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 lg:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input aria-label="Global search" className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" placeholder="Search city, basin, asset, alert, model run..." />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">Ctrl K</kbd>
        </div>

        <Selector label="State" value={states[0]} options={states} />
        <Selector label="District" value={districts[0]} options={districts} />

        <button onClick={() => setLive(!live)} className="hidden items-center gap-2 rounded-xl border border-emerald/25 bg-emerald/10 px-3 py-2 text-xs font-semibold text-emerald md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
          {live ? "LIVE ML" : "OFFLINE ML"}
        </button>
        <div className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs text-slate-300 sm:block">UTC {clock}</div>
        <IconButton label="Notifications"><Bell className="h-4 w-4" /></IconButton>
        <button aria-label="Toggle high contrast" onClick={() => setHighContrast(!highContrast)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan/40 hover:text-cyan">
          <Moon className="h-4 w-4" />
        </button>
        <div className="h-10 w-10 rounded-full border border-cyan/30 bg-gradient-to-br from-cyan/40 via-violet/40 to-emerald/30" />
      </div>
    </nav>
  );
}

function Selector({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <label className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400 xl:flex">
      {label}
      <select aria-label={label} defaultValue={value} className="bg-transparent text-sm font-medium text-slate-100 outline-none">
        {options.map((option) => (
          <option className="bg-panel text-slate-100" key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="h-3.5 w-3.5" />
    </label>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan/40 hover:text-cyan">
      {children}
    </button>
  );
}

function HeroMap({
  activeLayer,
  setActiveLayer,
  activeTime,
  setActiveTime,
  selectedCity,
  setSelectedCity,
  reducedMotion
}: {
  activeLayer: string;
  setActiveLayer: (layer: string) => void;
  activeTime: string;
  setActiveTime: (time: string) => void;
  selectedCity: City | null;
  setSelectedCity: (city: City) => void;
  reducedMotion: boolean;
}) {
  return (
    <Panel className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan">Mission map</p>
          <h2 className="mt-1 text-2xl font-semibold text-white md:text-3xl">Interactive India Climate Operations Layer</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <IconButton label="Locate"><LocateFixed className="h-4 w-4" /></IconButton>
          <IconButton label="Layers"><Layers3 className="h-4 w-4" /></IconButton>
          <IconButton label="Fullscreen"><Expand className="h-4 w-4" /></IconButton>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3">
        {layers.map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={cls(
              "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition",
              activeLayer === layer ? "border-cyan/60 bg-cyan/15 text-cyan shadow-glow" : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white"
            )}
          >
            {layer}
          </button>
        ))}
      </div>

      <div className="relative min-h-[520px] overflow-hidden bg-[#07111d] lg:min-h-[670px]">
        <div className="absolute inset-0 satellite-grid" />
        <div className={cls("absolute inset-0 opacity-80", overlayClass(activeLayer))} />
        {!reducedMotion && <WindVectors />}
        {!reducedMotion && <CloudBands />}
        <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
          <span className="rounded-full border border-cyan/30 bg-black/35 px-3 py-1 text-xs text-cyan backdrop-blur">INSAT + IMD + Oceansat fused nowcast</span>
          <span className="rounded-full border border-emerald/30 bg-black/35 px-3 py-1 text-xs text-emerald backdrop-blur">4.2 km adaptive mesh | confidence 91%</span>
        </div>
        <IndiaMap selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/35 p-2 backdrop-blur-xl">
            {timeline.map((time) => (
              <button key={time} onClick={() => setActiveTime(time)} className={cls("rounded-xl px-4 py-2 text-sm font-medium transition", activeTime === time ? "bg-cyan text-slate-950" : "text-slate-300 hover:bg-white/10")}>
                {time}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-black/35 p-2 text-center text-xs backdrop-blur-xl md:grid-cols-8">
            {["Wind", "Rain", "Thermal", "AQI", "Cyclone", "Flood", "Fire", "River"].map((item) => (
              <span className="rounded-lg bg-white/5 px-2 py-2 text-slate-300" key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function projectPoint([lon, lat]: GeoPoint) {
  const x = ((lon - 66) / 33) * 720;
  const y = ((36 - lat) / 30) * 780;
  return [x, y] as const;
}

function projectPath(points: GeoPoint[], close = false) {
  return points
    .map((point, index) => {
      const [x, y] = projectPoint(point);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ") + (close ? " Z" : "");
}

function IndiaMap({ selectedCity, setSelectedCity }: { selectedCity: City | null; setSelectedCity: (city: City) => void }) {
  return (
    <div className="absolute inset-x-0 top-0 bottom-40 grid place-items-center lg:bottom-32">
      <div className="relative h-[320px] w-[76%] max-w-[620px] lg:h-[min(430px,44vh)]">
        <svg viewBox="0 0 720 780" className="h-full w-full drop-shadow-[0_0_45px_rgba(0,229,255,0.22)]" role="img" aria-label="Accurate map of India with climate overlays">
          <defs>
            <linearGradient id="indiaFill" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#0e3147" />
              <stop offset="0.42" stopColor="#0a615f" />
              <stop offset="0.72" stopColor="#102d5a" />
              <stop offset="1" stopColor="#102641" />
            </linearGradient>
            <filter id="indiaGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="scanPattern" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M0 18 L18 0" stroke="rgba(255,255,255,.045)" strokeWidth="1" />
            </pattern>
          </defs>

          <path d={projectPath(indiaOutline, true)} fill="rgba(0,229,255,.16)" stroke="rgba(0,229,255,.22)" strokeWidth="18" filter="url(#indiaGlow)" />
          <path d={projectPath(indiaOutline, true)} fill="url(#indiaFill)" stroke="rgba(0,229,255,.86)" strokeWidth="2.6" />
          <path d={projectPath(indiaOutline, true)} fill="url(#scanPattern)" opacity="0.72" />

          {stateLines.map((line, index) => (
            <path key={`state-${index}`} d={projectPath(line)} fill="none" stroke="rgba(255,255,255,.20)" strokeWidth="1.2" strokeDasharray="5 8" />
          ))}
          {riverLines.map((line, index) => (
            <path key={`river-${index}`} d={projectPath(line)} fill="none" stroke="rgba(0,229,255,.58)" strokeWidth="2.4" strokeLinecap="round" />
          ))}

          <path d="M226 75 C244 110 244 145 229 181" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" />
          <path d="M505 223 C540 232 582 228 628 238" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" />
          <path d="M168 418 C216 448 269 458 319 447" fill="none" stroke="rgba(0,208,132,.42)" strokeWidth="3" strokeLinecap="round" />
          <path d="M448 384 C499 403 552 381 604 406" fill="none" stroke="rgba(0,229,255,.36)" strokeWidth="2" strokeDasharray="8 9" />

          <circle cx="555" cy="392" r="72" fill="none" stroke="rgba(0,229,255,.45)" strokeWidth="3" strokeDasharray="8 10" className="spin-slow" />
          <circle cx="195" cy="342" r="48" fill="rgba(255,77,79,.16)" stroke="rgba(255,77,79,.55)" />
          <circle cx="296" cy="572" r="54" fill="rgba(255,159,28,.13)" stroke="rgba(255,159,28,.45)" />
          <circle cx="478" cy="406" r="44" fill="rgba(0,229,255,.12)" stroke="rgba(0,229,255,.42)" />

          {islandPoints.map((point, index) => {
            const [x, y] = projectPoint(point);
            return <circle key={`island-${index}`} cx={x} cy={y} r={index < 3 ? 4.5 : 5.5} fill="#0b615f" stroke="rgba(0,229,255,.8)" strokeWidth="1.5" />;
          })}

          <text x="360" y="742" textAnchor="middle" className="fill-slate-400 text-[13px] font-semibold tracking-[0.35em]">INDIA CLIMATE GRID</text>
        </svg>
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => setSelectedCity(city)}
            className={cls("absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border p-1 transition hover:scale-110", selectedCity?.name === city.name ? "border-cyan bg-cyan/30 shadow-glow" : "border-white/40 bg-black/40")}
            style={{ left: city.x, top: city.y }}
            aria-label={`Open ${city.name} climate details`}
          >
            <span className="block h-2.5 w-2.5 rounded-full bg-cyan" />
            <span className="absolute left-4 top-1 whitespace-nowrap rounded-md bg-black/60 px-2 py-1 text-[11px] text-white backdrop-blur">{city.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function overlayClass(layer: string) {
  if (layer === "Temperature") return "thermal-overlay";
  if (layer === "Rainfall") return "rain-overlay";
  if (layer === "AQI") return "aqi-overlay";
  if (layer === "Flood") return "flood-overlay";
  if (layer === "Cyclone") return "cyclone-overlay";
  if (layer === "Wildfire") return "fire-overlay";
  if (layer === "Soil Moisture") return "soil-overlay";
  if (layer === "Reservoirs") return "reservoir-overlay";
  return "wind-overlay";
}

function WindVectors() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 42 }).map((_, index) => (
        <span
          key={index}
          className="wind-vector"
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${(index * 29) % 100}%`,
            animationDelay: `${(index % 9) * 0.35}s`,
            transform: `rotate(${(index * 23) % 120 - 30}deg)`
          }}
        />
      ))}
    </div>
  );
}

function CloudBands() {
  return (
    <>
      <div className="cloud-band top-[18%]" />
      <div className="cloud-band top-[46%] animation-delay-2" />
      <div className="cloud-band top-[70%] animation-delay-4" />
    </>
  );
}

function KpiGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <motion.article
            key={kpi.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025 }}
            className="group rounded-2xl border border-white/10 bg-panel/80 p-4 shadow-glow backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10" style={{ background: `${kpi.color}18`, color: kpi.color }}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">{kpi.status}</span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">{kpi.name}</p>
            <div className="mt-2 flex items-end justify-between">
              <strong className="text-2xl font-semibold text-white">{kpi.value}</strong>
              <span className="text-sm font-medium" style={{ color: kpi.color }}>{kpi.delta}</span>
            </div>
            <Sparkline color={kpi.color} />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>AI confidence</span>
              <span>{kpi.confidence}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${kpi.confidence}%`, background: kpi.color }} />
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function Sparkline({ color }: { color: string }) {
  return (
    <div className="mt-3 h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line dataKey="rain" type="monotone" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Copilot({ risk, running, activeLayer }: { risk: number; running: boolean; activeLayer: string }) {
  return (
    <Panel>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-violet/30 bg-violet/15 text-violet">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">AI Climate Copilot</h2>
          <p className="text-sm text-slate-400">Adaptive multi-model reasoning engine</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-cyan/15 bg-cyan/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Current analysis</span>
          <span className="rounded-full bg-emerald/10 px-2 py-1 text-xs text-emerald">Streaming</span>
        </div>
        <p className="typing mt-3 text-sm leading-6 text-slate-100">
          {running ? "Assimilating scenario perturbations across atmosphere, hydrology, crop stress, and infrastructure exposure..." : `The ${activeLayer.toLowerCase()} layer shows elevated compound risk across coastal, riverine, and urban heat corridors.`}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Risk score" value={`${risk}/100`} tone="danger" />
        <Metric label="Confidence" value="91%" tone="cyan" />
      </div>
      <div className="mt-4 space-y-3">
        {["Pre-position NDRF assets near high-flow river gauges.", "Trigger district advisories for heat, AQI, and heavy rainfall clusters.", "Prioritize reservoir release review where inflow uncertainty exceeds 20%."].map((action, index) => (
          <details key={action} className="group rounded-xl border border-white/10 bg-white/[0.035] p-3 open:border-cyan/30">
            <summary className="cursor-pointer list-none text-sm font-medium text-white">Recommended action {index + 1}</summary>
            <p className="mt-2 text-sm leading-6 text-slate-400">{action}</p>
          </details>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-red-100">
        Government alert: maintain district-level emergency readiness for next 72 hours in flagged basins.
      </div>
    </Panel>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "danger" | "cyan" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={cls("mt-2 text-2xl font-semibold", tone === "danger" ? "text-danger" : "text-cyan")}>{value}</p>
    </div>
  );
}

function Simulator({ runSimulation, running }: { runSimulation: () => void; running: boolean }) {
  const controls = ["Temperature", "Rainfall", "Humidity", "Wind Speed", "Sea Level", "CO2 Level", "Population Density", "Urbanization"];
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">What-if Simulator</h2>
          <p className="text-sm text-slate-400">Scenario controls for adaptation planning</p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-cyan" />
      </div>
      <div className="mt-4 grid gap-4">
        {controls.map((control, index) => (
          <label key={control} className="grid gap-2 text-sm text-slate-300">
            <span className="flex justify-between"><span>{control}</span><span className="text-slate-500">{index % 2 ? "+12%" : "+2.0"}</span></span>
            <input aria-label={control} type="range" min="0" max="100" defaultValue={42 + index * 5} />
          </label>
        ))}
        <div className="grid grid-cols-2 gap-3">
          {["ENSO Phase", "La Nina", "El Nino", "Cyclone Category"].map((item) => (
            <button key={item} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-300 transition hover:border-cyan/40 hover:text-white">{item}</button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={runSimulation} className="rounded-xl bg-cyan px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white">{running ? "Running..." : "Run Simulation"}</button>
        <button className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200">Compare</button>
        <button className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200">Reset</button>
        <button className="rounded-xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm font-semibold text-emerald">Save Scenario</button>
      </div>
    </Panel>
  );
}

function Analytics({ activeLayer, running }: { activeLayer: string; running: boolean }) {
  const charts = [
    ["Temperature Forecast", "temp", "#FF9F1C"],
    ["Rainfall Timeline", "rain", "#00E5FF"],
    ["AQI Trend", "aqi", "#FFD60A"],
    ["Flood Probability", "flood", "#FF4D4F"],
    ["Cyclone Intensity", "cyclone", "#8B5CF6"],
    ["Reservoir Levels", "reservoir", "#00D084"],
    ["Energy Consumption", "energy", "#00E5FF"],
    ["Carbon Emissions", "carbon", "#FF9F1C"],
    ["Crop Yield Forecast", "crop", "#00D084"]
  ] as const;
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Analytics</h2>
          <p className="text-sm text-slate-400">{activeLayer} model ensemble output</p>
        </div>
        {running && <span className="rounded-full bg-cyan/10 px-2 py-1 text-xs text-cyan">Updating graphs</span>}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {charts.map(([title, key, color], index) => (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3" key={title}>
            <p className="mb-2 text-sm font-medium text-slate-200">{title}</p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                {index % 3 === 0 ? (
                  <AreaChart data={chartData}>
                    <defs><linearGradient id={`g-${key}`} x1="0" x2="0" y1="0" y2="1"><stop stopColor={color} stopOpacity={0.35} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                    <XAxis dataKey="t" stroke="#64748b" fontSize={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "#101827", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }} />
                    <Area dataKey={key} type="monotone" stroke={color} fill={`url(#g-${key})`} strokeWidth={2} />
                  </AreaChart>
                ) : index % 3 === 1 ? (
                  <BarChart data={chartData}>
                    <XAxis dataKey="t" stroke="#64748b" fontSize={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "#101827", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }} />
                    <Bar dataKey={key} fill={color} radius={[8, 8, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                    <XAxis dataKey="t" stroke="#64748b" fontSize={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "#101827", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }} />
                    <Line dataKey={key} type="monotone" stroke={color} strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RiskDashboard({ risk }: { risk: number }) {
  const risks = [
    ["Overall Risk", risk, "#FF9F1C"],
    ["Flood Risk", 72, "#00E5FF"],
    ["Heat Risk", 81, "#FF4D4F"],
    ["Cyclone Risk", 64, "#8B5CF6"],
    ["Wildfire Risk", 58, "#FF9F1C"],
    ["AQI Risk", 69, "#FFD60A"]
  ] as const;
  return (
    <Panel>
      <h2 className="text-xl font-semibold text-white">Risk Dashboard</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {risks.map(([label, value, color]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
            <GaugeRing value={value} color={color} />
            <p className="mt-2 text-sm text-slate-300">{label}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function GaugeRing({ value, color }: { value: number; color: string }) {
  const deg = value * 3.6;
  return (
    <div className="mx-auto grid h-24 w-24 place-items-center rounded-full" style={{ background: `conic-gradient(${color} ${deg}deg, rgba(255,255,255,.08) 0deg)` }}>
      <div className="grid h-[74px] w-[74px] place-items-center rounded-full bg-panel">
        <span className="text-xl font-semibold text-white">{value}</span>
      </div>
    </div>
  );
}

function AlertsCenter() {
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Alerts Center</h2>
        <Bell className="h-5 w-5 text-cyan" />
      </div>
      <div className="mt-4 space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3" key={`${alert.title}-${alert.place}`}>
              <div className="flex items-center gap-3">
                <div className={cls("grid h-10 w-10 place-items-center rounded-xl", alert.severity === "Red" ? "bg-danger/15 text-danger" : alert.severity === "Orange" ? "bg-amber/15 text-amber" : "bg-yellow/15 text-yellow")}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{alert.title}</p>
                  <p className="truncate text-sm text-slate-400">{alert.place}</p>
                </div>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function DigitalTwin({ activeLayer }: { activeLayer: string }) {
  return (
    <Panel>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Digital Twin Core</h2>
          <p className="text-sm text-slate-400">Satellite imagery, 3D terrain, overlays, prediction engine, confidence layer</p>
        </div>
        <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs text-cyan">{activeLayer} overlay active</span>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#06121d]">
          <div className="absolute inset-0 terrain" />
          <div className="absolute inset-x-8 bottom-10 h-28 rounded-[50%] border border-cyan/30 bg-cyan/10 blur-sm" />
          <div className="absolute left-6 top-6 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-slate-200 backdrop-blur">Live satellite composite</div>
          <div className="absolute bottom-6 right-6 rounded-xl border border-emerald/30 bg-emerald/10 px-3 py-2 text-sm text-emerald">Prediction engine online</div>
        </div>
        <div className="grid gap-3">
          {["Live satellite imagery", "3D terrain visualization", "Weather overlays", "Real-time climate simulation", "AI prediction engine", "Confidence layer"].map((item) => (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3" key={item}>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald shadow-emerald" />
              <span className="text-sm text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function CityDrawer({ city }: { city: City | null }) {
  if (!city) return null;
  return (
    <Panel>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan">City detail panel</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{city.name}</h2>
        </div>
        <MapPin className="h-5 w-5 text-cyan" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          ["Temperature", city.temp],
          ["Rainfall", city.rain],
          ["Humidity", "78%"],
          ["Wind", "34 km/h"],
          ["AQI", String(city.aqi)],
          ["Population", "12.4M"],
          ["Hospitals", "184"],
          ["Flood Zones", "17"]
        ].map(([label, value]) => (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3" key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-cyan/15 bg-cyan/5 p-4">
        <h3 className="font-semibold text-white">AI Summary</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">Compound exposure is concentrated around transport corridors, low-lying wards, hospitals, substations, and dense informal settlements. Policy recommendations prioritize heat shelters, pump readiness, ward-level messaging, and water release coordination.</p>
      </div>
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs><linearGradient id="city-history" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#00E5FF" stopOpacity={0.35} /><stop offset="1" stopColor="#00E5FF" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="t" stroke="#64748b" fontSize={10} />
            <YAxis hide />
            <Area dataKey="rain" type="monotone" stroke="#00E5FF" fill="url(#city-history)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function FloatingActions({ setCommandOpen, setReducedMotion, reducedMotion }: { setCommandOpen: (value: boolean) => void; setReducedMotion: (value: boolean) => void; reducedMotion: boolean }) {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2">
      <IconButton label="Command palette"><Command className="h-4 w-4" /></IconButton>
      <button aria-label="Open command palette" onClick={() => setCommandOpen(true)} className="rounded-xl border border-cyan/30 bg-cyan/15 px-3 py-2 text-sm font-semibold text-cyan shadow-glow">Ctrl K</button>
      <IconButton label="Export PDF"><Download className="h-4 w-4" /></IconButton>
      <IconButton label="Share dashboard"><Share2 className="h-4 w-4" /></IconButton>
      <IconButton label="Bookmark location"><Bookmark className="h-4 w-4" /></IconButton>
      <button onClick={() => setReducedMotion(!reducedMotion)} className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-slate-300">{reducedMotion ? "Motion on" : "Reduce motion"}</button>
    </div>
  );
}

function CommandPalette({ open, setOpen, setActiveLayer }: { open: boolean; setOpen: (value: boolean) => void; setActiveLayer: (layer: string) => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-start bg-black/55 px-4 pt-24 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="mx-auto w-full max-w-2xl rounded-2xl border border-cyan/20 bg-panel p-3 shadow-glow">
            <div className="flex items-center gap-3 border-b border-white/10 px-3 py-3">
              <Search className="h-5 w-5 text-cyan" />
              <input autoFocus aria-label="Command search" placeholder="Run command, switch layer, export, search location..." className="w-full bg-transparent text-slate-100 outline-none" />
              <button onClick={() => setOpen(false)} className="text-sm text-slate-400">Esc</button>
            </div>
            <div className="grid gap-2 p-2">
              {layers.slice(0, 6).map((layer) => (
                <button key={layer} onClick={() => { setActiveLayer(layer); setOpen(false); }} className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10">
                  Switch to {layer} layer
                  <Globe2 className="h-4 w-4 text-slate-500" />
                </button>
              ))}
              {["Export as PDF", "Export CSV", "Share dashboard", "Toggle fullscreen dashboard"].map((command) => (
                <button key={command} className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10">
                  {command}
                  <RefreshCcw className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cls("rounded-2xl border border-white/10 bg-panel/75 p-5 shadow-glow backdrop-blur-xl transition hover:border-cyan/25", className)}>{children}</section>;
}



