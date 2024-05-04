import exifr from "exifr"

const result = await exifr.parse("./test.jpeg", true)

console.log(result)
