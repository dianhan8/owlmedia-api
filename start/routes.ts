/* eslint-disable prettier/prettier */
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  // version
  Route.group(() => {
    Route.post('/sign-in', 'AuthController.signIn')
  }).prefix('auth')

  Route.group(() => {
    // admin
    Route.get('/profile', 'AuthController.profile')

    Route.group(() => {
      // users
      Route.post('/', 'Admin/UsersController.create')
          .middleware(['rbac:create user'])

      Route.get('/', 'Admin/UsersController.readAll')
          .middleware(['rbac:view user'])

      Route.get('/:userId', 'Admin/UsersController.readOne')
          .middleware(['rbac:view user'])

      Route.post('/:userId', 'Admin/UsersController.update')
          .middleware(['rbac:update user'])

      Route.delete('/:userId', 'Admin/UsersController.deleteOne')
          .middleware(['rbac:delete user'])
      // end users
    }).prefix('users')

    Route.group(() => {
      // roles
      Route.post('/', 'Admin/RolesController.create')
          .middleware(['rbac:create role'])

      Route.get('/', 'Admin/RolesController.readAll')
          .middleware(['rbac:view role'])

      Route.get('/:roleId', 'Admin/RolesController.readOne')
          .middleware(['rbac:view role'])

      Route.post('/:roleId', 'Admin/RolesController.update')
          .middleware(['rbac:update role'])

      Route.delete('/:roleId', 'Admin/RolesController.deleteOne')
          .middleware(['rbac:delete role'])
      // end roles
    }).prefix('roles')

    Route.group(() => {
      // permissions
      Route.post('/', 'Admin/PermissionsController.create')
          .middleware(['rbac:create permission'])

      Route.get('/', 'Admin/PermissionsController.readAll')
          .middleware(['rbac:view permission'])

      Route.get('/:permissionId', 'Admin/PermissionsController.readOne')
          .middleware(['rbac:view permission'])

      Route.post('/:permissionId', 'Admin/PermissionsController.update')
          .middleware(['rbac:update permission'])

      Route.delete('/:permissionId', 'Admin/PermissionsController.deleteOne')
          .middleware(['rbac:delete permission'])
      // end permissions
    }).prefix('permissions')
    // end admin
  })
    .prefix('admin')
    .middleware(['auth'])
  // end version
}).prefix('v1')
