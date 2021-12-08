import { storageProvider, trelloConnector } from './app'

export interface Action {
  type: ActionType
  key: string
}

export enum ActionType {
  SwitchListRight,
  SwitchListLeft,
  CardDown,
  CardUp,

  Archive,
  Unarchive,
  ChangeTitle,

  NewCard,

  SwitchBoard
}

export class ActionHandler {
  public getActionByKey(selectedKey: string): Action {
    switch (selectedKey) {
      case 'l':
        return { key: selectedKey, type: ActionType.SwitchListRight }
      case 'h':
        return { key: selectedKey, type: ActionType.SwitchListLeft }
      case 'j':
        return { key: selectedKey, type: ActionType.CardDown }
      case 'k':
        return { key: selectedKey, type: ActionType.CardUp }
      case 'c':
        return { key: selectedKey, type: ActionType.Archive }
      case 'u':
        return { key: selectedKey, type: ActionType.Unarchive }
      case 't':
        return { key: selectedKey, type: ActionType.ChangeTitle }
      case 'n':
        return { key: selectedKey, type: ActionType.NewCard }
      case 'w':
        return { key: selectedKey, type: ActionType.SwitchBoard }

      default:
        return null
    }
  }

  public async executeAction(action: Action): Promise<void> {
    switch (action.type) {
      case ActionType.Archive:
        await trelloConnector.archiveCard()
        break
      case ActionType.Unarchive:
        await trelloConnector.unarchiveCard()
        break
      case ActionType.ChangeTitle:
        await trelloConnector.changeTitle()
        break
      case ActionType.NewCard:
        await trelloConnector.newCard()
        break
      case ActionType.SwitchBoard:
        await trelloConnector.switchBoard()
        break
      case ActionType.SwitchListRight:
        await trelloConnector.switchListRight()
        break
      case ActionType.SwitchListLeft:
        await trelloConnector.switchListLeft()
        break
      case ActionType.CardDown:
        await trelloConnector.cardDown()
        break
      case ActionType.CardUp:
        await trelloConnector.cardUp()
        break

      default:
        break
    }
  }
}
