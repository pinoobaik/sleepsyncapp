import mysql from "mysql2";

// Konfigurasi koneksi ke phpMyAdmin (MySQL)
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sleepsync_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Gagal menghubungkan ke database: " + err.stack);
    return;
  }
  console.log(
    "Terhubung ke database sleepsync_db dengan ID " + connection.threadId
  );
});

export default connection;
