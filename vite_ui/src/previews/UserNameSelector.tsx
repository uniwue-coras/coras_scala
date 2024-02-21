import { ReactElement, SetStateAction } from "react";

interface IProps {
  currentUserIndex: number;
  allUsernames: string[];
  setCurrentUserIndex: (value: SetStateAction<number>) => void;
}

export function UserNameSelector({ currentUserIndex, allUsernames, setCurrentUserIndex }: IProps): ReactElement {

  const username = allUsernames[currentUserIndex];
  const maxNumber = allUsernames.length;

  return (
    <div className="container mx-auto my-4 flex space-x-2">
      <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-50" disabled={currentUserIndex <= 0}
        onClick={() => setCurrentUserIndex((index) => index - 1)}>
        previous
      </button>
      <select value={username} className="flex-grow p-2 rounded border border-slate-500 bg-white w-full" onChange={(event) => setCurrentUserIndex(parseInt(event.target.value))}>
        {allUsernames.map((username, index) => <option key={username} value={index}>{username}</option>)}
      </select>
      <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-60" disabled={currentUserIndex >= maxNumber - 1}
        onClick={() => setCurrentUserIndex((index) => index + 1)}>
        next
      </button>
    </div>
  );
}
