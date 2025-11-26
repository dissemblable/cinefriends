import Page from "@/components/Page"
import { LoginCard } from "@/features/auth/components"

export default function SignInPage() {
  return (
    <Page className="flex flex-1 items-center justify-center">
      <LoginCard />
    </Page>
  )
}
