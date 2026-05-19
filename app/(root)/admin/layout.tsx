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
      <main className="">
        {children}
      </main>
    </div>
  )
}
