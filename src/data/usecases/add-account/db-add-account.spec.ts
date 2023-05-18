import { DbAddAccount } from './db-add-account'
import { type Encrypter } from '../../protocols/encrypter'

describe('DbAddAccount Usecase', () => {
  test('Should call Ecrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }

    const ecrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(ecrypterStub)
    const encryptSpy = jest.spyOn(ecrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
