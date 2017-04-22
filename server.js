//server.js

var config = require(__dirname + "/config.js");

var express     = require('express');
var app         = express();
v
    inProgess: type.boolean(),
    assigned: type.boolean(),
    createdAt: type.date()
});`


var Employee = thinky.createModel("employees", {
    id: type.string(),
    firstname: type.string(),
    lastname: type.string(),
    tasks: type.array()
});


// Ensure that an index createdAt exists
Task.ensureIndex("createdAt");


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true}));/Users/jonatns/toody/server.js
app.use(bodyParser.json());
app.use(methodOverride());

app.get('/api/employees', function(req, res) {
  Employee.orderBy("firstname").run().then(function(result) {
    res.send(JSON.stringify(result));
  })
});



app.get('/api/employee/:id', function(req, res) {
  Employee.get(req.params.id).run().then(function(employee) {
    res.send(JSON.stringify(employee));
  });
});

app.post('/api/task', function(req, res) {
  var task = new Task({
    title: req.body.title,
    client: req.body.client,
    done: false,
    inProgress: false,
    assigned: false,
    createdAt: Date.now()
  });

  task.save().then(function(result) {
    Task.orderBy({index: "createdAt"}).run().then(function(result) {
      res.send(JSON.stringify(result));
    });
  });
});


app.delete('/api/task/:id', function(req, res) {
  Task.get(req.params.id).run().then(function(task) {
      task.delete().then(function(result) {
        Task.orderBy({index: "createdAt"}).run().then(function(result) {
          res.send(JSON.stringify(result));
        });
      });

  });

});

app.post('/api/task/done/:id', function(req, res) {
  var taskData = {
    client: req.body.client,
    createdAt: req.body.createdAt,
    done: false,
    id: req.body.id,
    inProgress: false,
    assigned: true,
    title: req.body.title
  }
  Task.get(req.params.id).run().then(function(task) {
      task.delete().then(function(result) {
        Task.orderBy({index: "createdAt"}).run().then(function(result) {
          res.send(JSON.stringify(result));
        });
      });
  });
});

app.post('/api/assign/:employee_id', function(req, res) {


  var taskData = {
    client: req.body.client,
    createdAt: req.body.createdAt,
    done: false,
    id: req.body.id,
    inProgress: false,
    assigned: true,
    title: req.body.title
  }


  Task.get(req.body.id).then(function(task) {
    task.merge(taskData).save().then(function(result) {
      Employee.get(req.params.employee_id).then(function(employee) {
        var array = new Array();
        for (var i = 0; i < employee.tasks.length; i++) {
          array[i] = employee.tasks[i];
        }

        array.push(taskData)
        var employeeData = {
          firstname: employee.firstname,
          lastname: employee.lastname,
          id: employee.id,
          tasks: array,
        }
        employee.merge(employeeData).save().then(function(result) {
          res.send(JSON.stringify(result));
        });
      });
    });
  });
});

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

app.listen(process.env.PORT || 3000 , function() {
    console.log('App listening on port 3000');
});
