import { SideSelector } from './SideSelector';

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

export const dummyDragProps: DragStatusProps = {
  draggedSide: undefined,
  setDraggedSide: () => void 0,
  onDrop: () => new Promise((/* resolve */ _, reject) => reject('TODO!'))
};
