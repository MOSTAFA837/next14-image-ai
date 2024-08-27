import { useCallback, useMemo, useState } from "react";

import { fabric } from "fabric";
import {
  BuilsEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  EditorHookProps,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  HEXAGON_OPTIONS,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "../types";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import { createFilter, isTextType } from "../utils";
import { useClipboard } from "./use-clipboard";

interface UseEditorProps {
  initialCanvas: fabric.Canvas;
  initialContainer: HTMLDivElement;
}

const buildEditor = ({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  fontFamily,
  selectedObjects,
  strokeDashArray,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setStrokeDashArray,
  setFontFamily,
  copy,
  paste,
}: BuilsEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-ignore
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  const SAVED_OPTIONS = {
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
  };

  return {
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (value: string) => {
      fabric.Image.fromURL(
        value,
        (image) => {
          const workspace = getWorkspace();

          image.scaleToWidth(workspace?.width || 0);
          image.scaleToHeight(workspace?.width || 0);

          addToCanvas(image);
        },
        { crossOrigin: "anonymous" }
      );
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        fontFamily: fontFamily,
        ...options,
      });

      addToCanvas(object);
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) return 1;

      const value = selectedObject.get("opacity") || 1;

      return value;
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });

      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.freeDrawingBrush.width = value;

      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ stroke: value });
      });
      canvas.freeDrawingBrush.color = value;
      canvas.renderAll();
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontWeight: value });
        }
      });

      canvas.renderAll();
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontStyle: value });
        }
      });

      canvas.renderAll();
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ linethrough: value });
        }
      });

      canvas.renderAll();
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ underline: value });
        }
      });

      canvas.renderAll();
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ textAlign: value });
        }
      });

      canvas.renderAll();
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontSize: value });
        }
      });

      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        ...SAVED_OPTIONS,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 10,
        ry: 10,
        ...SAVED_OPTIONS,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        ...SAVED_OPTIONS,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        ...SAVED_OPTIONS,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          strokeDashArray: strokeDashArray,
          ...SAVED_OPTIONS,
        }
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0 / 2, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          ...SAVED_OPTIONS,
          strokeDashArray: strokeDashArray,
        }
      );

      addToCanvas(object);
    },
    addHexagon: () => {
      const RADIUS = 225; // Radius of the hexagon

      // Calculate the six points of the hexagon
      const hexagonPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i; // 60 degrees for each point
        hexagonPoints.push({
          x: RADIUS * Math.cos(angle) + RADIUS, // Centering on the canvas
          y: RADIUS * Math.sin(angle) + RADIUS, // Centering on the canvas
        });
      }

      const object = new fabric.Polygon(hexagonPoints, {
        ...HEXAGON_OPTIONS,
        ...SAVED_OPTIONS,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    getActiveFillColor: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return fillColor;

      const value = selctedObject.get("fill") || fillColor;

      return value as string;
    },
    getActiveStrokeColor: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return strokeColor;

      const value = selctedObject.get("stroke") || strokeColor;

      return value;
    },
    getActiveStrokeWidth: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return strokeWidth;

      const value = selctedObject.get("strokeWidth") || strokeWidth;

      return value;
    },
    getActiveStrokeًDashArray: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return strokeDashArray;

      const value = selctedObject.get("strokeDashArray") || strokeDashArray;

      return value;
    },
    getActiveFontFamily: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return fontFamily;

      // @ts-ignore
      const value = selctedObject.get("fontFamily") || fontFamily;

      return value;
    },
    getActiveFontWeight: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return FONT_WEIGHT;

      // @ts-ignore
      const value = selctedObject.get("fontWeight") || FONT_WEIGHT;

      return value;
    },
    getActiveFontStyle: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return "normal";

      // @ts-ignore
      const value = selctedObject.get("fontStyle") || "normal";

      return value;
    },
    getActiveFontLinethrough: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return false;

      // @ts-ignore
      const value = selctedObject.get("linethrough") || false;

      return value;
    },
    getActiveFontUnderline: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return false;

      // @ts-ignore
      const value = selctedObject.get("underline") || false;

      return value;
    },
    getActiveTextAlign: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return "left";

      // @ts-ignore
      const value = selctedObject.get("textAlign") || "left";

      return value;
    },
    getActiveFontSize: () => {
      const selctedObject = selectedObjects[0];

      if (!selctedObject) return FONT_SIZE;

      // @ts-ignore
      const value = selctedObject.get("fontSize") || FONT_SIZE;

      return value;
    },
    onCopy: () => copy(),
    onPaste: () => paste(),
    canvas,
    selectedObjects,
  };
};

export default function useEditor({ clearSelectionCallback }: EditorHookProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);

  const { copy, paste } = useClipboard({ canvas });

  useAutoResize({ canvas, container });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        copy,
        paste,
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        strokeDashArray,
        selectedObjects,
        fontFamily,
        setStrokeDashArray,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        setFontFamily,
      });
    }

    return undefined;
  }, [
    copy,
    paste,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
    fontFamily,
  ]);

  const init = useCallback(
    ({ initialCanvas, initialContainer }: UseEditorProps) => {
      fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: "#fff",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );

  return { init, editor };
}
