import './models/pool-table';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { register } from '@tauri-apps/plugin-global-shortcut';

let isClickeable = true;
const window = getCurrentWindow();

(async () => {
  await register('v', () => {
    isClickeable = !isClickeable;
    window.setIgnoreCursorEvents(isClickeable);
  });
})();

if (!import.meta.env.DEV) {
  document.addEventListener('contextmenu', event => event.preventDefault());
}
