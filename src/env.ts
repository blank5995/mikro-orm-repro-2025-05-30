import 'dotenv/config';

let DB_URL = process.env.DB_URL!;
if (!DB_URL)
{
  console.info('DB_URL is not set. Using default values.');
  DB_URL = 'postgresql://postgres:postgres@localhost:5432/postgres';
}

export { DB_URL };