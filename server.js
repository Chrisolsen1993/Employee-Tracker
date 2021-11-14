const inquirer = require("inquirer")
const cTable = require(console.table)
const mysql = require("mysql2")
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      Port: '3001',
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
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee",
                "Quit"
            ]
        }
    ]).then(function(val){
        switch(val.choice){
            case "View All Employees?":
              viewAllEmployees();
            break;
    
          case "View All Employee's  Roles?":
              viewAllRoles();
            break;
          case "View all Emplyee's Deparments":
              viewAllDepartments();
            break;
          
          case "Add Employee?":
                addEmployee();
              break;

           case "Add Role":
                addRole();
              break;
      
            case "Add Department?":
                addDepartment();
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
function viewAllDepartments(){
    db.query("SELECT * FROM department;"),
    function(err, res){
   if (err) throw err
   cTable(res)
   startPrompt()
    }

}




  init()