import { Card } from './card'

export interface List {
  cards: Card[]
  addCard: (card: Card) => Promise<void>
  archiveCard: (card: Card) => Promise<void>
}
