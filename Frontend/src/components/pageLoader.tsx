import { LoaderCircle } from "lucide-react";

export default function pageLoader() {
    return (
        <div className="flex justify-center items-center bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] w-screen h-screen">
            <LoaderCircle className="size-20 animate-spin text-[#38BBAD]"/>
        </div>
    )
}