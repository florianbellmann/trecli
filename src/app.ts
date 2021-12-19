import readline from 'readline'
import { TrelloConnector } from './api/trello.connector'
import { inject, injectable } from 'inversify'
import { TYPES } from './types'
import { GlobalStateContext } from './data/storage.provider'
import { ActionHandler, ActionType } from './actions/action.handler'
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
    const initialBoard = await this._trelloConnector.getBoardByName(this._storageProvider.BOARD_NAMES[0])
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
      const singleColumnMenuResponse = await this._cliWrapper.startColumnMenu(
        this._storageProvider.getCurrentCards().map((card) => `${card.due}\t\t\t || ${card.name} >> ${card.desc}`)
      )
      console.log(`key`, singleColumnMenuResponse)
      if (singleColumnMenuResponse.key != null && singleColumnMenuResponse.key != '') {
        const action = this._actionHandler.getActionByKey(singleColumnMenuResponse.key)
        // this._actionHandler.executeAction(action)

        const actionCard = this._storageProvider.getCurrentCards()[singleColumnMenuResponse.selectedIndex]

        switch (action.type) {
          case ActionType.Archive:
            await this._trelloConnector.archiveCard(actionCard)
            break
          case ActionType.Unarchive:
            await this._trelloConnector.unArchiveCard(actionCard)
            break
          case ActionType.ChangeTitle:
            // TODO read from stdin
            const newTitle = 'New Title'
            await this._trelloConnector.changeTitle(newTitle)
            break
          case ActionType.NewCard:
            // var rl = readline.createInterface({
            //   input: process.stdin,
            //   output: process.stdout
            // })

            // rl.on('line', function (line) {
            //   console.log(line)
            // })
            // TODO read from stdin
            const newName = 'New Card'
            await this._trelloConnector.newCard(newName, this._storageProvider.getCurrentList().id, 'new desc')
            break
          case ActionType.SwitchBoard:
            await this._trelloConnector.switchBoard()
            break
          case ActionType.SwitchListRight:
            await this._trelloConnector.switchListRight()
            break
          case ActionType.SwitchListLeft:
            await this._trelloConnector.switchListLeft()
            break
          case ActionType.MoveCardDown:
            const currentCards = this._storageProvider.getCurrentCards()
            const currentCard = this._storageProvider.getCurrentCard()
            const currentCardIndex = currentCards.findIndex((card) => card.id === currentCard.id)
            const nextCard = currentCards[currentCardIndex + 1]
            if (nextCard != null) {
              await this._trelloConnector.cardDown(currentCard, nextCard.pos + 1)
            }
            break
          case ActionType.MoveCardUp:
            // TODO: readd this while refactoring
            // const currentCards = this._storageProvider.getCurrentCards()
            // const currentCard = this._storageProvider.getCurrentCard()
            // const currentCardIndex = currentCards.findIndex((card) => card.id === currentCard.id)
            // const prevCard = currentCards[currentCardIndex + 1]
            // if (nextCard != null) {
            //   await this._trelloConnector.cardDown(currentCard, prevCard.pos + 1)
            //   await this._trelloConnector.cardUp(currentCard, prevCard.pos - 1)
            // }
            break
          default:
            break
        }
      }
      key = singleColumnMenuResponse.key
    }

    process.exit(0)
  }
}
