"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const NumberGuessingGame = () => {
  const [randomNumber, setRandomNumber] = useState(0)
  const [guess, setGuess] = useState("")
  const [message, setMessage] = useState("")
  const [attempts, setAttempts] = useState(10)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1)
    setGuess("")
    setMessage("Hãy đoán một số từ 1 đến 100!")
    setAttempts(10)
    setGameOver(false)
  }

  const handleGuess = () => {
    const guessNumber = Number.parseInt(guess)

    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      setMessage("Vui lòng nhập một số hợp lệ từ 1 đến 100.")
      return
    }

    setAttempts(attempts - 1)

    if (guessNumber === randomNumber) {
      setMessage("Chúc mừng! Bạn đã đoán đúng!")
      setGameOver(true)
    } else if (attempts === 1) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`)
      setGameOver(true)
    } else if (guessNumber < randomNumber) {
      setMessage("Bạn đoán quá thấp!")
    } else {
      setMessage("Bạn đoán quá cao!")
    }

    setGuess("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-8">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Trò chơi đoán số</h1>

        <Card className="p-6 space-y-4">
          <p className="text-center text-lg">{message}</p>
          <p className="text-center">Số lượt còn lại: {attempts}</p>
          <Input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Nhập số dự đoán của bạn"
            disabled={gameOver}
          />
          <div className="flex justify-center space-x-4">
            <Button onClick={handleGuess} disabled={gameOver}>
              Đoán
            </Button>
            <Button onClick={startNewGame} variant="outline">
              Chơi lại
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default NumberGuessingGame

