"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Table,
  Tag,
  Space,
  message,
  Modal,
  Input,
  Divider,
  Typography,
  Row,
  Col,
  Tabs,
  Popconfirm,
  Rate,
  Comment,
  List,
  Avatar,
  Checkbox,
  InputNumber,
  Statistic,
} from "antd"
import type { TableProps } from "antd"
import {
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
  StarOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ScheduleOutlined,
  CommentOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import moment from "moment"
import { Line, Bar, Pie } from "@ant-design/charts"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs
const { RangePicker } = DatePicker

// Define appointment status options
const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ duyệt", color: "orange" },
  { value: "confirmed", label: "Xác nhận", color: "green" },
  { value: "completed", label: "Hoàn thành", color: "blue" },
  { value: "cancelled", label: "Hủy", color: "red" },
]

// Define days of week
const DAYS_OF_WEEK = [
  { value: 0, label: "Chủ nhật" },
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
]

// Define interfaces
interface Staff {
  id: number
  name: string
  phone: string
  email: string
  dailyLimit: number
  schedule: WorkSchedule[]
  averageRating: number
  totalRatings: number
  active: boolean
}

interface WorkSchedule {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface Service {
  id: number
  name: string
  price: number
  duration: number // in minutes
  description: string
  active: boolean
}

interface Rating {
  id: string
  appointmentId: string
  customerId: string
  customerName: string
  staffId: number
  serviceId: number
  rating: number
  comment: string
  staffResponse?: string
  createdAt: string
}

interface Appointment {
  id: string
  date: string
  time: string
  staffId: number
  staffName: string
  serviceId: number
  serviceName: string
  price: number
  duration: number
  customerName: string
  customerPhone: string
  notes: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  ratingId?: string
  createdAt: string
}

// Sample data
const initialStaff: Staff[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    dailyLimit: 8,
    schedule: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
    ],
    averageRating: 4.5,
    totalRatings: 12,
    active: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0909876543",
    email: "tranthib@example.com",
    dailyLimit: 6,
    schedule: [
      { dayOfWeek: 1, startTime: "13:00", endTime: "21:00" },
      { dayOfWeek: 2, startTime: "13:00", endTime: "21:00" },
      { dayOfWeek: 3, startTime: "13:00", endTime: "21:00" },
      { dayOfWeek: 4, startTime: "13:00", endTime: "21:00" },
      { dayOfWeek: 5, startTime: "13:00", endTime: "21:00" },
    ],
    averageRating: 4.8,
    totalRatings: 15,
    active: true,
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@example.com",
    dailyLimit: 7,
    schedule: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 2, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 6, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 0, startTime: "10:00", endTime: "18:00" },
    ],
    averageRating: 4.2,
    totalRatings: 8,
    active: true,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0987654321",
    email: "phamthid@example.com",
    dailyLimit: 5,
    schedule: [
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 6, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 0, startTime: "09:00", endTime: "17:00" },
    ],
    averageRating: 4.6,
    totalRatings: 10,
    active: true,
  },
]

const initialServices: Service[] = [
  {
    id: 1,
    name: "Cắt tóc nam",
    price: 100000,
    duration: 30,
    description: "Dịch vụ cắt tóc nam cơ bản",
    active: true,
  },
  {
    id: 2,
    name: "Cắt tóc nữ",
    price: 150000,
    duration: 45,
    description: "Dịch vụ cắt tóc nữ cơ bản",
    active: true,
  },
  {
    id: 3,
    name: "Nhuộm tóc",
    price: 500000,
    duration: 120,
    description: "Dịch vụ nhuộm tóc theo yêu cầu",
    active: true,
  },
  {
    id: 4,
    name: "Uốn tóc",
    price: 400000,
    duration: 90,
    description: "Dịch vụ uốn tóc theo yêu cầu",
    active: true,
  },
]

const initialRatings: Rating[] = [
  {
    id: "1",
    appointmentId: "1",
    customerId: "101",
    customerName: "Khách hàng 1",
    staffId: 1,
    serviceId: 1,
    rating: 5,
    comment: "Nhân viên phục vụ rất tốt, tôi rất hài lòng với kết quả.",
    staffResponse: "Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!",
    createdAt: "2025-03-10T14:30:00",
  },
  {
    id: "2",
    appointmentId: "3",
    customerId: "102",
    customerName: "Khách hàng 2",
    staffId: 2,
    serviceId: 3,
    rating: 4,
    comment: "Dịch vụ tốt, nhưng thời gian chờ hơi lâu.",
    createdAt: "2025-03-11T16:45:00",
  },
  {
    id: "3",
    appointmentId: "5",
    customerId: "103",
    customerName: "Khách hàng 3",
    staffId: 1,
    serviceId: 2,
    rating: 5,
    comment: "Tuyệt vời, sẽ quay lại lần sau!",
    staffResponse: "Rất vui khi được phục vụ quý khách!",
    createdAt: "2025-03-12T10:15:00",
  },
]

// Sample data for appointments
const initialAppointments: Appointment[] = [
  {
    id: "1",
    date: "2025-03-15",
    time: "09:00",
    staffId: 1,
    staffName: "Nguyễn Văn A",
    serviceId: 1,
    serviceName: "Cắt tóc nam",
    price: 100000,
    duration: 30,
    customerName: "Khách hàng 1",
    customerPhone: "0901234567",
    notes: "Lịch hẹn tư vấn",
    status: "completed",
    ratingId: "1",
    createdAt: "2025-03-12T08:30:00",
  },
  {
    id: "2",
    date: "2025-03-15",
    time: "10:30",
    staffId: 2,
    staffName: "Trần Thị B",
    serviceId: 2,
    serviceName: "Cắt tóc nữ",
    price: 150000,
    duration: 45,
    customerName: "Khách hàng 2",
    customerPhone: "0909876543",
    notes: "Khách VIP",
    status: "pending",
    createdAt: "2025-03-12T09:15:00",
  },
  {
    id: "3",
    date: "2025-03-16",
    time: "14:00",
    staffId: 2,
    staffName: "Trần Thị B",
    serviceId: 3,
    serviceName: "Nhuộm tóc",
    price: 500000,
    duration: 120,
    customerName: "Khách hàng 3",
    customerPhone: "0912345678",
    notes: "",
    status: "completed",
    ratingId: "2",
    createdAt: "2025-03-13T10:20:00",
  },
  {
    id: "4",
    date: "2025-03-17",
    time: "11:00",
    staffId: 3,
    staffName: "Lê Văn C",
    serviceId: 4,
    serviceName: "Uốn tóc",
    price: 400000,
    duration: 90,
    customerName: "Khách hàng 4",
    customerPhone: "0987654321",
    notes: "",
    status: "confirmed",
    createdAt: "2025-03-14T09:30:00",
  },
  {
    id: "5",
    date: "2025-03-18",
    time: "15:30",
    staffId: 1,
    staffName: "Nguyễn Văn A",
    serviceId: 2,
    serviceName: "Cắt tóc nữ",
    price: 150000,
    duration: 45,
    customerName: "Khách hàng 5",
    customerPhone: "0923456789",
    notes: "",
    status: "completed",
    ratingId: "3",
    createdAt: "2025-03-15T14:00:00",
  },
]

// LocalStorage keys
const STORAGE_KEYS = {
  APPOINTMENTS: "salon_appointments",
  STAFF: "salon_staff",
  SERVICES: "salon_services",
  RATINGS: "salon_ratings",
}

// Helper functions for localStorage
const getFromStorage = <T,>(key: string, initialData: T): T => {
  if (typeof window === "undefined") return initialData

  try {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : initialData
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return initialData
  }
}

const saveToStorage = <T,>(key: string, data: T): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

const AppointmentManagement: React.FC = () => {
  // State variables
  const [form] = Form.useForm()
  const [staffForm] = Form.useForm()
  const [serviceForm] = Form.useForm()
  const [scheduleForm] = Form.useForm()
  const [responseForm] = Form.useForm()

  // Initialize state with data from localStorage or initial data if not available
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isStaffModalVisible, setIsStaffModalVisible] = useState(false)
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false)
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false)
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false)
  const [statusModalVisible, setStatusModalVisible] = useState(false)

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [activeTab, setActiveTab] = useState("1")
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().startOf("month"),
    moment().endOf("month"),
  ])

  // Load data from localStorage on component mount
  useEffect(() => {
    setAppointments(getFromStorage(STORAGE_KEYS.APPOINTMENTS, initialAppointments))
    setStaff(getFromStorage(STORAGE_KEYS.STAFF, initialStaff))
    setServices(getFromStorage(STORAGE_KEYS.SERVICES, initialServices))
    setRatings(getFromStorage(STORAGE_KEYS.RATINGS, initialRatings))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments)
  }, [appointments])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STAFF, staff)
  }, [staff])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SERVICES, services)
  }, [services])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RATINGS, ratings)
  }, [ratings])

  // ==================== APPOINTMENT MANAGEMENT ====================

  // Function to check for appointment conflicts
  const checkConflict = (
    date: string,
    time: string,
    staffId: number,
    duration: number,
    currentId?: string,
  ): boolean => {
    // Convert appointment time to minutes for easier comparison
    const appointmentTime = Number.parseInt(time.split(":")[0]) * 60 + Number.parseInt(time.split(":")[1])
    const appointmentEndTime = appointmentTime + duration

    return appointments.some((app) => {
      if (app.date !== date || app.staffId !== staffId || app.id === currentId || app.status === "cancelled") {
        return false
      }

      const existingTime = Number.parseInt(app.time.split(":")[0]) * 60 + Number.parseInt(app.time.split(":")[1])
      const existingEndTime = existingTime + app.duration

      // Check if times overlap
      return (
        (appointmentTime >= existingTime && appointmentTime < existingEndTime) ||
        (appointmentEndTime > existingTime && appointmentEndTime <= existingEndTime) ||
        (appointmentTime <= existingTime && appointmentEndTime >= existingEndTime)
      )
    })
  }

  // Check if staff is available on the selected day and time
  const isStaffAvailable = (staffId: number, date: string, time: string, duration: number): boolean => {
    const selectedStaff = staff.find((s) => s.id === staffId)
    if (!selectedStaff) return false

    const dayOfWeek = dayjs(date).day()
    const workSchedule = selectedStaff.schedule.find((s) => s.dayOfWeek === dayOfWeek)

    if (!workSchedule) return false

    const appointmentTime = Number.parseInt(time.split(":")[0]) * 60 + Number.parseInt(time.split(":")[1])
    const appointmentEndTime = appointmentTime + duration

    const workStartTime =
      Number.parseInt(workSchedule.startTime.split(":")[0]) * 60 + Number.parseInt(workSchedule.startTime.split(":")[1])
    const workEndTime =
      Number.parseInt(workSchedule.endTime.split(":")[0]) * 60 + Number.parseInt(workSchedule.endTime.split(":")[1])

    return appointmentTime >= workStartTime && appointmentEndTime <= workEndTime
  }

  // Check if staff has reached daily limit
  const hasReachedDailyLimit = (staffId: number, date: string, currentId?: string): boolean => {
    const selectedStaff = staff.find((s) => s.id === staffId)
    if (!selectedStaff) return true

    const dailyAppointments = appointments.filter(
      (app) =>
        app.date === date &&
        app.staffId === staffId &&
        app.id !== currentId &&
        (app.status === "confirmed" || app.status === "pending"),
    )

    return dailyAppointments.length >= selectedStaff.dailyLimit
  }

  // Handle appointment form submission
  const handleSubmit = (values: any) => {
    const date = values.date.format("YYYY-MM-DD")
    const time = values.time.format("HH:mm")
    const staffId = values.staffId
    const serviceId = values.serviceId

    const selectedService = services.find((service) => service.id === serviceId)
    if (!selectedService) {
      message.error("Dịch vụ không hợp lệ!")
      return
    }

    const selectedStaffMember = staff.find((s) => s.id === staffId)
    if (!selectedStaffMember) {
      message.error("Nhân viên không hợp lệ!")
      return
    }

    // Check if staff is available on the selected day
    if (!isStaffAvailable(staffId, date, time, selectedService.duration)) {
      message.error("Nhân viên không làm việc vào thời gian này!")
      return
    }

    // Check if staff has reached daily limit
    if (hasReachedDailyLimit(staffId, date, editingAppointment?.id)) {
      message.error("Nhân viên đã đạt giới hạn số lượng khách trong ngày!")
      return
    }

    // Check for conflicts
    if (checkConflict(date, time, staffId, selectedService.duration, editingAppointment?.id)) {
      message.error("Lịch hẹn bị trùng! Nhân viên đã có lịch hẹn vào thời gian này.")
      return
    }

    if (editingAppointment) {
      // Update existing appointment
      const updatedAppointments = appointments.map((app) =>
        app.id === editingAppointment.id
          ? {
              ...app,
              date,
              time,
              staffId,
              staffName: selectedStaffMember.name,
              serviceId,
              serviceName: selectedService.name,
              price: selectedService.price,
              duration: selectedService.duration,
              customerName: values.customerName,
              customerPhone: values.customerPhone,
              notes: values.notes,
            }
          : app,
      )
      setAppointments(updatedAppointments)
      message.success("Cập nhật lịch hẹn thành công!")
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        date,
        time,
        staffId,
        staffName: selectedStaffMember.name,
        serviceId,
        serviceName: selectedService.name,
        price: selectedService.price,
        duration: selectedService.duration,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        notes: values.notes || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      setAppointments([...appointments, newAppointment])
      message.success("Đặt lịch hẹn thành công!")
    }

    setIsModalVisible(false)
    form.resetFields()
    setEditingAppointment(null)
  }

  // Open modal to create new appointment
  const showCreateModal = () => {
    form.resetFields()
    setEditingAppointment(null)
    setIsModalVisible(true)
  }

  // Open modal to edit appointment
  const showEditModal = (record: Appointment) => {
    setEditingAppointment(record)
    form.setFieldsValue({
      date: dayjs(record.date),
      time: dayjs(record.time, "HH:mm"),
      staffId: record.staffId,
      serviceId: record.serviceId,
      customerName: record.customerName,
      customerPhone: record.customerPhone,
      notes: record.notes,
    })
    setIsModalVisible(true)
  }

  // Open modal to update status
  const showStatusModal = (record: Appointment) => {
    setSelectedAppointment(record)
    setStatusModalVisible(true)
  }

  // Update appointment status
  const updateStatus = (status: string) => {
    if (!selectedAppointment) return

    const updatedAppointments = appointments.map((app) =>
      app.id === selectedAppointment.id ? { ...app, status: status as Appointment["status"] } : app,
    )

    setAppointments(updatedAppointments)
    setStatusModalVisible(false)
    message.success("Cập nhật trạng thái thành công!")
  }

  // Appointment table columns
  const appointmentColumns: TableProps<Appointment>["columns"] = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: STATUS_OPTIONS.map((option) => ({ text: option.label, value: option.value })),
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const statusOption = STATUS_OPTIONS.find((option) => option.value === status)
        return <Tag color={statusOption?.color}>{statusOption?.label}</Tag>
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>
            Sửa
          </Button>
          <Button type="link" onClick={() => showStatusModal(record)}>
            Trạng thái
          </Button>
        </Space>
      ),
    },
  ]

  // ==================== STAFF & SERVICE MANAGEMENT ====================

  // Handle staff form submission
  const handleStaffSubmit = (values: any) => {
    if (editingStaff) {
      // Update existing staff
      const updatedStaff = staff.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              name: values.name,
              phone: values.phone,
              email: values.email,
              dailyLimit: values.dailyLimit,
              active: values.active,
            }
          : s,
      )
      setStaff(updatedStaff)
      message.success("Cập nhật nhân viên thành công!")
    } else {
      // Create new staff
      const newStaff: Staff = {
        id: Math.max(...staff.map((s) => s.id), 0) + 1,
        name: values.name,
        phone: values.phone,
        email: values.email,
        dailyLimit: values.dailyLimit,
        schedule: [],
        averageRating: 0,
        totalRatings: 0,
        active: values.active,
      }

      setStaff([...staff, newStaff])
      message.success("Thêm nhân viên thành công!")
    }

    setIsStaffModalVisible(false)
    staffForm.resetFields()
    setEditingStaff(null)
  }

  // Open modal to create new staff
  const showCreateStaffModal = () => {
    staffForm.resetFields()
    staffForm.setFieldsValue({ active: true, dailyLimit: 8 })
    setEditingStaff(null)
    setIsStaffModalVisible(true)
  }

  // Open modal to edit staff
  const showEditStaffModal = (record: Staff) => {
    setEditingStaff(record)
    staffForm.setFieldsValue({
      name: record.name,
      phone: record.phone,
      email: record.email,
      dailyLimit: record.dailyLimit,
      active: record.active,
    })
    setIsStaffModalVisible(true)
  }

  // Delete staff
  const handleDeleteStaff = (id: number) => {
    // Check if staff has appointments
    const hasAppointments = appointments.some(
      (app) => app.staffId === id && (app.status === "pending" || app.status === "confirmed"),
    )

    if (hasAppointments) {
      message.error("Không thể xóa nhân viên có lịch hẹn đang chờ hoặc đã xác nhận!")
      return
    }

    setStaff(staff.filter((s) => s.id !== id))
    message.success("Xóa nhân viên thành công!")
  }

  // Open modal to manage staff schedule
  const showScheduleModal = (record: Staff) => {
    setSelectedStaff(record)
    scheduleForm.resetFields()
    setIsScheduleModalVisible(true)
  }

  // Add work schedule for staff
  const handleAddSchedule = (values: any) => {
    if (!selectedStaff) return

    const dayOfWeek = values.dayOfWeek
    const startTime = values.timeRange[0].format("HH:mm")
    const endTime = values.timeRange[1].format("HH:mm")

    // Check if day already exists in schedule
    const existingScheduleIndex = selectedStaff.schedule.findIndex((s) => s.dayOfWeek === dayOfWeek)

    const updatedStaff = [...staff]
    const staffIndex = updatedStaff.findIndex((s) => s.id === selectedStaff.id)

    if (existingScheduleIndex !== -1) {
      // Update existing schedule
      updatedStaff[staffIndex].schedule[existingScheduleIndex] = {
        dayOfWeek,
        startTime,
        endTime,
      }
    } else {
      // Add new schedule
      updatedStaff[staffIndex].schedule.push({
        dayOfWeek,
        startTime,
        endTime,
      })
    }

    setStaff(updatedStaff)
    setSelectedStaff(updatedStaff[staffIndex])
    scheduleForm.resetFields()
    message.success("Cập nhật lịch làm việc thành công!")
  }

  // Delete work schedule
  const handleDeleteSchedule = (dayOfWeek: number) => {
    if (!selectedStaff) return

    const updatedStaff = [...staff]
    const staffIndex = updatedStaff.findIndex((s) => s.id === selectedStaff.id)

    updatedStaff[staffIndex].schedule = updatedStaff[staffIndex].schedule.filter((s) => s.dayOfWeek !== dayOfWeek)

    setStaff(updatedStaff)
    setSelectedStaff(updatedStaff[staffIndex])
    message.success("Xóa lịch làm việc thành công!")
  }

  // Handle service form submission
  const handleServiceSubmit = (values: any) => {
    if (editingService) {
      // Update existing service
      const updatedServices = services.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              name: values.name,
              price: values.price,
              duration: values.duration,
              description: values.description,
              active: values.active,
            }
          : s,
      )
      setServices(updatedServices)
      message.success("Cập nhật dịch vụ thành công!")
    } else {
      // Create new service
      const newService: Service = {
        id: Math.max(...services.map((s) => s.id), 0) + 1,
        name: values.name,
        price: values.price,
        duration: values.duration,
        description: values.description,
        active: values.active,
      }

      setServices([...services, newService])
      message.success("Thêm dịch vụ thành công!")
    }

    setIsServiceModalVisible(false)
    serviceForm.resetFields()
    setEditingService(null)
  }

  // Open modal to create new service
  const showCreateServiceModal = () => {
    serviceForm.resetFields()
    serviceForm.setFieldsValue({ active: true, duration: 30 })
    setEditingService(null)
    setIsServiceModalVisible(true)
  }

  // Open modal to edit service
  const showEditServiceModal = (record: Service) => {
    setEditingService(record)
    serviceForm.setFieldsValue({
      name: record.name,
      price: record.price,
      duration: record.duration,
      description: record.description,
      active: record.active,
    })
    setIsServiceModalVisible(true)
  }

  // Delete service
  const handleDeleteService = (id: number) => {
    // Check if service has appointments
    const hasAppointments = appointments.some(
      (app) => app.serviceId === id && (app.status === "pending" || app.status === "confirmed"),
    )

    if (hasAppointments) {
      message.error("Không thể xóa dịch vụ có lịch hẹn đang chờ hoặc đã xác nhận!")
      return
    }

    setServices(services.filter((s) => s.id !== id))
    message.success("Xóa dịch vụ thành công!")
  }

  // Staff table columns
  const staffColumns: TableProps<Staff>["columns"] = [
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Giới hạn khách/ngày",
      dataIndex: "dailyLimit",
      key: "dailyLimit",
    },
    {
      title: "Đánh giá",
      key: "rating",
      render: (_, record) => (
        <Space>
          <Rate disabled defaultValue={record.averageRating} allowHalf />
          <span>({record.totalRatings})</span>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Đang hoạt động" : "Ngừng hoạt động"}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditStaffModal(record)}>
            <EditOutlined /> Sửa
          </Button>
          <Button type="link" onClick={() => showScheduleModal(record)}>
            <ScheduleOutlined /> Lịch làm việc
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDeleteStaff(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              <DeleteOutlined /> Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // Service table columns
  const serviceColumns: TableProps<Service>["columns"] = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString("vi-VN"),
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Đang cung cấp" : "Ngừng cung cấp"}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditServiceModal(record)}>
            <EditOutlined /> Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => handleDeleteService(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              <DeleteOutlined /> Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // ==================== RATINGS MANAGEMENT ====================

  // Open modal to respond to rating
  const showResponseModal = (record: Rating) => {
    setSelectedRating(record)
    responseForm.resetFields()
    if (record.staffResponse) {
      responseForm.setFieldsValue({ response: record.staffResponse })
    }
    setIsResponseModalVisible(true)
  }

  // Submit staff response to rating
  const handleResponseSubmit = (values: any) => {
    if (!selectedRating) return

    const updatedRatings = ratings.map((r) =>
      r.id === selectedRating.id ? { ...r, staffResponse: values.response } : r,
    )

    setRatings(updatedRatings)
    setIsResponseModalVisible(false)
    responseForm.resetFields()
    message.success("Phản hồi đánh giá thành công!")
  }

  // Ratings table columns
  const ratingColumns: TableProps<Rating>["columns"] = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Nhân viên",
      key: "staffName",
      render: (_, record) => {
        const staffMember = staff.find((s) => s.id === record.staffId)
        return staffMember ? staffMember.name : "N/A"
      },
    },
    {
      title: "Dịch vụ",
      key: "serviceName",
      render: (_, record) => {
        const service = services.find((s) => s.id === record.serviceId)
        return service ? service.name : "N/A"
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: "Nhận xét",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showResponseModal(record)}>
          <CommentOutlined /> {record.staffResponse ? "Xem phản hồi" : "Phản hồi"}
        </Button>
      ),
    },
  ]

  // ==================== STATISTICS & REPORTS ====================

  // Get appointment statistics by date range
  const getAppointmentStats = () => {
    const startDate = dateRange[0].format("YYYY-MM-DD")
    const endDate = dateRange[1].format("YYYY-MM-DD")

    // Filter appointments by date range
    const filteredAppointments = appointments.filter((app) => app.date >= startDate && app.date <= endDate)

    // Group by date
    const groupedByDate = filteredAppointments.reduce(
      (acc, app) => {
        const date = app.date
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(app)
        return acc
      },
      {} as Record<string, Appointment[]>,
    )

    // Convert to chart data
    return Object.entries(groupedByDate).map(([date, apps]) => ({
      date: dayjs(date).format("DD/MM"),
      total: apps.length,
      completed: apps.filter((a) => a.status === "completed").length,
      cancelled: apps.filter((a) => a.status === "cancelled").length,
    }))
  }

  // Get revenue statistics by service
  const getRevenueByService = () => {
    const startDate = dateRange[0].format("YYYY-MM-DD")
    const endDate = dateRange[1].format("YYYY-MM-DD")

    // Filter completed appointments by date range
    const filteredAppointments = appointments.filter(
      (app) => app.date >= startDate && app.date <= endDate && app.status === "completed",
    )

    // Group by service
    const groupedByService = filteredAppointments.reduce(
      (acc, app) => {
        const serviceId = app.serviceId
        if (!acc[serviceId]) {
          acc[serviceId] = {
            name: app.serviceName,
            revenue: 0,
            count: 0,
          }
        }
        acc[serviceId].revenue += app.price
        acc[serviceId].count += 1
        return acc
      },
      {} as Record<number, { name: string; revenue: number; count: number }>,
    )

    // Convert to chart data
    return Object.values(groupedByService).map((service) => ({
      name: service.name,
      revenue: service.revenue,
      count: service.count,
    }))
  }

  // Get revenue statistics by staff
  const getRevenueByStaff = () => {
    const startDate = dateRange[0].format("YYYY-MM-DD")
    const endDate = dateRange[1].format("YYYY-MM-DD")

    // Filter completed appointments by date range
    const filteredAppointments = appointments.filter(
      (app) => app.date >= startDate && app.date <= endDate && app.status === "completed",
    )

    // Group by staff
    const groupedByStaff = filteredAppointments.reduce(
      (acc, app) => {
        const staffId = app.staffId
        if (!acc[staffId]) {
          acc[staffId] = {
            name: app.staffName,
            revenue: 0,
            count: 0,
          }
        }
        acc[staffId].revenue += app.price
        acc[staffId].count += 1
        return acc
      },
      {} as Record<number, { name: string; revenue: number; count: number }>,
    )

    // Convert to chart data
    return Object.values(groupedByStaff).map((staff) => ({
      name: staff.name,
      revenue: staff.revenue,
      count: staff.count,
    }))
  }

  // Calculate total revenue
  const getTotalRevenue = () => {
    const startDate = dateRange[0].format("YYYY-MM-DD")
    const endDate = dateRange[1].format("YYYY-MM-DD")

    return appointments
      .filter((app) => app.date >= startDate && app.date <= endDate && app.status === "completed")
      .reduce((sum, app) => sum + app.price, 0)
  }

  // Calculate total appointments
  const getTotalAppointments = () => {
    const startDate = dateRange[0].format("YYYY-MM-DD")
    const endDate = dateRange[1].format("YYYY-MM-DD")

    return appointments.filter((app) => app.date >= startDate && app.date <= endDate).length
  }

  // Calculate completed appointments
  const getCompletedAppointments = () => {
    const startDate = dateRange[0].format("YYYY-MM-DD")
    const endDate = dateRange[1].format("YYYY-MM-DD")

    return appointments.filter((app) => app.date >= startDate && app.date <= endDate && app.status === "completed")
      .length
  }

  // Handle date range change
  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([moment(dates[0]), moment(dates[1])])
    }
  }

  return (
    <div className="appointment-management">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <CalendarOutlined />
                Quản lý lịch hẹn
              </span>
            }
            key="1"
          >
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4}>Quản lý lịch hẹn</Title>
              </Col>
              <Col>
                <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
                  Đặt lịch hẹn
                </Button>
              </Col>
            </Row>

            <Table columns={appointmentColumns} dataSource={appointments} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Quản lý nhân viên & dịch vụ
              </span>
            }
            key="2"
          >
            <Tabs defaultActiveKey="staff" type="card">
              <TabPane tab="Nhân viên" key="staff">
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                  <Col>
                    <Title level={4}>Quản lý nhân viên</Title>
                  </Col>
                  <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showCreateStaffModal}>
                      Thêm nhân viên
                    </Button>
                  </Col>
                </Row>

                <Table columns={staffColumns} dataSource={staff} rowKey="id" pagination={{ pageSize: 10 }} />
              </TabPane>

              <TabPane tab="Dịch vụ" key="service">
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                  <Col>
                    <Title level={4}>Quản lý dịch vụ</Title>
                  </Col>
                  <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showCreateServiceModal}>
                      Thêm dịch vụ
                    </Button>
                  </Col>
                </Row>

                <Table columns={serviceColumns} dataSource={services} rowKey="id" pagination={{ pageSize: 10 }} />
              </TabPane>
            </Tabs>
          </TabPane>

          <TabPane
            tab={
              <span>
                <StarOutlined />
                Đánh giá dịch vụ & nhân viên
              </span>
            }
            key="3"
          >
            <Title level={4}>Đánh giá dịch vụ & nhân viên</Title>

            <Table
              columns={ratingColumns}
              dataSource={ratings}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ margin: 0 }}>
                    <Paragraph>
                      <strong>Nhận xét của khách hàng:</strong> {record.comment}
                    </Paragraph>
                    {record.staffResponse && (
                      <Paragraph>
                        <strong>Phản hồi của nhân viên:</strong> {record.staffResponse}
                      </Paragraph>
                    )}
                  </div>
                ),
              }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Thống kê & báo cáo
              </span>
            }
            key="4"
          >
            <Title level={4}>Thống kê & báo cáo</Title>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <Card>
                  <Space direction="horizontal" size="large">
                    <RangePicker value={dateRange} onChange={handleDateRangeChange} format="DD/MM/YYYY" />
                  </Space>
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tổng doanh thu"
                    value={getTotalRevenue()}
                    precision={0}
                    valueStyle={{ color: "#3f8600" }}
                    prefix={<DollarOutlined />}
                    suffix="VNĐ"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tổng số lịch hẹn"
                    value={getTotalAppointments()}
                    valueStyle={{ color: "#1890ff" }}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Lịch hẹn hoàn thành"
                    value={getCompletedAppointments()}
                    valueStyle={{ color: "#52c41a" }}
                    prefix={<CheckOutlined />}
                    suffix={`/ ${getTotalAppointments()}`}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <Card title="Thống kê lịch hẹn theo ngày">
                  <Line
                    data={getAppointmentStats()}
                    xField="date"
                    yField="total"
                    seriesField="type"
                    legend={{ position: "top" }}
                    smooth
                    animation={{
                      appear: {
                        animation: "path-in",
                        duration: 1000,
                      },
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Card title="Doanh thu theo dịch vụ">
                  <Bar
                    data={getRevenueByService()}
                    xField="revenue"
                    yField="name"
                    seriesField="name"
                    legend={{ position: "top-right" }}
                    barBackground={{ style: { fill: "rgba(0,0,0,0.1)" } }}
                    interactions={[
                      {
                        type: "active-region",
                        enable: false,
                      },
                    ]}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Doanh thu theo nhân viên">
                  <Pie
                    data={getRevenueByStaff().map((item) => ({
                      type: item.name,
                      value: item.revenue,
                    }))}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: "outer",
                      content: "{name} {percentage}",
                    }}
                    interactions={[
                      {
                        type: "pie-legend-active",
                      },
                      {
                        type: "element-active",
                      },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal for creating/editing appointments */}
      <Modal
        title={editingAppointment ? "Sửa lịch hẹn" : "Đặt lịch hẹn mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true, message: "Vui lòng chọn ngày hẹn!" }]}>
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf("day")}
            />
          </Form.Item>

          <Form.Item name="time" label="Giờ hẹn" rules={[{ required: true, message: "Vui lòng chọn giờ hẹn!" }]}>
            <TimePicker style={{ width: "100%" }} format="HH:mm" minuteStep={15} />
          </Form.Item>

          <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}>
            <Select placeholder="Chọn dịch vụ">
              {services
                .filter((s) => s.active)
                .map((service) => (
                  <Option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString("vi-VN")}đ ({service.duration} phút)
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="staffId"
            label="Nhân viên phục vụ"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
          >
            <Select placeholder="Chọn nhân viên">
              {staff
                .filter((s) => s.active)
                .map((s) => (
                  <Option key={s.id} value={s.id}>
                    {s.name} - {s.averageRating > 0 ? `${s.averageRating.toFixed(1)}★` : "Chưa có đánh giá"}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingAppointment ? "Cập nhật" : "Đặt lịch"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for updating status */}
      <Modal
        title="Cập nhật trạng thái lịch hẹn"
        visible={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        {selectedAppointment && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Khách hàng:</Text> {selectedAppointment.customerName}
              <br />
              <Text strong>Ngày giờ:</Text> {dayjs(selectedAppointment.date).format("DD/MM/YYYY")}{" "}
              {selectedAppointment.time}
              <br />
              <Text strong>Dịch vụ:</Text> {selectedAppointment.serviceName}
              <br />
              <Text strong>Nhân viên:</Text> {selectedAppointment.staffName}
              <br />
              <Text strong>Trạng thái hiện tại:</Text>{" "}
              <Tag color={STATUS_OPTIONS.find((s) => s.value === selectedAppointment.status)?.color}>
                {STATUS_OPTIONS.find((s) => s.value === selectedAppointment.status)?.label}
              </Tag>
            </div>

            <Divider />

            <Text strong>Chọn trạng thái mới:</Text>
            <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {STATUS_OPTIONS.map((status) => (
                <Button
                  key={status.value}
                  onClick={() => updateStatus(status.value)}
                  type={selectedAppointment.status === status.value ? "primary" : "default"}
                  style={{
                    borderColor: status.color,
                    color: selectedAppointment.status !== status.value ? status.color : undefined,
                  }}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </Modal>

      {/* Modal for creating/editing staff */}
      <Modal
        title={editingStaff ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
        visible={isStaffModalVisible}
        onCancel={() => setIsStaffModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={staffForm} layout="vertical" onFinish={handleStaffSubmit}>
          <Form.Item
            name="name"
            label="Tên nhân viên"
            rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
          >
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="dailyLimit"
            label="Giới hạn khách/ngày"
            rules={[{ required: true, message: "Vui lòng nhập giới hạn khách hàng!" }]}
          >
            <InputNumber min={1} max={20} placeholder="Nhập giới hạn" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="active" valuePropName="checked">
            <Checkbox>Đang hoạt động</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsStaffModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingStaff ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for creating/editing service */}
      <Modal
        title={editingService ? "Sửa thông tin dịch vụ" : "Thêm dịch vụ mới"}
        visible={isServiceModalVisible}
        onCancel={() => setIsServiceModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={serviceForm} layout="vertical" onFinish={handleServiceSubmit}>
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá dịch vụ (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá dịch vụ!" }]}
          >
            <InputNumber
              min={0}
              step={10000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => {
                const parsed = value ? Number(value.replace(/\$\s?|(,*)/g, "")) : 0
                return parsed as unknown as 0
              }}
              style={{ width: "100%" }}
              placeholder="Nhập giá dịch vụ"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian thực hiện (phút)"
            rules={[{ required: true, message: "Vui lòng nhập thời gian thực hiện!" }]}
          >
            <InputNumber min={5} step={5} style={{ width: "100%" }} placeholder="Nhập thời gian thực hiện" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả dịch vụ">
            <TextArea rows={4} placeholder="Nhập mô tả dịch vụ" />
          </Form.Item>

          <Form.Item name="active" valuePropName="checked">
            <Checkbox>Đang cung cấp</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsServiceModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingService ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for managing staff schedule */}
      <Modal
        title={`Quản lý lịch làm việc - ${selectedStaff?.name}`}
        visible={isScheduleModalVisible}
        onCancel={() => setIsScheduleModalVisible(false)}
        footer={null}
        width={700}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form form={scheduleForm} layout="vertical" onFinish={handleAddSchedule}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="dayOfWeek"
                    label="Ngày trong tuần"
                    rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                  >
                    <Select placeholder="Chọn ngày">
                      {DAYS_OF_WEEK.map((day) => (
                        <Option key={day.value} value={day.value}>
                          {day.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="timeRange"
                    label="Thời gian làm việc"
                    rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
                  >
                    <TimePicker.RangePicker format="HH:mm" minuteStep={15} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: "flex", alignItems: "flex-end" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                      Thêm
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={24}>
            <Divider orientation="left">Lịch làm việc hiện tại</Divider>
            <List
              bordered
              dataSource={selectedStaff?.schedule.sort((a, b) => a.dayOfWeek - b.dayOfWeek) || []}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa lịch làm việc này?"
                      onConfirm={() => handleDeleteSchedule(item.dayOfWeek)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        Xóa
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined style={{ fontSize: 24 }} />}
                    title={DAYS_OF_WEEK.find((day) => day.value === item.dayOfWeek)?.label}
                    description={`${item.startTime} - ${item.endTime}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: "Chưa có lịch làm việc" }}
            />
          </Col>
        </Row>
      </Modal>

      {/* Modal for responding to rating */}
      <Modal
        title="Phản hồi đánh giá"
        visible={isResponseModalVisible}
        onCancel={() => setIsResponseModalVisible(false)}
        footer={null}
      >
        {selectedRating && (
          <>
            <Comment
              author={<Text strong>{selectedRating.customerName}</Text>}
              avatar={<Avatar icon={<UserOutlined />} />}
              content={
                <div>
                  <Rate disabled defaultValue={selectedRating.rating} />
                  <p>{selectedRating.comment}</p>
                </div>
              }
              datetime={dayjs(selectedRating.createdAt).format("DD/MM/YYYY HH:mm")}
            />

            <Divider />

            <Form form={responseForm} layout="vertical" onFinish={handleResponseSubmit}>
              <Form.Item
                name="response"
                label="Phản hồi của nhân viên"
                rules={[{ required: true, message: "Vui lòng nhập phản hồi!" }]}
              >
                <TextArea rows={4} placeholder="Nhập phản hồi của bạn" />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button onClick={() => setIsResponseModalVisible(false)}>Hủy</Button>
                  <Button type="primary" htmlType="submit">
                    {selectedRating.staffResponse ? "Cập nhật phản hồi" : "Gửi phản hồi"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  )
}

export default AppointmentManagement

