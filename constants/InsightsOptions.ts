// Available options for Insights pages
export const HEALTH_OPTIONS = [
  { label: "Total Night Sleep (mins)", value: "sleepDuration" },
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
  {
    label: "Follicular",
    value: "follicular",
  },
  {
    label: "Ovulation",
    value: "ovulatory",
  },
  {
    label: "Early Luteal",
    value: "early-luteal",
  },
  {
    label: "Mid Luteal",
    value: "late-luteal",
  },
];

export const PHASE_BG_MAP = {
  menstrual: require("@/assets/images/menstrual-bg.png"),
  follicular: require("@/assets/images/follicular-bg.png"),
  ovulatory: require("@/assets/images/ovulatory-bg.png"),
  "early-luteal": require("@/assets/images/early-luteal-bg.png"),
  "late-luteal": require("@/assets/images/late-luteal-bg.png"),
  default: "",
};

export const PHASE_COLOR_MAP = {
  menstrual: { color: "#FF6459", label: "Menstrual" },
  follicular: { color: "#F1B8D1", label: "Follicular" },
  ovulatory: { color: "#BAD6AE", label: "Ovulatory" },
  "early-luteal": { color: "#FFCA6A", label: "Early Luteal" },
  "late-luteal": { color: "#006E90", label: "Mid Luteal" },
  default: { color: "rgba(100, 100, 100, 0.5)", label: "No Phase" },
};
