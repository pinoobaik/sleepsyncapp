// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Gagal menghubungkan ke database: " + err.stack);
//     return;
//   }
//   console.log(
//     "Terhubung ke database " +
//       process.env.DB_NAME +
//       " dengan ID " +
//       connection.threadId
//   );
// });

// export default connection;
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Gunakan connection string dari Supabase (paling mudah)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // contoh: postgresql://postgres:password@db.ref.supabase.co:5432/postgres
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Test koneksi (opsional)
pool.connect((err, client, release) => {
  if (err) {
    console.error("Gagal menghubungkan ke PostgreSQL:", err.stack);
    return;
  }
  console.log("Terhubung ke database PostgreSQL");
  release();
});

export default pool;