import { FastifyRequest, FastifyReply } from 'fastify';

export type Request = FastifyRequest; // http.IncomingMessage | http2.Http2ServerRequest
export type Response = FastifyReply; // ServerResponse
