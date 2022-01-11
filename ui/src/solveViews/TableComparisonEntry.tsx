import {ComparisonResult} from '../model/correction/comparisonResult';

interface IProps<T> {
  name: string;
  comparisonResult: ComparisonResult<T>;
  describeValue: (t: T) => string;
}

export function ComparisonResultTableEntryDisplay<T>({name, comparisonResult, describeValue}: IProps<T>): JSX.Element {

  const {userValue, sampleValue, correct, explanation} = comparisonResult;

  return (
    <>
      <tr>
        <td className="has-text-weight-bold">{correct ? <span>&#10004;</span> : <span>&#10008;</span>} {name}</td>
        <td className={correct ? 'has-text-success' : 'has-text-danger'}>{describeValue(userValue)}</td>
        <td>{describeValue(sampleValue)}</td>
      </tr>
      <tr>
        <td colSpan={3}>
          <input type="text" className="input" defaultValue={explanation}/>
        </td>
      </tr>
    </>
  );
}
