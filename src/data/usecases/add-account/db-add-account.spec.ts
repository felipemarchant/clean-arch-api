import { type AccountModel, type Encrypter, type AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}
const newAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 1,
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return await new Promise(resolve => { resolve(fakeAccount) })
    }
  }
  return new AddAccountRepositoryStub()
}
const newEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}
const newSut = (): SutTypes => {
  const encrypterStub = newEncrypter()
  const addAccountRepositoryStub = newAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}
describe('DbAddAccount Usecase', () => {
  test('Should call Ecrypter with correct password', async () => {
    const { sut, encrypterStub } = newSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw exception if Encrypter throws', async () => {
    const { sut, encrypterStub } = newSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = newSut()
    const addRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    const accountDataWithHashedPassword = {
      ...accountData, password: 'hashed_password'
    }
    expect(addRepositorySpy).toHaveBeenCalledWith(accountDataWithHashedPassword)
  })

  test('Should throw exception if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = newSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
