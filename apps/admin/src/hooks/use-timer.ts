import { useRef, useState } from 'react'

export default function __UseTimer(time: number) {
  const [timer, setTimer] = useState(time)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  function start() {
    stop()
    setTimer(time)
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
  }

  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  function reset() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setTimer(time)
    }
  }

  return { timer, start, stop, reset }
}
