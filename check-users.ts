import { AirtableService } from './src/lib/services/airtable'

async function checkUsers() {
    try {
        const users = await AirtableService.getAllUsers()
        console.log('Existing users:', users.map(u => u.username))
    } catch (error) {
        console.error('Error fetching users:', error)
    }
}

checkUsers()
