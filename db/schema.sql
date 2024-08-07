DROP DATABASE IF EXISTS billsbusiness_db;
CREATE DATABASE billsbusiness_db;
\c billsbusiness_db;

-- DROP TABLE IF EXISTS department;
-- DROP TABLE IF EXISTS roles;
-- DROP TABLE IF EXISTS employee;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY, 
  names VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY, --SERIAL creates a unique id on its own --
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department INTEGER NOT NULL,

  FOREIGN KEY (department) --defining deparment as our foreign key for role table--
  REFERENCES departments(id) --defining primary key in department table--
  ON DELETE restrict
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,

  FOREIGN KEY (role_id)
  REFERENCES roles(id)
  ON DELETE restrict,
  FOREIGN KEY (manager_id)
  REFERENCES employee(id) 
  ON DELETE restrict
  );
