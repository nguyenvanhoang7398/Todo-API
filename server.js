var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
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
}];

app.get('/todos', function (req, res) {
    res.json(todos);
});

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

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});