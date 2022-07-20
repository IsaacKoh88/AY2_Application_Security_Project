import * as jose from 'jose';

const generateJWT = async (email: string) => {
    return await new jose.SignJWT({ email: email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('application-security-project')
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(`qwertyuiop`));
};

export default generateJWT;