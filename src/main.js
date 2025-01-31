import './models/pool-table';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { register } from '@tauri-apps/plugin-global-shortcut';

let isClickeable = false;
const window = getCurrentWindow();

await register('CommandOrControl+Shift+C', event => {
  if (event.state === 'Pressed') {
    isClickeable = !isClickeable;
    window.setIgnoreCursorEvents(isClickeable);
  }
});
