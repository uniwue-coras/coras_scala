export interface RawUserSolutionEntry {
  id: number;
  text: string;
  subTexts: string[];
  children: RawUserSolutionEntry[];
}

/*
function inflateRawSolutionRecurse(entries: RawFlatUserSolutionEntryFragment[], searchedParentId: number): RawUserSolutionEntry[] {
  return entries
    .filter(({parentId}) => parentId == searchedParentId)
    .map(({id, text, subTexts}) => {
      return {id, text, subTexts, children: inflateRawSolutionRecurse(entries, id)};
    });
}

export function inflateRawSolution(entries: RawFlatUserSolutionEntryFragment[]): RawUserSolutionEntry[] {
  return entries
    .filter(({parentId}) => !parentId)
    .map(({id, text, subTexts}) => {
      return {id, text, subTexts, children: inflateRawSolutionRecurse(entries, id)};
    });
}
 */