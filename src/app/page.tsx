import App from '@/src/App';
import { FirebaseProvider } from '@/src/components/common/FirebaseProvider';

export default function Home() {
  return (
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );
}
