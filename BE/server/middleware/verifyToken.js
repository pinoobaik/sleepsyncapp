import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Sesi habis. Silakan login ulang." });
    }
    return res.status(403).json({ message: "Token tidak valid." });
  }
};

export default verifyToken;