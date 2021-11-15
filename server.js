const inquirer = require("inquirer")
const cTable = require("console.table")
const mysql = require("mysql2")

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      port: '3306',
      password: '',
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
    db.query("SELECT * FROM employee;",
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
    })
   
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

])

}




  init()