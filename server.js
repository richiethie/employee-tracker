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
            name: "response",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "View all employees by department",
                "View all employees by role",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "I'm done"
            ]
        }
    ])
    .then(answer => {
        let {response} = answer
        if (response === 'View all departments') {
            viewDept()
        } else if (response === 'View all roles') {
            viewRoles()
        } else if (response === 'View all employees') {
            viewEmployees()
        } else if (response === 'View all employees by department') {
            viewEmpByDept()
        }  else if (response === 'View all employees by role') {
            viewEmpByRole()
        } else if (response === 'Add a department') {
            addDept()
        } else if (response === 'Add a role') {
            addRole()
        } else if (response === 'Add an employee') {
            addEmployee()
        } else if (response === 'Update an employee role') {
            updateEmployee()
        } else if (response === `I'm done`) {
            console.log("Thank you")
            process.exit()
        }
    })
    .catch(err => console.log(err))
}

const viewEmployees = () => {
    db.query(`SELECT employees.first_name AS First_Name,
     employees.last_name AS Last_Name,
      roles.title AS Role, department.name AS Dept,
       roles.salary AS Salary,
       CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
         FROM employees
          INNER JOIN roles ON employees.role_id = roles.id 
          INNER JOIN department ON roles.department_id = department.id 
          LEFT JOIN employees e ON employees.manager_id = e.id`, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    manageCompany()
    })
}

const viewDept = () => {
    db.query("SELECT department.id AS Id, department.name AS Department FROM department", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    manageCompany()
    })
}

const viewRoles = () => {
    db.query("SELECT roles.id AS Dept_Id, roles.title AS Title FROM roles", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    manageCompany()
    })
}

const viewEmpByDept = () => {
    db.query("SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, department.name AS Department FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department.id ORDER BY department.id", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    manageCompany()
    })
}

const viewEmpByRole = () => {
    db.query("SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Title FROM employees INNER JOIN roles ON employees.role_id = roles.id ORDER BY roles.id", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res)
        }
    manageCompany()
    })
}

let roleArr = []
const selectRole = () => {
    db.query("SELECT * FROM roles", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            for (var i = 0; i < res.length; i++) {
                roleArr.push(res[i].title)
            }
        }
    })
    return roleArr
}

let managersArr = []
const selectManager = () => {
    db.query("SELECT first_name, last_name FROM employees", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            for (var i = 0; i < res.length; i++) {
                managersArr.push(res[i].first_name)
            }
        }
    })
    return managersArr
}

let deptArr = []
const selectDepartment = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) {
            console.log(err)
        } else {
            for (var i = 0; i < res.length; i++) {
                deptArr.push(res[i].name)
            }
        }
    })
    return deptArr
}

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "first_name"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "last_name"
        },
        {
            type: "list",
            message: "What is the role of this employee?",
            name: "role",
            choices: selectRole()
        },
        {
            type: "list",
            message: "Who is the manager of this employee?",
            name: "manager",
            choices: selectManager()
        }
    ]).then(answer => {
        const role_id = selectRole().indexOf(answer.role) + 1
        const manager_id = selectManager().indexOf(answer.manager) + 1
        db.query("INSERT INTO employees SET ?", 
        {
            first_name: answer.first_name,
            last_name: answer.last_name,
            manager_id: manager_id,
            role_id: role_id
        }, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("EMPLOYEE ADDED")
                console.table(answer)
            }
        })
        manageCompany()
    })
}


const updateEmployee = () => {
    db.query("SELECT employees.last_name, roles.title FROM employees INNER JOIN roles ON employees.role_id = roles.id", (err, res) => {
        if (err) throw err
        inquirer.prompt([
            {
                type: "list",
                message: "What is the last name of the employee?",
                name:  "last_name",
                choices: function () {
                    let lastNameArr = []
                    for (var i = 0; i < res.length; i++) {
                        lastNameArr.push(res[i].last_name)
                    }
                    return lastNameArr
                }
            },
            {
                type: "list",
                message: "What is the new role of the employee?",
                name: "role",
                choices: selectRole()
            }
        ]).then(answer => {
            let role_id = selectRole().indexOf(answer.role) + 1
            db.query("UPDATE employees SET WHERE ?", 
            {
                last_name: answer.last_name,
                role_id: role_id
            }, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.table(answer)
                }
            })
            manageCompany()
        })
    })
}

const addDept = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "name"
        },
        {
            type: "input",
            message: "What is the new department ID number?",
            name: "id"
        }
    ]).then(answer => {
        db.query("INSERT INTO department SET ?", 
        {
            name: answer.name,
            id: answer.id
        }, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.table(answer)
            }
        })
        manageCompany()
    })
}

const addRole = () => {
    db.query("SELECT roles.title AS Title, roles.salary AS Salary FROM roles LEFT JOIN department.name AS Department FROM department", (err, res) => {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the new role?",
                name: "title"
            },
            {
                type: "input",
                message: "What is the salary of the new role?",
                name: "salary"
            },
            {
                type: "list",
                message: "Under which department does this new role fit?",
                name: "department",
                choices: selectDepartment()
            }
        ]).then(answer => {
            const deptId = selectDepartment().indexOf(answer.department) + 1 // ch
            db.query("INSERT INTO roles SET ?", 
            {
                title: answer.title,
                salary: answer.salary,
                department_id: deptId
            }, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.table(answer)
                }
            })
            manageCompany()
        })
    })
}



manageCompany()