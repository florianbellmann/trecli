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
  storageProvider.setCurrentBoard(initialBoard)

  const initialLists = await trelloConnector.getListsOnBoard(initialBoard.id)
  storageProvider.setCurrentLists(initialLists)

  const startingList = initialLists[0]
  storageProvider.setCurrentList(startingList)

  const initialCards = await trelloConnector.getCardsOnList(startingList.id)
  storageProvider.setCurrentCards(initialCards)

  const initialCard = initialCards[0]
  storageProvider.setCurrentCard(initialCard)

  let key = null

  while (key !== 'q') {
    // eslint-disable-next-line no-await-in-loop
    const singleColumnMenuResponse = await cliWrapper.startColumnMenu(initialCards.map((card) => card.name))
    console.log(`key`, singleColumnMenuResponse)
    if (singleColumnMenuResponse.key != null && singleColumnMenuResponse.key != '') {
      const action = actionHandler.getActionByKey(singleColumnMenuResponse.key)
      actionHandler.executeAction(action)
    }
    key = singleColumnMenuResponse.key
  }

  process.exit(0)
}
