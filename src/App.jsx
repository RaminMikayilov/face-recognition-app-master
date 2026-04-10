import { useFaceAuth } from './hooks/useFaceAuth';
import { AuthGate } from './components/AuthGate';
import { FaceRecognitionApp } from './components/FaceRecognitionApp';
import './App.css';

function App() {
  const auth = useFaceAuth();

  return (
    <AuthGate auth={auth}>
      <FaceRecognitionApp matcher={auth.matcher} />
    </AuthGate>
  );
}

export default App;
