"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button, Input, Card, Typography, Space, List, Badge, message, Progress, Statistic } from "antd"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography
const { Countdown } = Statistic

const NumberGuessingGame = () => {
  const [randomNumber, setRandomNumber] = useState(0)
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(10)
  const [gameOver, setGameOver] = useState(false)
  const [history, setHistory] = useState<Array<{ guess: number; result: string }>>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60000)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1)
    setGuess("")
    setAttempts(10)
    setGameOver(false)
    setHistory([])
    setShowCelebration(false)
    setTimeLeft(60000)
    message.info("Hãy đoán một số từ 1 đến 100!")
  }

  const handleGuess = () => {
    const guessNumber = Number.parseInt(guess)

    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      message.error("Vui lòng nhập một số hợp lệ từ 1 đến 100.")
      return
    }

    setAttempts(attempts - 1)
    let result = ""

    if (guessNumber === randomNumber) {
      result = "Đúng!"
      message.success("Chúc mừng! Bạn đã đoán đúng!")
      setGameOver(true)
      setShowCelebration(true)
    } else if (attempts === 1) {
      result = "Game Over"
      message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`)
      setGameOver(true)
    } else if (guessNumber < randomNumber) {
      result = "Thấp hơn"
      message.warning(`Số ${guessNumber} thấp hơn số cần đoán!`)
    } else {
      result = "Cao hơn"
      message.warning(`Số ${guessNumber} cao hơn số cần đoán!`)
    }

    setHistory([...history, { guess: guessNumber, result }])
    setGuess("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !gameOver) {
      handleGuess()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        {}
        <div className="mb-8 animate-fadeIn">
          <Title
            level={1}
            style={{
              color: "#d32f2f",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            Game Đoán Số
          </Title>
        </div>

        {}
        <div className="w-full flex justify-center mb-8 animate-slideDown">
          <Card className="w-full max-w-md text-center p-4 border border-gray-300 shadow-sm">
            <div className="border border-gray-400 p-4 bg-gray-100">
              <Countdown
                title={
                  <Text strong style={{ color: "#000000" }}>
                    Thời gian còn lại
                  </Text>
                }
                value={Date.now() + timeLeft}
                onFinish={() => setGameOver(true)}
                className="mb-4"
              />
            </div>
          </Card>
        </div>
      </div>


      <div className="flex justify-center">
        <Card
          className="w-full max-w-md animate-fadeIn"
          hoverable
          cover={
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center relative">
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
              <TrophyOutlined 
                className="animate-bounce"
                style={{ fontSize: "64px", color: "#FFD700", position: "relative", zIndex: 1 }} 
              />
              <Progress
                percent={((10 - attempts) / 10) * 100}
                status={attempts <= 3 ? "exception" : "active"}
                format={() => `${attempts} lượt`}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                className="mt-4"
              />
            </div>
          }
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Input
              size="large"
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập số dự đoán của bạn"
              disabled={gameOver}
              prefix={<ThunderboltOutlined className="animate-pulse" style={{ color: "#1890ff" }} />}
              suffix={<Badge count={attempts} color={attempts <= 3 ? "red" : "blue"} overflowCount={10} />}
              className="transition-all hover:shadow-lg"
            />
            
            <Space style={{ width: "100%", justifyContent: "center" }}>
              <Button
                type="primary"
                onClick={handleGuess}
                disabled={gameOver}
                size="large"
                icon={<ArrowUpOutlined />}
                className="transition-all hover:scale-105"
                style={{ background: "linear-gradient(to right, #1890ff, #096dd9)" }}
              >
                Đoán
              </Button>
              <Button
                onClick={startNewGame}
                size="large"
                icon={<ReloadOutlined spin />}
                className="transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(to right, #52c41a, #389e0d)",
                  color: "white",
                }}
              >
                Chơi lại
              </Button>
            </Space>

            {history.length > 0 && (
              <List
                header={
                  <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded">
                    Lịch sử đoán
                  </div>
                }
                bordered
                dataSource={history.reverse()}
                className="transition-all hover:shadow-lg"
                renderItem={(entry, index) => (
                  <List.Item
                    className={`
                      ${index === 0 ? 'bg-blue-50' : 'bg-transparent'}
                      transition-all duration-300 hover:bg-blue-100
                      ${index === 0 ? 'animate-slideIn' : ''}
                    `}
                  >
                    <Space>
                      <Text>Lần {history.length - index}:</Text>
                      <Text strong>{entry.guess}</Text>
                      {entry.result === "Đúng!" && <CheckCircleOutlined className="text-xl text-green-500 animate-bounce" />}
                      {entry.result === "Game Over" && <CloseCircleOutlined className="text-xl text-red-500 animate-shake" />}
                      {entry.result === "Thấp hơn" && <ArrowUpOutlined className="text-xl text-yellow-500 animate-pulse" />}
                      {entry.result === "Cao hơn" && <ArrowDownOutlined className="text-xl text-yellow-500 animate-pulse" />}
                      <Text type="secondary">{entry.result}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Space>
        </Card>
      </div>

      {showCelebration && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center z-50">
          <div className="text-8xl animate-bounce">🎉</div>
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  animation: `confetti ${2 + Math.random() * 3}s linear infinite`,
                  color: ['🎈', '🎊', '✨', '⭐'][Math.floor(Math.random() * 4)],
                  fontSize: `${20 + Math.random() * 20}px`,
                }}
              >
                {['🎈', '🎊', '✨', '⭐'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes confetti {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(100vh) rotate(360deg); }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        .animate-confetti {
          position: absolute;
        }
        .animate-shake {
          animation: shake 0.5s linear;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}

export default NumberGuessingGame