import Link from 'next/link'
import { getModerators } from './actions'
import { ModeratorsTable } from '@/components/admin/moderators-table'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function ModeratorsPage() {
  const moderators = await getModerators()

  return (
    <div className="container mx-auto py-10 px-4 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-tr from-neutral-900 via-neutral-900/70 to-neutral-900 bg-clip-text text-transparent">Team Leaders</h1>
          <p className="text-muted-foreground mt-1">Manage team leaders</p>
        </div>
        <Link href="/admin/team_leaders/create">
          <Button>
            Add Team Leader
          </Button>
        </Link>
      </div>

      <ModeratorsTable initialModerators={moderators} />
    </div>
  )
}
