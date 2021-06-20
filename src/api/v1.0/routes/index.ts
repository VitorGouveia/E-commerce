import { Router } from "express"

import user from "./entities/user"
import item from "./entities/item"

const router = Router()

router.use("/user", user)
router.use("/item", item)

// todo:
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

export { router }