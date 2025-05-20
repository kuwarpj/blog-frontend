import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/Header/Header";


export const metadata = {
  title: "CRUD Blog APP",
  description: "This is Crud Blog App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col w-full min-h-screen">
            <Header />
            <main className="flex-1 w-full p-4">
              <SidebarTrigger />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
