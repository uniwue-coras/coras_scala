import { AnnotationImportance } from './graphql';

export function fontStyleForAnnoImportance(importance: AnnotationImportance): string {
  return {
    [AnnotationImportance.Less]: 'italic',
    [AnnotationImportance.Medium]: '',
    [AnnotationImportance.More]: 'font-bold'
  }[importance];
}
