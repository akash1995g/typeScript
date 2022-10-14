import React, { useEffect,useState } from 'react';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';


var App: React.FC = () => {
  var todo = [{ id: "t1", text: "react course" }]
  var [todoList, setTodoList] = useState([])

  const setValue = (enterValue: string) => {
    var data = {id: Math.random.toString(),text: enterValue}
   // setTodoList([data])
  }

  return (
    <div className="App">
      <NewTodo update={setValue} />
      <TodoList items={todo} />
    </div>
  );
}

export default App;
