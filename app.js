var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
// var todos = [{
//     id: 1,
//     description: 'Come back home soon',
//     completed: false
// }, {
//     id: 2,
//     description: 'go to sleep',
//     completed: false
// },  {
//     id: 3,
//     description: 'hello world',
//     completed: true
// }];
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

//GET todos
app.get('/', function(req, res){
    res.send('Todo API Root');
});

app.get('/todos', function(req, res){
    res.json(todos);
});

app.get('/todos/:id', function (req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;

    todos.forEach(function(todo){
        if (todoId === todo.id){
            matchedTodo = todo;
        }
    });

    if (matchedTodo){
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// app.get('/todos/:id', function(req,res){
//     res.send('Asking for todo with id of ' + req.params.id);
// });


//POST
app.post('/todos', function(req, res){
    var body = req.body;

    //add id field
    body.id = todoNextId++;

    //push body into array
    todos.push(body);

    res.json(body);
});

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});