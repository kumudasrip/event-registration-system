import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminRegistrations, useAnalytics } from "@/hooks/use-registrations";
import { useAuth } from "@/hooks/use-auth";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Code, Lightbulb, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("All");
  
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  
  const { data: registrations, isLoading: regsLoading } = useAdminRegistrations({
    search: search || undefined,
    domain: domainFilter !== "All" ? (domainFilter as 'Tech' | 'Non-Tech') : undefined,
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-12">
      <AdminNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time event registration analytics and management.</p>
        </div>

        {/* Analytics Section */}
        {analyticsLoading || !analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
            <Skeleton className="col-span-1 md:col-span-2 h-[350px] w-full rounded-xl" />
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Registrations</p>
                    <p className="text-4xl font-display font-bold">{analytics.totalRegistrations}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tech Domain</p>
                    <p className="text-4xl font-display font-bold text-primary">{analytics.domainSplit.tech}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Non-Tech Domain</p>
                    <p className="text-4xl font-display font-bold text-accent">{analytics.domainSplit.nonTech}</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-full">
                    <Lightbulb className="w-6 h-6 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2 shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Registrations Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.dailyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(val) => format(new Date(val), 'MMM d')}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip 
                          cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                          labelFormatter={(val) => format(new Date(val), 'MMMM d, yyyy')}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Domain Split</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Tech', value: analytics.domainSplit.tech },
                            { name: 'Non-Tech', value: analytics.domainSplit.nonTech }
                          ]}
                          cx="50%"
                          cy="45%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Data Table Section */}
        <Card className="shadow-sm border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-xl font-bold font-display">Attendee List</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search names or emails..." 
                  className="pl-9 w-full sm:w-[250px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative flex items-center">
                <Filter className="absolute left-2.5 z-10 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] pl-9">
                    <SelectValue placeholder="Domain Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Domains</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Non-Tech">Non-Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right">Registered On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !registrations || registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No registrations found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((reg) => (
                    <TableRow key={reg.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {reg.registrationId}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{reg.name}</p>
                        <p className="text-xs text-muted-foreground">{reg.email}</p>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={reg.college}>
                        {reg.college}
                      </TableCell>
                      <TableCell>{reg.year}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={reg.domain === 'Tech' ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'bg-accent/10 text-accent hover:bg-accent/20 border-0'}
                        >
                          {reg.domain}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(reg.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
