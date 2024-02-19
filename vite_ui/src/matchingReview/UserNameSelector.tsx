import { ReactElement, SetStateAction } from "react";

interface IProps {
  exerciseId: number;
  username: string;
  currentUserIndex: number;
  maxNumber: number;
  setCurrentUserIndex: (value: SetStateAction<number>) => void;
}

export function UserNameSelector({ exerciseId, username, currentUserIndex, maxNumber, setCurrentUserIndex }: IProps): ReactElement {
  return (
    <div className="container mx-auto my-4 grid grid-cols-3 gap-2">
      <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-50" disabled={currentUserIndex <= 0}
        onClick={() => setCurrentUserIndex((index) => index - 1)}>
        previous
      </button>
      <div className="p-2 font-bold text-center">
        {exerciseId} - {username} ({currentUserIndex + 1} / {maxNumber})
      </div>
      <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-60" disabled={currentUserIndex >= maxNumber - 1}
        onClick={() => setCurrentUserIndex((index) => index + 1)}>
        next
      </button>
    </div>
  );
}
