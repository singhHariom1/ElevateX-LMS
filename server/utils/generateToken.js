import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign({ userId: user._id }, secretKey, {
    expiresIn: "1d",
  });

  // Determine if we're in production (HTTPS) or development (HTTP)
  const isProduction = process.env.NODE_ENV === "production";
  const isHTTPS = process.env.FRONTEND_URL?.startsWith("https://");

  // Cookie settings:
  // - In production/HTTPS: use secure cookies with sameSite: "none" for cross-origin
  // - In development/HTTP: use sameSite: "lax" and secure: false for localhost
  const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    ...(isProduction || isHTTPS
      ? { sameSite: "none", secure: true } // Production: cross-origin secure cookies
      : { sameSite: "lax", secure: false }), // Development: localhost-friendly
  };

  return res.status(200).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    user,
  });
};
