import { HttpStatus } from '@nestjs/common';
import { RequestSegment } from '@/http/types';
import { AppError, HttpErrorObject } from '@/exception/base/AppError';
import { InvalidDataIssue } from '@/common/type';

export class RequestValidationError extends AppError {
	public readonly error: string = 'VALIDATION';
	public readonly segment: RequestSegment;
	public readonly issues: InvalidDataIssue[];

	constructor(segment: RequestSegment, issues: InvalidDataIssue[]) {
		super('Request validation error');
		this.segment = segment;
		this.issues = issues;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.BAD_REQUEST,
			error: this.error,
			segment: this.segment,
			message: this.message,
			issues: this.issues,
		};
	}
}
