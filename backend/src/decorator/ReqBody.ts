import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request, RequestSegment } from '@/http/types';
import { RequestValidationError } from '@/exception/validation/RequestValidationError';
import { Validator } from '@/util/zod';

export const ReqBody = createParamDecorator<
	Validator<unknown>,
	ExecutionContext,
	unknown
>((schema: Validator<unknown>, ctx: ExecutionContext): unknown => {
	const request = ctx.switchToHttp().getRequest<Request>();

	const result = schema.parse(request.body);
	if (!result.success) {
		throw RequestValidationError.fromZodIssue(
			RequestSegment.Body,
			result.error.issues
		);
	}

	return result.data;
});
