import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Permission from 'App/Models/Permission'

export default class PermissionsController {
  public async create(ctx: HttpContextContract) {
    const newPermission = schema.create({
      name: schema.string({}, [rules.unique({ table: 'permissions', column: 'name' })]),
      group: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: newPermission })

    const response = await Permission.create(payload)

    return response
  }

  public async readAll(ctx: HttpContextContract) {
    const { page = 1, pageSize = 12 } = ctx.request.all()

    const response = await Permission.query().paginate(page, pageSize)

    return response
  }

  public async readOne(ctx: HttpContextContract) {
    const { permissionId } = ctx.request.params()

    const response = await Permission.find(permissionId)

    return response
  }

  public async update(ctx: HttpContextContract) {
    const { permissionId } = ctx.request.params()

    const updatePermissionSchema = schema.create({
      name: schema.string(),
      group: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: updatePermissionSchema })

    const permission = await Permission.findOrFail(permissionId)

    await permission.merge(payload).save()

    return permission
  }

  public async deleteOne(ctx: HttpContextContract) {
    const { permissionId } = ctx.request.params()

    const payload = await Permission.findOrFail(permissionId)

    await payload?.delete()

    return ctx.response.json({
      message: 'permission has been deleted',
    })
  }
}
