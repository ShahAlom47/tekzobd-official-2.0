import DashboardWrapper from "@/components/wrappers/DashboardWrapper";
import DashboardClientLayout from "@/layouts/DashboardClientLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardWrapper>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </DashboardWrapper>
  );
}
