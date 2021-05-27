import { Board } from './board'

export interface BoardProvider {
  board: Board
  load: () => Promise<void>
  reload: () => Promise<void>
}
