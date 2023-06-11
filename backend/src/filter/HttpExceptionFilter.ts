import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { AppError } from '@/exception/base/AppError';
import { Request, Response } from '@/http/types';

@Catch(AppError)
export class HttpExceptionFilter implements ExceptionFilter {
	public catch(error: AppError, host: ArgumentsHost) {
		const request = host.switchToHttp().getResponse<Request>();
		const response = host.switchToHttp().getResponse<Response>();
		const httpError = error.httpErrorObject();
		error.toHttp(request, response);

		if (httpError.status >= 500) {
			this.logger.error(httpError);
		} else {
			this.logger.log(httpError);
		}
	}

	private readonly logger = new Logger('HttpException');
}
