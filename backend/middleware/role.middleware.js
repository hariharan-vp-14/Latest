/* =================================================
   ROLE-BASED AUTHORIZATION MIDDLEWARE
================================================= */
module.exports = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        console.warn('🚫 Role check failed - No user in req.user');
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
      }

      // Check if user has the required role
      console.log(`🔐 Role check: required="${requiredRole}", user has="${req.user.role}"`);
      if (req.user.role !== requiredRole) {
        console.warn(`❌ Role mismatch: required="${requiredRole}" but user="${req.user.role}"`);
        return res.status(403).json({ 
          message: `Forbidden: Required role '${requiredRole}' but user has role '${req.user.role}'` 
        });
      }
      
      console.log(`✅ Role check passed for "${requiredRole}"`);
      next();
    } catch (error) {
      console.error('❌ Role middleware error:', error.message);
      res.status(500).json({ message: error.message });
    }
  };
};
