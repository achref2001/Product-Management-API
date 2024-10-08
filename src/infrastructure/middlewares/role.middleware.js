

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
      
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();  // User has the right role, so proceed
    };
  };
  
  module.exports = checkRole;
  