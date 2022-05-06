import io from 'socket.io'
import axios from 'axios'
import { SpellManager } from '@latitudegames/thoth-core/dist/server'
import { buildThothInterface } from './thothInterface'

interface FeathersSocket extends io.Socket {
  feathers: any
}

const getUserInfo = async (sessionId: string) => {
  try {
    const response = await axios({
      url: 'https://api.latitude.io/user/info',
      headers: {
        Authorization: `session ${sessionId}`,
      },
    })

    return response.data
  } catch (err) {
    console.log('Error getting usert info!')
    console.log(err)
  }
}

const handleSockets = (app: any) => {
  return (io: any) => {
    // Another gross 'any' here
    io.on('connection', async function (socket: any) {
      console.log('CONNECTION ESTABLISHED')
      const sessionId = socket.handshake.headers.authorization.split(' ')[1]

      if (!sessionId) throw new Error('No session id provided for handshake')
      // Authenticate with the auth headers here
      const user = await getUserInfo(sessionId)

      console.log('SETTING USER', user)

      // Attach the user info to the params or use in services
      socket.feathers.user = user

      const thothInterface = buildThothInterface()
      const spellManager = new SpellManager(thothInterface, socket)

      app.userSpellManagers.set(user.id, spellManager)

      console.log('EMITTING CONNECTED EVENT')
      socket.emit('connected')
    })
  }
}

export default handleSockets
