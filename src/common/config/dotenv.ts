import dotenv from 'dotenv';
import path from 'node:path';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.production'),
  });
} else if (process.env.NODE_ENV === 'ci') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.ci'),
  });
} else {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.development'),
  });
}
