import { ReactElement } from 'react';
import { ParagraphSynonymFragment, ParagraphSynonymIdentifierFragment, useParagraphSynonymManagementQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { useTranslation } from 'react-i18next';
import { ParagraphSynonymForm } from './ParagraphSynonymForm';

interface IProps {
  paragraphSynonyms: ParagraphSynonymFragment[];
  refetch: () => void;
}

const keyFunc = ({ paragraphType, paragraphNumber, section, lawCode }: ParagraphSynonymIdentifierFragment): string => `${paragraphType}${paragraphNumber}-${section}${lawCode}`;


function Inner({ paragraphSynonyms, refetch }: IProps): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto">
      <h1 className="my-4 font-bold text-xl text-center">{t('paragraphSynonym_plural')}</h1>

      <div className="grid grid-cols-7 gap-2 text-center">
        <div className="col-span-5">{t('paragraph')}</div>
        <div>{t('synonym')}</div>
        <div />
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        <div>{t('paragraphType')}</div>
        <div>{t('paragraphNumber')}</div>
        <div>{t('section')}</div>
        <div>{t('sentenceNumber')}</div>
        <div>{t('lawCode')}</div>
        <div />
        <div />
      </div>

      {paragraphSynonyms.map((paragraphSynonym) => <ParagraphSynonymForm key={keyFunc(paragraphSynonym)} paragraphSynonym={paragraphSynonym} onUpdated={refetch} />)}

      <ParagraphSynonymForm onUpdated={refetch} />
    </div >
  );
}

export function ParagraphSynonymManagement(): ReactElement {
  return (
    <WithQuery query={useParagraphSynonymManagementQuery()}>
      {({ paragraphSynonyms }, refetch) => <Inner paragraphSynonyms={paragraphSynonyms} refetch={refetch} />}
    </WithQuery>
  );
}
