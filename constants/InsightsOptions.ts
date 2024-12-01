// Available options for Insights pages
export const HEALTH_OPTIONS = [
  { label: "Total Sleep Time (mins)", value: "sleepDuration" },
  { label: "Average Time Awake (%)", value: "avgAwake" },
  { label: "Average REM (%)", value: "avgRem" },
  { label: "Average Deep Sleep (%)", value: "avgDeep" },
  { label: "Average REM Latency (mins)", value: "avgRemLatency" },
  { label: "Total Exercise Duration (mins)", value: "exerciseDuration" },
  { label: "Steps", value: "steps" },
  { label: "No. of Non-OK Symptoms", value: "symptoms" },
];

export const PHASE_OPTIONS = [
  { label: "Menstrual", value: "menstrual" },
  { label: "Follicular", value: "follicular" },
  { label: "Ovulation", value: "ovulation" },
  { label: "Early Luteal", value: "early-luteal" },
  { label: "Mid Luteal", value: "mid-luteal" },
];

export const PHASE_COLOR_MAP = {
  menstrual: { color: "#FF6459", label: "Menstrual" },
  follicular: { color: "#F1B8D1", label: "Follicular" },
  ovulatory: { color: "#BAD6AE", label: "Ovulatory" },
  "early-luteal": { color: "#FFCA6A", label: "Early Luteal" },
  "mid-luteal": { color: "#006E90", label: "Late Luteal" },
  default: { color: "#aaa", label: "No Phase" },
};
