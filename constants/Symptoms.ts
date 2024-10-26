export type SymptomItem = { type: string; label: string; id: number };
export type SymptomCategory = { label: string; items: SymptomItem[] };

const MENSTRUATION_ITEMS = [
  { id: 1, type: "menstruation", label: "Light" },
  { id: 2, type: "menstruation", label: "Medium" },
  { id: 3, type: "menstruation", label: "Heavy" },
  { id: 4, type: "menstruation", label: "Super Heavy" },
];

const PAIN_ITEMS = [
  { id: 5, type: "pain", label: "Pain free" },
  { id: 6, type: "pain", label: "Cramps" },
  { id: 7, type: "pain", label: "Headache" },
  { id: 8, type: "pain", label: "Migraine" },
  { id: 9, type: "pain", label: "Migraine with aura" },
  { id: 10, type: "pain", label: "Breast Tenderness" },
  { id: 11, type: "pain", label: "Lower Back" },
  { id: 12, type: "pain", label: "Muscle ache" },
  { id: 13, type: "pain", label: "Joint ache" },
  { id: 14, type: "pain", label: "Vulvar" },
];

const DIGESTION_ITEMS = [
  { id: 15, type: "digestion", label: "OK" },
  { id: 16, type: "digestion", label: "Bloating" },
  { id: 17, type: "digestion", label: "Gassy" },
  { id: 18, type: "digestion", label: "Heartburn" },
  { id: 19, type: "digestion", label: "Nausea" },
  { id: 20, type: "digestion", label: "Vomitting" },
  { id: 21, type: "digestion", label: "Diarrhea" },
  { id: 22, type: "digestion", label: "Constipation" },
];

const MOOD_ITEMS = [
  { id: 23, type: "mood", label: "OK" },
  { id: 24, type: "mood", label: "Happy" },
  { id: 25, type: "mood", label: "Excited" },
  { id: 26, type: "mood", label: "Grateful" },
  { id: 27, type: "mood", label: "Mood Swings" },
  { id: 28, type: "mood", label: "Sad" },
  { id: 29, type: "mood", label: "Sensitive" },
  { id: 30, type: "mood", label: "Angry" },
  { id: 31, type: "mood", label: "Confident" },
  { id: 32, type: "mood", label: "Anxious" },
  { id: 33, type: "mood", label: "Irritable" },
  { id: 34, type: "mood", label: "Insecure" },
];

const MIND_ITEMS = [
  { id: 35, type: "mind", label: "OK" },
  { id: 36, type: "mind", label: "Brain Fog" },
  { id: 37, type: "mind", label: "Forgetful" },
  { id: 38, type: "mind", label: "Distracted" },
  { id: 39, type: "mind", label: "Stressed" },
  { id: 40, type: "mind", label: "Focused" },
  { id: 41, type: "mind", label: "Productive" },
];

const SKIN_ITEMS = [
  { id: 42, type: "skin", label: "OK" },
  { id: 43, type: "skin", label: "Acne" },
  { id: 44, type: "skin", label: "Dry Skin" },
  { id: 45, type: "skin", label: "Oily Skin" },
  { id: 46, type: "skin", label: "Dull Skin" },
  { id: 47, type: "skin", label: "Itchy Skin" },
];

const ENERGY_ITEMS = [
  { id: 48, type: "energy", label: "OK" },
  { id: 49, type: "energy", label: "Exhausted" },
  { id: 50, type: "energy", label: "Tired" },
  { id: 51, type: "energy", label: "Energetic" },
  { id: 52, type: "energy", label: "Unstoppable" },
];

export const SYMPTOMS_CATEGORIZED = [
  { label: "Menstruation", items: MENSTRUATION_ITEMS },
  { label: "Pain", items: PAIN_ITEMS },
  { label: "Digestion", items: DIGESTION_ITEMS },
  { label: "Mood", items: MOOD_ITEMS },
  { label: "Mind", items: MIND_ITEMS },
  { label: "Skin", items: SKIN_ITEMS },
  { label: "Energy", items: ENERGY_ITEMS },
];
export const SYMPTOMS = [
  ...MENSTRUATION_ITEMS,
  ...PAIN_ITEMS,
  ...DIGESTION_ITEMS,
  ...MOOD_ITEMS,
  ...MIND_ITEMS,
  ...SKIN_ITEMS,
  ...ENERGY_ITEMS,
];
