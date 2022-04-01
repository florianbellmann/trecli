/* eslint-disable complexity */
/* eslint-disable no-empty-function */
import { Card, TrelloConnector } from './api/trello.connector'
import { inject, injectable } from 'inversify'
import { TYPES } from './types'
import { GlobalStateContext } from './data/storage.provider'
import { ActionHandler, ActionType } from './actions/action.handler'
import { CliWrapper } from './cli/cli.wrapper'
import { dateStringToDate, formatDateString } from './date.helper'
import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

function paintBright(text: string) {
  return `\x1b[1m${text}\x1b[0m`
}
function paintDim(text: string) {
  return `\x1b[2m${text}\x1b[0m`
}
function paintUnderscore(text: string) {
  return `\x1b[4m${text}\x1b[0m`
}
function paintBlink(text: string) {
  return `\x1b[5m${text}\x1b[0m`
}
function paintReverse(text: string) {
  return `\x1b[7m${text}\x1b[0m`
}
function paintHidden(text: string) {
  return `\x1b[8m${text}\x1b[0m`
}
function paintFgBlack(text: string) {
  return `\x1b[30m${text}\x1b[0m`
}
function paintFgRed(text: string) {
  return `\x1b[31m${text}\x1b[0m`
}
function paintFgGreen(text: string) {
  return `\x1b[32m${text}\x1b[0m`
}
function paintFgYellow(text: string) {
  return `\x1b[33m${text}\x1b[0m`
}
function paintFgBlue(text: string) {
  return `\x1b[34m${text}\x1b[0m`
}
function paintFgMagenta(text: string) {
  return `\x1b[35m${text}\x1b[0m`
}
function paintFgCyan(text: string) {
  return `\x1b[36m${text}\x1b[0m`
}
function paintFgWhite(text: string) {
  return `\x1b[37m${text}\x1b[0m`
}
function paintBgBlack(text: string) {
  return `\x1b[40m${text}\x1b[0m`
}
function paintBgRed(text: string) {
  return `\x1b[41m${text}\x1b[0m`
}
function paintBgGreen(text: string) {
  return `\x1b[42m${text}\x1b[0m`
}
function paintBgYellow(text: string) {
  return `\x1b[43m${text}\x1b[0m`
}
function paintBgBlue(text: string) {
  return `\x1b[44m${text}\x1b[0m`
}
function paintBgMagenta(text: string) {
  return `\x1b[45m${text}\x1b[0m`
}
function paintBgCyan(text: string) {
  return `\x1b[46m${text}\x1b[0m`
}
function BgWhite(text: string) {
  return `\x1b[47m${text}\x1b[0m`
}
export interface IApp {
  main(): Promise<void>
}

@injectable()
export class App implements IApp {
  @inject(TYPES.ITrelloConnector) private _trelloConnector: TrelloConnector
  @inject(TYPES.IStorageProvider) private _storageProvider: GlobalStateContext
  @inject(TYPES.IActionProvider) private _actionHandler: ActionHandler
  @inject(TYPES.ICliWrapper) private _cliWrapper: CliWrapper

  getTerminalRestrictions(): { dateMaxWidth: number; labelMaxWidth: number; titleMaxWidth: number; descMaxWidth: number } {
    const termWidth = this._cliWrapper.getTermWidth() * 1.4

    const dateMaxWidth = Math.floor(termWidth * 0.15)
    const labelMaxWidth = Math.floor(termWidth * 0.15)
    const titleMaxWidth = Math.floor(termWidth * 0.4)
    const descMaxWidth = termWidth - dateMaxWidth - labelMaxWidth - titleMaxWidth - 10

    return { dateMaxWidth, labelMaxWidth, titleMaxWidth, descMaxWidth }
  }

  async getItems() {
    let nameWidth = 0,
      dateWidth = 0,
      descWidth = 0,
      labelWidth = 0

    const cards = await this._storageProvider.getCurrentCards()

    cards.forEach((card: any) => {
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
      if (card.labels != null) {
        const cardLabels = card.labels.map((label: any) => label.name).join(', ')
        labelWidth = Math.max(labelWidth, cardLabels.length)
      }
    })

    const items: string[] = []

    cards.forEach((card) => {
      const nameText = this.adjustStringWidth(this.cleanText(card.name), nameWidth)

      let dateText = '',
        descText = '',
        labelsText = ''

      if (card.due != null) {
        dateText = formatDateString(card.due.toString())
      }
      dateText = this.adjustStringWidth(dateText, dateWidth)

      if (card.desc != null) {
        const cardDesc = this.cleanText(card.desc)
        descText = this.adjustStringWidth(cardDesc, descWidth)
      }

      if (card.labels != null) {
        labelsText = this.adjustStringWidth(card.labels.map((l) => l.name).join(', '), labelWidth)
      }
      const itemString = this.getItemString(dateText, labelsText, nameText, descText)

      items.push(itemString)
    })

    const currentList = await (await this._storageProvider.getCurrentList()).name
    const currentBoard = await (await this._storageProvider.getCurrentBoard()).name
    items.push('')
    items.push(`${paintFgGreen('[')}${paintFgYellow(currentBoard)}${paintFgGreen(']')}>${paintFgYellow(currentList)}`)
    return items
  }

  getItemString(dateText: string, labelText: string, nameText: string, descText: string): string {
    const { dateMaxWidth, descMaxWidth, labelMaxWidth, titleMaxWidth } = this.getTerminalRestrictions()

    const finalDateText = paintFgRed(dateText.length > dateMaxWidth ? `${dateText.substring(0, dateMaxWidth - 3)}...` : dateText),
      finalLabelText = paintFgBlue(labelText.length > labelMaxWidth ? `${labelText.substring(0, labelMaxWidth - 3)}...` : labelText),
      finalNameText = paintFgGreen(nameText.length > titleMaxWidth ? `${nameText.substring(0, titleMaxWidth)}` : nameText),
      finalDescText = paintFgYellow(descText.length > descMaxWidth ? `${descText.substring(0, descMaxWidth - 3)}...` : descText)

    const itemString = `${finalDateText} ${paintFgGreen('')} ${finalLabelText} ${paintFgGreen('')} ${finalNameText} ${paintFgGreen('')} ${finalDescText}`

    return itemString
  }

  cleanText(str: string): string {
    const cleanString = `${str.replace(/\n/g, '').replace(/\r/g, '').replace(/\s+/g, ' ').trim().substring(0, 100)}`
    const result = str.length > 100 ? `${cleanString}...` : cleanString
    return result
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

  async initSoft(): Promise<void> {
    const currentCard = await this._storageProvider.getCurrentCard()
    if (currentCard == null) {
      await this.initAsync()
    }
  }

  private getInitialBoardName(): string {
    const dayOfWeek = new Date().getDay()
    const dayTime = new Date().getHours()

    if (dayOfWeek === 0 || dayOfWeek === 6 || dayTime < 8 || dayTime > 18) {
      return this._storageProvider.BOARD_NAMES[0] //private stuff
    }

    return this._storageProvider.BOARD_NAMES[1] //work stuff
  }

  async initAsync(): Promise<void> {
    const initialBoard = await this._trelloConnector.getBoardByName(this.getInitialBoardName())
    await this._storageProvider.setCurrentBoard(initialBoard)

    const initialLists = await this._trelloConnector.getListsOnBoard(initialBoard.id)
    await this._storageProvider.setCurrentLists(initialLists)

    const startingList = initialLists[0]
    await this._storageProvider.setCurrentList(startingList)

    const initialCards = await this._trelloConnector.getCardsOnList(startingList.id)
    await this._storageProvider.setCurrentCards(initialCards)

    const initialCard = initialCards[0]
    await this._storageProvider.setCurrentCard(initialCard)
  }

  async main() {
    await this.initSoft()

    let key = null

    while (key !== 'q') {
      const items = await this.getItems()
      // eslint-disable-next-line no-await-in-loop
      const singleColumnMenuResponse = await this._cliWrapper.startColumnMenu(items)
      // console.log(`key`, singleColumnMenuResponse)
      if (singleColumnMenuResponse.key != null && singleColumnMenuResponse.key != '' && singleColumnMenuResponse.key !== 'q') {
        const action = this._actionHandler.getActionByKey(singleColumnMenuResponse.key)
        // this._actionHandler.executeAction(action)

        const actionCard: Card = (await this._storageProvider.getCurrentCards())[singleColumnMenuResponse.selectedIndex]

        switch (action.type) {
          case ActionType.Archive:
            await this._trelloConnector.archiveCard(actionCard)
            break
          case ActionType.Unarchive:
            const lastCard = await this._storageProvider.getLastCard()
            await this._trelloConnector.unArchiveCard(lastCard)
            break
          case ActionType.ChangeDate:
            let placeholderDateString = ''
            if (actionCard.due != null) {
              placeholderDateString = formatDateString(actionCard.due.toString())
            }
            const newDateString = await this._cliWrapper.readFromSTDIN(placeholderDateString)
            await this._trelloConnector.changeDate(actionCard, dateStringToDate(newDateString))
            break
          // case ActionType.AddLabel:
          // const labels = actionCard.idLabels
          // console.log('labels', labels)

          // const currentLabels = actionCard.labels
          // console.log('currentLabels', currentLabels)
          // const newLabels = await this.editInVim(currentLabels.toString())

          // await this._trelloConnector.
          case ActionType.ChangeTitle:
            const currentTitle = actionCard.name
            const newTitle = await this.editInVim(currentTitle)
            // const newTitle = await this._cliWrapper.readFromSTDIN(currentTitle)
            await this._trelloConnector.changeTitle(actionCard, newTitle)
            break
          case ActionType.NewCard:
            const newName = await this._cliWrapper.readFromSTDIN()
            await this._trelloConnector.newCard(newName, (await this._storageProvider.getCurrentList()).id)
            break
          case ActionType.AppendCard:
            const appendName = await this._cliWrapper.readFromSTDIN()
            await this._trelloConnector.appendCard(appendName, (await this._storageProvider.getCurrentList()).id)
            break
          case ActionType.PrependCard:
            const prependName = await this._cliWrapper.readFromSTDIN()
            await this._trelloConnector.prependCard(prependName, (await this._storageProvider.getCurrentList()).id)
            break
          case ActionType.SwitchBoard:
            await this._trelloConnector.switchBoard()
            break
          case ActionType.SwitchListRight:
            await this._trelloConnector.switchListRight()
            break
          case ActionType.Refresh:
            this._cliWrapper.refresh()
            break
          case ActionType.RefreshHard:
            this._cliWrapper.refresh()
            await this.initAsync()
            break
          case ActionType.SwitchListLeft:
            await this._trelloConnector.switchListLeft()
            break
          case ActionType.MoveCardDown:
            const currentCardsDown = await this._storageProvider.getCurrentCards()
            const currentCardDown = currentCardsDown.find((searchCard) => searchCard.id === actionCard.id)
            const currentCardIndexDown = currentCardsDown.findIndex((card) => card.id === currentCardDown.id)
            const nextCard = currentCardsDown[currentCardIndexDown + 1]
            if (nextCard != null) {
              await this._trelloConnector.cardDown(currentCardDown, nextCard.pos + 1)
            }
            break
          case ActionType.MoveCardUp:
            const currentCardsUp = await this._storageProvider.getCurrentCards()
            const currentCardUp = currentCardsUp.find((searchCard) => searchCard.id === actionCard.id)
            const currentCardIndexUp = currentCardsUp.findIndex((card) => card.id === currentCardUp.id)
            const prevCard = currentCardsUp[currentCardIndexUp - 1]
            if (prevCard != null) {
              await this._trelloConnector.cardDown(currentCardUp, prevCard.pos - 1)
            }
            break
          case ActionType.DoToday:
            await this._trelloConnector.moveToToday(actionCard)
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
