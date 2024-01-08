import { SideSelector } from './CorrectSolutionView';

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

