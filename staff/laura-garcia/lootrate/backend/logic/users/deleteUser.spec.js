import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import deleteUser from './deleteUser.js'
import bcrypt from 'bcryptjs'
import { data } from '../../data/index.js'
import { errors } from 'common'

const failId =  new data.ObjectId() 

describe('deleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()

      data.users.findById = jest.fn()
      bcrypt.compare = jest.fn()
  })

  it('debería lanzar NotFoundError si el usuario no existe', async () => {

    data.users.findById.mockResolvedValue(undefined)

    await expect(deleteUser(failId, 'user@mail.com', 'pass')).rejects.toThrow(errors.NotFoundError)
  })

  it('debería lanzar CredentialsError si el email no coincide', async () => {
    data.users.findById.mockResolvedValue({ email: 'otro@mail.com' })

    await expect(deleteUser('id', 'user@mail.com', 'pass')).rejects.toThrow(errors.CredentialsError)
  })

  it('debería lanzar CredentialsError si la contraseña es incorrecta', async () => {
    data.users.findById.mockResolvedValue({ email: 'user@mail.com', password: 'hash' })

    await expect(deleteUser('id', 'user@mail.com', 'wrong')).rejects.toThrow(errors.CredentialsError)
  })

  it('debería eliminar usuario y reseñas correctamente si todo es válido', async () => {
    const user = { email: 'user@mail.com', password: 'hash' }

    data.users.findById.mockResolvedValue(user)
    bcrypt.compare.mockResolvedValue(true)

    const result = await deleteUser('id', 'user@mail.com', 'correctPass')

    expect(bcrypt.compare).toHaveBeenCalledWith('correctPass', 'hash')
    expect(data.reviews.deleteMany).toHaveBeenCalledWith({ userId: 'id' })
    expect(data.users.findByIdAndDelete).toHaveBeenCalledWith('id')
    expect(result).toEqual({ message: 'Cuenta eliminada exitosamente' })
  })
})
