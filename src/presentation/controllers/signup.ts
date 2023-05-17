import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200,
      body: null
    }
  }
}
