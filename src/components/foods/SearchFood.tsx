"use client"

import { Label } from "@radix-ui/react-label"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { useEffect, useRef, useState } from "react"
import { api } from "@/trpc/react"

export const SearchFood: React.FC<{ name: string }> = (props) => {
    const { name } = props

    const [search, setSearch] = useState(name)
    const [foods, setFoods] = useState<{
        name: string;
        calories: number;
        type: "fruit" | "meat" | "pastry" | "dairy" | "other";
        id: string;
    }[]>([])


    const searchForFoodMutation = api.foods.searchFood.useMutation({
        onSuccess: (data) => {
            setFoods(data)
        }
    })

    const timeOutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (search !== "") {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current)
            }

            timeOutRef.current = setTimeout(() => {
                searchForFoodMutation.mutate({
                    query: search,
                })
            }, 500)
        } else {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current)
            }
            setFoods([])
        }
    }, [search, searchForFoodMutation])

    return <Card className="w-full bg-neutral-900 p-8 flex flex-col gap-4">
        <CardTitle>Search Food</CardTitle>

        <CardContent>
            <div>
                <Label>Name</Label>
                <Input type="text" placeholder="steak"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="py-4 flex flex-col gap-2">
                {foods.map((food) => (
                    <div key={food.id}>
                        <div className="flex w-full justify-between items-center py-2">
                            <h2><span className="text-neutral-100 font-bold">{food.name}</span> - {food.calories} calories</h2>
                            <FoodType type={food.type} />
                        </div>
                        <Separator />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
}

const FoodType: React.FC<{
    type: "fruit" | "meat" | "pastry" | "dairy" | "other"
}> = (props) => {
    const { type } = props

    if (type === "fruit") {
        return <div className="border py-1 px-3 border-red-300 text-red-300 rounded-md">Fruit</div>
    }

    if (type === "meat") {
        return <div className="border py-1 px-3 border-purple-300 text-purple-300 rounded-md">Meat</div>
    }
    if (type === "pastry") {
        return <div className="border py-1 px-3 border-neutral-300 text-neutral-300 rounded-md">Pastry</div>
    }
    if (type === "dairy") {
        return <div className="border py-1 px-3 border-yellow-300 text-yellow-300 rounded-md">Dairy</div>
    }
    if (type === "other") {
        return <div className="border px-3 py-1 border-pink-300 text-pink-300 rounded-md">Other</div>
    }
}