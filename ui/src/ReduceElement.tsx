interface IProps {
  isReduced: boolean;
  toggleIsReduced: () => void;
}

export function ReduceElement({isReduced, toggleIsReduced}: IProps): JSX.Element {
  return (
    <span onClick={toggleIsReduced}>{isReduced ? <span>&gt;</span> : <span>&or;</span>}</span>
  );
}
