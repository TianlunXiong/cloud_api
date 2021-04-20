interface ResponseBody {
  success: boolean,
  data?: any,
  error?: {
    message: string,
    code: number,
  },
}

export {
  ResponseBody,
}