import {FetchResult} from '@apollo/client';

export async function executeMutation<T>(
  mutation: () => Promise<FetchResult<T>>,
  f: (t: T) => void
): Promise<void> {
  try {
    const {data} = await mutation();

    if (data) {
      f(data);
    }
  } catch (error) {
    console.error(error);
  }
}
