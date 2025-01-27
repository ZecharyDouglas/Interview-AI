import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { Outlet } from "react-router-dom";

/**Currently does not have any functionality. */

function HomePage() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // // useEffect(() => {
  // //   client.models.Todo.observeQuery().subscribe({
  // //     next: (data) => setTodos([...data.items]),
  // //   });
  // // }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  return <main>{/* <Outlet /> */}</main>;
}

export default HomePage;
