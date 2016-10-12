var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if (matchedTodo) {
        res.send(matchedTodo);
    } else {
        res.status(404).json({"error": "todo not found"});
    }
})

// Get /
app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || !body.description.trim().length) {
        return res.status(400).json({"error": "Bad data provided"});
    }
    
    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    
    res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
        
        res.json(matchedTodo);
    } else {
        res.status(404).json({"error": "No todo found with that id"});
    }
})
app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});