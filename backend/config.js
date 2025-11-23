const env = process.env;

module.exports = {
  port: env.PORT || 3000,
  db: {
    type: env.DB_TYPE || 'sqlite',
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
  },
  jwtSecret: env.JWT_SECRET,
  pythonScript: env.PYTHON_PATH,
};
