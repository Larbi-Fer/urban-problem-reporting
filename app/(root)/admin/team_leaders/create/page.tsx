import { CreateModeratorForm } from '@/components/admin/create-moderator-form'

export default function CreateModeratorPage() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <CreateModeratorForm />
      </div>
    </div>
  )
}
