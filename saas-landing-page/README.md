# FlowPilot SaaS Landing Page

A responsive React and TailwindCSS landing page with:

- light and dark modes with persisted preference;
- accessible sticky navigation;
- hero, feature, product-preview, pricing, and contact sections;
- responsive layouts for mobile, tablet, and desktop;
- a client-side validated contact form;
- semantic HTML and keyboard-focus styles.

## Use

Copy `App.jsx` into a React project configured with TailwindCSS. Ensure Tailwind dark mode is set to class mode:

```js
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

Then render the component from the application's entry point:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

The contact form currently validates and records a success state locally. Replace `submitContact` with the project's API or form-provider request when an endpoint is available.
