import { TrelloConnector } from './api/trello.connector'
import { inject, injectable } from 'inversify'
import { TYPES } from './types'
import { GlobalStateContext } from './data/storage.provider'
import { ActionHandler } from './actions/action.handler'
import { CliWrapper } from './cli/cli.wrapper'

export interface IApp {
  main(): Promise<void>
}

@injectable()
export class App implements IApp {
  @inject(TYPES.ITrelloConnector) private _trelloConnector: TrelloConnector
  @inject(TYPES.IStorageProvider) private _storageProvider: GlobalStateContext
  @inject(TYPES.IActionProvider) private _actionHandler: ActionHandler
  @inject(TYPES.ICliWrapper) private _cliWrapper: CliWrapper

  async main() {
    const initialBoard = await this._trelloConnector.getBoardByName('Website')
    this._storageProvider.setCurrentBoard(initialBoard)

    const initialLists = await this._trelloConnector.getListsOnBoard(initialBoard.id)
    this._storageProvider.setCurrentLists(initialLists)

    const startingList = initialLists[0]
    this._storageProvider.setCurrentList(startingList)

    const initialCards = await this._trelloConnector.getCardsOnList(startingList.id)
    this._storageProvider.setCurrentCards(initialCards)

    const initialCard = initialCards[0]
    this._storageProvider.setCurrentCard(initialCard)

    let key = null

    while (key !== 'q') {
      // eslint-disable-next-line no-await-in-loop
      const singleColumnMenuResponse = await this._cliWrapper.startColumnMenu(initialCards.map((card) => card.name))
      console.log(`key`, singleColumnMenuResponse)
      if (singleColumnMenuResponse.key != null && singleColumnMenuResponse.key != '') {
        const action = this._actionHandler.getActionByKey(singleColumnMenuResponse.key)
        this._actionHandler.executeAction(action)
      }
      key = singleColumnMenuResponse.key
    }

    process.exit(0)
  }
}
