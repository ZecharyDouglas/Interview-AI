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

  return <main>{<>

  <p>This is the home page.</p>
  
  </>}</main>;
}

export default HomePage;

/**
 * Columns in the db:
- user_id (string)
- item_id (string)
- confidence_value (int)
- entry_time
- interview_feedback (string)
- interview_topic (string)
- interview_transcript (string)
- name (string)
- occupation (string)
- password (string)
 */