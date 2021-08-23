var Trello = require('trello')
import dotenv from 'dotenv'
import { cachedDataVersionTag } from 'v8'

dotenv.config()

export class TrelloHost {
  private _trello: any
  private _boards: any[]
  private _lists: any[]
  private _cards: any[]

  constructor() {
    this._trello = new Trello(process.env.APIKEY, process.env.APITOKEN)
  }

  public async init() {
    this._boards = await this._trello.getBoards(process.env.MEMBERID)
    const websiteBoard = this._boards.find((b: any) => b.name == 'Website')
    this._lists = await this._trello.getListsOnBoard(websiteBoard.id)

    if (this._lists.length > 0) await this.loadCardsOfList(this._lists[0])
  }

  private async loadCardsOfList(list: any) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this._cards = await this._trello.getCardsOnList(list.id)
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  public getCards() {
    return this._cards.map((card) => {
      return {
        name: card.name,
        id: card.id,
        desc: card.desc,
        due: card.due
      }
    })
    // return this._cards.map((card: any) => {
    //   card = card.map((l: any) => l.name)
    //   return card
    // })
  }
}
