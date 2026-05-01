import { Dropzone } from "@/components/dropzone";
import { createClient } from "@/lib/supabase/server";

export default async function CreateIssue() {
    const supabase = await createClient()
    return (
        <div>
        </div>
    );
}
