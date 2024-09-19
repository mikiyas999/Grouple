import { onCreateGroupCourse, onGetGroupCourses } from "@/actions/courses"
import { onGetGroupInfo } from "@/actions/groups"
import { CreateCourseSchema } from "@/components/global/create-course/schema"
import { upload } from "@/lib/uploadcare"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 } from "uuid"
import { z } from "zod"

export const useCourses = (groupid: string) => {
    const { data } = useQuery({
        queryKey: ["group-courses"],
        queryFn: () => onGetGroupCourses(groupid),
    })

    return { data }
}

export const useCreateCourse = (groupid: string) => {
    const [onPrivacy, setOnPrivacy] = useState<string | undefined>("open")
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors },
    } = useForm<z.infer<typeof CreateCourseSchema>>({
        resolver: zodResolver(CreateCourseSchema),
        defaultValues: {
            privacy: "open",
            published: false,
        },
    })

    useEffect(() => {
        const privacy = watch(({ privacy }) => setOnPrivacy(privacy))
        return () => privacy.unsubscribe()
    }, [watch])

    const client = useQueryClient()

    const { data } = useQuery({
        queryKey: ["group-info"],
        queryFn: () => onGetGroupInfo(groupid),
    })
    const { mutate, isPending, variables } = useMutation({
        mutationKey: ["create-course-mutation"],
        mutationFn: async (data: {
            id: string
            name: string
            image: FileList
            description: string
            createdAt: Date
            privacy: string
            published: boolean
        }) => {
            console.log(data)
            const uploaded = await upload.uploadFile(data.image[0])

            const course = await onCreateGroupCourse(
                groupid,
                data.name,
                uploaded.uuid,
                data.description,
                data.id,
                data.privacy,
                data.published,
            )
            return course
        },
        onMutate: () => {
            buttonRef.current?.click()
        },
        onSuccess: (data) => {
            return toast(data.status !== 200 ? "Error" : "Success", {
                description: data.message,
            })
        },
        onSettled: async () => {
            return await client.invalidateQueries({
                queryKey: ["group-courses"],
            })
        },
    })

    const onCreateCourse = handleSubmit(async (values) =>
        mutate({
            id: v4(),
            createdAt: new Date(),
            image: values.image,
            ...values,
        }),
    )

    return {
        onCreateCourse,
        register,
        errors,
        buttonRef,
        variables,
        isPending,
        onPrivacy,
        setValue,
        data,
    }
}
