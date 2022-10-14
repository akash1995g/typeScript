import React ,{useRef} from "react";
import "./NewTodo.css"


// interface NewTodoProps{ // interface or type can be used
//     update : (enteredText:string) => void
// }


type NewTodoProps = {
    update : (enteredText:string) => void
}

const NewTodo: React.FC <NewTodoProps>= props => {

    const textInputRef = useRef<HTMLInputElement>(null)

    const todoSubmitHandler = (e : React.FormEvent) =>{
        e.preventDefault()
        const enteredText  = textInputRef.current!.value
        props.update(enteredText)

    } 

    return (<form className= "form-control" onSubmit={todoSubmitHandler}>
        <div>
            <label htmlFor="todo-text">New Todo</label>
            <input type="text" id="todo-text" ref={textInputRef} />
        </div>
        <br/>
        <button type="submit">Add Todo</button>
    </form>)
}

export default NewTodo