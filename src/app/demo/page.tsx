import { openaiEmbeddingsModel } from "@/server/ai"
import { embed } from "ai"

export default async function Page() {
    const res = await embed({
        model: openaiEmbeddingsModel,
        value: "Apple"
    })

    console.log(res)

    return <div>hello there</div>
}