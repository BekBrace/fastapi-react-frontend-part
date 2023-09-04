import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    UseDisclosure,
} from "@chakra-ui/react";

const TodosContext = React.createContext({
  todos: [], fetchTodos: () => {}
})

// POST ROUTE
// Adding a new AddTodo function
function AddTodo() {
  const [item, setItem] = React.useState("")
  const {todos, fetchTodos} = React.useContext(TodosContext)

  const handleInput = event  => {
    setItem(event.target.value)
  }

  const handleSubmit = (event) => {
    const newTodo = {
      "id": todos.length + 1,
      "item": item
    }

    fetch("http://localhost:8000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo)
    }).then(fetchTodos)
  }

  // Returning the form to be rendered
  
  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Add a todo item"
          aria-label="Add a todo item"
          onChange={handleInput}
        />
      </InputGroup>
    </form>
  )
}


// PUT ROUTE
function UpdateTodo({item, id}) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [todo, setTodo] = useState(item)
  const {fetchTodos} = React.useContext(TodosContext)

  const updateTodo = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: todo })
    })
    onClose()
    await fetchTodos()
  }

  return (
    <>
    
      <Button
  h="2rem"           // Increase the height
  fontSize="1rem"    // Increase the font size
  fontWeight="bold"  // Make the text bold
  colorScheme="twitter" // Change the color scheme (you can choose from different color schemes)
  borderRadius="10px" // Add rounded corners
  boxShadow="md"     // Add a small box shadow
  _hover={{
    bg: 'facebook.500',   // Change the background color on hover
          }}
  size="sm"
  onClick={onOpen}>Update Todo</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Update Todo</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Add a todo item"
                aria-label="Add a todo item"
                value={todo}  
                onChange={e => setTodo(e.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button h="2rem"           // Increase the height
              fontSize="1rem"    // Increase the font size
              fontWeight="bold"  // Make the text bold
              colorScheme="twitter" // Change the color scheme (you can choose from different color schemes)
              borderRadius="10px" // Add rounded corners
              boxShadow="md"     // Add a small box shadow
              _hover={{
                bg: 'facebook.500',   // Change the background color on hover
                      }}
            size="sm"
            onClick={updateTodo}>Update Todo</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

// DELETE ROUTE
function DeleteTodo({id}) {
  const {fetchTodos} = React.useContext(TodosContext)

  const deleteTodo = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: { "id": id }
    })
    await fetchTodos()
  }

  return (
    <Button
  h="2rem"           // Increase the height
  fontSize="1rem"    // Increase the font size
  fontWeight="bold"  // Make the text bold
  colorScheme="yellow" // Change the color scheme (you can choose from different color schemes)
  borderRadius="10px" // Add rounded corners
  boxShadow="md"     // Add a small box shadow
  _hover={{
    bg: 'red.500',   // Change the background color on hover
  }}
  size="sm"
  onClick={deleteTodo}>
  Delete Todo
</Button>
  )
}


// Before adding the component to the Todos component, let's add a helper component for rendering todos to clean things up a bit:
function TodoHelper({item, id, fetchTodos}) {
  return (
    <Box p={1} shadow="sm">
      <Flex justify="space-between">
        <Text mt={4} as="div">
          {item}
          <Flex align="end">
            <UpdateTodo item={item} id={id} fetchTodos={fetchTodos}/>
            <DeleteTodo id={id} fetchTodos={fetchTodos}/>  {/* new */}
          </Flex>
        </Text>
      </Flex>
    </Box>
  )
}


// EXPORT TOODS
export default function Todos() {
  const [todos, setTodos] = useState([])
  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8000/todo")
    const todos = await response.json()
    setTodos(todos.data)
  }
  useEffect(() => {
    fetchTodos()
  }, [])

// REPLACE THE RETURN WITH A NEW AFTER ADDING THE PUT ROUTE
  return (
    <TodosContext.Provider value={{todos, fetchTodos}}>
      <AddTodo />
      <Stack spacing={5}>
        {
          todos.map((todo) => (
            <TodoHelper item={todo.item} id={todo.id} fetchTodos={fetchTodos} />
          ))
        }
      </Stack>
    </TodosContext.Provider>
  )
}

