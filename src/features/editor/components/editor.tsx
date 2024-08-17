"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";

import useEditor from "../hooks/use-editor";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import Footer from "./footer";

export default function Editor() {
  const { init } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar />

      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar />

        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar />

          <div
            className="h-[calc(100%-176px)] flex-1 bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
