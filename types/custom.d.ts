// import { JwtPayload } from 'jsonwebtoken';
const { JwtPayload } = require('jsonwebtoken');

declare namespace Express {
	export interface Request {
		user: string | JwtPayload;
	}
}
