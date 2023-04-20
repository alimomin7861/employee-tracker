const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: "armaan.7861",
        database: "employee_db"
    }
);

db.connect(function (err) {
    if (err) throw err
    console.log("MySQL Connected")
    start();
});

function start() {
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Exit"
        ]
    }).then((response) => {
        if (response.choice === "View All Departments") {
            viewDepts();
        } else if (response.choice === "View All Roles") {
            viewRoles();
        } else if (response.choice === "View All Employees") {
            viewEmployees();
        } else if (response.choice === "Add Department") {
            addDepartment();
        } else if (response.choice === "Add Role") {
            addRole();
        } else if (response.choice === "Add Employee") {
            addEmployee();
        } else if (response.choice === "Update Employee Role") {
            updateEmployee();
        } else if (response.choice === "Exit") {
            console.log('Goodbye!');
        }
    })
}

function viewDepts() {
    const query = `SELECT id, department_name FROM department`;
    db.query(query,
        function (err, res) {
            if (err) throw err
            console.log("Displaying all departments:");
            console.table(res)
            start()
        })
}

function viewRoles() {
    const query = `SELECT * FROM role`;
    db.query(query,
        function (err, res) {
            if (err) throw err
            console.log("Displaying all roles:");
            console.table(res)
            start()
        })
}

function viewEmployees() {
    const query = `SELECT * FROM employee`;
    db.query(query,
        function (err, res) {
            if (err) throw err
            console.log("Displaying all employees:");
            console.table(res)
            start()
        })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department?'
            }
        ]).then(response => {
            const query = `INSERT INTO department SET ?`
            db.query(
                query, {
                department_name: response.departmentName
            }
            )
            console.log(`${response.departmentName} department has been added to the database`);
            start()
        })
}


function addRole() {
    db.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      const departments = results.map(department => {
        return {
          name: department.department_name,
          value: department.id
        }
      });
      inquirer.prompt([
        {
          type: 'input',
          name: 'roleName',
          message: 'What is the name of the role?'
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: 'What is the salary of the role?'
        },
        {
          type: 'list',
          name: 'roleDepartment',
          message: 'Which department does the role belong to?',
          choices: departments
        },
      ]).then(response => {
        const query = `INSERT INTO role SET ?`
        db.query(
          query, {
            title: response.roleName,
            salary: response.roleSalary,
            department_id: response.roleDepartment
          },
          (err) => {
            if (err) throw err;
            console.log(`${response.roleName} role has been added to the database`);
            start();
          }
        );
      });
    });
}

function addEmployee() {
    db.query('SELECT * FROM role', (err, results) => {
        if (err) throw err;
        const roles = results.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        })

        db.query('SELECT * FROM employee', (err, results) => {
            if (err) throw err;
            const employees = results.map(employee => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            })

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the first name of the employee?'
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the last name of the employee?'
                    },
                    {
                        type: 'list',
                        name: 'employeeRole',
                        message: "What is the employee's role?",
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'employeeManager',
                        message: "Who is the employee's manager?",
                        choices: employees
                    },
                ]).then(response => {
                    const query = `INSERT INTO employee SET ?`
                    db.query(
                        query, {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: response.employeeRole,
                        manager_id: response.employeeManager
                    },
                    (err, result) => {
                        if (err) throw err;
                        console.log(`${response.firstName} ${response.lastName} has been added to the database`);
                        start()
                    })
                })
        })
    });
}



function updateEmployee() {
    // Get a list of all employees from the database
    const query = `SELECT * FROM employee`;
    db.query(query, function (err, res) {
        if (err) throw err;

        // Create an array of employee choices for the inquirer prompt
        const employeeChoices = res.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        // Get a list of all roles from the database
        const query = `SELECT * FROM role`;
        db.query(query, function (err, res) {
            if (err) throw err;

            // Create an array of role choices for the inquirer prompt
            const roleChoices = res.map(role => ({
                name: role.title,
                value: role.id
            }));

            // Prompt the user to select an employee and a new role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employee\'s new role?',
                    choices: roleChoices
                }
            ]).then(response => {
                const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
                db.query(query, [response.role, response.employee], function (err, res) {
                    if (err) throw err;

                    console.log('Employee role has been updated.');
                    start();
                });
            });
        });
    });
}
