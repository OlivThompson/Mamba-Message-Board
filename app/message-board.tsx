import React, { useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
const mess = "Real Niggas Only!";
type Post = {
  id: string;
  author: string;
  text: string;
  emojis: string[];
  reactions: { [emoji: string]: number };
};

const demoPosts: Post[] = [
  {
    id: '1',
    author: 'Admin',
    text: 'Welcome to the message board!',
    emojis: ['👍', '💚'],
    reactions: { '👍': 69, '💚': 1 },
  },
];

 export default function IndexScreen() {
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [newMessage, setNewMessage] = useState('');

  const handleAddPost = () => {
    if (newMessage.trim() === '') return;
    const newPost: Post = {
      id: String(posts.length + 1),
      author: 'Admin',
      text: newMessage,
      emojis: [],
      reactions: {},
    };
    setPosts([newPost, ...posts]);
    setNewMessage('');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.text}>{item.text}</Text>
      <View style={styles.reactions}>
        {Object.entries(item.reactions).map(([emoji, count]) => (
          <Text key={emoji} style={styles.emoji}>
            {emoji} {count}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Message Board</Text>
      <View style={styles.newPost}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Post" onPress={handleAddPost} />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000ff' },
  header: { fontSize: 22, fontWeight: 'bold', margin: 16, alignSelf: 'center' },
  newPost: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8 },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, height: 40, marginRight: 10 },
  post: { backgroundColor: '#f2f2f2', padding: 16, borderRadius: 8, marginBottom: 12, marginHorizontal: 16 },
  author: { fontWeight: 'bold', marginBottom: 4 },
  text: { marginBottom: 8 },
  reactions: { flexDirection: 'row' },
  emoji: { marginRight: 12, fontSize: 18 },
  list: { paddingBottom: 32 },
});