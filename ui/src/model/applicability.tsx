export enum Applicability {
  NotSpecified = 'NotSpecified',
  NotApplicable = 'NotApplicable',
  Applicable = 'Applicable'
}

export const applicabilityValues: Applicability[] = [Applicability.NotSpecified, Applicability.NotApplicable, Applicability.Applicable];

export function stringifyApplicability(a: Applicability): string {
  switch (a) {
    case Applicability.NotSpecified:
      return '(k. a.)';
    case Applicability.NotApplicable:
      return '(-)';
    case Applicability.Applicable:
      return '(+)';
  }
}
