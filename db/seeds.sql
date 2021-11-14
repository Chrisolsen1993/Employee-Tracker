INSERT INTO department (name)
VALUE ("Human Resources");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Sales");
-- EMPLOYEE ROLE SEEDS -------
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 200000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("HR Manager", 70000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 100000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Manager", 130000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 160000, 2);

-- EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Jean", "Ola", 3, null );
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Tiffany", "thing", 4, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Ali", "Nikiema", 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Pauline", "Marta", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Aziz", "Drago", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("David", "Dyer", 1, 6);
