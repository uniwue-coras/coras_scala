import { Applicability, ErrorType, Importance } from '../graphql';

export function stringifyApplicability(a: Applicability): string {
  return {
    [Applicability.NotSpecified]: '',
    [Applicability.NotApplicable]: '(-)',
    [Applicability.Applicable]: '(+)'
  }[a];
}

export const errorTypes: ErrorType[] = [ErrorType.Neutral, ErrorType.Missing, ErrorType.Wrong];

export const importanceTypes: Importance[] = [Importance.Less, Importance.Medium, Importance.More];

export function importanceSymbol(importance: Importance): string {
  return {
    [Importance.Less]: '  *',
    [Importance.Medium]: ' **',
    [Importance.More]: '***'
  }[importance];
}

export function importanceFontStyle(importance: Importance): string {
  return {
    [Importance.Less]: 'italic',
    [Importance.Medium]: '',
    [Importance.More]: 'font-bold'
  }[importance];
}
