import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, "codercoder", { // Incluir "id"
        expiresIn: "1h",
    });
};