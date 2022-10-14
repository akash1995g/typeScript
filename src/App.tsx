import React, { useState } from 'react';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import { Todo } from './todo.model';


var App: React.FC = () => {
  var [todoList, setTodoList] = useState<Todo[]>([])

  const setValue = (enterValue: string) => {
    var data = { id: Math.random().toString(), text: enterValue }
  
    setTodoList(old => [...old,data])
  }

  const deleteTodo  = (id:string) =>{
      console.log(id)
      setTodoList(old => old.filter( todo=> todo.id != id ))
  }

  return (
    <div className="App">
      <NewTodo update={setValue} />
      <TodoList items={todoList} delete={deleteTodo} />
    </div>
  );
}

export default App;
