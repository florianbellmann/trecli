/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
import { injectable } from 'inversify'
import { Action } from '../actions/action.handler'
import { Board, Card, List } from '../api/trello.connector'
import storage from 'node-persist'

export interface IStorageProvider {
  setCurrentBoard(board: Board): Promise<void>
  getCurrentBoard(): Promise<Board>
  setCurrentLists(lists: List[]): Promise<void>
  getCurrentLists(): Promise<List[]>
  setCurrentList(list: List): Promise<void>
  getCurrentList(): Promise<List>
  setCurrentCards(cards: Card[]): Promise<void>
  getCurrentCards(): Promise<Card[]>
  setCurrentAction(action: Action): Promise<void>
  getCurrentAction(): Promise<Action>
  setCurrentCard(card: Card): Promise<void>
  getCurrentCard(): Promise<Card>
}

// TODO: rename me!
@injectable()
export class GlobalStateContext implements IStorageProvider {
  private currentBoard: Board
  private currentLists: List[]
  private currentList: List
  private currentCards: Card[]
  private currentCard: Card
  private currentAction: Action

  // TODO: why caps?
  public BOARD_NAMES: string[]

  constructor() {
    const boardNames = process.env.BOARD_NAMES
    const boardNamesArray = boardNames.split(',')
    this.BOARD_NAMES = boardNamesArray
    this.init()
  }
  private async init() {
    await storage.init({
      ttl: 1000 * 60 * 15 // 15 minutes
    })
  }

  private waitandRetry(callback: any) {
    let tryIndex = 1
    const maxTries = 5
    const interval = 100

    return new Promise((resolve, reject) => {
      const tryFunc = async () => {
        try {
          const returnVal = await callback()
          resolve(returnVal)
        } catch (error) {
          if (tryIndex < maxTries) {
            tryIndex++
            setTimeout(tryFunc, interval)
          } else {
            reject(false)
          }
        }
      }
      tryFunc()
    })
  }

  public async setCurrentBoard(board: Board) {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      this.waitandRetry(() => storage.update('currentBoard', board))
    } else {
      this.waitandRetry(() => storage.setItem('currentBoard', board))
    }

    this.currentBoard = board
  }

  public async getCurrentBoard(): Promise<Board> {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      return (await this.waitandRetry(() => storage.get('currentBoard'))) as Board
    } else {
      return this.currentBoard
    }
  }

  public async setCurrentLists(lists: List[]) {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      this.waitandRetry(() => storage.update('currentLists', lists))
    } else {
      this.waitandRetry(() => storage.setItem('currentLists', lists))
    }

    this.currentLists = lists
  }
  public async getCurrentLists(): Promise<List[]> {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      return (await this.waitandRetry(() => storage.get('currentLists'))) as List[]
    } else {
      return this.currentLists
    }
  }

  public async setCurrentList(list: List) {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      this.waitandRetry(() => storage.update('currentList', list))
    } else {
      this.waitandRetry(() => storage.setItem('currentList', list))
    }

    this.currentList = list
  }

  public async getCurrentList(): Promise<List> {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      return (await this.waitandRetry(() => storage.get('currentList'))) as List
    } else {
      return this.currentList
    }
  }

  public async setCurrentCards(cards: Card[]) {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      this.waitandRetry(() => storage.update('currentCards', cards))
    } else {
      this.waitandRetry(() => storage.setItem('currentCards', cards))
    }

    this.currentCards = cards
  }
  public async getCurrentCards(): Promise<Card[]> {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      return (await this.waitandRetry(() => storage.get('currentCards'))) as Card[]
    } else {
      return this.currentCards
    }
  }

  public async setCurrentAction(action: Action) {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      this.waitandRetry(() => storage.update('currentAction', action))
    } else {
      this.waitandRetry(() => storage.setItem('currentAction', action))
    }

    this.currentAction = action
  }
  public async getCurrentAction(): Promise<Action> {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      return (await this.waitandRetry(() => storage.get('currentAction'))) as Action
    } else {
      return this.currentAction
    }
  }

  public async setCurrentCard(card: Card) {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      this.waitandRetry(() => storage.update('currentCard', card))
    } else {
      this.waitandRetry(() => storage.setItem('currentCard', card))
    }

    this.currentCard = card
  }

  public async getCurrentCard(): Promise<Card> {
    const keys = (await this.waitandRetry(() => storage.keys())) as string[]
    const alreadyStored = keys.indexOf('currentBoard') > -1

    if (alreadyStored) {
      return (await this.waitandRetry(() => storage.get('currentCard'))) as Card
    } else {
      return this.currentCard
    }
  }

  // TODO: Implement storing
}
