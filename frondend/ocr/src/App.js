
import { useState } from 'react';
import './App.css';
import FrameComponents from './components/FrameComponents';
import WelcomeHome from './components/WelcomeHome';

function App() {

  const [showWelcome, setShowWelcome] = useState(true);

  setTimeout(() => {
    setShowWelcome(false)
  }, 5000);

  return (
    <div className="App">
      <div>
      {showWelcome ? <WelcomeHome /> : <FrameComponents /> }
      </div>
    </div>
  );
}

export default App;
