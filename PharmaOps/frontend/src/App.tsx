import { RouterProvider } from 'react-router-dom';
import router from './routes/index';
import { AppProviders } from './app/providers/AppProviders';
import './App.css';

const App = () => (
  <AppProviders>
    <div style={{ padding: 16 }}>

      <RouterProvider router={router} />
    </div>
  </AppProviders>
);

export default App;
