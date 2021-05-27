import { Board } from '../../types/board'
import { BoardProvider } from '../../types/board-provider'

export class TrelloBoardProvider implements BoardProvider {
  private board: Board
  load: () => Promise<void>
}
