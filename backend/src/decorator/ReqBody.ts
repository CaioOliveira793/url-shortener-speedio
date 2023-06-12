import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request, RequestSegment } from '@/http/types';
import { RequestValidationError } from '@/exception/validation/RequestValidationError';
import { makeInvalidDataIssueFromZodIssue } from '@/common/type';
import { Validator } from '@/util/zod';

export const ReqBody = createParamDecorator<
	Validator<unknown>,
	ExecutionContext,
	unknown
>((schema: Validator<unknown>, ctx: ExecutionContext): unknown => {
	const request = ctx.switchToHttp().getRequest<Request>();

	const result = schema.parse(request.body);
	if (!result.success) {
		throw new RequestValidationError(
			RequestSegment.Body,
			result.error.issues.map(makeInvalidDataIssueFromZodIssue)
		);
	}

	return result.data;
});
