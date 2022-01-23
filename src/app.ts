/* eslint-disable no-empty-function */
import { TrelloConnector } from './api/trello.connector'
import { inject, injectable } from 'inversify'
import { TYPES } from './types'
import { GlobalStateContext } from './data/storage.provider'
import { ActionHandler, ActionType } from './actions/action.handler'
import { CliWrapper } from './cli/cli.wrapper'
import { terminal, truncateString, stringWidth } from 'terminal-kit'
import { logger } from './logger'
import { dateStringToDate, formatDateString } from './date.helper'
import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

export interface IApp {
  main(): Promise<void>
}

@injectable()
export class App implements IApp {
  @inject(TYPES.ITrelloConnector) private _trelloConnector: TrelloConnector
  @inject(TYPES.IStorageProvider) private _storageProvider: GlobalStateContext
  @inject(TYPES.IActionProvider) private _actionHandler: ActionHandler
  @inject(TYPES.ICliWrapper) private _cliWrapper: CliWrapper

  getItems() {
    let nameWidth = 0,
      dateWidth = 0,
      descWidth = 0

    const cards = this._storageProvider.getCurrentCards()

    cards.forEach((card) => {
      const cardName = this.cleanText(card.name)
      nameWidth = Math.max(nameWidth, cardName.length)
      if (card.due != null) {
        const dateText = formatDateString(card.due.toString())
        dateWidth = Math.max(dateWidth, dateText.length)
      }
      if (card.desc != null) {
        const cardDesc = this.cleanText(card.desc)
        descWidth = Math.max(descWidth, cardDesc.length)
      }
    })

    const items: string[] = []

    cards.forEach((card) => {
      const nameText = this.adjustStringWidth(this.cleanText(card.name), nameWidth)

      let dateText = '',
        descText = ''

      if (card.due != null) {
        dateText = formatDateString(card.due.toString())
      }
      dateText = this.adjustStringWidth(dateText, dateWidth)

      if (card.desc != null) {
        const cardDesc = this.cleanText(card.desc)
        descText = this.adjustStringWidth(cardDesc, descWidth)
      }

      const itemString = `${dateText}  |  ${nameText}  |  ${descText}`

      items.push(itemString)
    })

    return items
  }

  cleanText(str: string): string {
    return str.replace(/\n/g, ' . ').replace(/\s+/g, ' ').trim()
  }

  adjustStringWidth(str: string, width: number) {
    const strWidth = str.length
    if (strWidth > width) {
      return `${str.substring(0, width - 3)}…`
    } else if (strWidth < width) {
      return `${str}${' '.repeat(width - strWidth)}`
    } else {
      return str
    }
  }

  spawnVim(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const child_process = require('child_process')

      process.stdin.setRawMode(true)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      process.stdin.on('data', (data) => {})
      process.stdin.pause
      const child = child_process.spawn('nvim', [filePath], { stdio: 'inherit' })
      child.on('error', (err: any) => {
        reject(err)
      })

      child.on('exit', (e: any, code: any) => {
        process.stdin.resume
        resolve(code)
      })
    })
  }

  async editInVim(inputText: string): Promise<string> {
    const tempFileName = path.resolve(os.tmpdir(), `temp_${Date.now()}.md`)

    fs.writeFileSync(tempFileName, inputText)

    await this.spawnVim(tempFileName)

    const newText = fs.readFileSync(tempFileName, 'utf8')

    fs.rmSync(tempFileName)
    return newText
  }

  async initAsync(): Promise<void> {
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
  }

  async main() {
    await this.initAsync()

    let key = null

    while (key !== 'q') {
      const items = this.getItems()
      // eslint-disable-next-line no-await-in-loop
      const singleColumnMenuResponse = await this._cliWrapper.startColumnMenu(items)
      // console.log(`key`, singleColumnMenuResponse)
      if (singleColumnMenuResponse.key != null && singleColumnMenuResponse.key != '' && singleColumnMenuResponse.key !== 'q') {
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
          case ActionType.ChangeDate:
            let placeholderDateString = ''
            if (actionCard.due != null) {
              placeholderDateString = formatDateString(actionCard.due.toString())
            }

            const newDateString = await this._cliWrapper.readFromSTDIN(placeholderDateString)

            // const newDate = await this.editInVim(actionCard.due.toString())
            await this._trelloConnector.changeDate(actionCard, dateStringToDate(newDateString))
            break
          case ActionType.ChangeTitle:
            const currentTitle = actionCard.name
            const newTitle = await this.editInVim(currentTitle)
            // const newTitle = await this._cliWrapper.readFromSTDIN(currentTitle)
            await this._trelloConnector.changeTitle(actionCard, newTitle)
            break
          case ActionType.NewCard:
            const newName = await this._cliWrapper.readFromSTDIN()
            // TODO: make this interactive with desc and due date setting
            await this._trelloConnector.newCard(newName, this._storageProvider.getCurrentList().id)
            break
          case ActionType.AppendCard:
            const appendName = await this._cliWrapper.readFromSTDIN()
            // TODO: make this interactive with desc and due date setting
            await this._trelloConnector.appendCard(appendName, this._storageProvider.getCurrentList().id)
            break
          case ActionType.PrependCard:
            const prependName = await this._cliWrapper.readFromSTDIN()
            // TODO: make this interactive with desc and due date setting
            await this._trelloConnector.prependCard(prependName, this._storageProvider.getCurrentList().id)
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
            const currentCardsDown = this._storageProvider.getCurrentCards()
            const currentCardDown = currentCardsDown.find((searchCard) => searchCard.id === actionCard.id)
            const currentCardIndexDown = currentCardsDown.findIndex((card) => card.id === currentCardDown.id)
            const nextCard = currentCardsDown[currentCardIndexDown + 1]
            if (nextCard != null) {
              await this._trelloConnector.cardDown(currentCardDown, nextCard.pos + 1)
            }
            break
          case ActionType.MoveCardUp:
            const currentCardsUp = this._storageProvider.getCurrentCards()
            const currentCardUp = currentCardsUp.find((searchCard) => searchCard.id === actionCard.id)
            const currentCardIndexUp = currentCardsUp.findIndex((card) => card.id === currentCardUp.id)
            const prevCard = currentCardsUp[currentCardIndexUp - 1]
            if (prevCard != null) {
              await this._trelloConnector.cardDown(currentCardUp, prevCard.pos - 1)
            }
            break
            break
          case ActionType.DoTomorrow:
            await this._trelloConnector.moveToTomorrow(actionCard)
            break
          case ActionType.ChangeDescription:
            const oldDesc = actionCard.desc
            const newDesc = await this.editInVim(oldDesc)
            // const newDesc = await this._cliWrapper.readFromSTDIN(oldDesc)
            // TODO: make this interactive with desc and due date setting
            await this._trelloConnector.changeDescription(actionCard, newDesc)
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
