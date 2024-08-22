import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import * as material from "material-colors";

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.blueGrey["500"],
  "transparent",
];

export const selectionDependentTools = [
  "fill",
  "font",
  "filter",
  "opacity",
  "remove-bg",
  "stroke-color",
  "stroke-width",
];

export const alignTypes = [
  {
    align: "left",
    icon: AlignLeft,
  },
  {
    align: "center",
    icon: AlignCenter,
  },
  {
    align: "right",
    icon: AlignRight,
  },
];

export const fonts = [
  "Arial",
  "Arial Black",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Palatino",
  "Bookman",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Geneva",
  "Lucida Console",
];

export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates";

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 52;
export const FONT_WEIGHT = 400;

const SHAPE_COMMON_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const CIRCLE_OPTIONS = {
  SHAPE_COMMON_OPTIONS,
  radius: 200,
};

export const RECTANGLE_OPTIONS = {
  SHAPE_COMMON_OPTIONS,
  width: 400,
  height: 400,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  SHAPE_COMMON_OPTIONS,
  width: 400,
  height: 400,
  angle: 0,
};

export const DIAMOND_OPTIONS = {
  SHAPE_COMMON_OPTIONS,
  width: 600,
  height: 600,
  angle: 0,
};

export const HEXAGON_OPTIONS = {
  SHAPE_COMMON_OPTIONS,
  width: 300,
  height: 300,
  angle: 0,
};

export const TEXT_OPTIONS = {
  type: "textbox",
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

export interface EditorHookProps {
  clearSelectionCallback?: () => void;
}

export type BuilsEditorProps = {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontFamily: string;
  selectedObjects: fabric.Object[];
  strokeDashArray: number[];
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  setStrokeDashArray: (value: number[]) => void;
  setFontFamily: (value: string) => void;
};

export interface Editor {
  addImage: (value: string) => void;
  delete: () => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  changeOpacity: (value: number) => void;
  changeFontFamily: (value: string) => void;
  changeFontWeight: (value: number) => void;
  changeFontSize: (value: number) => void;
  changeFontStyle: (value: string) => void;
  changeTextAlign: (value: string) => void;
  changeFontLinethrough: (value: boolean) => void;
  changeFontUnderline: (value: boolean) => void;
  getActiveOpacity: () => number;
  bringForward: () => void;
  sendBackwards: () => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeDashArray: (value: number[]) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  addHexagon: () => void;
  selectedObjects: fabric.Object[];
  canvas: fabric.Canvas;
  getActiveFillColor: () => void;
  getActiveStrokeColor: () => void;
  getActiveStrokeًWidth: () => void;
  getActiveFontFamily: () => string;
  getActiveStrokeًDashArray: () => number[];
  getActiveFontWeight: () => number;
  getActiveFontSize: () => number;
  getActiveFontStyle: () => string;
  getActiveTextAlign: () => string;
  getActiveFontLinethrough: () => boolean;
  getActiveFontUnderline: () => boolean;
}
