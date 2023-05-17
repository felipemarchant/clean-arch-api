import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type EmailValidator,
  type AddAccount
} from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../erros'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      const isPasswordConfirmed = password === passwordConfirmation
      if (!isPasswordConfirmed) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
