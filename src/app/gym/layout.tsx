import { permanentRedirect } from 'next/navigation';

export default function GymLayout({ children }: { children: React.ReactNode }) {
  permanentRedirect('/hall');
}
