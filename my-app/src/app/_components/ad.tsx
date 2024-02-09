import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function AD() {
  return (
    <div className="bg-fuchsia-600 p-6 max-w-4xl w-full m-auto">
      <h1 className="text-3xl">
        Generate fast and efficient icons for your projects.
      </h1>
      <p>
        Save time by generating icons for your businesses website, applications,
        or brand using our AI digital icon generator.
      </p>
      <div
        style={{ width: 800, height: 500, backgroundColor: "red" }}
        className="m-auto"
      >
        Image PlacerHolder
      </div>
      
      <Link className={buttonVariants({ variant: "outline" })} href="/generator">start generate icons</Link>
    </div>
  );
}
