/* 

*/
const parseExp = /\[([0-9]{2}):([0-9]{2})\.([0-9]{2,3})\]/
export function parseLyric(lyrics) {
  if(!lyrics) return
  const lineStrings = lyrics.split('\n')
  const lyricList = []
  for (const line of lineStrings) {
    if (line) {
      const result = parseExp.exec(line)
      if(!result) continue
      const time1 = result[1] * 60 * 1000
      const time2 = result[2] * 1000
      const time3 = result[3].length > 2 ? result[3] * 1 : result[3] * 1000
      // Total duration of current song playback (milliseconds)
      const totalTime = time1 + time2 + time3
      const content = line.replace(parseExp, '').trim()
      const lineObj = {totalTime, content};
      lyricList.push(lineObj)
    }
  }
  return lyricList
}

