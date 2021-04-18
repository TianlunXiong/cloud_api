interface ResponseBody {
  success: boolean,
  data?: any,
  error?: {
    message: string,
    code: number,
  },
}

const Response = {
  Success(data: any): ResponseBody {
    return {
      success: true,
      data,
    }
  },
  NotSuccess(message: string): ResponseBody {
    return {
      success: false,
      error: {
        message: message,
        code: 1,
      }
    }
  },
  Error(message: any): ResponseBody {
    return {
      success: false,
      error: {
        message: message,
        code: 2,
      }
    }
  }
}

export {
  ResponseBody,
  Response,
}