var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
// var todos = [{
//     id: 1,
//     description: 'Come back home soon',
//     completed: false
// }, {
//     id: 2,
//     description: 'go to sleep',C
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
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    res.json(filteredTodos);
});

app.get('/todos/:id', function (req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    // var matchedTodo;

    // todos.forEach(function(todo){
    //     if (todoId === todo.id){
    //         matchedTodo = todo;
    //     }
    // });

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
  //  var body = req.body;
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
    }
    
    body.description = body.description.trim();

    //add id field
    body.id = todoNextId++;

    //push body into array
    todos.push(body);

    res.json(body);
});


//DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (!matchedTodo){
        res.status(404).json({"error": "no todo found with that id"});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
})

//PUT /todos/:id
app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10); //get ID and converse to integer
    var matchedTodo = _.findWhere(todos, {id: todoId}); //findwhere(mảng, thuộc tính): Tìm qua danh sách (mảng) và trả về giá trị đầu tiên phù hợp với tất cả các cặp khóa-giá trị được liệt kê trong thuộc tính.
    var body = _.pick(req.body, 'description', 'completed'); //chon lay gia tri des va completed trong req.body
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){ //kiem tra completed
        validAttributes.completed = body.completed;
        debugger;
    } else if (body.hasOwnProperty('completed')){
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')){
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

})

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});