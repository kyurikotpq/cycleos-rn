export type SymptomItem = {
  id: number;
  type: string;
  label: string;
  isNegative: boolean;
};
export type SymptomCategory = { label: string; items: SymptomItem[] };

const MENSTRUATION_ITEMS = [
  { id: 1, type: "menstruation", label: "Light", isNegative: false },
  { id: 2, type: "menstruation", label: "Medium", isNegative: false },
  { id: 3, type: "menstruation", label: "Heavy", isNegative: true },
  { id: 4, type: "menstruation", label: "Super Heavy", isNegative: true },
];

const PAIN_ITEMS = [
  { id: 5, type: "pain", label: "Pain free", isNegative: false },
  { id: 6, type: "pain", label: "Cramps", isNegative: true },
  { id: 7, type: "pain", label: "Headache", isNegative: true },
  { id: 8, type: "pain", label: "Migraine", isNegative: true },
  { id: 9, type: "pain", label: "Migraine with aura", isNegative: true },
  { id: 10, type: "pain", label: "Breast Tenderness", isNegative: true },
  { id: 11, type: "pain", label: "Lower Back", isNegative: true },
  { id: 12, type: "pain", label: "Muscle ache", isNegative: true },
  { id: 13, type: "pain", label: "Joint ache", isNegative: true },
  { id: 14, type: "pain", label: "Vulvar", isNegative: true },
];

const DIGESTION_ITEMS = [
  { id: 15, type: "digestion", label: "OK", isNegative: false },
  { id: 16, type: "digestion", label: "Bloating", isNegative: true },
  { id: 17, type: "digestion", label: "Gassy", isNegative: true },
  { id: 18, type: "digestion", label: "Heartburn", isNegative: true },
  { id: 19, type: "digestion", label: "Nausea", isNegative: true },
  { id: 20, type: "digestion", label: "Vomitting", isNegative: true },
  { id: 21, type: "digestion", label: "Diarrhea", isNegative: true },
  { id: 22, type: "digestion", label: "Constipation", isNegative: true },
];

const MOOD_ITEMS = [
  { id: 23, type: "mood", label: "OK", isNegative: false },
  { id: 24, type: "mood", label: "Happy", isNegative: false },
  { id: 25, type: "mood", label: "Excited", isNegative: false },
  { id: 26, type: "mood", label: "Grateful", isNegative: false },
  { id: 27, type: "mood", label: "Confident", isNegative: false },
  { id: 28, type: "mood", label: "Sad", isNegative: true },
  { id: 29, type: "mood", label: "Mood Swings", isNegative: true },
  { id: 30, type: "mood", label: "Sensitive", isNegative: true },
  { id: 31, type: "mood", label: "Angry", isNegative: true },
  { id: 32, type: "mood", label: "Anxious", isNegative: true },
  { id: 33, type: "mood", label: "Irritable", isNegative: true },
  { id: 34, type: "mood", label: "Insecure", isNegative: true },
];

const MIND_ITEMS = [
  { id: 35, type: "mind", label: "OK", isNegative: false },
  { id: 36, type: "mind", label: "Focused", isNegative: false },
  { id: 37, type: "mind", label: "Productive", isNegative: false },
  { id: 38, type: "mind", label: "Brain Fog", isNegative: true },
  { id: 39, type: "mind", label: "Forgetful", isNegative: true },
  { id: 40, type: "mind", label: "Distracted", isNegative: true },
  { id: 41, type: "mind", label: "Stressed", isNegative: true },
];

const SKIN_ITEMS = [
  { id: 42, type: "skin", label: "OK", isNegative: false },
  { id: 43, type: "skin", label: "Acne", isNegative: true },
  { id: 44, type: "skin", label: "Dry Skin", isNegative: true },
  { id: 45, type: "skin", label: "Oily Skin", isNegative: true },
  { id: 46, type: "skin", label: "Dull Skin", isNegative: true },
  { id: 47, type: "skin", label: "Itchy Skin", isNegative: true },
];

const ENERGY_ITEMS = [
  { id: 48, type: "energy", label: "OK", isNegative: false },
  { id: 49, type: "energy", label: "Exhausted", isNegative: true },
  { id: 50, type: "energy", label: "Tired", isNegative: true },
  { id: 51, type: "energy", label: "Energetic", isNegative: false },
  { id: 52, type: "energy", label: "Unstoppable", isNegative: false },
];

export const SYMPTOMS_CATEGORIZED = [
  { label: "Energy", items: ENERGY_ITEMS },
  { label: "Mood", items: MOOD_ITEMS },
  { label: "Mind", items: MIND_ITEMS },
  { label: "Menstruation", items: MENSTRUATION_ITEMS },
  { label: "Pain", items: PAIN_ITEMS },
  { label: "Digestion", items: DIGESTION_ITEMS },
  { label: "Skin", items: SKIN_ITEMS },
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
