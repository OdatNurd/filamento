/******************************************************************************/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import './index.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import './theme/variables.css';

/* Ionicons */
import { locationIcons } from '@inventory/location-styles.js';
import { addIcons } from 'ionicons';
import { chevronDownCircleOutline } from 'ionicons/icons';

import { Workbox } from 'workbox-window';

/******************************************************************************/

// Transform the array from location-styles into the object format that addIcons expects.
const dynamicIcons = locationIcons.reduce((acc, current) => {
  acc[current.name] = current.icon;
  return acc;
}, {});

// Add all icons that we might use dynamically here so that they are not
// tree-shaken from the application bundle.
addIcons({
  // This is used for the pull to refresh functionality
  'chevron-down-circle-outline': chevronDownCircleOutline,

  // Spread in the dynamically registered icons from our config
  ...dynamicIcons,
});

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.register();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/******************************************************************************/
