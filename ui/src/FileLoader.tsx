import {useTranslation} from 'react-i18next';
import {ChangeEvent, useRef, useState} from 'react';
import classNames from 'classnames';

interface IProps {
  accept?: string;
  loadFile: (file: File) => Promise<void>;
}

export function FileLoader({accept, loadFile}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files.length === 1) {
      setLoading(true);
      loadFile(event.target.files[0]).then(() => setLoading(false));
    }
  }

  return (
    <div className="mt-4">
      <button type="button" className={classNames('p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'opacity-50': loading})}
              onClick={() => fileInput.current && fileInput.current.click()} disabled={loading}>
        {t('loadFile')}
      </button>
      <input type="file" ref={fileInput} accept={accept} onChange={onChange} hidden/>
    </div>
  );
}
