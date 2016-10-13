var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

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
app.get('/todos', function(req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({
        where: where
    }).then(function (filteredTodos) {
        res.status(200).json(filteredTodos);
    }, function (e) {
        res.status(500).json(e);
    });
});

// Get /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo) {
            if (!!todo) {
                res.status(200).json(todo.toJSON());
            } else {
                res.status(404).json({
                    "error": "Todo not found"
                });
            }
        }, function(e) {
            res.status(500).json(e);
        })
        /*var matchedTodo = _.findWhere(todos, {
            id: todoId
        });

        if (matchedTodo) {
            res.send(matchedTodo);
        } else {
            res.status(404).json({
                "error": "todo not found"
            });
        }*/
})

// Get /
app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// POST /todos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo) {
        res.status(200).json(todo.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    
    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function (rowDeleted) {
        if (rowDeleted === 0) {
            res.status(404).json({
                "error": "Todo not found"
            });
        } else {
            res.status(204).send();
        }
    }).then(function () {
        res.status(500);
    });
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).json({
            "error": "No todo found with that id"
        });
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).json({
            "error": "bad data provided"
        });
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).json({
            "error": "bad data provided"
        });
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});