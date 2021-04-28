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

const viewDepartments = () => {
    connection.query('SELECT name FROM department', (error, response) => {
        if(error) throw error;
     console.table(response);
     start();
    });
};

const viewEmployees = () => {
    connection.query('SELECT first_name AS "First", last_name AS "Last", title, salary FROM employee LEFT JOIN emp_role ON role_id = emp_role.id', (error, response) => {
        if(error) throw error;
     console.table(response);
     start();
    });
};

const viewRoles = () => {
    connection.query('SELECT title AS "Title", salary AS "Salary", department.name AS "Department" FROM emp_role LEFT JOIN department ON department_id = department.id', (error, response) => {
        if(error) throw error;
     console.table(response);
     start();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Department name?'
        }
    ]).then(answer => {
        connection.query('INSERT INTO department(name) VALUE( ? )', answer.name, (error, response) => {
             if(error) throw error;
             console.log('added Department');
             start();
        });
    });
};

const addEmployee = () => {
    connection.query('SELECT title, last_name FROM emp_role INNER JOIN employee ON emp_role.id = employee.id', (error, response) => {
        if (error) throw error;
        inquirer.prompt([
            {
                name: 'first',
                type: 'input',
                message: 'First name?'
            },
            {
                name: 'last',
                type: 'input',
                message: 'Last name?'
            },
            {
                name: 'role',
                type: 'rawlist',
                message: 'Role?',
                loop: false,
                choices: () => {
                    let choices = response.map(choice => choice.title);
                    return choices;
                }
            },
            {
                name: 'manager',
                type: 'rawlist',
                message: 'Manager?',
                loop: false,
                choices: () => {
                    let choices = response.map(choice => choice.last_name);
                    return choices;
                }
            }
        ]).then((answers) => {
            //FOR SOME REASON THIS QUERY WORKS AND I'M SORRY...
            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, (SELECT id FROM emp_role WHERE title = ?), (SELECT id FROM (SELECT * FROM employee) AS BULLSHIT WHERE last_name = ?))', [answers.first, answers.last, answers.role, answers.manager ], (error, response) => {
                if (error) throw error;
                console.log(`Added ${ answers.first } ${ answers.last }.`);
                start();
            })   
        })
    })
}

const addRole = () => {
    connection.query('SELECT name FROM department', (error, response) => {
        if (error) throw error;
    inquirer
    .prompt([{
        name: 'title',
        type: 'input',
        message: 'Job title?',
    },
    {
        name: 'salary',
        type: 'input',
        message: 'Salary? Just numbers... no commas.',
    },
    {
        name: 'department',
        type: 'rawlist',
        loop: false,
        choices: () => {
            let choices = response.map(choice => choice.name);
            return choices;
        }
    }
    ]).then((answers) => {
        const query = 'INSERT INTO emp_role(title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))';
        connection.query(query, [answers.title, answers.salary, answers.department], (error, response) => {
            if (error) throw error;
            console.log(`Added role: ${ answers.title }`);
            start();
        })
    });
});
};

const changeRole = () => {
    connection.query('SELECT first_name AS "First", last_name AS "Last", title AS "Role" FROM employee LEFT JOIN emp_role ON role_id = emp_role.id', (error, response) => {
        if (error) throw error
        console.table(response)
        inquirer.prompt([
            {
                name: 'which',
                type: 'rawlist',
                message: 'Who\'s role will change?',
                loop: false,
                choices: () => {
                    let choices = response.map(choice => choice.Last);
                    return choices;
                }
            },
            {
                name: 'role',
                type: 'rawlist',
                message: 'New role?',
                loop: false,
                choices: () => {
                    let choices = response.map(choice => choice.Role);
                    return choices;
                }
            }]).then((answers) => {
            connection.query('UPDATE employee SET role_id = (SELECT emp_role.id FROM emp_role WHERE title = ?) WHERE last_name = ?', [answers.role, answers.which], (error, response) => {
                if (error) throw error;
                console.log(`Changed role`);
                start();
            })
        })
    })
}   



connection.connect((error) => {
    if (error) throw error;
    start();
});