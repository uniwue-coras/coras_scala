export const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9016' : '';

export const homeUrl = '/';

export const changePasswordUrl = '/changePassword';

export const adminsUrl = '/admins';

export const correctorsUrl = '/correctors';

export const registerUrl = '/register';

export const loginUrl = '/login';

export const createExerciseUrl = '/createExercise';

export const exercisesBaseUrl = '/exercises';


// fragments

export const solutionsUrlFragment = 'solutions';

export const submitUrlFragment = 'submit';

export const correctSolutionUrlFragment = 'correctSolution';

export const updateCorrectionUrlFragment = 'updateCorrection';
