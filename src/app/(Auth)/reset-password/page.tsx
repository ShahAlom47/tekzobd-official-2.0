import Loading from "@/app/loading";
import ResetPassContent from "@/components/ResetPassContent";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPassContent />
    </Suspense>
  );
}
