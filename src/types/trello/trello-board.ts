import { Board } from '../board'
import { List } from '../list'

export class TrelloBoard implements Board {
  name: string
  lists: List[]
  isLoadded: boolean
  isActive: boolean
}
