import { View, Text, Image, StyleSheet } from "react-native";
import posts from '../../assets/data/posts.json'
import { formatDistanceToNowStrict } from 'date-fns'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Post } from "../types";
import { Link } from "expo-router";

type PostListItemProps = {
    post: Post
    isDetailedPost?: boolean
};

export default function PostListItem({ post, isDetailedPost }: PostListItemProps) {
    const shouldShowImage = post.image || isDetailedPost
    const shouldShowDescription = isDetailedPost || !post.image

    return (
        <Link href={`/post/${post.id}`}>
            <View style={styles.container}>
                {/* Post Header */}
                <View style={styles.header}>
                    <Image source={{ uri: post.group.image }} style={styles.groupImage} />
                    <View>
                        <Text style={styles.groupName}>{post.group.name}</Text>
                        {isDetailedPost && <Text style={styles.userName}>{post.user.name}</Text>}

                    </View>
                    <Text style={styles.timestamp}>{formatDistanceToNowStrict(new Date(post.created_at))}</Text>

                    <View style={styles.buttonContainer}>
                        <Text style={styles.joinButton}>Join</Text>
                    </View>
                </View>
                {/* Post Content */}
                <Text style={styles.contentText}>{post.title}</Text>
                {post.image && <Image source={{ uri: post.image }} style={styles.contentImage} />}
                {!post.image && post.description && <Text>{post.description}</Text>}
                {
                    shouldShowDescription && post.description && <Text>{post.description}</Text>
                }

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.voteContainer}>
                        <MaterialCommunityIcons name="arrow-up-bold-outline" size={19} color="black" />
                        <Text>{post.upvotes}</Text>
                        <MaterialCommunityIcons name="arrow-down-bold-outline" size={19} color="black" />
                    </View>
                    <View style={styles.commentContainer}>
                        <MaterialCommunityIcons name="comment-outline" size={19} color="black" />
                        <Text>{post.nr_of_comments}</Text>
                    </View>
                    <View style={styles.actionButtonsContainer}>
                        <MaterialCommunityIcons
                            name="trophy-outline"
                            size={19}
                            color="black"
                            style={styles.actionButton}
                        />
                        <MaterialCommunityIcons
                            name="share-outline"
                            size={19}
                            color="black"
                            style={styles.actionButton}
                        />
                    </View>
                </View>
            </View>
        </Link >
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        width: '100%', // Take full width
        marginHorizontal: 0, // Ensure no horizontal margin
    },
    header: {
        flexDirection: 'row',
        gap: 10,
        padding: 10,
    },
    groupImage: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
    },
    groupName: {
        fontWeight: '600',
        fontSize: 14,
    },
    timestamp: {
        color: '#787C7E',
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    joinButton: {
        backgroundColor: '#0079D3',
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
        fontWeight: '600',
        fontSize: 12,
    },
    contentText: {
        fontSize: 16,
        letterSpacing: 0.3,
        fontWeight: '500',
        marginVertical: 8,
    },
    contentImage: {
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: 10,
        marginVertical: 8,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#EDEFF1',
    },
    voteContainer: {
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F6F7F8',
    },
    commentContainer: {
        flexDirection: 'row',
        gap: 5,
        marginLeft: 20,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F6F7F8',
        alignItems: 'center',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        gap: 15,
    },
    actionButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F6F7F8',
    },
    userName: {
        fontSize: 12,
        color: 'gray',
    }
});