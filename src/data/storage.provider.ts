/* eslint-disable no-unused-vars */
import { injectable } from 'inversify'
import { Action } from '../actions/action.handler'
import { Board, Card, List } from '../api/trello.connector'

export interface IStorageProvider {
  currentCards: Card[]
  currentCard: Card
  currentAction: Action
  setCurrentBoard(board: Board): void
  getCurrentBoard(): Board
  setCurrentLists(lists: List[]): void
  getCurrentLists(): List[]
  setCurrentList(list: List): void
  getCurrentList(): List
  setCurrentCards(cards: Card[]): void
  getCurrentCards(): Card[]
  setCurrentAction(action: Action): void
  getCurrentAction(): Action
  setCurrentCard(card: Card): void
  getCurrentCard(): Card
}

// TODO: rename me!
@injectable()
export class StorageProvider implements IStorageProvider {
  private currentBoard: Board
  private currentLists: List[]
  private currentList: List
  public currentCards: Card[]
  public currentCard: Card

  public currentAction: Action

  public setCurrentBoard(board: Board) {
    this.currentBoard = board
  }
  public getCurrentBoard(): Board {
    return this.currentBoard
  }

  public setCurrentLists(lists: List[]) {
    this.currentLists = lists
  }
  public getCurrentLists(): List[] {
    return this.currentLists
  }

  public setCurrentList(list: List) {
    this.currentList = list
  }
  public getCurrentList(): List {
    return this.currentList
  }

  public setCurrentCards(cards: Card[]) {
    this.currentCards = cards
  }
  public getCurrentCards(): Card[] {
    return this.currentCards
  }

  public setCurrentAction(action: Action) {
    this.currentAction = action
  }
  public getCurrentAction(): Action {
    return this.currentAction
  }

  public setCurrentCard(card: Card) {
    this.currentCard = card
  }
  public getCurrentCard(): Card {
    return this.currentCard
  }

  // TODO: Implement storing
}
