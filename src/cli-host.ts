import { Terminal, terminal } from 'terminal-kit'
import { TrelloHost } from './trello-host'

export class CliHost {
  private _term: Terminal
  private _trelloHost: TrelloHost

  constructor() {
    this._trelloHost = new TrelloHost()

    // this._term.fullscreen(true)
    this._term = terminal
    this._term.on('resize', () => {
      console.log('resized. should re-init terminal with cached list values')
      this._term.reset
    })
  }
  public async init() {
    await this._trelloHost.init()
  }

  public async loadList() {
    const cards = this._trelloHost.getCards()
    // console.log(`cards`, cards)
    const result = await this._term.singleColumnMenu(
      cards.map((c) => c.name),
      {
        keyBindings: {
          j: 'cyclePrevious'
        }
      }
    )
    console.log(`result`, result)
  }

  public switchList() {}

  public switchBoard() {}
}
