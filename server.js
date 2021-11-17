const inquirer = require("inquirer")
const cTable = require("console.table")
const mysql = require("mysql2")

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      port: '3306',
      password: 'poloboy1993',
      database: 'employee_trackerDB'
    },
    console.log(`Connected to the employee_trackerDB database.`)
  );
  function init(){
    db.connect((err) => {
        if (err) throw err;
        startPrompt()
      });
      
  }
function startPrompt(){
    inquirer.prompt([
        {
            type:"list",
            message: "What would you like to do?",
            name: "choice",
            choices:[
                "View All Employee",
                "View All Employee's Roles",
                "View All Employee's Departments",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee",
                "Quit"
            ]
        }
    ]).then(function(val){
        switch(val.choice){
            case "View All Employee":
              viewAllEmployees();
            break;
    
          case "View All Employee's Roles":
              viewAllRoles();
            break;
          case "View All Employee's Departments":
              viewAllDepartments();
            break;
          
          case "Add Department":
                addDepartment();
              break;

           case "Add Role":
                addRole();
              break;
      
            case "Add Employee":
                addEmployee();
              break;

            case "Update Employee":
                updateEmployee();
              break;
            case "Quit":
                db.end();
              break;

        }

    }

    )
}
//view all employee function
function viewAllEmployees(){
    db.query(`SELECT employee.id,
                     employee.first_name,
                     employee.last_name,
                     employee.role_id FROM employee JOIN role ON role.title = employee.role_id`,
    function(err, res){
   if (err) throw err
  
   console.log(cTable.getTable(res));
   startPrompt()
    })

}
//view all employee roles function
function viewAllRoles(){
    db.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;",
    function(err, res){
   if (err) throw err
  
   console.log(cTable.getTable(res));
   startPrompt()
    })

}


// view all depatment function
function viewAllDepartments(){
    db.query("SELECT * FROM department;",
    function(err, res){
   if (err) throw err
  
   console.log(cTable.getTable(res));
   startPrompt()
    })

}

function addDepartment(){
  inquirer.prompt([
    {
      name:"name",
      type:"input",
      message:"Enter the name of the department"
    }
  ]).then(function(answer){
    const newName= answer.name
    const sql = `INSERT INTO department (name) VALUES(?);`
    db.query(sql,newName,
    function(err,res){
      if (err) throw err
   console.log(cTable.getTable(res));
   viewAllDepartments()
   startPrompt()
    }
    )
  })

}
function addRole(){
  // query the department table to get all the info
  const sqlDept=`SELECT * FROM department;`
  db.query(sqlDept, 
    function(err,data){
      if (err) throw err;
      console.log(data)
      var myData = data.map(({name, id})=>({name: name, value: id})) 
console.log(myData)

inquirer.prompt([
  {
    name: "Title",
    type: "input",
    message: "What is the roles Title name?"
  },
  {
    name: "Salary",
    type: "input",
    message: "What is the Salary?"

  } ,
  {
    type: 'list', 
    name: 'someName',
    message: "Select department?",
    choices: myData

  }

]).then(function(response){
const titleName=response.Title
const salaryName= response.Salary
const departmentName=response.someName
const parameters =[titleName, salaryName, departmentName]
const sql=`INSERT INTO role(title, salary, department_id)
VALUES(?, ?, ?)`;
db.query(sql, parameters, function(err){
  if (err) throw err;
  console.log('Added ' + titleName + " to roles!"); 
viewAllRoles()
})
})
    })

}
function addEmployee(){
  //let's grab the roles from role table
  const roleSql=`SELECT role.id, role.title FROM role`;
  db.query(roleSql, function(err, data){
    if (err) throw err; 
    console.log(data)
    const myRole =  data.map(({id, title})=>({name: title, value: id})) 
    console.log(myRole)
   //lets grab the manager first and last name from the employee table
  const managerSql= `SELECT * FROM employee`;
  db.query(managerSql, function(err, res){
    if (err) throw err; 
    console.log(res)
    const myManager = res.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
    console.log(myManager)

    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
       
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        
      },
     {
      type: 'list',
      name: 'role',
      message: "What is the employee's role?",
      choices: myRole
     },
     {
      type: 'list',
      name: 'manager',
      message: "Who is the employee's manager?",
      choices: myManager
     }

    ]).then(function(response){
   const firstName = response.firstName
   const lastName = response.lastName
   const empRole = response.role
   const empManager = response.manager
   const parameter= [firstName, lastName, empRole, empManager]
   const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
   VALUES (?, ?, ?, ?)`;
   db.query(sql, parameter, function(err, res){
    if (err) throw err;
    console.log("Employee has been added!")
  console.log(res)
    viewAllEmployees()

   })

  
    })

  })
  })
  

}



  init()