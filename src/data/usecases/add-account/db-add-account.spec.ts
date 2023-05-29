import { type AccountModel, type AddAccountRepository, type Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}
const newAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AccountModel): Promise<AccountModel> {
      account = { ...account, id: 1 }
      return account
    }
  }
  return new AddAccountRepositoryStub()
}
const newEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'hashed_password'
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

  test('Should return an acccount on success', async () => {
    const { sut } = newSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({ ...accountData, id: 1, password: 'hashed_password' })
  })
})
