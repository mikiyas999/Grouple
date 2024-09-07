import { onAuthenticatedUser } from "@/actions/auth"
import {
    onGetAllGroupMembers,
    onGetGroupChannels,
    onGetGroupInfo,
    onGetGroupSubscriptions,
    onGetUserGroups,
} from "@/actions/groups"
import SideBar from "@/components/global/sidebar"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query"
import { redirect } from "next/navigation"

type Props = {
    children: React.ReactNode
    params: {
        groupid: string
    }
}

const GroupLayout = async ({ children, params }: Props) => {
    const query = new QueryClient()

    const user = await onAuthenticatedUser()
    if (!user.id) redirect("/sign-in")

    //group info
    await query.prefetchQuery({
        queryKey: ["group-info"],
        queryFn: () => onGetGroupInfo(params.groupid),
    })

    //user groups
    await query.prefetchQuery({
        queryKey: ["user-groups"],
        queryFn: () => onGetUserGroups(user.id as string),
    })

    //channels
    await query.prefetchQuery({
        queryKey: ["group-channels"],
        queryFn: () => onGetGroupChannels(params.groupid),
    })

    //group subscriptions
    await query.prefetchQuery({
        queryKey: ["group-subscriptions"],
        queryFn: () => onGetGroupSubscriptions(params.groupid),
    })

    //member-chats
    await query.prefetchQuery({
        queryKey: ["member-chats"],
        queryFn: () => onGetAllGroupMembers(params.groupid),
    })
    return (
        <HydrationBoundary state={dehydrate(query)}>
            <div className="flex h-screen md:pt-5">
                <SideBar />
            </div>
        </HydrationBoundary>
    )
}

export default GroupLayout
