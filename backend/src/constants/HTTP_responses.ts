export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const;

export const API_RESPONSES = {
  AUTH_REQUIRED: {
    status: HTTP_STATUS.UNAUTHORIZED,
    description: 'Unauthorized. Authentication required',
  },
  ADMIN_REQUIRED: {
    status: HTTP_STATUS.FORBIDDEN,
    description: 'Forbidden. Admin access required',
  },
  NOT_FOUND: {
    status: HTTP_STATUS.NOT_FOUND,
    description: 'Resource not found',
  },
  BAD_REQUEST: {
    status: HTTP_STATUS.BAD_REQUEST,
    description: 'Invalid input with error message',
  },
} as const;
