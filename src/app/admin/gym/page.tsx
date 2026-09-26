import { permanentRedirect } from 'next/navigation';

export default function AdminGymRedirect() {
  permanentRedirect('/admin/hall');
}
