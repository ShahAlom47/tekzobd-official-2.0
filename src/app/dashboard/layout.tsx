import DashboardWrapper from "@/wrappers/DashboardWrapper";
import DashboardClientLayout from "../../layout/DashboardClientLayout";


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
