import JWT from 'jsonwebtoken';

export interface Payload<T> extends JWT.JwtPayload {
	data: T;
}

export class JWTService {
	private readonly secret: string;

	constructor(secret: string) {
		this.secret = secret;
	}

	public verify<T>(token: string): Promise<Payload<T>> {
		return new Promise((resolve, reject) => {
			JWT.verify(
				token.toString(),
				this.secret,
				(err: JWT.VerifyErrors | null, decode) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(decode as Payload<T>);
				}
			);
		});
	}

	public sign<T>(data: T, expiresIn: number): string {
		return JWT.sign({ data }, this.secret, { expiresIn });
	}
}
