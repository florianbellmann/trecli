import { terminal } from 'terminal-kit'
import { SingleColumnMenuResponse } from 'terminal-kit/Terminal'
import { TrelloHost } from './trello-host'

export class CliHost {
  private _trelloHost: TrelloHost
  private _currentKey: string

  constructor() {
    this._trelloHost = new TrelloHost()

    // terminal.fullscreen(true)
    terminal.on('resize', () => {
      console.log('resized. should re-init terminal with cached list values')
      terminal.reset
    })
  }
  public async init() {
    await this._trelloHost.init()
    this.readKeyboardInput()
  }

  public async loadList() {
    const cards = this._trelloHost.getCards()
    const result = await this.runSingleColumnMenu(cards.map((c) => c.name))
    console.log(`result`, result)

    console.log(`this._currentey`, this._currentKey)
    process.exit()
  }

  private runSingleColumnMenu(items: string[]): Promise<SingleColumnMenuResponse> {
    return new Promise<SingleColumnMenuResponse>((resolve, reject) => {
      terminal.singleColumnMenu(
        items,
        {
          keyBindings: {
            k: 'cyclePrevious',
            j: 'cycleNext',
            l: 'submit',
            ENTER: 'submit',
            KP_ENTER: 'submit',
            ESCAPE: 'escape'
          }
        },
        function (error, response) {
          if (error) {
            console.error(error)
            reject(error)
            process.exit()
          }
          console.log(`response`, response)
          terminal('\n').eraseLineAfter.green('#%s selected: %s (%s,%s)\n', response.selectedIndex, response.selectedText, response.x, response.y)
          resolve(response)
        }
      )
    })
  }

  private readKeyboardInput(): void {
    var stdin = process.stdin

    // without this, we would only get streams once enter is pressed
    stdin.setRawMode(true)

    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume()

    // i don't want binary, do you?
    stdin.setEncoding('utf8')

    // on any data into stdin
    const that = this
    stdin.on('data', function (key) {
      // write the key to stdout all normal like
      // process.stdout.write(key)
      // console.log(`key`, key)
      that._currentKey = key.toString('utf-8')
      // console.log(`this._currentey`, that._currentKey)
    })
  }

  public switchList() {
    this.runSingleColumnMenu(['hjk', 'hjk', 'hjk'])
  }

  public switchBoard() {}
}
