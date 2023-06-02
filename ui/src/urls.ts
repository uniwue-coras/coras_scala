export const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9016' : '';

export const homeUrl = '/';

// User management

export const registerUrl = '/register';
export const loginUrl = '/login';
export const changePasswordUrl = '/changePassword';
export const userManagementUrl = 'userManagement';

// Other urls

export const relatedWordManagementUrl = '/manageRelatedWords';
export const abbreviationManagementUrl = '/abbreviationManagement';

