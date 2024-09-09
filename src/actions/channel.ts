"use server"

import { client } from "@/lib/prisma"

export const onCreateNewChannel = async (
    groupid: string,
    data: {
        id: string
        name: string
        icon: string
    },
) => {
    console.log(groupid, data)
    try {
        const channel = await client.group.update({
            where: {
                id: groupid,
            },
            data: {
                channel: {
                    create: {
                        ...data,
                    },
                },
            },
            select: {
                channel: true,
            },
        })

        if (channel) {
            return { status: 200, channel: channel.channel }
        }

        return {
            status: 404,
            message: "Channel could not be created",
        }
    } catch (error) {
        return {
            status: 400,
            message: "Oops! something went wrong",
        }
    }
}
export const onUpdateChannelInfo = async (
    channelid: string,
    name?: string,
    icon?: string,
) => {
    try {
        if (name) {
            const channel = await client.channel.update({
                where: {
                    id: channelid,
                },
                data: {
                    name,
                },
            })

            if (channel) {
                return {
                    status: 200,
                    message: "Channel name successfully updated",
                }
            }
            return {
                status: 404,
                message: "Channel not found! try again later",
            }
        }
        if (icon) {
            const channel = await client.channel.update({
                where: {
                    id: channelid,
                },
                data: {
                    icon,
                },
            })
            if (channel) {
                return {
                    status: 200,
                    message: "Channel icon successfully updated",
                }
            }
            return {
                status: 404,
                message: "Channel not found! try again later",
            }
        } else {
            const channel = await client.channel.update({
                where: {
                    id: channelid,
                },
                data: {
                    icon,
                    name,
                },
            })
            if (channel) {
                return {
                    status: 200,
                    message: "Channel successfully updated",
                }
            }
            return {
                status: 404,
                message: "Channel not found! try again later",
            }
        }
    } catch (error) {
        console.log(error)
        return { status: 400, message: "Oops! something went wrong" }
    }
}

export const onDeleteChannel = async (channelId: string) => {
    try {
        const channel = await client.channel.delete({
            where: {
                id: channelId,
            },
        })

        if (channel) {
            return { status: 200, message: "Channel deleted successfully" }
        }

        return { status: 404, message: "Channel not found!" }
    } catch (error) {
        return { status: 400, message: "Oops! something went wrong" }
    }
}
