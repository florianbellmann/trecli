import { Board, Card, List } from './trello.connector'

export interface Action {
  id: string
}

export class StorageProvider {
  private activeBoard: Board
  private currentLists: List[]
  private activeList: List
  public activeCards: Card[]

  public currentAction: Action

  public setActiveBoard(board: Board) {
    this.activeBoard = board
  }
  public getActiveBoard(): Board {
    return this.activeBoard
  }

  public setCurrentLists(lists: List[]) {
    this.currentLists = lists
  }
  public getCurrentLists(): List[] {
    return this.currentLists
  }

  public setActiveList(list: List) {
    this.activeList = list
  }
  public getActiveList(): List {
    return this.activeList
  }

  public setActiveCards(cards: Card[]) {
    this.activeCards = cards
  }
  public getActiveCards(): Card[] {
    return this.activeCards
  }

  public setCurrentAction(action: Action) {
    this.currentAction = action
  }
  public getCurrentAction(): Action {
    return this.currentAction
  }

  // TODO: Implement storing
}
