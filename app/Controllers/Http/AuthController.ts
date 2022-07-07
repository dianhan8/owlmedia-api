import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Users from 'App/Models/Users'

export default class AuthController {
  public async signIn(ctx: HttpContextContract) {
    const signInSchema = schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string(),
    })

    const payload = await ctx.request.validate({ schema: signInSchema })

    const user = await Users.query()
      .where('email', payload.email)
      .preload('role', (query) => query.preload('permissions'))
      .firstOrFail()

    if (!(await Hash.verify(user.password, payload.password))) {
      return ctx.response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = await ctx.auth.use('api').generate(user)

    return {
      user,
      token,
    }
  }

  public async profile(ctx: HttpContextContract) {
    const userId: any = ctx.auth.user?.id
    const users = await Users.query()
      .where('id', userId)
      .preload('role', (query) => query.preload('permissions'))
      .firstOrFail()

    return users
  }
}
