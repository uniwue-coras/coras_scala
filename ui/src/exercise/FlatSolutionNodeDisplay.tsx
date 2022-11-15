import {FlatSolutionNodeFragment} from '../graphql';
import {MouseEvent} from 'react';
import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, SideSelector} from './NewCorrectSolutionContainer';
import {useTranslation} from 'react-i18next';

export const indentPerRow = 40;

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[];
  updateNodeId: (id?: number | undefined) => void;
}

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side?: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => void;
}

interface IProps {
  side: SideSelector;
  matches: ColoredMatch[];
  currentNode: FlatSolutionNodeFragment;
  allNodes: FlatSolutionNodeFragment[];
  depth?: number;
  showSubTexts: boolean;
  selectedNodeId: MarkedNodeIdProps;
  dragProps: DragStatusProps;
  clearMatch: (clickedNodeId: number) => void;
}

export function getFlatSolutionNodeChildren(allNodes: FlatSolutionNodeFragment[], currentId?: number | null): FlatSolutionNodeFragment[] {
  return allNodes.filter(({parentId}) =>
    currentId === undefined || currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

export function FlatSolutionNodeDisplay({
  side,
  matches,
  currentNode,
  allNodes,
  depth = 0,
  showSubTexts,
  selectedNodeId,
  dragProps,
  clearMatch
}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const {id, subTexts} = currentNode;

  const ownMatches = side === SideSelector.Sample
    ? matches.filter(({sampleValue}) => id === sampleValue)
    : matches.filter(({userValue}) => id === userValue);

  const mainMatch: ColoredMatch | undefined = ownMatches.length === 1 ? ownMatches[0] : undefined;

  const isSelected = selectedNodeId.nodeId === id;
  const isMatchingSelected = selectedNodeId.matchingNodeIds.includes(id);


  function onClearClick(event: MouseEvent): void {
    event.stopPropagation();
    clearMatch(id);
  }

  return (
    <div>
      <div className="my-2 p-2" onClick={() => isSelected ? selectedNodeId.updateNodeId() : selectedNodeId.updateNodeId(id)}>
        <FlatNodeText side={side} depth={depth} node={currentNode} dragProps={dragProps} mainMatch={mainMatch}/>
        {isMatchingSelected &&
          <span className="ml-2 p-2 rounded border border-red-600" title={t('clearMatch')} onClick={onClearClick}>X</span>}
      </div>

      {showSubTexts &&
        <div style={{marginLeft: `${indentPerRow / 2}px`}}>
          {subTexts.map((subText, index) => <p key={index}>{subText.text}</p>)}
        </div>
      }

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {getFlatSolutionNodeChildren(allNodes, id).map((child) =>
          <FlatSolutionNodeDisplay key={child.childIndex} matches={matches} side={side} currentNode={child} allNodes={allNodes} depth={depth + 1}
                                   showSubTexts={showSubTexts} selectedNodeId={selectedNodeId} dragProps={dragProps} clearMatch={clearMatch}/>
        )}
      </div>
    </div>
  );
}
