import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, type RegistrationInput } from "@shared/routes";
import { useCreateRegistration } from "@/hooks/use-registrations";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function RegistrationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createRegistration = useCreateRegistration();

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(api.registrations.create.input),
    defaultValues: {
      name: "",
      email: "",
      college: "",
      year: "",
      domain: "Tech",
      interestAnswer: "",
    },
  });

  function onSubmit(data: RegistrationInput) {
    createRegistration.mutate(data, {
      onSuccess: (result) => {
        // Store result in sessionStorage to display on success page
        sessionStorage.setItem("lastRegistration", JSON.stringify(result));
        setLocation("/success");
      },
      onError: (error) => {
        toast({
          title: "Registration Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }

  return (
    <Card className="shadow-2xl border-white/20 backdrop-blur-sm bg-card/95 w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-display">Secure your spot</CardTitle>
        <CardDescription>
          Fill out the form below to register for Nexus 2025.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@university.edu" {...field} className="focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College / University</FormLabel>
                    <FormControl>
                      <Input placeholder="Stanford University" {...field} className="focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Study</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus-visible:ring-primary/20">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                        <SelectItem value="Postgrad">Postgraduate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Domain</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="focus-visible:ring-primary/20">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tech">Technical (Coding, Data, AI)</SelectItem>
                      <SelectItem value="Non-Tech">Non-Technical (Design, Management)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why are you interested in Nexus 2025?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us what you hope to learn or achieve..." 
                      className="resize-none h-24 focus-visible:ring-primary/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold group bg-gradient-to-r from-primary to-primary/80 hover:to-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              disabled={createRegistration.isPending}
            >
              {createRegistration.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
