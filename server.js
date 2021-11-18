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
                     role.title,
                     department.name AS department,
                     role.salary,
                     CONCAT (manager.first_name, " ", manager.last_name) AS manager
                    FROM employee JOIN role ON employee.role_id = role.id
                     LEFT JOIN department ON role.department_id = department.id
                     LEFT JOIN employee manager ON employee.manager_id = manager.id;`,
    function(err, res){
   if (err) throw err
  
   console.log(cTable.getTable(res));
   startPrompt()
    })

}
//view all employee roles function
function viewAllRoles(){
    db.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id ORDER BY role.id;",
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
      // console.log(data)
      var myData = data.map(({name, id})=>({name: name, value: id})) 
// console.log(myData)

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
    // console.log(data)
    const myRole =  data.map(({id, title})=>({name: title, value: id})) 
    // console.log(myRole)
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
  // console.log(res)
    viewAllEmployees()

   })

  
    })

  })
  })
  

}

function updateEmployee(){
// lets get employee from employee table
const empSql= `SELECT * From employee`;
db.query(empSql, (err,res)=>{
  if (err) throw err; 
  const empUpdate= res.map(({id, first_name, last_name})=>({name: first_name +" "+ last_name, value: id}));
  inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: "Which employee would you like to update?",
      choices: empUpdate
    }
  ]).then(function (response){
    const empName = response.name;
    //lets grab the role of that employee we want to change it too
const roleSql= `SELECT * FROM role`;
db.query(roleSql, (err,res)=>{
  if (err) throw err;
  const roleUpdate = res.map(({ id, title }) => ({ name: title, value: id }));
  inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      message: "What is the employee's new role?",
      choices: roleUpdate
    }
  ]).then (function(response1){
    const empRole = response1.role;
    const parameter = [empRole, empName]
    console.log (parameter)
const updateSql = `UPDATE employee SET role_id= ? WHERE id = ?`;

db.query(updateSql, parameter, (err, res) => {
  if (err) throw err;
console.log("Employee has been updated!");

viewAllEmployees();
});

  })



})

  }


  )

})

}



  init()