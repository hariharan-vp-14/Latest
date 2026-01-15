/* =================================================
   ROLE-BASED AUTHORIZATION MIDDLEWARE
================================================= */
module.exports = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
      }

      // Check if user has the required role
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ 
          message: `Forbidden: Required role '${requiredRole}' but user has role '${req.user.role}'` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
