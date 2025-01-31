import './models/pool-table';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { register } from '@tauri-apps/plugin-global-shortcut';

let isClickeable = true;
const window = getCurrentWindow();

await register('v', () => {
  isClickeable = !isClickeable;
  window.setIgnoreCursorEvents(isClickeable);
});
