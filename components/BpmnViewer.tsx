"use client"

// --- Import der Komponenten (bpmn-js fuer den Viewer) ---
import React, { useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

// --- Definition der Komponente ---
const BpmnViewerComponent = ({ xml }: { xml: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewer = new BpmnViewer({ container: containerRef.current! });
    viewer.importXML(xml).then(() => {
      (viewer.get('canvas') as any).zoom('fit-viewport');
    });
    return () => { viewer.destroy(); };
  }, [xml]);

// --- Rueckgabe der Komponente  durch rendern ---
  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

export default BpmnViewerComponent; 