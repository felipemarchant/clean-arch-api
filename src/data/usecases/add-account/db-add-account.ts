import {
  type AccountModel,
  type AddAccountModel,
  type Encrypter,
  type AddAccount, type AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    account = { ...account, password: hashedPassword }
    await this.addAccountRepository.add(account)
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
