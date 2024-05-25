"use client";
import Image from "next/image";

export const SystemMessage: React.FC<{ message: string }> = (props) => {
    const { message } = props
    return (
        <div className="flex flex-col gap-2 py-3">
            <div className="flex gap-2">
                <Image
                    src={"/system.png"}
                    width={30}
                    height={30}
                    className="rounded-full"
                    alt="User Pic"
                />
                <h2 className="font-bold text-lg text-neutral-100">
                    <span>
                        AI Assistant
                    </span>
                </h2>
            </div>
            <p>{message}</p>
        </div>
    )
}