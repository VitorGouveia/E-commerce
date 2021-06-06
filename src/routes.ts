import { Router } from "express"

import { UserController } from "@controllers/UserController"
import { ItemController } from "@controllers/ItemController"
import { SessionController } from "@controllers/SessionController"
import { DashboardController } from "@controllers/DashboardController"

const router = Router()

/* User CRUD */
router.post("/user", UserController.create) /* Creates user */
router.get("/user", UserController.list) /* Lists users */

// todo:
// GET: /user/{userId}  retrieves user with that id
// PATCH/PUT: /user/{userId}
// DELETE: /user/{userId}
// versioning
/**
 * v1: db drivers (sqlite3, pg, mysql)
 * v2: Query builder (knex.js, prisma)
 * v3: ORM (MikroORM, Typeorm, Sequelize)
 * v4: MongoDB
 * v5: GraphQL
 * v6: like rocketseat (with classes, services, repositories)
 */
/**
 * TODO:
 * blog with infinite scroll
 * send email to users
 * add gender
 */
/**
 * folder structure
 *  src/
 *    api/
 *      v1/
 *        controllers/
 *        database/
 *        models/
 *        services/
 *      v2/
 *      v3/
 *      v4/
 *      v5/
 *    lib/
 *      auth/
 *    tests/
 *    utils/
 */
/**
 * CREATE A ERROR CODES TABLE
 * certain errors codes and messages are used with error handler
 * ERROR 100: invalid input etc
 */
router.patch("/user", UserController.update) /* Updates an especific user */
router.delete("/user", UserController.delete) /* Deletes an especific user */
router.delete("/dashboard/user", DashboardController.deleteUser) /* Deletes a user with admin permissions */
router.post("/user/address", UserController.createAddress) /* Creates an address for an especific user */

/* User JWT Related */
router.post("/user/login", SessionController.create) /* Authenticate user / Login */



/* Items CRUD */
router.post("/item", ItemController.create) /* Creates item */
router.post("/item/list/:page", ItemController.list) /* Lists items */
router.patch("/item", ItemController.update) /* Updates an especific item */
router.delete("/item", ItemController.delete) /* Deletes item */

/* Image related */
router.post("/item/image", ItemController.createImage)
router.delete("/item/image", ItemController.removeImage)

/* Rating realted */
router.post("/item/rate", ItemController.rateItem) /* Lists an especific item's ratings */
router.post("/item/rate/list", ItemController.listRating) /* List all items by category */
router.get("/item/list/category/:category", ItemController.findByCategory) /* List all items by category */

export { router }