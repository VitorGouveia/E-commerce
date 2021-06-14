export function generateHash(num: number) {
  var add = 1
  var max = 12 - add
  
  if(num > max) {
    return generateHash(max) + generateHash(Number(num) - max)
  }
  
  max = Math.pow(10, num + add)
  var min = max / 10
  var number = Math.floor(Math.random() * (max - min + 1)) + min
  
  return ("" + number).substring(add)
}