import { ReactElement } from 'react';
import { ParagraphCitationAnnotationInput } from '../../graphql';
import { Field, Form, Formik } from 'formik';
import { CorrectnessIcon } from '../CorrectnessIcon';
import { CancelIcon, CheckmarkIcon, LeftRightArrow } from '../../icons';
import { correctnessTextColor } from '../../model/correctness';
import { nextCorrectness } from '../../correctness';
import { RecommendationSelect } from '../RecommendationSelect';
import classNames from 'classnames';


interface IProps {
  initialValues: ParagraphCitationAnnotationInput;
  recommendations: string[];
  setKeyHandlingEnabled: (value: boolean) => void;
  onSubmit: (paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => void;
  onCancel: () => void;
}

const inputClasses = 'flex-auto p-2 rounded border border-slate-500';

export function ParagraphCitationAnnotationForm({ initialValues, recommendations, setKeyHandlingEnabled, onSubmit, onCancel }: IProps): ReactElement {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setFieldValue }) =>
        <Form>

          <div className="flex flex-row items-start space-x-2">
            <button type="button" className={classNames('px-4 py-2 rounded border border-slate-500', correctnessTextColor(values.correctness))}
              onClick={() => setFieldValue('correctness', nextCorrectness(values.correctness))}>
              <CorrectnessIcon correctness={values.correctness} />
            </button>

            <div className="flex-grow space-y-2">
              <div className="flex flex-row space-x-2">
                <Field className={inputClasses} name="awaitedParagraph" onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />
                <span className="py-2"><LeftRightArrow /></span>
                <Field className={inputClasses} name="citedParagraph" onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />
              </div>

              <Field className={classNames(inputClasses, 'w-full')} name="explanation" onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />
            </div>

            <div className="flex flex-col space-y-2">
              <button type="reset" className="p-2 text-red-500" onClick={onCancel}><CancelIcon /></button>
              <button type="submit" className="p-2 text-blue-500" ><CheckmarkIcon /></button>
            </div>
          </div>

          <div className="my-2">
            {recommendations.length > 0 && <RecommendationSelect recommendations={recommendations} apply={(value) => setFieldValue('explanation', value)} />}
          </div>
        </Form>}
    </Formik>
  );
}
