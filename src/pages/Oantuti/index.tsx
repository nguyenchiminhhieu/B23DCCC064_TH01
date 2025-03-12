"use client"

import { useState } from "react"
import "./styles.css"

type Choice = "rock" | "paper" | "scissors" | null
type Result = "win" | "lose" | "draw" | null
type GameRecord = {
  playerChoice: Choice
  computerChoice: Choice
  result: Result
  timestamp: Date
}

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [computerChoice, setComputerChoice] = useState<Choice>(null)
  const [result, setResult] = useState<Result>(null)
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const choices: Choice[] = ["rock", "paper", "scissors"]

  const getRandomChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * 3)
    return choices[randomIndex]
  }

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return "draw"
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "scissors" && computer === "paper") ||
      (player === "paper" && computer === "rock")
    ) {
      return "win"
    }
    return "lose"
  }

  const handlePlayerChoice = (choice: Choice) => {
    if (isPlaying) return

    setIsPlaying(true)
    setPlayerChoice(choice)

    // Simulate computer "thinking"
    setTimeout(() => {
      const computerSelection = getRandomChoice()
      setComputerChoice(computerSelection)

      const gameResult = determineWinner(choice, computerSelection)
      setResult(gameResult)

      // Add to history
      const newRecord: GameRecord = {
        playerChoice: choice,
        computerChoice: computerSelection,
        result: gameResult,
        timestamp: new Date(),
      }

      setGameHistory((prev) => [newRecord, ...prev])
      setIsPlaying(false)
    }, 1000)
  }

  const getChoiceIcon = (choice: Choice) => {
    switch (choice) {
      case "rock":
        return "✊"
      case "paper":
        return "✋"
      case "scissors":
        return "✌️"
      default:
        return "?"
    }
  }

  const getChoiceName = (choice: Choice) => {
    if (!choice) return ""

    const nameMap: Record<string, string> = {
      rock: "Búa",
      paper: "Bao",
      scissors: "Kéo",
    }

    return nameMap[choice] || ""
  }

  const getResultText = (result: Result) => {
    switch (result) {
      case "win":
        return "Bạn thắng!"
      case "lose":
        return "Bạn thua!"
      case "draw":
        return "Hòa!"
      default:
        return ""
    }
  }

  const getResultClass = (result: Result) => {
    switch (result) {
      case "win":
        return "result-win"
      case "lose":
        return "result-lose"
      case "draw":
        return "result-draw"
      default:
        return ""
    }
  }

  return (
    <div className="container">
      <div className="game-card">
        <div className="card-header">
          <h1 className="card-title">Trò chơi Oẳn Tù Tì</h1>
          <p className="card-description">Chọn Kéo, Búa, hoặc Bao để bắt đầu</p>
        </div>
        <div className="card-content">
          <div className="players-container">
            <div className="player">
              <h3 className="player-title">Bạn</h3>
              <div className="choice-display">
                <span className="choice-icon">{playerChoice ? getChoiceIcon(playerChoice) : "?"}</span>
              </div>
              <p>{getChoiceName(playerChoice)}</p>
            </div>
            <div className="player">
              <h3 className="player-title">Máy tính</h3>
              <div className="choice-display">
                <span className="choice-icon">{computerChoice ? getChoiceIcon(computerChoice) : "?"}</span>
              </div>
              <p>{getChoiceName(computerChoice)}</p>
            </div>
          </div>

          {result && (
            <div className="result-container">
              <h2 className={`result-text ${getResultClass(result)}`}>{getResultText(result)}</h2>
            </div>
          )}
        </div>
        <div className="card-footer">
          <button className="choice-button" onClick={() => handlePlayerChoice("rock")} disabled={isPlaying}>
            <span className="button-icon">✊</span>
            <span>Búa</span>
          </button>
          <button className="choice-button" onClick={() => handlePlayerChoice("paper")} disabled={isPlaying}>
            <span className="button-icon">✋</span>
            <span>Bao</span>
          </button>
          <button className="choice-button" onClick={() => handlePlayerChoice("scissors")} disabled={isPlaying}>
            <span className="button-icon">✌️</span>
            <span>Kéo</span>
          </button>
        </div>
      </div>

      <div className="history-card">
        <div className="card-header">
          <h2 className="card-title">Lịch sử trận đấu</h2>
        </div>
        <div className="card-content">
          {gameHistory.length === 0 ? (
            <p className="empty-history">Chưa có trận đấu nào</p>
          ) : (
            <div className="history-list">
              {gameHistory.map((record, index) => (
                <div key={index} className="history-item">
                  <div className="history-match">
                    <span className="history-number">#{gameHistory.length - index}:</span>
                    <div className="history-choices">
                      <span>{getChoiceIcon(record.playerChoice)}</span>
                      <span>vs</span>
                      <span>{getChoiceIcon(record.computerChoice)}</span>
                    </div>
                  </div>
                  <span className={getResultClass(record.result)}>{getResultText(record.result)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
