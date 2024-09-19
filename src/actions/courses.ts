"use server"

import { client } from "@/lib/prisma"

export const onCreateGroupCourse = async (
    groupid: string,
    name: string,
    image: string,
    description: string,
    courseid: string,
    privacy: string,
    published: boolean,
) => {
    try {
        const course = await client.group.update({
            where: {
                id: groupid,
            },
            data: {
                courses: {
                    create: {
                        id: courseid,
                        name,
                        thumbnail: image,
                        description,
                        privacy,
                        published,
                    },
                },
            },
        })

        if (course) {
            return { status: 200, message: "Course successfully created" }
        }

        return { status: 404, message: "Group not found" }
    } catch (error) {
        return { status: 400, message: "Oops! something went wrong" }
    }
}

export const onGetGroupCourses = async (groupid: string) => {
    try {
        const courses = await client.course.findMany({
            where: {
                groupId: groupid,
            },
            take: 8,
            orderBy: {
                createdAt: "desc",
            },
        })

        if (courses && courses.length > 0) {
            return { status: 200, courses }
        }

        return {
            status: 404,
            message: "No courses found",
        }
    } catch (error) {
        return {
            status: 400,
            message: "Oops! something went wrong",
        }
    }
}
