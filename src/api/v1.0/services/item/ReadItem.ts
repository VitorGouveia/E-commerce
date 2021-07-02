import { Request } from "express"
import { ParsedQs } from "qs"

import { IItemsRepository } from "@v1/repositories"
import { SqliteItemsRepository } from "@v1/repositories/implementations"

export class ReadItemService {
  constructor(
    private itemsRepository: IItemsRepository
  ) {}

  async read(id: string | number, { query }: Request<ParsedQs>) {
    try {
      // listing options
      let page: number = Number(query.page)
      let quantity: number = Number(query.quantity)
      
      let category: string = String(query.category)
      let sort: any = String(query.sort)
      let property: any = String(query.property)

      const categorySearch = category != "undefined"
      const propertySortSearch = property != "undefined" && sort != "undefined"
      const fullSearch = categorySearch && propertySortSearch

      if(id != undefined) {
        const items = await this.itemsRepository.findById(Number(id))

        if(items == null) throw new Error("item not found")

        return { items }
      }

      if(!page && !quantity) {
        // without pagination
        if(fullSearch) {
          // category and property sort
          const items = await this.itemsRepository.findAll(category, property, sort)
          if(items == null || items.length == 0) throw new Error("items not found")
          return { items }
        }
        
        if(propertySortSearch) {
          // property sort
          const items = await this.itemsRepository.findAll(undefined, property, sort)
          if(items == null || items.length == 0) throw new Error("items not found")
          return { items }
        }
        
        if(categorySearch) {
          // category
          const items = await this.itemsRepository.findAll(category, undefined, undefined)
          if(items == null || items.length == 0) throw new Error("items not found")
          return { items }
        }
        const items = await this.itemsRepository.findAll()
        return { items }
      } else {  
        // with pagination
        if(fullSearch) {
          // category and property sort
          const items = await this.itemsRepository.findAllPagination(page, quantity, category, property, sort)
          if(items == null || items.length == 0) throw new Error("items not found")
          return { items }
        }
        
        if(propertySortSearch) {
          // property sort
          const items = await this.itemsRepository.findAllPagination(page, quantity, undefined, property, sort)
          if(items == null || items.length == 0) throw new Error("items not found")
          return { items }
        }
        
        if(categorySearch) {
          // category
          const items = await this.itemsRepository.findAllPagination(page, quantity, category, undefined, undefined)
          if(items == null || items.length == 0) throw new Error("items not found")
          return { items }
        }

        const items = await this.itemsRepository.findAllPagination(page, quantity)
        if(items == null || items.length == 0) throw new Error("items not found")
        return { items }
      }
      
    } catch (error) {
      throw new Error(error.message)
      return error
    }
  }
}

export default async (request: Request) => {
  try {
    // create sqlite repository
    const ItemsRepository = new SqliteItemsRepository()

    // create read item service
    const ReadItem = new ReadItemService(ItemsRepository)

    // execute item service
    const { items } = await ReadItem.read(request.params.id, request)
    // respond with item information
    return ({
      status: 202,
      message: "Listed items with success!",
      items
    })

  } catch (error) {
    if(error.message == "items not found" || error.message == "item not found") {
      return ({
        error: true,
        status: 404,
        message: error.message
      })
    }

    // in case of error
    return ({
      error: true,
      status: 400,
      message: "Failed to read item."
    })
  }
}