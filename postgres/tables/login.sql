BEGIN TRANSACTION;

CREATE TABLE login (
    idUser serial PRIMARY KEY,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);

COMMIT;
