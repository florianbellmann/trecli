import boardInfo from '../api'
// Require the lib, get a working terminal
import { terminal as term } from 'terminal-kit'

// // The term() function simply output a string to stdout, using current style
// // output "Hello world!" in default terminal's colors
// term('Hello world!\n')

// // This output 'red' in red
// term.red('red')

// // This output 'bold' in bold
// term.bold('bold')

// // output 'mixed' using bold, underlined & red, exposing the style-mixing syntax
// term.bold.underline.red('mixed')

// // printf() style formatting everywhere:
// // this will output 'My name is Jack, I'm 32.' in green
// term.green("My name is %s, I'm %d.\n", 'Jack', 32)

// // Since v0.16.x, style markup are supported as a shorthand.
// // Those two lines produce the same result.
// term('My name is ').red('Jack')(" and I'm ").green('32\n')
// term("My name is ^rJack^ and I'm ^g32\n")

// // Width and height of the terminal
// term('The terminal size is %dx%d', term.width, term.height)

// // Move the cursor at the upper-left corner
// term.moveTo(1, 1)

// // We can always pass additional arguments that will be displayed...
// term.moveTo(1, 1, 'Upper-left corner')

// // ... and formated
// term.moveTo(1, 1, "My name is %s, I'm %d.\n", 'Jack', 32)

// // ... or even combined with other styles
// term.moveTo.cyan(1, 1, "My name is %s, I'm %d.\n", 'Jack', 32)

// // Get some user input
// term.magenta('Enter your name: ')
// term.inputField(function (error: any, input: any) {
//   term.green("\nYour name is '%s'\n", input)
// })

var fs = require('fs')

term.cyan('Choose a file:\n')

// var items = fs.readdirSync(process.cwd())

// const items = [
//   ['asdf', 'a2fds', 'a3fsd'],
//   ['bdfss', 'bfdsd2', 'bfsdfdsfsd3'],
//   ['', 'cs3', 'csadfdf']
// ]

const items2 = boardInfo
console.log(`items2`, items2)

term.gridMenu(items2, function (error: any, response: any) {
  term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, response.selectedText, response.x, response.y)
  process.exit()
})
