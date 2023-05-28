import {
  type AccountModel,
  type AddAccountModel,
  type Encrypter,
  type AddAccount
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => {
      resolve({
        id: 1,
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      })
    })
  }
}
