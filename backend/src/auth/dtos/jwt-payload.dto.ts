export class JwtPayload {
  iss!: string; // issuer
  sub!: string; // subject (user_id)
  exp!: number; // expires at
  iat!: number; // issued at
  jti!: string; // jwt id
}
