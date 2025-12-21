import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    reactions: { '👍': 42, '💚': 1 },
  },

  {
    id: '2',
    author: 'Admin',
    text: 'New tank tops out soon!',
    emojis: ['🤜', '🎽'],
    reactions: { '🤜': 15 , '🎽':12},
  },
];

export default function MessageBoard() {
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [newMessage, setNewMessage] = useState('');
  const [showPickerFor, setShowPickerFor] = useState<string | null>(null);
  const [pickerPosition, setPickerPosition] = useState<{ x: number; y: number } | null>(null);


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

  const handleEmojiSelected = (postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentCount = post.reactions[emoji] ?? 0;
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [emoji]: currentCount + 1,
            },
          };
        }
        return post;
      }),
    );
    setShowPickerFor(null);
    setPickerPosition(null);
  };

  // The event is of type NativeSyntheticEvent<LayoutChangeEvent>
  const onPostLayout = (id: string, event: any) => {
  if (showPickerFor === id && event?.nativeEvent?.layout) {
    const { x, y, height } = event.nativeEvent.layout;
    setPickerPosition({ x, y: y + height });
  }
};

  const renderPost = ({ item }: { item: Post }) => (
    <View
      style={styles.post}
      onLayout={(e) => onPostLayout(item.id, e)}
    >
      <Pressable onLongPress={() => setShowPickerFor(item.id)} style={{ flex: 1 }}>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <View style={styles.reactions}>
          {Object.entries(item.reactions).map(([emoji, count]) => (
            <Text key={emoji} style={styles.emoji}>
              {emoji} {count}
            </Text>
          ))}
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.header}>Message Board</Text>
      <View style={styles.newPost}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.button} onPress={handleAddPost}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
      />
      {showPickerFor && (
        <View style={[
          styles.picker,
          pickerPosition
            ? { top: pickerPosition.y, left: pickerPosition.x }
            : { top: 100, left: 30 } 
        ]}>
          <EmojiSelector
            onEmojiSelected={(emoji) => handleEmojiSelected(showPickerFor, emoji)}
            showTabs={true}
            showSearchBar={false}
            columns={8}
            category={Categories.all}
          />
          <TouchableOpacity style={styles.button} onPress={() => {
            setShowPickerFor(null);
            setPickerPosition(null);
          }}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000ff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 16,
    alignSelf: 'center',
    color: 'white',
  },
  newPost: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    marginRight: 12,
    backgroundColor: 'white',
  },
  post: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 0,
  },
  author: { fontWeight: 'bold', marginBottom: 6 },
  text: { marginBottom: 8 },
  reactions: { flexDirection: 'row' },
  emoji: { marginRight: 12, fontSize: 18 },
  list: { paddingBottom: 32 },
  picker: {
    position: 'absolute',
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 8,
    zIndex: 200,
    elevation: 20,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
