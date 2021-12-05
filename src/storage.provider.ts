export interface Board {
  id: string
}
export interface List {
  id: string
}
export interface Card {
  id: string
}
export interface Action {
  id: string
}

export class StorageProvider {
  public activeBoard: Board
  public activeList: List
  public activeCards: Card[]

  public currentAction: Action

  constructor() {
    this.activeBoard = null
    this.activeList = null
    this.activeCards = null
  }

  // TODO: Implement storing
}
