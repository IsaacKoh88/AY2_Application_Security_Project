import jwt from 'jsonwebtoken'

const KEY = 'qwertyuiop'

const generateToken = (
    email: string
): string => {
    return(
        jwt.sign({ email }, KEY)
    )
}
export default generateToken;