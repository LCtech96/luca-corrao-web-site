// Servizio per la gestione dei dati degli utenti
export interface UserData {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
  phoneNumber?: string
  imageUrl?: string
  publicMetadata?: Record<string, any>
  privateMetadata?: Record<string, any>
  unsafeMetadata?: Record<string, any>
}

// Simulazione di un database in memoria (in produzione, usa un database reale)
const users: Map<string, UserData> = new Map()

export class UserService {
  // Salva un nuovo utente
  static async createUser(userData: Omit<UserData, 'createdAt' | 'updatedAt'>): Promise<UserData> {
    const now = new Date()
    const user: UserData = {
      ...userData,
      createdAt: now,
      updatedAt: now
    }
    
    users.set(user.id, user)
    console.log('Utente salvato:', user)
    return user
  }

  // Ottieni un utente per ID
  static async getUserById(id: string): Promise<UserData | null> {
    return users.get(id) || null
  }

  // Ottieni tutti gli utenti
  static async getAllUsers(): Promise<UserData[]> {
    return Array.from(users.values())
  }

  // Aggiorna un utente
  static async updateUser(id: string, updates: Partial<UserData>): Promise<UserData | null> {
    const user = users.get(id)
    if (!user) return null

    const updatedUser: UserData = {
      ...user,
      ...updates,
      updatedAt: new Date()
    }

    users.set(id, updatedUser)
    console.log('Utente aggiornato:', updatedUser)
    return updatedUser
  }

  // Elimina un utente
  static async deleteUser(id: string): Promise<boolean> {
    const deleted = users.delete(id)
    if (deleted) {
      console.log('Utente eliminato:', id)
    }
    return deleted
  }

  // Cerca utenti per email
  static async findUserByEmail(email: string): Promise<UserData | null> {
    for (const user of users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  // Ottieni statistiche degli utenti
  static async getUserStats() {
    const allUsers = Array.from(users.values())
    return {
      total: allUsers.length,
      verified: allUsers.filter(u => u.emailVerified).length,
      unverified: allUsers.filter(u => !u.emailVerified).length,
      recent: allUsers.filter(u => {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return u.createdAt > oneWeekAgo
      }).length
    }
  }
} 