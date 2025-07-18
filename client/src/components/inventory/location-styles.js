/******************************************************************************/

// It's crucial to import the icons here to ensure they are not tree-shaken
// (removed) from the final application bundle. This makes this configuration
// self-contained. The icons are registered for use via name in main.jsx.
import { construct, cubeOutline, fileTray, fileTrayFull, library, print } from 'ionicons/icons';

/******************************************************************************/

/**
 * The list of Ionic color names that can be applied to a location.
 */
export const locationColors = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'dark',
  'medium',
];

/**
 * The list of icons that can be used for locations. The `name` should be the
 * string that Ionic uses to identify the icon, and the `icon` property should
 * be the imported icon data from the `ionicons/icons` package.
 */
export const locationIcons = [
  { name: 'print', icon: print },
  { name: 'file-tray-full', icon: fileTrayFull },
  { name: 'file-tray', icon: fileTray },
  { name: 'library', icon: library },
  { name: 'construct', icon: construct },
  { name: 'cube-outline', icon: cubeOutline },
];

/******************************************************************************/
