import { ReactElement, useState } from 'react';
import { ParagraphSynonymIdentifierInput, ParagraphSynonymInput, useCreateParagraphSynonymMutation, useDeleteParagraphSynonymMutation, useUpdateParagraphSynonymMutation } from '../graphql';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import classnames from 'classnames';
import { DeleteIcon, ResetIcon, UploadIcon } from '../icons';

interface IProps {
  paragraphSynonym?: ParagraphSynonymInput;
  onUpdated: () => void;
}

const paragraphSynonymInputSchema: yup.ObjectSchema<ParagraphSynonymInput> = yup
  .object({
    paragraphType: yup.string().required(),
    paragraphNumber: yup.number().required(),
    section: yup.number().required(),
    sentenceNumber: yup.number().notRequired(),
    lawCode: yup.string().required(),
    synonym: yup.string().required()
  })
  .required();

const emptyParagraphSynonym: ParagraphSynonymInput = {
  paragraphType: '',
  paragraphNumber: 0,
  section: 0,
  sentenceNumber: undefined,
  lawCode: '',
  synonym: ''
};

export function ParagraphSynonymForm({ paragraphSynonym, onUpdated }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const [changed, setChanged] = useState(false);

  const [createParagraphSynonym, { loading: createLoading }] = useCreateParagraphSynonymMutation();
  const [updateParagraphSynonym, { loading: updateLoading }] = useUpdateParagraphSynonymMutation();
  const [deleteParagraphSynonym, { loading: deleteLoading }] = useDeleteParagraphSynonymMutation();

  const loading = createLoading || updateLoading || deleteLoading;
  const isNew = paragraphSynonym === undefined;

  const upload = async ({ paragraphType, paragraphNumber, section, sentenceNumber, lawCode, synonym }: ParagraphSynonymInput, { resetForm }: FormikHelpers<ParagraphSynonymInput>) => {
    if (isNew) {
      await createParagraphSynonym({ variables: { paragraphSynonymInput: { paragraphType, paragraphNumber, section, sentenceNumber, lawCode, synonym } } });
      resetForm();
      blur();
    } else {
      const paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput = { paragraphType, paragraphNumber, section, lawCode };
      await updateParagraphSynonym({ variables: { paragraphSynonymIdentifierInput, maybeSentenceNumber: sentenceNumber, synonym } });
    }

    onUpdated();
  };

  const onDelete = async ({ paragraphType, paragraphNumber, section, lawCode }: ParagraphSynonymIdentifierInput) => {
    const paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput = { paragraphType, paragraphNumber, section, lawCode };
    await deleteParagraphSynonym({ variables: { paragraphSynonymIdentifierInput } });
    onUpdated();
  };

  const readSentenceNumber = (value: string): number | undefined => value.trim().length > 0
    ? parseInt(value)
    : undefined;

  return (
    <Formik initialValues={paragraphSynonym || emptyParagraphSynonym} validationSchema={paragraphSynonymInputSchema} onSubmit={upload} enableReinitialize>
      {({ values, resetForm, setFieldValue, touched, errors }) =>
        <Form onChange={() => setChanged(true)}>
          <div className="grid grid-cols-7 gap-2">
            <Field type="text" name="paragraphType" required className={classnames('p-2 rounded border w-full', touched.paragraphType && errors.paragraphType ? 'border-red-500' : 'border-slate-500')} />

            <Field type="number" name="paragraphNumber" required className={classnames('p-2 rounded border w-full', touched.paragraphNumber && errors.paragraphNumber ? 'border-red-500' : 'border-slate-500')} />

            <Field type="number" name="section" required className={classnames('p-2 rounded border w-full', touched.section && errors.section ? 'border-red-500' : 'border-slate-500')} />

            <input type="number" name="sentenceNumber" defaultValue={values.sentenceNumber || undefined}
              onChange={(event) => setFieldValue('sentenceNumber', readSentenceNumber(event.target.value))} className={classnames('p-2 rounded border w-full', touched.sentenceNumber && errors.sentenceNumber ? 'border-red-500' : 'border-slate-500')} />

            <Field type="text" name="lawCode" required className={classnames('p-2 rounded border w-full', touched.lawCode && errors.lawCode ? 'border-red-500' : 'border-slate-500')} />

            <Field type="text" name="synonym" required className={classnames('p-2 rounded border w-full', touched.synonym && errors.synonym ? 'border-red-500' : 'border-slate-500')} />

            <div className="grid grid-cols-2 gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50" title={t('update')} disabled={!changed || loading}>
                <UploadIcon />
              </button>
              <button type="button" className="px-4 py-2 rounded bg-red-500 text-white disabled:opacity-50" title={t('delete')} disabled={loading} onClick={() => isNew ? resetForm() : onDelete(values)}>
                {isNew ? <ResetIcon /> : <DeleteIcon />}
              </button>
            </div>

          </div>

          <div className="my-2">
            <ErrorMessage name="paragraphType">{(msg) => <div className="my-2 italic text-sm text-cyan-700">{msg}</div>}</ErrorMessage>
            <ErrorMessage name="paragraphNumber">{(msg) => <div className="my-2 italic text-sm text-cyan-700">{msg}</div>}</ErrorMessage>
          </div>
        </Form>}
    </Formik>
  );
}
