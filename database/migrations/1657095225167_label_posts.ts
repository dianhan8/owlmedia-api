import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'label_posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('label_id').unsigned().references('labels.id')
      table.integer('post_id').unsigned().references('posts.id')
      table.unique(['label_id', 'post_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
