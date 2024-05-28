import jwt, { JwtPayload } from 'jsonwebtoken'

export async function verify(token: string): Promise<JwtPayload | null> {
  try {
    return jwt.verify(token, 'secret') as JwtPayload
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function sign(payload: JwtPayload) {
  return jwt.sign(payload, 'secret')
}
