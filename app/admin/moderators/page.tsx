import Link from 'next/link'
import { getModerators } from './actions'
import { ModeratorsTable } from '@/components/admin/moderators-table'

export const dynamic = 'force-dynamic'

export default async function ModeratorsPage() {
  const moderators = await getModerators()

  return (
    <div className="container mx-auto py-10 px-4 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moderators</h1>
          <p className="text-muted-foreground mt-1">Manage platform moderators</p>
        </div>
        <Link href="/admin/moderators/create">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors">
            Add Moderator
          </button>
        </Link>
      </div>

      <ModeratorsTable initialModerators={moderators} />
    </div>
  )
}
