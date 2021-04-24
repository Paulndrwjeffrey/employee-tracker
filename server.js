const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./config/connection')
const cTable = require("console.table");

const start = () => {
  inquirer
    .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View departments',
            'View employees',
            'View roles',
            'Add a department',
            'Add an employee',
            'Add a role',
            'Change an employee\'s role',
            'Quit'
        ],
        loop: false
  })
  .then((answwer) => {
      switch(answwer.action) {
        case 'View departments':
            viewDepartments();
            break;
        case 'View employees':
            viewEmployees();
            break;
        case 'View roles':
            viewRoles();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Change an employee\'s role':
            changeRole();
            break;
        case 'Quit':
            connection.end(console.log('Adios!'));
            break;
      }
  })
}



connection.connect((error) => {
    if (error) throw error;
    start();
});