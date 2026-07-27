import { useDesktopStore } from './store/desktopStore';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import './styles/global.css';

function App() {
  const { isBooting } = useDesktopStore();

  return (
    <div className="app">
      {isBooting ? <BootScreen /> : <Desktop />}
    </div>
  );
}

export default App;
