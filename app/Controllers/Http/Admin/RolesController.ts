import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/Role'

export default class RolesController {
  public async create(ctx: HttpContextContract) {
    const newRolesSchema = schema.create({
      name: schema.string({}, [rules.unique({ table: 'roles', column: 'name' })]),
      permissions: schema
        .array()
        .members(schema.number([rules.exists({ table: 'permissions', column: 'id' })])),
      is_active: schema.boolean.optional(),
    })

    const payload = await ctx.request.validate({ schema: newRolesSchema })

    const response = await Role.create({
      name: payload.name,
      isActive: payload.is_active,
    })
    response.related('permissions').sync(payload.permissions)

    return response
  }

  public async readAll(ctx: HttpContextContract) {
    const { page = 1, pageSize = 12 } = ctx.request.all()

    const response = await Role.query().preload('permissions').paginate(page, pageSize)

    return response
  }

  public async readOne(ctx: HttpContextContract) {
    const { roleId } = ctx.request.params()

    const response = await Role.query().where('id', roleId).preload('permissions').first()

    return response
  }

  public async update(ctx: HttpContextContract) {
    const { roleId } = ctx.request.params()

    const updateRoleSchema = schema.create({
      name: schema.string(),
      permissions: schema
        .array()
        .members(schema.number([rules.exists({ table: 'permissions', column: 'id' })])),
      is_active: schema.boolean.optional(),
    })

    const payload = await ctx.request.validate({ schema: updateRoleSchema })

    const response = await Role.findOrFail(roleId)

    await response
      .merge({
        name: payload.name,
        isActive: payload.is_active,
      })
      .save()

    response.related('permissions').sync(payload.permissions)

    return payload
  }

  public async deleteOne(ctx: HttpContextContract) {
    const { roleId } = ctx.request.params()

    const payload = await Role.find(roleId)
    await payload?.related('permissions').detach()
    await payload?.delete()

    return ctx.response.json({
      message: 'Role has been deleted',
    })
  }
}
