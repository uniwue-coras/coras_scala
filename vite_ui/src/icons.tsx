import { ReactElement } from 'react';

type IconFunc = () => ReactElement;

export const UpdateIcon: IconFunc = () => <>&#x27F3;</>;

export const CheckmarkIcon: IconFunc = () => <>&#x2713;</>;

export const HamburgerIcon: IconFunc = () => <>&#9776;</>;

export const EmptySetIcon: IconFunc = () => <>&#x2205;</>;

export const ResetIcon: IconFunc = () => <>&#8634;</>;

export const UploadIcon: IconFunc = () => <>&uarr;</>;

export const WrongIcon: IconFunc = () => <>&#10006;</>;

export const DeleteIcon: IconFunc = () => <>&#x2421;</>;

export const DashIcon: IconFunc = () => <>&mdash;</>;

export const GearIcon: IconFunc = () => <>&#x2699;</>;

export const FullWidthQuestionMarkIcon: IconFunc = () => <>&#xFF1F;</>;

// TODO: use &#x232B;?
export const EditIcon: IconFunc = () => <>&#x270E;</>;
