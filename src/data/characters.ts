export interface Character {
  id: string;
  index: number;
  name: string;
  role: string;
  height: { cm: number; display: string };
  weight: { kg: number; lb: number; display: string };
  birthYear: number;
  bio: string;
  image?: string;
}

export const characters: Character[] = [
  {
    id: 'jack-hawson',
    index: 1,
    name: 'Jack Hawson',
    role: 'Main Hero',
    height: { cm: 188, display: '188 cm' },
    weight: { kg: 89, lb: 196, display: '89 kg / 196 lb' },
    birthYear: 1987,
    bio: 'A powerful, smart and fearless soldier who continues the mission after losing his team. Disciplined, capable under pressure and determined to discover what is happening inside the villa.',
    image: '/assets/IMG-20260619-WA0027.jpg'
  },
  {
    id: 'edward-harrington',
    index: 2,
    name: 'Edward Harrington',
    role: 'Government Agent',
    height: { cm: 174, display: '174 cm' },
    weight: { kg: 72, lb: 159, display: '72 kg / 159 lb' },
    birthYear: 1964,
    bio: 'A senior government officer connected to the operation. Calm, experienced and strategic, with a difficult-to-read presence.',
    image: '/assets/IMG-20260620-WA0005(1).jpg'
  },
  {
    id: 'silas-graves',
    index: 3,
    name: 'Silas Graves',
    role: 'Main Villain',
    height: { cm: 196, display: '196 cm' },
    weight: { kg: 102, lb: 225, display: '102 kg / 225 lb' },
    birthYear: 1971,
    bio: 'A dangerous former soldier with a ruthless presence. Intelligent, physically imposing, unpredictable and highly capable.',
    image: '/assets/Cpauter.1'
  },
];
