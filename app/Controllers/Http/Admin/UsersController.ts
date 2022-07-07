import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Users from 'App/Models/Users'

export default class UsersController {
  public async create(ctx: HttpContextContract) {
    const newUserSchema = schema.create({
      email: schema.string({}, [
        rules.required(),
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({}, [rules.required(), rules.minLength(6)]),
      role_id: schema.number([rules.exists({ table: 'roles', column: 'id' })]),
    })

    const payload = await ctx.request.validate({ schema: newUserSchema })

    const response = await Users.create({
      email: payload.email,
      password: payload.password,
      roleId: payload.role_id,
    })

    return response
  }

  public async readAll(ctx: HttpContextContract) {
    const { page = 1, pageSize = 12 } = ctx.request.all()

    const response = await Users.query().paginate(page, pageSize)

    return response
  }

  public async readOne(ctx: HttpContextContract) {
    const { userId } = ctx.request.params()

    const response = await Users.query().where('id', userId).preload('role')

    return response
  }

  public async update(ctx: HttpContextContract) {
    const { userId } = ctx.request.params()

    const updateUserSchema = schema.create({
      email: schema.string({}, [rules.email()]),
      role_id: schema.number([rules.exists({ table: 'roles', column: 'id' })]),
    })

    const payload = await ctx.request.validate({ schema: updateUserSchema })

    const response = await Users.findOrFail(userId)

    await response.merge({
      email: payload.email,
      roleId: payload.role_id,
    })

    return response
  }

  public async deleteOne(ctx: HttpContextContract) {
    const { userId } = ctx.request.params()

    await Users.query().where('id', userId).delete()

    return ctx.response.json({
      message: 'user has been deleted',
    })
  }
}
