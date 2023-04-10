import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),

    MONGODB_URI: str(),

    JWT_ACCESS: str(),

    FILE_ROOT_URL: str(),
  });
};

export default validateEnv;