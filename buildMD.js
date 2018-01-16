const fs = require('fs-extra')
const readDir = require('fs-readdir-recursive')

async function read (input, output) {
  const paths = await readDir(input)
  const diarys = await Promise.all(paths.map(async path => {
    const matches = path.trim().match(/[\d/]+/)
    return {
      path: matches ? matches[0] : '',
      data: await fs.readFile(input + '/' + path, 'utf8')
    }
  }))

  let results = {}
  for (let i = 0; i < diarys.length; i++) {
    let date = diarys[i].path.match(/\d+\/\d+\/\d+/)
    if (date === null) continue
    date = date[0]
    date = new Date(date)
    const month = date.getFullYear() + '/' + (date.getMonth() + 1)
    const day = String(date.getDate())
    results[month] = results[month] || []
    let content = diarys[i].data || ''
    let title = content.trim().match(/#+(.+)\n?/)
    title = title ? title[1].trim() : ''
    results[month].push({
      day: day,
      title: title,
      content: content
    })
  }

  return await Promise.all(Object.keys(results).map(async key => {
    const outputPath = output + '/' + key + '.json'
    try {
      await fs.outputJson(outputPath, results[key])
      return 'done'
    } catch (e) {
      console.error(e)
      return 'fail'
    }
  }))
}

const INPUT_DIR = 'md'
const OUTPUT_DIR = 'build/json'
read(INPUT_DIR, OUTPUT_DIR).then(status => {
  console.log(status)
})
