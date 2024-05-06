import { useTranslation } from 'react-i18next';
import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import classNames from 'classnames';

interface IProps {
  accept?: string;
  loadFiles: (files: File[]) => Promise<void>;
}

export function MultiFileLoader({ accept, loadFiles }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setLoading(true);

      try {
        await loadFiles(Array.from(event.target.files));
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }
  };

  const classes = classNames('p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', { 'opacity-50': loading });

  return (
    <div className="mt-4">
      <button type="button" className={classes} onClick={() => fileInput.current && fileInput.current.click()} disabled={loading}>
        {t('loadFiles')}
      </button>
      <input type="file" multiple={true} ref={fileInput} accept={accept} onChange={onChange} hidden />
    </div>
  );
}
