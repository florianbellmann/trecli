// eslint-disable-next-line @typescript-eslint/no-var-requires
const term = require('terminal-kit').terminal

export class CLIWrapper {
  constructor() {
    // TODO: reanable this in production
    // term.fullscreen(true)
  }

  public startColumnMenu(items: string[], callback?: (error: any, response: any) => void) {
    term.singleColumnMenu(items, function (error: any, response: any) {
      // term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, response.selectedText, response.x, response.y)
      term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, (response as any).key, response.selectedText, response.x, response.y)
      term.clear()
      term.singleColumnMenu(items, function (error: any, response: any) {
        // term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, response.selectedText, response.x, response.y)
        term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, (response as any).key, response.selectedText, response.x, response.y)
        process.exit(0)
      })
    })
  }
}
