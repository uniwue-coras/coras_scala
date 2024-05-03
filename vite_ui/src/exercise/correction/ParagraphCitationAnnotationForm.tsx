import { ReactElement } from 'react';
import { ParagraphCitationAnnotationInput } from '../../graphql';
import { Field, Form, Formik } from 'formik';
import { CorrectnessIcon } from '../CorrectnessIcon';
import { CancelIcon, CheckmarkIcon, LeftRightArrow } from '../../icons';
import { correctnessTextColor } from '../../model/correctness';
import { nextCorrectness } from '../../correctness';
import classNames from 'classnames';

interface IProps {
  initialValues: ParagraphCitationAnnotationInput;
  setKeyHandlingEnabled: (value: boolean) => void;
  onSubmit: (paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => void;
  onCancel: () => void;
}

const inputClasses = 'flex-auto p-2 rounded border border-slate-500';

export function ParagraphCitationAnnotationForm({ initialValues, setKeyHandlingEnabled, onSubmit, onCancel }: IProps): ReactElement {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setFieldValue }) =>
        <Form>

          <div className="flex flex-row items-start space-x-2">
            <button type="button" className={classNames('p-2 rounded border border-slate-500', correctnessTextColor(values.correctness))}
              onClick={() => setFieldValue('correctness', nextCorrectness(values.correctness))}>
              <CorrectnessIcon correctness={values.correctness} />
            </button>

            <div className="flex-grow space-y-2">
              <div className="flex flex-row space-x-2">
                <Field className={inputClasses} name="awaitedParagraph" onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />

                <span><LeftRightArrow /></span>

                <Field className={inputClasses} name="citedParagraph" onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />

                <button type="reset" className="text-red-500" onClick={onCancel}><CancelIcon /></button>
                <button type="submit" className="text-blue-500" ><CheckmarkIcon /></button>
              </div>

              <Field className={classNames(inputClasses, 'w-full')} name="explanation" onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />
            </div>
          </div>

        </Form>}
    </Formik>
  );
}
