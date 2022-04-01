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
  AppendCard,
  PrependCard,

  SwitchBoard,
  DoTomorrow,
  DoToday,

  ChangeDescription,

  ChangeDate,

  AddLabel,

  Refresh,
  RefreshHard
}

export interface IActionProvider {
  getActionByKey(key: string): Action
  // executeAction(action: Action): Promise<void>
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
      case 'J':
        return { key: selectedKey, type: ActionType.MoveCardDown }
      case 'K':
        return { key: selectedKey, type: ActionType.MoveCardUp }
      case 'd':
        return { key: selectedKey, type: ActionType.ChangeDate }
      case 'H':
        return { key: selectedKey, type: ActionType.DoToday }
      case 'L':
        return { key: selectedKey, type: ActionType.DoTomorrow }
      case 'c':
        return { key: selectedKey, type: ActionType.Archive }
      case 'r':
        return { key: selectedKey, type: ActionType.Refresh }
      case 'R':
        return { key: selectedKey, type: ActionType.RefreshHard }
      case 'u':
        return { key: selectedKey, type: ActionType.Unarchive }
      case 't':
        return { key: selectedKey, type: ActionType.ChangeTitle }
      case 'e':
        return { key: selectedKey, type: ActionType.ChangeDescription }
      case 'n':
        return { key: selectedKey, type: ActionType.NewCard }
      case 'A':
        return { key: selectedKey, type: ActionType.AppendCard }
      case 'I':
        return { key: selectedKey, type: ActionType.PrependCard }
      case 'o':
        return { key: selectedKey, type: ActionType.AddLabel }
      case 'w':
        return { key: selectedKey, type: ActionType.SwitchBoard }

      default:
        return null
    }
  }
}
