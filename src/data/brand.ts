export interface BrandConfig {
  name: string;
  wordmark: string;
  tagline: string;
  coreMessage: string;
  supportingMessage: string;
  description: string;
  navLinks: { label: string; href: string; icon: string }[];
  socials: { instagram: string };
}

export const BRAND: BrandConfig = {
  name: 'COSMIX',
  wordmark: 'COSMIX',
  tagline: 'Virtual Lipstick Shade Discovery & Try-On Studio',
  coreMessage: 'Find the shade that feels like you.',
  supportingMessage:
    'Explore colours, experiment with different looks and discover the shades that make you feel confident.',
  description:
    'COSMIX is a virtual lipstick shade discovery and try-on platform. We help you explore colours on your own face through real-time AI and high-precision texture preservation — without guessing.',
  navLinks: [
    { label: 'Home', href: '/', icon: 'House' },
    { label: 'Try On', href: '/try-on', icon: 'Camera' },
    { label: 'Explore Shades', href: '/shades', icon: 'Palette' },
    { label: 'My Favourites', href: '/favourites', icon: 'Heart' },
    { label: 'About COSMIX', href: '/about', icon: 'Info' },
  ],
  socials: {
    instagram: 'https://instagram.com',
  },
};
