import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    await User.create({
      nome: 'Gustavo',
      email: 'gu@email.com',
      password: '123456',
      tipo: 'admin',
      telefone: '35999999999',
    })

    await User.create({
      nome: 'Vinicius',
      email: 'vini@email.com',
      password: '123456',
      tipo: 'user',
      telefone: '35999086268',
    })
  }
}
