// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const { Pool } = require('pg');


const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: 'postgres',
    // TODO: Enter PostgreSQL password
    password: 'April2you!',
    host: 'localhost',
    database: 'billsbusiness_db'
  },

)

// pool.connect();

// TODO: Create an array of questions for user input
const menuQuestions = [
  {

    message: "What would you like to do?",
    name: "menu",
    type: "list",
    choices: [
      'View All Employees', 
      'Add Employee', 
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department'
    ]
}];




// {
//   message:"Enter your project description here",
//   name: "Description",
//   validate: DescriptionInput => {
//     if(DescriptionInput){
//       return true;
//     }else {
//       console.log('You must enter a description.');
//       return false;
//     }
//   }
// },
// {
//   message:"Provide instructions to install your project",
//   name:"install",
//   validate: installInput => {
//     if(installInput){
//       return true;
//     }else {
//       console.log('You must provide instructions on how to install your project.');
//       return false;
//     }
//   }
// },
// {
//   message: "Provide instructions on how to use your project",
//   name: "usage",
//   validate: usageInput => {
//     if(usageInput){
//       return true;
//     }else {
//       console.log('You must provide instructions on how to use your project.');
//       return false;
//     }
//   }
// },
// {
//   message: "Select your license",
//   name: "license",
//   type: "list",
//   choices: [
//     'Apache 2.0', 
//     'MIT', 
//     'BSD 3-Clause',
//     'None'
//   ]
// },
// {
//   message:"How can users contribute to this project?",
//   name: "contribution",
//   validate: contributionInput => {
//     if(contributionInput){
//       return true;
//     }else {
//       console.log('You must provide instructions for project contributions.');
//       return false;
//     }
//   }
// },
// {
//   message: "How do I test this?",
//   name:"tests"
// },

// ];

// TODO: Create a function to write README file
// const getFilename = (title) =>{

//   return `${title.trim().replace(' ', '')}.json`

// };


// const handleAnswers = (response) =>{
//   const filename = getFilename(response.title);

//   fs.writeFile(filename,JSON.stringify(response,null,2)), (err) =>
//     err ? console.log(err) : console.log("Success! ReadMe file has been generated!Check the ReadMe folder to view file!");

// };
function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, err => {
      if (err) throw new Error(err);

      console.log("Success! ReadMe file has been generated!Check the ReadMe folder to view file!")
  })
};

function viewAllDepartments (){
  pool.query('SELECT * FROM departments', function (err, { rows }) {
    console.table(rows);
    menu();
  });
};
function viewAllRoles (){
  pool.query('SELECT * FROM roles', function (err, { rows }) {
    console.table(rows);
    menu();
});
};
function viewAllEmployees(){
  pool.query('SELECT * FROM employee', function (err, { rows }) {
    console.table(rows);
    menu();
});
};

function addDepartment(){
  inquirer.prompt({
    name: "department_name",
    message: "What is the department name?",
    type: "input"
  }).then(res=>{
    pool.query('INSERT into departments (names)VALUES ($1)',[res.department_name], function (err){
      console.log(`${res.department_name} has been added.`);
      // console.table(rows);
      menu();
    })
  })}

function addRole(){
  inquirer.prompt([{
    name:"role_title",
    message:"What is the name of the role?",
    type:"input"
  },
{
  name:"role_department",
  message:"What is the role department?",
  type:"input"
},
{
  name:"role_salary",
  message:"What is the role salary?",
  type:"input"
}]).then(res=>{
  pool.query('INSERT into roles (title, department, salary )VALUES ($1,$2,$3)',[res.role_title,res.role_department, res.role_salary], function (err){
    console.log('Role has been added to the database.')
    // console.table(rows);
    menu();
  })
  })
};
function addEmployee(){
  inquirer.prompt([{
    name:"first_name",
    message:"What is the employee's first name?",
    type:"input"
  },
{ 
  name:"last_name",
  message:"What is the employee's last name?",
  type:"input"
},
{
  name:"employee_role",
  message:"What is the employee's role?",
  type:"input"
},
{
  name:"employee_manager",
  message:"Who is the employee's manager?",
  type:"input"
}
]).then(res=>{
  pool.query('INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [res.first_name, res.last_name, res.employee_role, res.employee_manager], function (err){
    console.log(`${res.first_name} ${res.last_name} has been added to the database`);
    menu();
  })
})
};

// function updateEmployeeRole(){
//   inquirer.prompt([{


//   },{

//   },{

//   }.then(res=>{

//     // `UPDATE employee SET role_id= ${answers.role}, manager_id=${answers.manager} WHERE id =${answers.employee};`
//     pool.query(`UPDATE employee SET `, function (err){
//       console.log('Employee role has been updated');
//       menu();
//   })
//   })
// ])}
function updateEmployeeRole() {
  // First, get the list of employees and roles to show to the user
  Promise.all([
    pool.query('SELECT id, last_name FROM employee ORDER BY last_name'),
    pool.query('SELECT id, title FROM roles ORDER BY title')
  ])
  .then(([employeeResult, roleResult]) => {
    // Extract data from the query results
    const employees = employeeResult.rows;
    const roles = roleResult.rows;

    // Prompt the user for the employee and new role
    inquirer.prompt([
      {
        name: "emp_id",
        message: "Which employee's role do you want to update? (Select last name)",
        type: "list",
        choices: employees.map(emp => ({ name: emp.last_name, value: emp.id })),
      },
      {
        name: "new_role_id",
        message: "Which role do you want to assign to the selected employee?",
        type: "list",
        choices: roles.map(role => ({ name: role.title, value: role.id })),
      }
    ])
    .then(res => {
      // Perform the role update in the database
      pool.query(
        'UPDATE employee SET role_id = $1 WHERE id = $2',
        [res.new_role_id, res.emp_id],
        (err) => {
          if (err) {
            console.error('Error updating employee role:', err);
          } else {
            console.log('Employee role has been updated successfully.');
          }
          menu();
        }
      );
    })
    .catch(err => {
      console.error('Error fetching data for update:', err);
      menu();
    });
  })
  .catch(err => {
    console.error('Error fetching employee or role data:', err);
    menu();
  });
}

function menu() {

  inquirer.prompt(menuQuestions)
  .then(responses => {
    if(responses.menu === `View All Departments`){
      viewAllDepartments();
    };
    if(responses.menu === 'View All Roles'){
      viewAllRoles();
    };
    if(responses.menu === 'View All Employees'){
      viewAllEmployees();
    };
    if (responses.menu === 'Add Department'){
      addDepartment();
    };
    if (responses.menu === 'Add Role'){
      addRole();
    };
    if (responses.menu === 'Add Employee'){
      addEmployee();
    };
    if(responses.menu === 'Update Employee Role'){
      updateEmployeeRole();
    }
  


    
  })
};


menu();

//update sql query UPDATE into 



// // TODO: Create a function to initialize app
// function init() {
//   console.log('Welcome to my ReadMe Generator');
//   inquirer.prompt(questions).then(handleAnswers);
// };
// // Function call to initialize app
// init();
