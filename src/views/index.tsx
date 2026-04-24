import App from '@/src/App';
import { FirebaseProvider } from '@/src/components/common/FirebaseProvider';

export default function HomePage() {
  return (
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );
}
