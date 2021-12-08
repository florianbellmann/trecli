import { ActionHandler } from './action.handler'
import { CLIWrapper } from './cli.wrapper'
import { StorageProvider } from './storage.provider'
import { TrelloConnector } from './trello.connector'

// globals
export const storageProvider = new StorageProvider()
export const trelloConnector = new TrelloConnector()
export const actionHandler = new ActionHandler()
export const cliWrapper = new CLIWrapper()

export const main = async () => {
  const initialBoard = await trelloConnector.getBoardByName('Website')
  storageProvider.setActiveBoard(initialBoard)

  const initialLists = await trelloConnector.getListsOnBoard(initialBoard.id)

  const startingList = initialLists[0]

  const initialCards = await trelloConnector.getCardsOnList(startingList.id)

  cliWrapper.startColumnMenu(initialCards.map((card) => card.name))
  /**
   * PROGRAMM LIFECYCLE
   *
   * init trello
   * load list cards
   *
   * 1 term display single column menu
   * 2 choose things
   * 3 do action
   *
   * loop 1-3
   *
   *
   *
   */
}
