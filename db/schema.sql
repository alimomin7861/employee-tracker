DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) 
    REFERENCES role(id),
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
    ON DELETE SET NULL
);


SELECT department_name 
FROM department 
LEFT JOIN role 
ON department.department_name = role.department_id;

SELECT title, salary, department_id 
FROM role 
LEFT JOIN department 
ON role.department_id = department.id;

SELECT first_name, last_name, role_id, manager_id 
FROM employee 
LEFT JOIN role 
ON employee.role_id = role.department_id;

