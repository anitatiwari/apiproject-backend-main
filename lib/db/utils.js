
export function ensureAuthenticated(req, res, next) {
    
    if (req.session.isLoggedIn) {
        return next();
    }
    else {
        return res.sendStatus(401)
    }
}
