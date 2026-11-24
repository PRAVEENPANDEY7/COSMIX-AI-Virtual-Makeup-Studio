import { LipstickShade } from '@/types/makeup';

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export const LIPSTICK_SHADES: LipstickShade[] = [
  {
    id: 'ruby-red',
    name: 'Ruby Red',
    hex: '#9B111E',
    category: 'Red',
    defaultFinish: 'matte',
    description: 'Iconic deep ruby red with cool undertones for a timeless statement.',
    rgb: hexToRgb('#9B111E'),
  },
  {
    id: 'classic-red',
    name: 'Classic Red',
    hex: '#D32F2F',
    category: 'Red',
    defaultFinish: 'satin',
    description: 'Vibrant true crimson red designed to complement every skin tone.',
    rgb: hexToRgb('#D32F2F'),
  },
  {
    id: 'nude-pink',
    name: 'Nude Pink',
    hex: '#D4A59A',
    category: 'Nude',
    defaultFinish: 'satin',
    description: 'Soft, creamy neutral pink for understated everyday elegance.',
    rgb: hexToRgb('#D4A59A'),
  },
  {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    hex: '#C08081',
    category: 'Pink',
    defaultFinish: 'matte',
    description: 'Sophisticated muted rose petal shade with warm mauve notes.',
    rgb: hexToRgb('#C08081'),
  },
  {
    id: 'mocha-brown',
    name: 'Mocha Brown',
    hex: '#855246',
    category: 'Brown',
    defaultFinish: 'matte',
    description: 'Rich velvety espresso brown with warm chocolate undertones.',
    rgb: hexToRgb('#855246'),
  },
  {
    id: 'berry-wine',
    name: 'Berry',
    hex: '#7A2048',
    category: 'Berry',
    defaultFinish: 'satin',
    description: 'Luscious wild blackberry with deep jewel tone intensity.',
    rgb: hexToRgb('#7A2048'),
  },
  {
    id: 'coral-blush',
    name: 'Coral',
    hex: '#E06F64',
    category: 'Coral',
    defaultFinish: 'gloss',
    description: 'Bright sun-kissed coral infused with radiant peach brilliance.',
    rgb: hexToRgb('#E06F64'),
  },
  {
    id: 'deep-wine',
    name: 'Wine',
    hex: '#5E2129',
    category: 'Wine',
    defaultFinish: 'matte',
    description: 'Dark vintage Bordeaux wine shade offering dramatic couture depth.',
    rgb: hexToRgb('#5E2129'),
  },
  {
    id: 'peach-nude',
    name: 'Peach Nude',
    hex: '#E59E87',
    category: 'Nude',
    defaultFinish: 'gloss',
    description: 'Delicate apricot nude delivering fresh, luminous hydration.',
    rgb: hexToRgb('#E59E87'),
  },
  {
    id: 'cherry-red',
    name: 'Cherry Red',
    hex: '#B2182B',
    category: 'Red',
    defaultFinish: 'gloss',
    description: 'Juicy, glass-like cherry red with brilliant high-gloss shine.',
    rgb: hexToRgb('#B2182B'),
  },
  {
    id: 'rosewood',
    name: 'Rosewood',
    hex: '#9E5B61',
    category: 'Pink',
    defaultFinish: 'satin',
    description: 'Earthy woodsy rose balancing natural warmth and refined polish.',
    rgb: hexToRgb('#9E5B61'),
  },
  {
    id: 'mauve-velvet',
    name: 'Mauve',
    hex: '#915F6D',
    category: 'Mauve',
    defaultFinish: 'matte',
    description: 'Gentle dusky violet-pink for romantic Parisian charm.',
    rgb: hexToRgb('#915F6D'),
  },
];

export const DEFAULT_SHADE = LIPSTICK_SHADES[0];
