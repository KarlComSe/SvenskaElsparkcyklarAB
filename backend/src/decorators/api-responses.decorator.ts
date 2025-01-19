import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { API_RESPONSES, HTTP_STATUS } from '../constants/HTTP_responses';

export const ApiAuthResponses = () => {
  return applyDecorators(ApiResponse(API_RESPONSES.AUTH_REQUIRED));
};

export const ApiAdminResponses = () => {
  return applyDecorators(
    ApiResponse(API_RESPONSES.AUTH_REQUIRED),
    ApiResponse(API_RESPONSES.ADMIN_REQUIRED),
  );
};

export const ApiNotFoundResponses = () => {
  return applyDecorators(ApiResponse(API_RESPONSES.NOT_FOUND));
};

export const ApiBadRequestResponse = (description: string = 'Invalid input') => {
  return ApiResponse({
    status: HTTP_STATUS.BAD_REQUEST,
    description,
  });
};
