"use client"

import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"

const tasks = [
  {
    tag: "React",
    description: "Learn all basic concepts of react",
    color: "blue",
  },
  {
    tag: "Python",
    description: "Debugging in python project",
    color: "orange",
  },
  {
    tag: "Maths",
    description: "Learn and practive some cocepts of maths",
    color: "green",
  },
  {
    tag: "Science",
    description: "Science study",
    color: "red",
  },
  {
    tag: "JS",
    description: "Learn basic concepts of javascript",
    color: "yellow",
  },
  {
    tag: "Dinner",
    description: "Do dinner",
    color: "purple",
  },
  {
    tag: "Project",
    description: "Make a small project of react",
    color: "pink",
  },
  {
    tag: "Cricket",
    description: "Play cricket with friends",
    color: "amber",
  },
]

const TodoList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Todo List</h1>

        <div className="flex justify-center">
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-full">Create Task</Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tasks.map((task, index) => (
              <Card key={index} className="p-4 space-y-2">
                <Badge
                  variant="secondary"
                  className={`bg-${task.color}-100 text-${task.color}-800 hover:bg-${task.color}-100`}
                >
                  {task.tag}
                </Badge>
                <p className="text-gray-600">{task.description}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" className={`text-${task.color}-500 hover:text-${task.color}-600`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className={`text-${task.color}-500 hover:text-${task.color}-600`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoList

