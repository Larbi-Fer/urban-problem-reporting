'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteUser, updateUserPassword } from '@/app/admin/moderators/actions'
import { User } from '@supabase/supabase-js'

interface ModeratorsTableProps {
  initialModerators: User[]
}

export function ModeratorsTable({ initialModerators }: ModeratorsTableProps) {
  const [moderators, setModerators] = useState<User[]>(initialModerators)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this moderator?')) return
    
    setLoading(userId)
    try {
      await deleteUser(userId)
      setModerators(moderators.filter((m) => m.id !== userId))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete user')
    } finally {
      setLoading(null)
    }
  }

  const handlePasswordChange = async (userId: string) => {
    if (!newPassword) return
    
    setLoading(userId)
    try {
      await updateUserPassword(userId, newPassword)
      alert('Password updated successfully')
      setEditingId(null)
      setNewPassword('')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update password')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moderators.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                No moderators found.
              </TableCell>
            </TableRow>
          ) : (
            moderators.map((moderator) => (
              <TableRow key={moderator.id}>
                <TableCell>{moderator.email}</TableCell>
                <TableCell>{new Date(moderator.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    {editingId === moderator.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-32 sm:w-40"
                        />
                        <Button
                          size="sm"
                          onClick={() => handlePasswordChange(moderator.id)}
                          disabled={loading === moderator.id}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(moderator.id)}
                          disabled={loading === moderator.id}
                        >
                          Change Password
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(moderator.id)}
                          disabled={loading === moderator.id}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
