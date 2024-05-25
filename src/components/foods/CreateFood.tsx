"use client"

import { api } from "@/trpc/react"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Button } from "../ui/button"


export const CreateFood: React.FC = () => {
    const createFoodMutation = api.foods.createFood.useMutation({
        onSuccess: () => {
            alert("Food created!")
        }
    })

    const [name, setName] = useState("")
    const [calories, setCalories] = useState(0)
    const [type, setType] = useState<"fruit" | "meat" | "pastry" | "dairy" | "other">("fruit")

    const submit = () => {
        createFoodMutation.mutate({
            name,
            calories,
            type,
        })
    }


    return <Card className="w-full bg-neutral-900 p-8 flex flex-col gap-4">
        <CardTitle>Create Food</CardTitle>
        <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <Label>Name</Label>
                <Input type="text" placeholder="steak"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label>Calories</Label>
                <Input type="number" placeholder="steak"
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value))}
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v: "fruit" | "meat" | "pastry" | "dairy" | "other") => setType(v)}>
                    <SelectTrigger className="">
                        <SelectValue placeholder="Fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fruit">Fruit</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="pastry">Pastry</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Button onClick={submit} disabled={createFoodMutation.isPending}>Create</Button>
            </div>
        </CardContent>
    </Card>
}