export function __TimerParser(timer: number) {
  const timerMinute = Math.floor(timer / 60)
  const timerSecond = timer % 60
  const timerLabel = `${timerMinute.toString().padStart(2, '0')}:${timerSecond.toString().padStart(2, '0')}`

  return timerLabel
}
