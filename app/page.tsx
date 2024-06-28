import Card from "@/components/card";
import { getImages } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
const datas = await getImages()
  return (
    <div className="max-w-screen-lg mx-auto py-14">
      <div className="flex items-end justify-between">
        <h1 className="text-4xl font-bold">Latest Images</h1>
        <Link
          href={"/create"}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Upload New Image
        </Link>
      </div>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {datas.map(data => (
            <Card key={data.id} data={data} />
          ))}
        </div>
    </div>
  );
}
