import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const userAgent = req.headers["user-agent"] || "Unknown-UA";
    const decision = await aj.protect(req, { requested: 1, ua: userAgent });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: decision.retryAfter,
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Bot detected. Access denied.",
        });
      }

      return res.status(403).json({
        message: "Access denied.",
      });
    }

    next();
  } catch (error) {
    console.error(`Arcjet Middleware Error: ${error.message}`);
    next(error);
  }
};

export default arcjetMiddleware;
