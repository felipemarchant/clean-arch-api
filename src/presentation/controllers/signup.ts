import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { name, email } = httpRequest.body
    if (!name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    return {
      statusCode: 200,
      body: null
    }
  }
}
