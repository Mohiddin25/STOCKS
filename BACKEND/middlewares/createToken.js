import jwt from 'jsonwebtoken';

const {sign}=jwt;

export function createToken(user){
    const signedToken=sign({id:user._id,email:user.email,name:user.name},process.env.JWT_SECRET,{expiresIn:process.env.expiresIn});
    return signedToken;
}


