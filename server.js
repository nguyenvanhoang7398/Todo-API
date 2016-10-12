var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

/*var todos = [{
    id: 1,
    description: 'Complete CS1010 lab assignment',
    completed: false
}, {
    id: 2,
    description: 'Meeting with prof. for algorithms',
    completed: false
}, {
    id: 3,
    description: 'Jogging at NUS field',
    completed: true
}];*/

// Get /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

// Get /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = req.params.id;
    var matchedTodo;
    
    //res.send('Asking for todo with id of ' + todoId);
    todos.forEach(function (todo) {
        if (todo.id.toString() === todoId) {
            matchedTodo = todo;
        }
    })
    
    if (matchedTodo) {
        res.send(matchedTodo);
    } else {
        res.status(404).send('Todo not found!');
    }
})

// Get /
app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;
    
    body.id = todoNextId++;
    todos.push(body);
    
    res.json(body);
});
app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});