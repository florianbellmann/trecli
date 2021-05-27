import { Card } from '../card'
import { List } from '../list'

export class TrelloList implements List {
  cards: Card[]
  addCard: (card: Card) => Promise<void>
  archiveCard: (card: Card) => Promise<void>
}
