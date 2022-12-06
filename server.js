import dotenv from 'dotenv'
dotenv.config()
import inquirer from 'inquirer'
import consoleTable from 'console.table'
import mysql from 'mysql2'

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const manageCompany = async () => {
    await inquirer.prompt([
        {
            type: "list",
            message: "Select from the options listed:",
            name: "manageCompany",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "I'm done"
            ]
        }
    ])
    .then(answer => {
        console.log(answer)
        if (manageCompany === 'View all departments') {
            viewDept()
        } else if (manageCompany === 'View all roles') {
            viewRoles()
        } else if (manageCompany === 'View all employees') {
            viewEmployees()
        } else if (manageCompany === 'Add a department') {
            addDept()
        } else if (manageCompany === 'Add a role') {
            addRole()
        } else if (manageCompany === 'Add an employee') {
            addEmployee()
        } else if (manageCompany === 'Update an employee role') {
            updateEmployee()
        } else if (manageCompany === `I'm done`) {
            console.log("Thank you")
            process.exit()
        }
    })
    .catch(err => console.log(err))
}



const viewDept = () => {
    db.query(`SELECT * FROM department`, (results) => {
        console.table(results)
        manageCompany()
    })
}

const viewRoles = () => {
    db.query(`SELECT * FROM roles`, (results) => {
        console.table(results)
        manageCompany()
    })
}

const viewEmployees = () => {
    db.query(`SELECT * FROM employees`, (results) => {
        console.table(results)
        manageCompany()
    })
}

const addDept = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "roleTitle"
        }
        
    ])
    .then(answer => {
        db.query(`INSERT INTO department(name)
        VALUES(?)`, answer.addDept, (results) => {
            db.query(`SELECT * FROM department`, (results) => {
                console.table(results)
                manageCompany()
            })
        })
    })
}

const addRole = () => {
    const deptChoices = () => db.promise().query(`SELECT * FROM department`)
        .then((rows) => {
            let arrNames = rows[0].map(obj => obj.name)
            return arrNames
        })
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of the role you'd like to add?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the salary of this role?",
            name: "roleSalary"
        },
        {
            type: "list",
            message: "Which department is this role in?",
            name: "addDept",
            choices: deptChoices
        }
    ])
    .then(answer => {
        db.promise().query(`SELECT id FROM department WHERE name = ?`, answer.addDept)
            .then(answer => {
                let mappedId = answer[0].map(obj => obj.id)
                return mappedId
            })
            .then((mappedId) => {
                db.promise().query(`INSERT INTO roles(title, salary, department_id)
                VALUES(?, ?, ?)`, [answer.roleTitle, answer.roleSalary, mappedId])
                manageCompany()
            })
    })
}

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the first name of the employee?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the last name of the employee?",
            name: "lastName"
        },
        
    ])
    .then(answer => {
        db.query(`INSERT INTO employees(first_name, last_name)
        VALUES (?, ?)`, [answer.firstName, answer.lastName], (results) => {
            db.query(`SELECT * FROM employees`, (results) => {
                console.table(results)
                manageCompany()
            })
        })
    })
}


manageCompany()