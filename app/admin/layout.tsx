import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  if (user.user_metadata?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card px-8 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex gap-4">
            <a href="/admin/moderators" className="hover:underline">Moderators</a>
            <a href="/admin/moderators/create" className="hover:underline">Create Moderator</a>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
          </div>
        </div>
      </nav>
      <main className="">
        {children}
      </main>
    </div>
  )
}
