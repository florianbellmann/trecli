export class CLIWrapper {
  public singleColumnMenu(items: string[], callback: (error: any, response: any) => void) {}
  // const term = require('terminal-kit').terminal

  // term.cyan('The hall is spacious. Someone lighted few chandeliers.\n')
  // term.cyan('There are doorways south and west.\n')

  // const items = ['a. Go south', 'b. Go west', 'c. Go back to the street']

  // // term.fullscreen(true)
  // term.singleColumnMenu(items, function (error: any, response: any) {
  //   // term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, response.selectedText, response.x, response.y)
  //   term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, (response as any).key, response.selectedText, response.x, response.y)
  //   term.clear()
  //   term.singleColumnMenu(items, function (error: any, response: any) {
  //     // term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, response.selectedText, response.x, response.y)
  //     term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, (response as any).key, response.selectedText, response.x, response.y)
  //     process.exit(0)
  //   })
  // })
}
