conn = new Mongo();
db = conn.getDB("stackover-be");

db.users.insertOne({ email: "admin@piano.com", login: "piano", password: "$2b$10$Gs1oK51IaABRtzJGGXLGvOShgbOUlmAL0dyYlBsXMl7nbV4TxKUBK" });
