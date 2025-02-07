export const authorization = (rol) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("No autenticado");
        if (req.user.role !== rol) return res.status(403).send("No autorizado");
        next();
    };
};