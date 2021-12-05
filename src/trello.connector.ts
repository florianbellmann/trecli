/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Trello = require('trello')

export interface TrelloAPI {
  createQuery: () => Promise<any>
  makeRequest: (requestMethod: any, path: any, options: any, callback?: any) => Promise<any>
  addBoard: (name: any, description: any, organizationId: any, callback?: any) => Promise<any>
  copyBoard: (name: any, sourceBoardId: any, callback?: any) => Promise<any>
  updateBoardPref: (boardId: any, field: any, value: any, callback?: any) => Promise<any>
  addCard: (name: any, description: any, listId: any, callback?: any) => Promise<any>
  addCardWithExtraParams: (name: any, extraParams: any, listId: any, callback?: any) => Promise<any>
  getCard: (boardId: any, cardId: any, callback?: any) => Promise<any>
  getCardsForList: (listId: any, actions: any, callback?: any) => Promise<any>
  renameList: (listId: any, name: any, callback?: any) => Promise<any>
  addListToBoard: (boardId: any, name: any, callback?: any) => Promise<any>
  addMemberToBoard: (boardId: any, memberId: any, type: any, callback?: any) => Promise<any>
  addCommentToCard: (cardId: any, comment: any, callback?: any) => Promise<any>
  addAttachmentToCard: (cardId: any, url: any, callback?: any) => Promise<any>
  addMemberToCard: (cardId: any, memberId: any, callback?: any) => Promise<any>
  getBoards: (memberId: any, callback?: any) => Promise<any>
  getOrgBoards: (organizationId: any, callback?: any) => Promise<any>
  addChecklistToCard: (cardId: any, name: any, callback?: any) => Promise<any>
  addExistingChecklistToCard: (cardId: any, checklistId: any, callback?: any) => Promise<any>
  getChecklistsOnCard: (cardId: any, callback?: any) => Promise<any>
  addItemToChecklist: (checkListId: any, name: any, pos: any, callback?: any) => Promise<any>
  updateCard: (cardId: any, field: any, value: any, callback?: any) => Promise<any>
  updateChecklist: (checklistId: any, field: any, value: any, callback?: any) => Promise<any>
  updateCardName: (cardId: any, name: any, callback?: any) => Promise<any>
  updateCardDescription: (cardId: any, description: any, callback?: any) => Promise<any>
  updateCardList: (cardId: any, listId: any, callback?: any) => Promise<any>
  getMember: (memberId: any, callback?: any) => Promise<any>
  getMemberCards: (memberId: any, callback?: any) => Promise<any>
  getBoardMembers: (boardId: any, callback?: any) => Promise<any>
  getOrgMembers: (organizationId: any, callback?: any) => Promise<any>
  getListsOnBoard: (boardId: any, callback?: any) => Promise<any>
  getListsOnBoardByFilter: (boardId: any, filter: any, callback?: any) => Promise<any>
  getCardsOnBoard: (boardId: any, callback?: any) => Promise<any>
  getCardsOnBoardWithExtraParams: (boardId: any, extraParams: any, callback?: any) => Promise<any>
  getCardsOnList: (listId: any, callback?: any) => Promise<any>
  getCardsOnListWithExtraParams: (listId: any, extraParams: any, callback?: any) => Promise<any>
  deleteCard: (cardId: any, callback?: any) => Promise<any>
  addWebhook: (description: any, callbackUrl: any, idModel: any, callback?: any) => Promise<any>
  deleteWebhook: (webHookId: any, callback?: any) => Promise<any>
  getLabelsForBoard: (boardId: any, callback?: any) => Promise<any>
  getActionsOnBoard: (boardId: any, callback?: any) => Promise<any>
  getCustomFieldsOnBoard: (boardId: any, callback?: any) => Promise<any>
  addLabelOnBoard: (boardId: any, name: any, color: any, callback?: any) => Promise<any>
  deleteLabel: (labelId: any, callback?: any) => Promise<any>
  addLabelToCard: (cardId: any, labelId: any, callback?: any) => Promise<any>
  deleteLabelFromCard: (cardId: any, labelId: any, callback?: any) => Promise<any>
  updateLabel: (labelId: any, field: any, value: any, callback?: any) => Promise<any>
  updateLabelName: (labelId: any, name: any, callback?: any) => Promise<any>
  updateLabelColor: (labelId: any, color: any, callback?: any) => Promise<any>
  getCardStickers: (cardId: any, callback?: any) => Promise<any>
  addStickerToCard: (cardId: any, image: any, left: any, top: any, zIndex: any, rotate: any, callback?: any) => Promise<any>
  addDueDateToCard: (cardId: any, dateValue: any, callback?: any) => Promise<any>
}

import dotenv from 'dotenv'
dotenv.config()

enum Endpoint {
  Cards = '/cards',
  Boards = '/boards',
  Lists = '/lists',
  Members = '/members',
  Actions = '/actions',
  Search = '/search',
  CheckLists = '/checklists'
}

enum RequestMethod {
  PUT = 'PUT',
  POST = 'POST',
  GET = 'GET'
}

export class TrelloConnector {
  private _trello: TrelloAPI

  constructor() {
    this._trello = new Trello(process.env.API_KEY, process.env.API_TOKEN)
  }

  public async archiveCard() {
    // TODO: Implement this function
    throw new Error('Method not implemented.')
  }

  public async moveCardToTomorrow() {
    // TODO: Implement this function
    throw new Error('Method not implemented.')
  }

  public async openDetailViewOfCard() {
    // TODO: Implement this function
    throw new Error('Method not implemented.')
  }
  public async switchBoard() {
    // TODO: Implement this function
    throw new Error('Method not implemented.')
  }
  public async switchList() {
    // TODO: Implement this function
    throw new Error('Method not implemented.')
  }
  public async newCard() {
    // TODO: Implement this function
    throw new Error('Method not implemented.')
  }

  #getBoardByName() {
    this._boards = await this._trello.getBoards(process.env.MEMBER_ID)

    // TODO: remove test board/list for real one
    const websiteBoard = this._boards.find((b: any) => b.name == 'Website')
  }
}
