import extension from "extensionizer";

export default function() {
  return new Promise((resolve) => {
    extension.windows.getCurrent((res) => {
      let left = parseInt(res.width * 0.71);
      console.log(res);
      extension.windows.create(
        {
          url: extension.runtime.getURL("notification.html"),
          type: "popup",
          width: 416,
          height: 635,
          left,
          top: 68,
        },
        (win) => resolve(win.id)
      );
    });
  });
}
