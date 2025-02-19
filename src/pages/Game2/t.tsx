"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Button,
  Input,
  Card,
  Typography,
  List,
  Modal,
  Form,
  Select,
  DatePicker,
  Progress,
  Tabs,
  Calendar,
  Badge,
  Avatar,
  Statistic,
  Checkbox,
  message,
} from "antd"
import {
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"
import moment from "moment"
import type { Moment } from "moment"

const { Title, Text } = Typography
const { TextArea } = Input
const { TabPane } = Tabs

interface Subject {
  id: string
  name: string
  semester: string
  startDate: string
  description: string
  color: string
}

interface Lesson {
  id: string
  subjectId: string
  dateTime: string
  duration: number
}

interface Goal {
  id: string
  subjectId: string
  type: "weekly" | "monthly" | "yearly"
  duration: number
  completed: boolean
}

const SubjectDetails: React.FC<{ subject: Subject }> = ({ subject }) => (
  <>
    <Text>Semester: {subject.semester}</Text>
    <br />
    <Text>Start Date: {moment(subject.startDate).format("MMMM D, YYYY")}</Text>
    <br />
    <Text>Description: {subject.description}</Text>
  </>
)

const colorPalette = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F06292",
  "#AED581",
  "#7986CB",
  "#4DB6AC",
  "#FFD54F",
]

const StudyTracker: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false)
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false)
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [form] = Form.useForm()

  useEffect(() => {
    const storedSubjects = localStorage.getItem("subjects")
    const storedLessons = localStorage.getItem("lessons")
    const storedGoals = localStorage.getItem("goals")

    if (storedSubjects) setSubjects(JSON.parse(storedSubjects))
    if (storedLessons) setLessons(JSON.parse(storedLessons))
    if (storedGoals) setGoals(JSON.parse(storedGoals))
  }, [])

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects))
    localStorage.setItem("lessons", JSON.stringify(lessons))
    localStorage.setItem("goals", JSON.stringify(goals))
  }, [subjects, lessons, goals])

  const handleAddSubject = (values: any) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: values.name,
      semester: values.semester,
      startDate: values.startDate.format("YYYY-MM-DD"),
      description: values.description,
      color: colorPalette[subjects.length % colorPalette.length],
    }
    setSubjects((prevSubjects) => [...prevSubjects, newSubject])
    setIsSubjectModalVisible(false)
    form.resetFields()
    message.success("Subject added successfully")
  }

  const handleAddLesson = (values: any) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      subjectId: selectedSubject,
      dateTime: values.dateTime.format("YYYY-MM-DD HH:mm:ss"),
      duration: values.duration,
    }
    setLessons((prevLessons) => [...prevLessons, newLesson])
    setIsLessonModalVisible(false)
    form.resetFields()
    message.success("Lesson added successfully")
  }

  const handleAddGoal = (values: any) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      subjectId: values.subjectId,
      type: values.type,
      duration: values.duration,
      completed: false,
    }
    setGoals((prevGoals) => [...prevGoals, newGoal])
    setIsGoalModalVisible(false)
    form.resetFields()
    message.success("Goal added successfully")
  }

  const handleDeleteSubject = (id: string) => {
    setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== id))
    setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.subjectId !== id))
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.subjectId !== id))
    message.success("Subject deleted successfully")
  }

  const handleDeleteGoal = (id: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id))
    message.success("Goal deleted successfully")
  }

  const handleToggleGoalCompletion = (id: string) => {
    setGoals((prevGoals) => prevGoals.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)))
    message.success("Goal status updated")
  }

  const showAddLessonModal = (subjectId: string) => {
    setSelectedSubject(subjectId)
    setIsLessonModalVisible(true)
  }

  const calculateProgress = (subjectId: string) => {
    const subjectGoals = goals.filter((g) => g.subjectId === subjectId)
    if (subjectGoals.length === 0) return 0

    const completedGoals = subjectGoals.filter((g) => g.completed).length
    return Math.round((completedGoals / subjectGoals.length) * 100)
  }

  const getCalendarData = (value: Moment) => {
    return lessons.filter((lesson) => moment(lesson.dateTime).isSame(value, "day"))
  }

  const dateCellRender = (value: Moment) => {
    const listData = getCalendarData(value)
    return (
      <ul className="events">
        {listData.map((item) => {
          const subject = subjects.find((s) => s.id === item.subjectId)
          return (
            <li key={item.id}>
              <Badge color={subject?.color} text={`${subject?.name} (${moment(item.dateTime).format("HH:mm")})`} />
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
      <Card className="w-full h-[calc(100vh-2rem)] max-w-[1280px] mx-auto shadow-2xl overflow-hidden">
        <Title level={2} className="text-center mb-4 text-gradient">
          Study Progress Tracker
        </Title>

        <Tabs defaultActiveKey="1" centered className="study-tracker-tabs h-[calc(100%-4rem)]">
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Subjects
              </span>
            }
            key="1"
          >
            <div className="h-full overflow-y-auto p-4">
              <List
                dataSource={subjects}
                renderItem={(subject) => (
                  <List.Item
                    actions={[
                      <Button
                        key="add"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showAddLessonModal(subject.id)}
                      />,
                      <Button key="delete" icon={<DeleteOutlined />} onClick={() => handleDeleteSubject(subject.id)} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: subject.color }} icon={<BookOutlined />} />}
                      title={subject.name}
                      description={<SubjectDetails subject={subject} />}
                    />
                    <Progress
                      percent={calculateProgress(subject.id)}
                      status={calculateProgress(subject.id) >= 100 ? "success" : "active"}
                      strokeColor={subject.color}
                    />
                  </List.Item>
                )}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsSubjectModalVisible(true)}
                className="mt-4"
              >
                Add Subject
              </Button>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Goals
              </span>
            }
            key="2"
          >
            <div className="h-full overflow-y-auto p-4">
              <List
                dataSource={goals}
                renderItem={(goal) => (
                  <List.Item
                    actions={[
                      <Checkbox
                        key={goal.id}
                        checked={goal.completed}
                        onChange={() => handleToggleGoalCompletion(goal.id)}
                      >
                        {goal.completed ? "Completed" : "Mark as completed"}
                      </Checkbox>,
                      <Button key={goal.id} icon={<DeleteOutlined />} onClick={() => handleDeleteGoal(goal.id)} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: subjects.find((s) => s.id === goal.subjectId)?.color }}
                          icon={goal.completed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        />
                      }
                      title={`${subjects.find((s) => s.id === goal.subjectId)?.name} - ${goal.type} goal`}
                      description={`Duration: ${goal.duration} minutes`}
                    />
                  </List.Item>
                )}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsGoalModalVisible(true)}
                className="mt-4"
              >
                Add Goal
              </Button>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Dashboard
              </span>
            }
            key="3"
          >
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Title level={4}>Subject Progress</Title>
                  <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={subjects}
                    renderItem={(subject) => (
                      <List.Item>
                        <Card hoverable style={{ borderTop: `5px solid ${subject.color}` }}>
                          <Statistic title={subject.name} value={calculateProgress(subject.id)} suffix="%" />
                          <Progress
                            percent={calculateProgress(subject.id)}
                            status={calculateProgress(subject.id) >= 100 ? "success" : "active"}
                            strokeColor={subject.color}
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>
                <div>
                  <Title level={4}>Completed Goals</Title>
                  <List
                    dataSource={goals.filter((goal) => goal.completed)}
                    renderItem={(goal) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{ backgroundColor: subjects.find((s) => s.id === goal.subjectId)?.color }}
                              icon={<CheckCircleOutlined />}
                            />
                          }
                          title={`${subjects.find((s) => s.id === goal.subjectId)?.name} - ${goal.type} goal`}
                          description={`Duration: ${goal.duration} minutes`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ScheduleOutlined />
                Calendar
              </span>
            }
            key="4"
          >
            <div className="h-full overflow-y-auto">
              <Calendar dateCellRender={dateCellRender} />
            </div>
          </TabPane>
        </Tabs>

        <Modal
          title="Add Subject"
          open={isSubjectModalVisible}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleAddSubject(values)
              })
              .catch((info) => {
                console.log("Validate Failed:", info)
              })
          }}
          onCancel={() => {
            setIsSubjectModalVisible(false)
            form.resetFields()
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Subject Name"
              rules={[{ required: true, message: "Please input the subject name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="semester"
              label="Semester"
              rules={[{ required: true, message: "Please input the semester!" }]}
            >
              <Input placeholder="e.g. Fall 2023" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select the start date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please input the description!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Add Lesson"
          open={isLessonModalVisible}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleAddLesson(values)
              })
              .catch((info) => {
                console.log("Validate Failed:", info)
              })
          }}
          onCancel={() => {
            setIsLessonModalVisible(false)
            form.resetFields()
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="dateTime"
              label="Date and Time"
              rules={[{ required: true, message: "Please select the date and time!" }]}
            >
              <DatePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true, message: "Please input the duration!" }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Add Goal"
          open={isGoalModalVisible}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleAddGoal(values)
              })
              .catch((info) => {
                console.log("Validate Failed:", info)
              })
          }}
          onCancel={() => {
            setIsGoalModalVisible(false)
            form.resetFields()
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="subjectId"
              label="Subject"
              rules={[{ required: true, message: "Please select a subject!" }]}
            >
              <Select>
                {subjects.map((subject) => (
                  <Select.Option key={subject.id} value={subject.id}>
                    {subject.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="type"
              label="Goal Type"
              rules={[{ required: true, message: "Please select a goal type!" }]}
            >
              <Select>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true, message: "Please input the goal duration!" }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .events {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .events .ant-badge-status {
          width: 100%;
          overflow: hidden;
          font-size: 12px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .study-tracker-tabs .ant-tabs-nav {
          margin-bottom: 16px;
        }
        .study-tracker-tabs .ant-tabs-tab {
          font-size: 16px;
          padding: 8px 16px;
        }
        .ant-card-body {
          height: 100%;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .ant-tabs {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .ant-tabs-content {
          flex: 1;
          height: 100%;
        }
        .ant-tabs-tabpane {
          height: 100%;
        }
        @media (min-width: 1024px) {
          .ant-list-item {
            padding: 16px;
          }
          .calendar-container .ant-picker-calendar {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default StudyTracker

