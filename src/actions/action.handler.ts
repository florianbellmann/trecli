import { injectable } from 'inversify'

/* eslint-disable no-unused-vars */
export interface Action {
  type: ActionType
  key: string
}

export enum ActionType {
  SwitchListRight,
  SwitchListLeft,
  MoveCardDown,
  MoveCardUp,

  Archive,
  Unarchive,
  ChangeTitle,

  NewCard,

  SwitchBoard,
  DoTomorrow,

  ChangeDescription,

  ChangeDate
}

export interface IActionProvider {
  getActionByKey(key: string): Action
  executeAction(action: Action): Promise<void>
}

// TODO: rename me!
@injectable()
export class ActionHandler implements IActionProvider {
  public getActionByKey(selectedKey: string): Action {
    switch (selectedKey) {
      case 'l':
        return { key: selectedKey, type: ActionType.SwitchListRight }
      case 'h':
        return { key: selectedKey, type: ActionType.SwitchListLeft }
      // TODO: implement these
      // case 'J':
      //   return { key: selectedKey, type: ActionType.MoveCardDown }
      // case 'K':
      //   return { key: selectedKey, type: ActionType.MoveCardUp }
      case 'd':
        return { key: selectedKey, type: ActionType.ChangeDate }
      case 'L':
        return { key: selectedKey, type: ActionType.DoTomorrow }
      case 'c':
        return { key: selectedKey, type: ActionType.Archive }
      case 'u':
        return { key: selectedKey, type: ActionType.Unarchive }
      case 't':
        return { key: selectedKey, type: ActionType.ChangeTitle }
      case 'e':
        return { key: selectedKey, type: ActionType.ChangeDescription }
      case 'n':
        return { key: selectedKey, type: ActionType.NewCard }
      case 'w':
        return { key: selectedKey, type: ActionType.SwitchBoard }

      default:
        return null
    }
  }

  public async executeAction(action: Action, callback?: (result: any) => void): Promise<void> {
    // switch (action.type) {
    //   case ActionType.Archive:
    //     await trelloConnector.archiveCard()
    //     break
    //   case ActionType.Unarchive:
    //     await trelloConnector.unArchiveCard()
    //     break
    //   case ActionType.ChangeTitle:
    //     // TODO: readd this
    //     // await trelloConnector.changeTitle()
    //     break
    //   case ActionType.NewCard:
    //     // TODO: readd this
    //     // await trelloConnector.newCard()
    //     break
    //   case ActionType.SwitchBoard:
    //     await trelloConnector.switchBoard()
    //     break
    //   case ActionType.SwitchListRight:
    //     await trelloConnector.switchListRight()
    //     break
    //   case ActionType.SwitchListLeft:
    //     await trelloConnector.switchListLeft()
    //     break
    //   case ActionType.CardDown:
    //     await trelloConnector.cardDown()
    //     break
    //   case ActionType.CardUp:
    //     await trelloConnector.cardUp()
    //     break
    //   default:
    //     break
    // }
  }
}
