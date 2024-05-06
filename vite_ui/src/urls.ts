export const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9016' : '';

export const homeUrl = '/';

// User management

export const registerUrl = 'register';
export const loginUrl = 'login';
export const changePasswordUrl = 'changePassword';
export const userManagementUrl = 'userManagement';

// correction & review

export const createExerciseUrl = 'createExercise';

export const submitForeignSolutionUrlFragment = 'submitForeignSolution';
export const batchUploadSolutionsUrlFragment = 'batchUploadSolutions';
export const submitOwnSolutionUrlFragment = 'submitOwnSolution';
export const reviewCorrectionUrlFragment = 'reviewCorrection';

// correction helper management urls

export const relatedWordManagementUrl = '/manageRelatedWords';
export const abbreviationManagementUrl = '/abbreviationManagement';
export const paragraphSynonymManagementUrl = '/paragraphSynonymManagement';
