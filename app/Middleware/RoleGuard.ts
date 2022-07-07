import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Users from 'App/Models/Users'

export default class RoleGuard {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, permission: any) {
    const userId: any = auth?.user?.id

    const user = await Users.query()
      .where('id', userId)
      .preload('role', (query) => query.preload('permissions'))
      .firstOrFail()

    const permissions = user.role.permissions.map((pr) => pr.name)

    const accepted = permissions.includes(permission[0])

    if (!accepted) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS')
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
