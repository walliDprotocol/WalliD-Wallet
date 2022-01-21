import extension from 'extensionizer';

export default function() {
  return new Promise((resolve) => {
    var width = 416;
    var height = 660;
    var left = Math.floor(screen.width / 2 + width / 0.9);
    var top = 100;
    extension.windows.create(
      {
        url: extension.runtime.getURL('notification.html'),
        type: 'popup',
        width,
        height,
        left,
        top,
      },
      (win) => resolve(win.id)
    );
  });
}
