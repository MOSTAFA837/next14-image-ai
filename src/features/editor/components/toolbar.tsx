import Hint from "@/components/hint";
import {
  ActiveTool,
  Editor,
  FILL_COLOR,
  FONT_SIZE,
  FONT_WEIGHT,
  STROKE_COLOR,
  alignTypes,
} from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BsBorderWidth } from "react-icons/bs";
import { ArrowDown, ArrowUp, ChevronDown, Trash } from "lucide-react";
import { RxTransparencyGrid } from "react-icons/rx";
import { isTextType } from "../utils";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { TbColorFilter } from "react-icons/tb";
import { useState } from "react";
import { FontSizeInput } from "./font-size-input";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function Toolbar({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) {
  const initialFillColor = editor?.getActiveFillColor() || FILL_COLOR;
  const initialStrokeColor = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontUnderline = editor?.getActiveFontUnderline();
  const initialFontLinethrough = editor?.getActiveFontLinethrough();
  const initialTextAlign = editor?.getActiveTextAlign();
  const initialTextSize = editor?.getActiveFontSize() || FONT_SIZE;

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontUnderline: initialFontUnderline,
    fontLinethrough: initialFontLinethrough,
    textAlign: initialTextAlign,
    fontSize: initialTextSize,
  });

  const selectedObjectsType = editor?.selectedObjects[0]?.type;
  const selectedObject = editor?.selectedObjects[0];

  const isText = isTextType(selectedObjectsType);
  const isImage = selectedObjectsType === "image";

  const toggleBold = () => {
    if (!selectedObject) return;

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      fontweight: newValue,
    }));
  };

  const toggleItalic = () => {
    if (!selectedObject) return;

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObject) return;

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };

  const toggleLinethrough = () => {
    if (!selectedObject) return;

    const newValue = properties.fontLinethrough ? false : true;

    editor?.changeFontLinethrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLinethrough: newValue,
    }));
  };

  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) return;

    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  };

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      {!isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Color" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "fill" && "bg-gray-100")}
            >
              <div
                className="rounded-sm size-4 border"
                style={{ backgroundColor: properties.fillColor }}
              />
            </Button>
          </Hint>
        </div>
      )}

      {!isText && (
        <>
          <div className="flex items-center h-full justify-center">
            <Hint label="Stroke color" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("stroke-color")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-color" && "bg-gray-100")}
              >
                <div
                  className="rounded-sm size-4 border-2 bg-white"
                  style={{ borderColor: properties.strokeColor }}
                />
              </Button>
            </Hint>
          </div>

          <div className="flex items-center h-full justify-center">
            <Hint label="Stroke width" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("stroke-width")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-width" && "bg-gray-100")}
              >
                <BsBorderWidth className="size-4" />
              </Button>
            </Hint>
          </div>
        </>
      )}

      {isText && (
        <>
          <div className="flex items-center h-full justify-center">
            <Hint label="Font" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("font")}
                size="icon"
                variant="ghost"
                className={cn(
                  "w-auto px-2 text-sm",
                  activeTool === "font" && "bg-gray-100"
                )}
              >
                <div className="max-w-[100px] truncate">
                  {properties.fontFamily}
                </div>
                <ChevronDown className="size-4 ml-2 shrink-0" />
              </Button>
            </Hint>
          </div>

          <div className="flex items-center h-full justify-center">
            <Hint label="Bold" side="bottom" sideOffset={5}>
              <Button
                onClick={toggleBold}
                size="icon"
                variant="ghost"
                className={cn(properties.fontWeight > 500 && "bg-gray-200")}
              >
                <FaBold className="size-4" />
              </Button>
            </Hint>
          </div>

          <div className="flex items-center h-full justify-center">
            <Hint label="Italic" side="bottom" sideOffset={5}>
              <Button
                onClick={toggleItalic}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontStyle === "italic" && "bg-gray-200"
                )}
              >
                <FaItalic className="size-4" />
              </Button>
            </Hint>
          </div>

          <div className="flex items-center h-full justify-center">
            <Hint label="Underline" side="bottom" sideOffset={5}>
              <Button
                onClick={toggleUnderline}
                size="icon"
                variant="ghost"
                className={cn(properties.fontUnderline && "bg-gray-200")}
              >
                <FaUnderline className="size-4" />
              </Button>
            </Hint>
          </div>

          <div className="flex items-center h-full justify-center">
            <Hint label="Strike" side="bottom" sideOffset={5}>
              <Button
                onClick={toggleLinethrough}
                size="icon"
                variant="ghost"
                className={cn(properties.fontLinethrough && "bg-gray-200")}
              >
                <FaStrikethrough className="size-4" />
              </Button>
            </Hint>
          </div>

          {alignTypes.map((item, i) => {
            const Icon = item.icon;

            return (
              <div key={i} className="flex items-center h-full justify-center">
                <Hint
                  label={`Align ${item.align}`}
                  side="bottom"
                  sideOffset={5}
                >
                  <Button
                    onClick={() => onChangeTextAlign(item.align)}
                    size="icon"
                    variant="ghost"
                    className={cn(
                      properties.textAlign === item.align && "bg-gray-200"
                    )}
                  >
                    <Icon className="size-4" />
                  </Button>
                </Hint>
              </div>
            );
          })}

          <div className="flex items-center h-full justify-center">
            <FontSizeInput
              value={properties.fontSize}
              onChange={onChangeFontSize}
            />
          </div>
        </>
      )}

      {isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Filters" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("filter")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "filter" && "bg-gray-100")}
            >
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      <div className="flex items-center h-full justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-200")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.delete()}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-200")}
          >
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
}
