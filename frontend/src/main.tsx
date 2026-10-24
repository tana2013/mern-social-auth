// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx'; 
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Also ensure your Redux Provider wraps the App component properly */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);





// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { App } from './App.tsx'
// import './index.css'
// import { WebSocketProvider } from './context/WebSocketContext.tsx'
// import { Provider } from 'react-redux'
// import { store } from './store/index.ts'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <Provider store={store}>
//         <App />
//       {/* <WebSocketProvider>
//       </WebSocketProvider> */}
//     </Provider>
//   </StrictMode>,
// )