import { Card } from '../card'

export class TrelloCard implements Card {
  editHeadline: (headline: string) => Promise<void>
  editDescription: (headline: string) => Promise<void>
}
