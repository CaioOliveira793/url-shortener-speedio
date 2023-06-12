import { FastifyRequest, FastifyReply } from 'fastify';

export type Request = FastifyRequest; // http.IncomingMessage | http2.Http2ServerRequest
export type Response = FastifyReply; // ServerResponse

export const enum RequestSegment {
	Body = 'BODY',
	Params = 'PARAM',
	Query = 'QUERY',
	Headers = 'HEADER',
	Cookies = 'COOKIE',
	SignedCookies = 'SIGNED_COOKIE',
	MultipartFile = 'MULTIPART_FILE',
	MultipartField = 'MULTIPART_FIELD',
}