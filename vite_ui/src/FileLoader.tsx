import { useTranslation } from 'react-i18next';
import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import classNames from 'classnames';

interface IProps {
  accept?: string;
  loadFile: (file: File) => Promise<void>;
}

export function FileLoader({ accept, loadFile }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  async function onChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    if (event.target.files && event.target.files.length === 1) {
      setLoading(true);

      await loadFile(event.target.files[0])
        .catch((err) => console.error(err));

      setLoading(false);
    }
  }

  const classes = classNames('p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', { 'opacity-50': loading });

  return (
    <div className="mt-4">
      <button type="button" className={classes} onClick={() => fileInput.current && fileInput.current.click()} disabled={loading}>
        {t('loadFile')}
      </button>
      <input type="file" ref={fileInput} accept={accept} onChange={onChange} hidden />
    </div>
  );
}
