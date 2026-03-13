import { RegistrationForm } from "@/components/RegistrationForm";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex w-full bg-background font-sans">
      {/* Left Panel - Hidden on small screens */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop"
            alt="Conference Event"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/80 via-purple-900/40 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-zinc-950/50" />
        </div>
        <div className="relative z-10 text-white mt-12">
          <div className="inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-sm font-medium backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
            Registrations Open
          </div>
          <h1 className="font-display text-6xl font-bold tracking-tight mb-6 leading-tight">
            Welcome to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
              Zenith 2026
            </span>
          </h1>
          <p className="text-xl text-white/75 max-w-md font-medium leading-relaxed">
            Join students and professionals at the premier summit. Secure your spot today.
          </p>
        </div>
        <div className="relative z-10 text-white/40 text-sm flex justify-between items-center">
          <p>© 2026 Zenith Event. All rights reserved.</p>
          <Link href="/admin/login" className="hover:text-white/80 transition-colors">Admin Access</Link>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative bg-gradient-to-br from-background to-secondary/20">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 lg:hidden text-center">
             <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
               Zenith 2026
             </div>
             <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Secure your spot</h1>
             <p className="text-muted-foreground mt-2">Join the premier summit of 2026.</p>
          </div>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
