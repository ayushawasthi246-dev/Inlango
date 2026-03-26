import jwt from "jsonwebtoken"

export const genrateRefreshToken = (userID, res) => {

    const RefreshToken = jwt.sign({ id: userID }, process.env.Refresh_SECRET, { expiresIn: '7d' })
    res.cookie('refreshToken', RefreshToken, {
        httpOnly: true,
        secure: process.env.Node_ENV === 'production',
        sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const genrateAcessToken = (userID) => {
    return  jwt.sign({ id: userID }, process.env.Access_SECRET, { expiresIn: '15m' })
}