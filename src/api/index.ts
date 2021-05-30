import { Card } from '../types/card'
import { Endpoint } from '../types/api/endpoints'
import { RequestMethod } from '../types/api/request.method'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { terminal as term } from 'terminal-kit'

dotenv.config()

var Trello = require('trello')

var trello = new Trello(process.env.APIKEY, process.env.APITOKEN)

let boardInfo: any = null

;(async () => {
  const boards = await trello.getBoards(process.env.MEMBERID)
  //   console.log(`boards`, boards)
  const websiteBoard = boards.find((b: any) => b.name == 'Website')
  //   console.log(`websiteBoard`, websiteBoard)
  const listen = await trello.getListsOnBoard(websiteBoard.id)
  //   console.log(`listen`, listen)
  const cards: any = []

  let allPromises: any = []

  listen.forEach(async (liste: any) => {
    const promise = new Promise(async (resolve, reject) => {
      const listCards = await trello.getCardsOnList(liste.id)
      //   console.log(`listCards`, listCards)
      cards.push(listCards)
      resolve(true)
    })
    allPromises.push(promise)
  })
  await Promise.all(allPromises)
  //   console.log(`cards`, cards)

  const cardnames = cards.map((listcards: any) => {
    listcards = listcards.map((l: any) => l.name)
    return listcards
  })
  // console.log(`cardnames`, cardnames)
  boardInfo = cardnames

  // var items = fs.readdirSync(process.cwd())

  //   const items2 = [
  //     ['asdf', 'a2fds', 'a3fsd'],
  //     ['bdfss', 'bfdsd2', 'bfsdfdsfsd3'],
  //     ['', 'cs3', 'csadfdf']
  //   ]

  const items2 = boardInfo
  // console.log(`items2`, items2)

  term.fullscreen(true)
  term.on('resize', () => {
    console.log('resized. should re-init terminal with cached list values')
    term.reset
  })
  term.gridMenu(items2, function (error: any, response: any) {
    term('\n').eraseLineAfter.green('#%s selected: %s (%s,%s), %s, %s\n', response.selectedIndex, response.selectedText, response.x, response.y, response.key, response.id)
    term.clear()
    term.singleColumnMenu(['title', 'desc', 'due'], (error: any, res: any) => {
      console.log(`error,res`, error, res)

      switch (res.selectedText) {
        case 'title':
          // readline
          break

        default:
          break
      }
    })
    // process.exit()
  })
})()

export default boardInfo
// class Trello {
//   private readonly TRELLO_API_URL: string = 'https://api.trello.com/1'

//   constructor(private apiKey: string, private apiToken: string) {}

//   //   public async createCard(cardInfo: Card) {
//   //     await this.makeRequest(Endpoint.Cards, RequestMethod.POST, '', cardInfo)
//   //   }

//   //   public async moveCard(cardId: string, listId: string) {
//   //     await this.makeRequest(Endpoint.Cards, RequestMethod.PUT, '/' + cardId, { idList: listId })
//   //   }

//   //   public async setCardPosition(cardId: string, position: number) {
//   //     await this.makeRequest(Endpoint.Cards, RequestMethod.PUT, '/' + cardId, { pos: position })
//   //   }

//   public async getCardsOfList(listId: string): Promise<Card[]> {
//     return await this.makeRequest(Endpoint.Lists, RequestMethod.GET, '/' + listId + '/cards')
//   }

//   public async getListsOfBoard(boardId: string): Promise<Card[]> {
//     return await this.makeRequest(Endpoint.Boards, RequestMethod.GET, '/' + boardId + '/lists')
//   }

//   public async getBoards(memberId: string): Promise<Card[]> {
//     return await this.makeRequest(Endpoint.Members, RequestMethod.GET, '/' + memberId + '/boards')
//   }

//   //   public async searchCard(name: string): Promise<any> {
//   // return await this.makeRequest(Endpoint.Search, RequestMethod.GET, '', { query: name, card_fields: 'name,due,closed', modelTypes: 'cards' })
//   //   }
//   private async makeRequest(endpoint: Endpoint, requestMethod: RequestMethod, path: string, params?: {}) {
//     const authParams = '?&key=' + this.apiKey + '&token=' + this.apiToken
//     const urlParams = params ? this.transformParamsToQuery(params) : ''
//     const response = await fetch(this.TRELLO_API_URL + endpoint + path + '?' + authParams + urlParams, {
//       method: requestMethod,
//       headers: {
//         Accept: 'application/json'
//       }
//     })

//     return await response.json()
//   }

//   private transformParamsToQuery(params: {}): string {
//     const urlParams = Object.keys(params)
//       .map(function (k) {
//         return '&' + encodeURIComponent(k) + '=' + encodeURIComponent((params as any)[k])
//       })
//       .join('&')
//     return urlParams
//   }
// }

// export const trello = new Trello(process.env.APIKEY, process.env.APITOKEN)
// ;(async () => {
//   const boards = await trello.getBoards(process.env.MEMBERID)
//   console.log(`boards`, boards)
// })()
