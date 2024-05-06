import { FetchResult } from '@apollo/client';

export async function executeMutation<T>(
  mutation: () => Promise<FetchResult<T>>,
  f: (t: T) => void = () => void 0,
  onError: (e: unknown) => void = (error) => console.error(error)
): Promise<void> {
  try {
    const { data } = await mutation();

    if (data) {
      f(data);
    }
  } catch (error) {
    onError(error);
  }
}
