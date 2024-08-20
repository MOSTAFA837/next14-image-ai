import { cn } from "@/lib/utils";
import { ActiveTool, Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function StrokeWidthSidebar({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) {
  const widthValue = editor?.getActiveStrokeًWidth() || STROKE_WIDTH;
  const typeValue = editor?.getActiveStrokeًDashArray() || STROKE_DASH_ARRAY;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "stroke-width" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Stroke options"
        description="Modify the stroke width of your element"
      />

      <ScrollArea>
        <div className="p-4 space-y-6 border-b">
          <label className="text-sm">Stroke width</label>

          <Slider
            value={[widthValue]}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
          />
        </div>

        <div className="p-4 space-y-6 border-b">
          <label className="text-sm">Stroke type</label>

          <Button
            onClick={() => onChangeStrokeType([])}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left",
              JSON.stringify(typeValue) === `[]`
                ? "border-2 border-blue-400 opacity-100"
                : "opacity-65"
            )}
            style={{ padding: "8px 16px" }}
          >
            <div className="w-full border-black rounded-full border-4" />
          </Button>

          <Button
            onClick={() => onChangeStrokeType([5, 5])}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left",
              JSON.stringify(typeValue) === `[5,5]`
                ? "border-2 border-blue-400 opacity-100"
                : "opacity-65"
            )}
            style={{ padding: "8px 16px" }}
          >
            <div className="w-full border-black rounded-full border-4 border-dashed" />
          </Button>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
}
