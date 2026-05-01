'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, MapPin, Send } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

// ── Helpers ──────────────────────────────────────────────────────────────────
const supabase = createClient()

// ── Component ────────────────────────────────────────────────────────────────
export default function ReportProblemPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [issueId, setIssueId] = useState<string | null>(null)

  const uploadProps = useSupabaseUpload({
    bucketName: 'Attachments',
    issueId,
    allowedMimeTypes: ['image/*', 'video/*'],
    maxFileSize: 50 * 1024 * 1024, // 50 MB
    maxFiles: 10,
    upsert: true,
  })

  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !location.trim()) return

    setStatus('submitting')
    setErrorMsg('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id
      // 1. Insert the report into the `reports` table
      const { data, error } = await supabase
        .from('reports')
        .insert({ title: title.trim(), description: description.trim(), location: location.trim(), reporter_id: userId })
        .select('id')
        .single()

      if (error) throw error

      const newIssueId = data.id as string
      setIssueId(newIssueId)

      // 2. Upload attachments (if any), passing the issueId directly so it's
      //    available immediately without waiting for React state re-render
      if (uploadProps.files.length > 0) {
        await uploadProps.onUpload(newIssueId)
      }

      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setTitle('')
    setDescription('')
    setLocation('')
    setStatus('idle')
    setErrorMsg('')
    setIssueId(null)
    uploadProps.setFiles([])
    uploadProps.setErrors([])
  }

  // ── Success State ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Report Submitted!
          </h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Thank you for helping improve your community. Your report has been received and will be
            reviewed shortly.
          </p>
          <Button onClick={handleReset} className="w-full">
            Submit Another Report
          </Button>
        </div>
      </main>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Report a Problem</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Help us keep the city safe and clean by reporting issues in your area.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b">
              <CardTitle>Problem Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible so we can address the issue quickly.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 pt-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="report-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="report-title"
                  placeholder="e.g. Broken street light on Main Ave"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-9"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="report-description">
                  Description
                </Label>
                <textarea
                  id="report-description"
                  placeholder="Describe the problem in detail…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  className={cn(
                    'w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none resize-none',
                    'placeholder:text-muted-foreground',
                    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    'dark:bg-input/30'
                  )}
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="report-location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="report-location"
                    placeholder="e.g. 42 Main Ave, Downtown"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="h-9 pl-8"
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="flex flex-col gap-1.5">
                <Label>
                  Attachments{' '}
                  <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Dropzone {...uploadProps}>
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
                <p className="text-xs text-muted-foreground">
                  Images and videos up to 50 MB · max 10 files
                </p>
              </div>

              {/* Error banner */}
              {status === 'error' && (
                <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !title.trim() || !location.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          All reports are reviewed within 48 hours. Fields marked{' '}
          <span className="text-destructive font-medium">*</span> are required.
        </p>
      </div>
    </main>
  )
}
