import mongodbConnect from '@/lib/mongodb'

export async function register() {
    await mongodbConnect()
}
