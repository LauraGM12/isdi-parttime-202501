import dotenv from 'dotenv'
import fetch, { Headers, Request, Response } from 'node-fetch'

dotenv.config()

if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
}

process.env.RAWG_API_KEY = process.env.RAWG_API_KEY || '1d35f0064f6946c199bd8ffe4cfb2d26'
process.env.RAWG_BASE_URL = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api/'

process.env.NODE_ENV = 'test'
process.env.RAWG_API_KEY = process.env.RAWG_API_KEY || 'test-api-key'
process.env.RAWG_BASE_URL = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api/'
process.env.RAWG_API_KEY = process.env.RAWG_API_KEY || '1d35f0064f6946c199bd8ffe4cfb2d26'