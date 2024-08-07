INSERT INTO departments (names)
VALUES ('Sales'),
      ('Engineering'),
      ('Finance'),
      ('Legal');

INSERT INTO roles (title, department, salary)
VALUES ('Sales Lead', 1, 100000),
      ('Salesman', 2, 80000),
      ('Lead Engineer', 3, 150000),
      ('Software Developer', 4, 120000),
      ('Financial Advisor', 3, 150000),
      ('Accountant', 4, 110000),
      ('Team Lead', 2, 250000),
      ('Lawyer', 1, 200000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Steve', 'Williams', 1, NULL),  -- Adjust based on valid role_id and manager_id
       ('Bob', 'McAfee', 2, NULL),
       ('Fred', 'Flinstone', 3, NULL),
       ('Michael', 'Scott', 4, NULL),
       ('Toby', 'Flenderson', 5, 1),  -- Example: set manager_id if known
       ('Dwight', 'Schrute', 6, 1),
       ('Rickson', 'Gracie', 7, 2),
       ('Max', 'Holloway', 8, 2);