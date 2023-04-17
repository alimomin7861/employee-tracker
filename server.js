const express = require('express');
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


