import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { toast } from "sonner";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  }),
});

export default function CardWithForm() {
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log("inputData: ", data);
      const { data: loginData } = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/login",
        data
      );
      window.localStorage.setItem("userData", JSON.stringify(loginData));
      toast.success("Login successful, redirecting to dashboard");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3 * 1000);
    } catch (err) {
      console.log(err);
    }
  }
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="w-screen mt-52">
      <Card className="w-1/2 m-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-[#023382] font-bold text-2xl">
            Login now
          </CardTitle>
          <CardDescription className="">
            Once you login, we provide a complete suite of tools to manage your
            medical reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-[#023382]">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="james.bond@mi6.com" {...field} />
                    </FormControl>
                    <FormDescription>This is your login email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#023382]">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="If I tell you, I'll have to kill you"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your password, keep it safe.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between mt-4">
                <Button className="bg-[#023382]">Login</Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
