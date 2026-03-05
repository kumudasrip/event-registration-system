import { RegistrationForm } from "@/components/RegistrationForm";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex w-full bg-background font-sans">
      {/* Left Panel - Hidden on small screens */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          {/* landing page hero event tech conference */}
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop"
            alt="Conference Event"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-zinc-950/40" />
        </div>
        <div className="relative z-10 text-white mt-12">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
            Registrations Open
          </div>
          <h1 className="font-display text-6xl font-bold tracking-tight mb-6 leading-tight">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
              Tech & Innovation
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-md font-medium leading-relaxed">
            Join thousands of students and professionals at the premier summit. Secure your spot today.
          </p>
        </div>
        <div className="relative z-10 text-white/50 text-sm flex justify-between items-center">
          <p>© 2025 Nexus Event. All rights reserved.</p>
          <Link href="/admin/login" className="hover:text-white transition-colors">Admin Access</Link>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative bg-gradient-to-br from-background to-secondary/30">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 lg:hidden text-center">
             <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
               Nexus 2025
             </div>
             <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Secure your spot</h1>
             <p className="text-muted-foreground mt-2">Join the premier tech summit.</p>
          </div>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
