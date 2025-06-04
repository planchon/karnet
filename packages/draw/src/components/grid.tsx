import { useLayoutEffect, useRef } from "react";
import { approximately, useEditor, useIsDarkMode, useValue } from "tldraw";

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.stroke();
}

export const Grid = ({ size, ...camera }: { size: number; camera: any }) => {
  const editor = useEditor();

  // [2]
  const screenBounds = useValue(
    "screenBounds",
    () => editor.getViewportScreenBounds(),
    []
  );
  const devicePixelRatio = useValue(
    "dpr",
    () => editor.getInstanceState().devicePixelRatio,
    []
  );
  const isDarkMode = useIsDarkMode();

  const canvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (!canvas.current) return;
    // [3]
    const canvasW = screenBounds.w * devicePixelRatio;
    const canvasH = screenBounds.h * devicePixelRatio;
    canvas.current.width = canvasW;
    canvas.current.height = canvasH;

    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    // [4]
    ctx.clearRect(0, 0, canvasW, canvasH);

    // [5]
    const pageViewportBounds = editor.getViewportPageBounds();

    const startPageX = Math.ceil(pageViewportBounds.minX / size) * size;
    const startPageY = Math.ceil(pageViewportBounds.minY / size) * size;
    const endPageX = Math.floor(pageViewportBounds.maxX / size) * size;
    const endPageY = Math.floor(pageViewportBounds.maxY / size) * size;
    const numRows = Math.round((endPageY - startPageY) / size);
    const numCols = Math.round((endPageX - startPageX) / size);

    ctx.strokeStyle = isDarkMode ? "#555" : "#BBB";

    // [6]
    for (let row = 0; row <= numRows; row++) {
      const pageY = startPageY + row * size;
      // convert the page-space Y offset into our canvas' coordinate space
      const canvasY = (pageY + camera.y) * camera.z * devicePixelRatio;
      const isMajorLine = approximately(pageY % (size * 10), 0);
      drawLine(ctx, 0, canvasY, canvasW, canvasY, isMajorLine ? 3 : 1);
    }
    for (let col = 0; col <= numCols; col++) {
      const pageX = startPageX + col * size;
      // convert the page-space X offset into our canvas' coordinate space
      const canvasX = (pageX + camera.x) * camera.z * devicePixelRatio;
      const isMajorLine = approximately(pageX % (size * 10), 0);
      drawLine(ctx, canvasX, 0, canvasX, canvasH, isMajorLine ? 3 : 1);
    }
  }, [screenBounds, camera, size, devicePixelRatio, editor, isDarkMode]);

  // [7]
  return <canvas className="tl-grid" ref={canvas} />;
};
