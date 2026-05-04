'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getModerators() {
  const adminClient = createAdminClient()
  
  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  
  if (error) {
    throw new Error(error.message)
  }

  // Filter users who have the 'modirator' role in their metadata
  return users.filter(user => user.user_metadata?.role === 'modirator')
}

export async function deleteUser(userId: string) {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient.auth.admin.deleteUser(userId)
  
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/moderators')
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: newPassword
  })
  
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/moderators')
}
