import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="w-full py-12 lg:py-24 bg-[#FFF7F1] dark:bg-gray-900">
      <div className="container px-4 flex flex-col lg:flex-row lg:justify-between gap-8 items-center text-center">
        <div className="lg:w-1/2 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl xl:text-5xl bg-gradient-to-r from-[#E178C5] to-[#FFB38E] text-[#FFB38E] bg-clip-text">
            Get your medical reports analyzed
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Chat with medical professionals and securely share your reports on our platform.
          </p>
          <div className="w-full max-w-lg space-y-4">
            <form className="flex w-full space-x-2">
              <Input className="flex-1" placeholder="Enter your email" />
              <Button type="submit">Get Started</Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400">We'll never share your email with anyone else.</p>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img
            alt="Medical report analysis"
            className="mx-auto aspect-video overflow-hidden rounded-t-lg lg:rounded-l-lg"
            height="450"
            src="/placeholder.svg"
            width="800"
          />
        </div>
      </div>
    </div>
  )
}

