const inquirer = require('inquirer');
const mysql = require('mysql2');
//const cTable = require('console.table');

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
    const query = `SELECT * FROM department`;
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
    inquirer
        .prompt([
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
                type: 'input',
                name: 'roleDepartment',
                message: 'Which department does the role belong to?'
            },
        ]).then(response => {
            const query = `INSERT INTO role SET ?`
            db.query(
                query, {
                title: response.roleName,
                salary: response.roleSalary,
                department_id: response.roleDepartment
            }
            )
            console.log(`${response.roleName} role has been added to the database`);
            start()
        })
}

function addEmployee() {
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
                type: 'input',
                name: 'employeeRole',
                message: "What is the employee's role ID ?"
            },
            {
                type: 'input',
                name: 'employeeManager',
                message: "Who is the employee's manager?"
            },
        ]).then(response => {
            const query = `INSERT INTO role SET ?`
            db.query(
                query, {
                first_name: respomse.firstName,
                last_name: respomse.lastName,
                role_id: response.employeeRole,
                manager_id: response.employeeManager
            }
            )
            console.log(`${response.firstName} ${response.lastName} has been added to the database`);
            start()
        })
}

function updateEmployee() {

}
