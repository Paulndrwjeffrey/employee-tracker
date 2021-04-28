
const addEmployee = () => {
    connection.query('SELECT title, last_name FROM emp_role INNER JOIN employee ON emp_role.id = employee.id', (error, response) => {
        if (error) throw error;
        inquirer
        .prompt([
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
            // {
            //     name: 'manager',
            //     type: 'rawlist',
            //     message: 'Manager?',
            //     loop: false,
            //     choices: () => {
            //         let choices = response.map(choice => choice.last_name);
            //         return choices;
            //     }
            // }
        ])
        .then((answers) => {
            let newEmployee = {
                first_name: `${answers.first}`,
                last_name: `${answers.last}`,
                role: `${answers.role}`
        }
            connection.query('SELECT employee.first_name, employee.id FROM employee', (error, response) => {
                
                inquirer.prompt([
                    {
                    name: 'manager',
                    type: 'rawlist',
                    message: 'Who is the manager?',
                    choices: () => {
                        let choices = response.map((choice) => ({
                            name: choice.first_name,
                            id: choice.id
                        }))
                        return choices
                    }
                    }
                ]).then((answers)=>{
                    console.log(answers);
                    // newEmployee.manager_Id = 
                    const query = 'INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ?, (SELECT id from emp_role WHERE title = ?))';
                    connection.query(query, [answers.first, answers.last, answers.role], (error, response) => {
                        if (error) throw error;
                        console.log('Added employee');
                        start();
                    })

                })
            })
        })


    })
}